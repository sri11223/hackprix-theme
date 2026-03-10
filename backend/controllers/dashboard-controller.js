const { User, Startup, Investor, Individual, InvestmentRequest, PitchSession, ConnectionRequest } = require('../models/usermodel');
const Job = require('../models/jobmodel');
const Message = require('../models/messagemodel');
const Notification = require('../models/notificationmodel');

// GET /api/dashboard/stats - Get dashboard stats for current user
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userType = req.user.userType;

    if (userType === 'INVESTOR') {
      const [investmentRequests, pitchSessions, connections] = await Promise.all([
        InvestmentRequest.find({ investor: userId }),
        PitchSession.countDocuments({ 'attendees.user': userId }),
        ConnectionRequest.countDocuments({ $or: [{ from: userId }, { to: userId }], status: 'ACCEPTED' }),
      ]);

      const funded = investmentRequests.filter(r => r.status === 'FUNDED');
      const totalInvested = funded.reduce((s, r) => s + (r.requestedAmount || 0), 0);

      res.json({
        portfolioValue: totalInvested,
        activeInvestments: funded.length,
        avgROI: funded.length > 0 ? 32.7 : 0, // Placeholder - real ML would compute this
        totalDeals: investmentRequests.length,
        pitchSessions,
        connections,
        recentActivity: investmentRequests.slice(0, 5).map(r => ({
          type: 'investment',
          status: r.status,
          amount: r.requestedAmount,
          date: r.requestedAt,
        })),
      });
    } else if (userType === 'STARTUP') {
      const startup = await Startup.findById(userId);
      const [jobs, investments, pitchSessions] = await Promise.all([
        Job.find({ postedBy: userId }),
        InvestmentRequest.find({ startup: userId }),
        PitchSession.countDocuments({ pitcher: userId }),
      ]);

      const totalApplications = jobs.reduce((s, j) => s + (j.applications?.length || 0), 0);

      res.json({
        teamSize: startup?.teamSize || 0,
        stage: startup?.stage || 'IDEA',
        totalJobs: jobs.length,
        totalApplications,
        investorInterests: investments.length,
        fundingRaised: startup?.funding?.totalRaised || 0,
        pitchSessions,
        metrics: startup?.metrics || {},
        recentApplications: jobs.flatMap(j =>
          (j.applications || []).slice(-3).map(a => ({
            jobTitle: j.title,
            status: a.status,
            date: a.appliedAt,
          }))
        ).slice(0, 5),
      });
    } else if (userType === 'INDIVIDUAL') {
      const [applicationJobs, connections] = await Promise.all([
        Job.find({ 'applications.userId': userId }),
        ConnectionRequest.countDocuments({ $or: [{ from: userId }, { to: userId }], status: 'ACCEPTED' }),
      ]);

      const myApps = applicationJobs.flatMap(j =>
        j.applications.filter(a => a.userId?.toString() === userId)
      );

      res.json({
        totalApplications: myApps.length,
        pending: myApps.filter(a => a.status === 'PENDING').length,
        reviewing: myApps.filter(a => a.status === 'REVIEWING').length,
        interviews: myApps.filter(a => a.status === 'INTERVIEW').length,
        accepted: myApps.filter(a => a.status === 'ACCEPTED').length,
        rejected: myApps.filter(a => a.status === 'REJECTED').length,
        connections,
        recentApplications: myApps.slice(-5).map((a, i) => ({
          jobTitle: applicationJobs[i]?.title || 'Unknown',
          company: applicationJobs[i]?.company || 'Unknown',
          status: a.status,
          date: a.appliedAt,
        })),
      });
    } else {
      res.json({});
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/notifications - Get notifications for current user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/notifications/read - Mark notifications as read
exports.markNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { ids } = req.body; // Array of notification IDs, or empty to mark all

    const filter = { user: userId, read: false };
    if (ids && ids.length) filter._id = { $in: ids };

    await Notification.updateMany(filter, { $set: { read: true } });
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications read:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/platform/stats - Public platform statistics
exports.getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, startups, investors, individuals, jobs] = await Promise.all([
      User.countDocuments(),
      Startup.countDocuments(),
      Investor.countDocuments(),
      Individual.countDocuments(),
      Job.countDocuments(),
    ]);

    res.json({
      totalUsers,
      startups,
      investors,
      individuals,
      totalJobs: jobs,
    });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    res.status(500).json({ message: error.message });
  }
};
