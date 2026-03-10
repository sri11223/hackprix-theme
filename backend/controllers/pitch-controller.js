const { PitchSession, User } = require('../models/usermodel');
const Notification = require('../models/notificationmodel');

// GET /api/pitch-sessions - Get pitch sessions (upcoming/past)
exports.getPitchSessions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    const filter = {
      $or: [
        { pitcher: userId },
        { 'attendees.user': userId },
      ]
    };
    if (status) filter.status = status;

    const sessions = await PitchSession.find(filter)
      .populate('pitcher', 'firstName lastName companyName')
      .populate('attendees.user', 'firstName lastName')
      .sort({ scheduledAt: -1 });

    const shaped = sessions.map(s => ({
      id: s._id,
      title: s.title,
      description: s.description,
      date: s.scheduledAt,
      duration: s.duration,
      status: s.status,
      pitcher: {
        id: s.pitcher?._id,
        name: s.pitcher?.companyName || `${s.pitcher?.firstName} ${s.pitcher?.lastName}`,
      },
      participants: (s.attendees || []).map(a => ({
        id: a.user?._id,
        name: `${a.user?.firstName || ''} ${a.user?.lastName || ''}`,
        status: a.status,
      })),
      category: s.category,
    }));

    res.json(shaped);
  } catch (error) {
    console.error('Error fetching pitch sessions:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/pitch-sessions - Create a pitch session
exports.createPitchSession = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, category, scheduledAt, duration, invitees } = req.body;

    const session = await PitchSession.create({
      pitcher: userId,
      title,
      description,
      category: category || 'BUSINESS_IDEA',
      scheduledAt: scheduledAt || new Date(),
      duration: duration || 30,
      status: 'SCHEDULED',
      attendees: (invitees || []).map(id => ({ user: id, status: 'INVITED' })),
    });

    // Notify invitees
    const io = req.app.get('io');
    const users = req.app.get('connectedUsers');
    const pitcher = await User.findById(userId).select('firstName lastName companyName');

    for (const inviteeId of (invitees || [])) {
      await Notification.create({
        user: inviteeId,
        type: 'PITCH_INVITE',
        title: 'Pitch Session Invitation',
        message: `${pitcher.companyName || pitcher.firstName} invited you to "${title}"`,
        data: { sessionId: session._id },
      });

      if (io && users) {
        const sock = users[inviteeId];
        if (sock) {
          io.to(sock.socketId).emit('pitchInvite', {
            sessionId: session._id,
            title,
            from: pitcher.companyName || pitcher.firstName,
          });
        }
      }
    }

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating pitch session:', error);
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/pitch-sessions/:id/respond - Accept/decline pitch invite
exports.respondToInvite = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.userId;
    const { response } = req.body; // 'ACCEPTED' or 'DECLINED'

    const session = await PitchSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const attendee = session.attendees.find(a => a.user.toString() === userId);
    if (!attendee) return res.status(403).json({ message: 'Not invited to this session' });

    attendee.status = response;
    await session.save();

    res.json({ message: `Invitation ${response.toLowerCase()}` });
  } catch (error) {
    console.error('Error responding to pitch invite:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/pitch-sessions/:id/feedback - Add feedback to pitch
exports.addFeedback = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user.userId;
    const { rating, comment, interested } = req.body;

    const session = await PitchSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.feedback.push({ from: userId, rating, comment, interested });
    await session.save();

    // Notify pitcher
    const io = req.app.get('io');
    const users = req.app.get('connectedUsers');
    if (io && users) {
      const pitcherSocket = users[session.pitcher.toString()];
      if (pitcherSocket) {
        io.to(pitcherSocket.socketId).emit('pitchFeedback', {
          sessionId, rating, interested,
        });
      }
    }

    res.json({ message: 'Feedback submitted' });
  } catch (error) {
    console.error('Error adding feedback:', error);
    res.status(500).json({ message: error.message });
  }
};
