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
  fullDescription: { type: String },
  requirements: [String],
  benefits: [String],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applications: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: String,
    email: String,
    phone: String,
    coverLetter: String,
    portfolioUrl: String,
    linkedInUrl: String,
    status: {
      type: String,
      enum: ['PENDING', 'REVIEWING', 'INTERVIEW', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  }],
}, { timestamps: true });

jobSchema.index({ postedBy: 1 });
jobSchema.index({ skills: 1 });

module.exports = mongoose.model('Job', jobSchema);
