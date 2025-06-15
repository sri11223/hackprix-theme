const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  skills: [{
    type: String,
  }],
  description: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  applications: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

module.exports = mongoose.model('Job', jobSchema);
