const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// =========================
// 1️⃣ Base User Schema
// =========================
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please enter valid Indian phone number']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  userType: {
    type: String,
    enum: ['INDIVIDUAL', 'INVESTOR', 'STARTUP', 'SPECTATOR'],
    default: null
  },
  profileCompleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  avatar: String,
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' }
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true, discriminatorKey: 'userType' });

// Password Hashing Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password Comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// =========================
// 2️⃣ Individual Schema
// =========================
const individualSchema = new mongoose.Schema({
  profilePicture: { type: String, required: true },
  age: { type: Number, required: true, min: 18 },
  gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
  resumeUrl: String,
  skills: [String],
  bio: String,
  experience: [{
    title: String,
    company: String,
    duration: { start: Date, end: Date },
    description: String,
    current: { type: Boolean, default: false }
  }],
  education: [{
    degree: String,
    institute: String,
    year: Number,
    grade: String
  }],
  interests: [String],
  lookingFor: {
    type: String,
    enum: ['JOB', 'COLLABORATION', 'NETWORKING', 'INVESTMENT_OPPORTUNITY'],
    default: 'JOB'
  },
  projects: [{
    name: String,
    description: String,
    url: String,
    technologies: [String]
  }]
});

// =========================
// 3️⃣ Startup Schema
// =========================
const startupSchema = new mongoose.Schema({
  companyName: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  verification: {
    documents: {
      incorporationCertificate: { type: String, required: true },
      panCard: { type: String, required: true },
      gstCertificate: String,
      bankStatement: String
    },
    status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
    verifiedAt: Date,
    rejectionReason: String
  },
  domains: [{ type: String, required: true }],
  stage: { type: String, enum: ['IDEA', 'PROTOTYPE', 'MVP', 'EARLY_REVENUE', 'GROWTH'], required: true },
  teamSize: { type: Number, required: true, min: 1 },
  funding: {
    totalRaised: { type: Number, default: 0 },
    currentlyRaising: { type: Boolean, default: false },
    targetAmount: Number,
    equityOffered: { type: Number, min: 0, max: 100 },
    useOfFunds: String
  },
  metrics: {
    monthlyRevenue: Number,
    userBase: Number,
    growthRate: Number,
    burnRate: Number
  },
  documents: {
    pitchDeck: String,
    businessPlan: String,
    financialProjections: String,
    productDemo: String
  },
  teamMembers: [{
    name: String,
    role: String,
    linkedIn: String,
    equity: Number
  }]
});

// =========================
// 4️⃣ Investor Schema
// =========================
const investorSchema = new mongoose.Schema({
  investorType: {
    type: String,
    enum: ['ANGEL', 'VC_FIRM', 'CORPORATE', 'FAMILY_OFFICE', 'INDIVIDUAL'],
    required: true
  },
  verification: {
    documents: {
      identityProof: { type: String, required: true },
      incomeProof: { type: String, required: true },
      investmentHistory: String,
      accreditationCertificate: String
    },
    status: { type: String, enum: ['PENDING', 'VERIFIED', 'REJECTED'], default: 'PENDING' },
    verifiedAt: Date,
    rejectionReason: String
  },
  workExperience: {
    currentRole: String,
    company: String,
    industry: String,
    experience: Number
  },
  preferences: {
    sectors: [{ type: String, required: true }],
    stages: [{ type: String, enum: ['IDEA', 'PROTOTYPE', 'MVP', 'EARLY_REVENUE', 'GROWTH'] }],
    ticketSize: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'INR' }
    },
    geographicPreference: [String],
    riskTolerance: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' }
  },
  portfolio: [{
    startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startupName: String,
    investmentAmount: Number,
    equityPercentage: Number,
    investmentDate: Date,
    status: { type: String, enum: ['ACTIVE', 'EXITED', 'FAILED'], default: 'ACTIVE' },
    exitAmount: Number,
    exitDate: Date
  }],
  totalInvestmentCapacity: Number,
  availableCapacity: Number
});

// =========================
// 5️⃣ Application Schema
// =========================
const applicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  position: { type: String, required: true },
  coverLetter: String,
  resumeUrl: { type: String, required: true },
  additionalDocuments: [String],
  status: { type: String, enum: ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'], default: 'PENDING' },
  feedback: String,
  appliedAt: { type: Date, default: Date.now },
  reviewedAt: Date
});

// =========================
// 6️⃣ Investment Request Schema
// =========================
const investmentRequestSchema = new mongoose.Schema({
  startup: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedAmount: { type: Number, required: true },
  equityOffered: { type: Number, required: true, min: 0, max: 100 },
  useOfFunds: { type: String, required: true },
  pitchDeck: String,
  businessPlan: String,
  status: { type: String, enum: ['PENDING', 'UNDER_REVIEW', 'INTERESTED', 'REJECTED', 'FUNDED'], default: 'PENDING' },
  investorNotes: String,
  requestedAt: { type: Date, default: Date.now },
  respondedAt: Date
});

// =========================
// 7️⃣ Pitch Session Schema
// =========================
const pitchSessionSchema = new mongoose.Schema({
  pitcher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  audience: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userType: { type: String, enum: ['INVESTOR', 'STARTUP'] }
  }],
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['BUSINESS_IDEA', 'COLLABORATION', 'INVESTMENT_OPPORTUNITY', 'SKILL_SHOWCASE'],
    required: true
  },
  documents: {
    presentation: String,
    businessPlan: String,
    demo: String
  },
  scheduledAt: Date,
  duration: Number,
  status: { type: String, enum: ['SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' },
  attendees: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['INVITED', 'ACCEPTED', 'DECLINED', 'ATTENDED'], default: 'INVITED' }
  }],
  feedback: [{
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    interested: Boolean
  }]
}, { timestamps: true });

// =========================
// 8️⃣ Connection Request Schema
// =========================
const connectionRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' },
  requestedAt: { type: Date, default: Date.now },
  respondedAt: Date
});

// =========================
// 9️⃣ Model Exports
// =========================
const User = mongoose.model('User', userSchema);
const Individual = User.discriminator('INDIVIDUAL', individualSchema);
const Startup = User.discriminator('STARTUP', startupSchema);
const Investor = User.discriminator('INVESTOR', investorSchema);
const Application = mongoose.model('Application', applicationSchema);
const InvestmentRequest = mongoose.model('InvestmentRequest', investmentRequestSchema);
const PitchSession = mongoose.model('PitchSession', pitchSessionSchema);
const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = {
  User,
  Individual,
  Startup,
  Investor,
  Application,
  InvestmentRequest,
  PitchSession,
  ConnectionRequest
};
