const { InvestmentRequest, Startup, Investor, User } = require('../models/usermodel');
const Notification = require('../models/notificationmodel');
const { sendInvestmentEvent } = require('../utility/kafka');

// GET /api/investments - Get investment activity for current user
exports.getInvestments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    let requests;
    if (userType === 'STARTUP') {
      requests = await InvestmentRequest.find({ startup: userId })
        .populate('investor', 'firstName lastName username investorType workExperience')
        .sort({ requestedAt: -1 });

      const shaped = requests.map(r => ({
        id: r._id,
        name: `${r.investor?.firstName || ''} ${r.investor?.lastName || ''}`,
        firm: r.investor?.workExperience?.company || 'Independent',
        status: r.status === 'PENDING' ? 'interested' :
                r.status === 'INTERESTED' ? 'proposed' :
                r.status === 'FUNDED' ? 'connected' : 'viewed',
        proposalAmount: r.requestedAmount,
        equityAsk: r.equityOffered,
        lastInteraction: r.respondedAt || r.requestedAt,
        judgeScore: Math.floor(Math.random() * 30) + 70, // Will be replaced with real AI scoring
      }));

      res.json(shaped);
    } else if (userType === 'INVESTOR') {
      requests = await InvestmentRequest.find({ investor: userId })
        .populate('startup', 'companyName description domains stage metrics funding')
        .sort({ requestedAt: -1 });

      const shaped = requests.map(r => ({
        id: r._id,
        startupName: r.startup?.companyName || 'Unknown',
        description: r.startup?.description,
        amount: r.requestedAmount,
        equity: r.equityOffered,
        status: r.status,
        requestedAt: r.requestedAt,
      }));

      res.json(shaped);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/investments/request - Investor sends investment request to startup
exports.createInvestmentRequest = async (req, res) => {
  try {
    const investorId = req.user.userId;
    const { startupId, amount, equityOffered, useOfFunds, message } = req.body;

    const investor = await User.findById(investorId);
    if (!investor || investor.userType !== 'INVESTOR') {
      return res.status(403).json({ message: 'Only investors can create investment requests' });
    }

    const startup = await Startup.findById(startupId);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });

    const request = await InvestmentRequest.create({
      startup: startupId,
      investor: investorId,
      requestedAmount: amount,
      equityOffered,
      useOfFunds,
      investorNotes: message,
    });

    // Kafka event
    sendInvestmentEvent('INVESTMENT_REQUEST', {
      investorId, startupId, amount,
    }).catch(() => {});

    // Socket notification
    const io = req.app.get('io');
    const users = req.app.get('connectedUsers');
    if (io && users) {
      const startupSocket = users[startupId];
      if (startupSocket) {
        io.to(startupSocket.socketId).emit('investmentRequest', {
          id: request._id,
          investorName: `${investor.firstName} ${investor.lastName}`,
          amount,
        });
      }
    }

    // Notification
    await Notification.create({
      user: startupId,
      type: 'INVESTMENT_REQUEST',
      title: 'New Investment Interest',
      message: `${investor.firstName} ${investor.lastName} is interested in investing $${amount}`,
      data: { requestId: request._id, investorId },
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating investment request:', error);
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/investments/:id/status - Update investment request status
exports.updateInvestmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;
    const userId = req.user.userId;

    const request = await InvestmentRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Investment request not found' });

    // Only the startup or investor involved can update
    if (request.startup.toString() !== userId && request.investor.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    request.status = status;
    request.respondedAt = new Date();
    await request.save();

    // Notify the other party
    const notifyUserId = request.startup.toString() === userId ? request.investor : request.startup;
    const io = req.app.get('io');
    const users = req.app.get('connectedUsers');
    if (io && users) {
      const targetSocket = users[notifyUserId.toString()];
      if (targetSocket) {
        io.to(targetSocket.socketId).emit('investmentUpdate', { requestId, status });
      }
    }

    await Notification.create({
      user: notifyUserId,
      type: 'INVESTMENT_UPDATE',
      title: 'Investment Status Updated',
      message: `Investment request status changed to ${status}`,
      data: { requestId, status },
    });

    res.json({ message: 'Status updated', status });
  } catch (error) {
    console.error('Error updating investment status:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/investments/portfolio - Get investor's portfolio
exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.user.userId;
    const investor = await Investor.findById(userId);
    if (!investor) return res.status(404).json({ message: 'Investor not found' });

    const funded = await InvestmentRequest.find({ investor: userId, status: 'FUNDED' })
      .populate('startup', 'companyName domains stage metrics funding');

    const portfolio = funded.map(f => ({
      id: f._id,
      startupName: f.startup?.companyName || 'Unknown',
      domains: f.startup?.domains || [],
      amount: f.requestedAmount,
      equity: f.equityOffered,
      investmentDate: f.requestedAt,
      growthRate: f.startup?.metrics?.growthRate || 0,
    }));

    // Calculate aggregates
    const totalInvested = portfolio.reduce((sum, p) => sum + (p.amount || 0), 0);

    res.json({
      portfolio,
      stats: {
        totalInvested,
        activeInvestments: portfolio.length,
        totalPortfolioValue: totalInvested, // Simplified – real would use valuation
      }
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ message: error.message });
  }
};
