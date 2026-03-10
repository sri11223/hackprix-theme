const Message = require('../models/messagemodel');
const { User } = require('../models/usermodel');

// GET /api/messages/chats - Get all chats for current user
exports.getChats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find all distinct chatIds involving this user
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    // Group by chatId and get latest message + other user
    const chatMap = new Map();
    for (const msg of messages) {
      if (chatMap.has(msg.chatId)) continue;
      const otherId = msg.sender.toString() === userId ? msg.receiver : msg.sender;
      chatMap.set(msg.chatId, { lastMessage: msg, otherUserId: otherId });
    }

    // Count unread per chat
    const chats = [];
    for (const [chatId, { lastMessage, otherUserId }] of chatMap) {
      const otherUser = await User.findById(otherUserId).select('firstName lastName username avatar');
      const unreadCount = await Message.countDocuments({ chatId, receiver: userId, read: false });

      chats.push({
        id: chatId,
        user: {
          id: otherUserId,
          name: otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : 'Unknown',
          avatar: otherUser?.avatar,
          status: 'offline', // Will be updated via socket
        },
        lastMessage: {
          content: lastMessage.content,
          timestamp: lastMessage.createdAt,
        },
        unreadCount,
      });
    }

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/messages/:userId - Get messages with specific user
exports.getMessages = async (req, res) => {
  try {
    const myId = req.user.userId;
    const otherId = req.params.userId;
    const chatId = Message.getChatId(myId, otherId);

    const messages = await Message.find({ chatId })
      .populate('sender', 'firstName lastName')
      .sort({ createdAt: 1 })
      .limit(100);

    // Mark as read
    await Message.updateMany(
      { chatId, receiver: myId, read: false },
      { $set: { read: true } }
    );

    const shaped = messages.map(m => ({
      id: m._id,
      sender: {
        id: m.sender._id,
        name: m.sender._id.toString() === myId ? 'Me' : `${m.sender.firstName} ${m.sender.lastName}`,
      },
      content: m.content,
      timestamp: m.createdAt,
      read: m.read,
    }));

    res.json(shaped);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/messages - Send a message
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'receiverId and content are required' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: 'Receiver not found' });

    const chatId = Message.getChatId(senderId, receiverId);
    const message = await Message.create({ chatId, sender: senderId, receiver: receiverId, content });

    const sender = await User.findById(senderId).select('firstName lastName');

    const shaped = {
      id: message._id,
      chatId,
      sender: { id: senderId, name: `${sender.firstName} ${sender.lastName}` },
      content: message.content,
      timestamp: message.createdAt,
      read: false,
    };

    // Real-time delivery via Socket.io
    const io = req.app.get('io');
    const users = req.app.get('connectedUsers');
    if (io && users) {
      const receiverSocket = users[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket.socketId).emit('newMessage', shaped);
      }
    }

    res.status(201).json(shaped);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/messages/search-users - Search users to message
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      _id: { $ne: req.user.userId },
      $or: [
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
        { companyName: { $regex: q, $options: 'i' } },
      ]
    }).select('firstName lastName username avatar userType companyName').limit(10);

    res.json(users.map(u => ({
      id: u._id,
      name: u.companyName || `${u.firstName} ${u.lastName}`,
      username: u.username,
      avatar: u.avatar,
      userType: u.userType,
    })));
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: error.message });
  }
};
