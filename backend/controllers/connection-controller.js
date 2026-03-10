const { ConnectionRequest, User } = require('../models/usermodel');
const Notification = require('../models/notificationmodel');

// POST /api/connections/request - Send connection request
exports.sendRequest = async (req, res) => {
  try {
    const fromId = req.user.userId;
    const { toId, message } = req.body;

    if (fromId === toId) return res.status(400).json({ message: 'Cannot connect with yourself' });

    const existing = await ConnectionRequest.findOne({
      $or: [
        { from: fromId, to: toId },
        { from: toId, to: fromId },
      ]
    });
    if (existing) return res.status(400).json({ message: 'Connection request already exists' });

    const request = await ConnectionRequest.create({ from: fromId, to: toId, message });

    const fromUser = await User.findById(fromId).select('firstName lastName');

    // Notification
    await Notification.create({
      user: toId,
      type: 'CONNECTION_REQUEST',
      title: 'New Connection Request',
      message: `${fromUser.firstName} ${fromUser.lastName} wants to connect`,
      data: { requestId: request._id, fromId },
    });

    const io = req.app.get('io');
    const users = req.app.get('connectedUsers');
    if (io && users) {
      const sock = users[toId];
      if (sock) {
        io.to(sock.socketId).emit('connectionRequest', {
          requestId: request._id,
          from: { id: fromId, name: `${fromUser.firstName} ${fromUser.lastName}` },
        });
      }
    }

    res.status(201).json({ message: 'Connection request sent' });
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/connections/:id - Accept or reject
exports.respondToRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user.userId;
    const { status } = req.body; // 'ACCEPTED' or 'REJECTED'

    const request = await ConnectionRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.to.toString() !== userId) return res.status(403).json({ message: 'Unauthorized' });

    request.status = status;
    request.respondedAt = new Date();
    await request.save();

    if (status === 'ACCEPTED') {
      // Add to followers/following
      await User.findByIdAndUpdate(request.from, { $addToSet: { following: request.to } });
      await User.findByIdAndUpdate(request.to, { $addToSet: { followers: request.from } });

      await Notification.create({
        user: request.from,
        type: 'CONNECTION_ACCEPTED',
        title: 'Connection Accepted',
        message: 'Your connection request was accepted',
        data: { requestId },
      });
    }

    res.json({ message: `Request ${status.toLowerCase()}` });
  } catch (error) {
    console.error('Error responding to connection:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/connections - Get user's connections
exports.getConnections = async (req, res) => {
  try {
    const userId = req.user.userId;
    const connections = await ConnectionRequest.find({
      $or: [{ from: userId }, { to: userId }],
      status: 'ACCEPTED',
    }).populate('from', 'firstName lastName username companyName userType avatar')
      .populate('to', 'firstName lastName username companyName userType avatar');

    const shaped = connections.map(c => {
      const other = c.from._id.toString() === userId ? c.to : c.from;
      return {
        id: other._id,
        name: other.companyName || `${other.firstName} ${other.lastName}`,
        username: other.username,
        userType: other.userType,
        avatar: other.avatar,
      };
    });

    res.json(shaped);
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ message: error.message });
  }
};
