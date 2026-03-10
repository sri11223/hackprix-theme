const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: {
    type: String,
    enum: [
      'NEW_APPLICATION', 'APPLICATION_STATUS', 'NEW_JOB',
      'NEW_MESSAGE', 'INVESTMENT_REQUEST', 'INVESTMENT_UPDATE',
      'PITCH_INVITE', 'PITCH_REMINDER', 'CONNECTION_REQUEST',
      'CONNECTION_ACCEPTED', 'TEAM_INVITE', 'SYSTEM'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
