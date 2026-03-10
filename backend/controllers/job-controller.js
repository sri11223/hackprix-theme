const Job = require('../models/jobmodel');
const { User, Startup } = require('../models/usermodel');
const Notification = require('../models/notificationmodel');
const { sendJobEvent } = require('../utility/kafka');

// GET /api/jobs - Get all jobs with filters
exports.getJobs = async (req, res) => {
  try {
    const { search, type, skill, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (type) filter.type = type;
    if (skill) filter.skills = { $in: skill.split(',') };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [jobs, total] = await Promise.all([
      Job.find(filter).populate('postedBy', 'companyName firstName lastName').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
      Job.countDocuments(filter),
    ]);

    const shaped = jobs.map(j => ({
      id: j._id,
      title: j.title,
      company: j.company,
      location: j.location,
      type: j.type,
      salary: j.salary,
      skills: j.skills,
      description: j.description,
      fullDescription: j.fullDescription || j.description,
      requirements: j.requirements || [],
      benefits: j.benefits || [],
      postedAt: j.createdAt,
      applicationCount: j.applications?.length || 0,
    }));

    res.json({ jobs: shaped, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/jobs - Create a job (startup only)
exports.createJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user || user.userType !== 'STARTUP') {
      return res.status(403).json({ message: 'Only startups can post jobs' });
    }

    const job = await Job.create({
      ...req.body,
      company: req.body.company || user.companyName || `${user.firstName}'s Startup`,
      postedBy: userId,
    });

    // Kafka event
    sendJobEvent('JOB_CREATED', { jobId: job._id, title: job.title, company: job.company }).catch(() => {});

    // Socket broadcast
    const io = req.app.get('io');
    if (io) io.emit('newJob', { id: job._id, title: job.title, company: job.company });

    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/jobs/apply - Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId, name, email, phone, coverLetter, portfolioUrl, linkedInUrl } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user || user.userType !== 'INDIVIDUAL') {
      return res.status(403).json({ message: 'Only individuals can apply for jobs' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const alreadyApplied = job.applications.some(app => app.userId?.toString() === userId);
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied for this job' });

    job.applications.push({
      userId,
      name: name || `${user.firstName} ${user.lastName}`,
      email: email || user.email,
      phone,
      coverLetter,
      portfolioUrl,
      linkedInUrl,
      status: 'PENDING',
    });
    await job.save();

    // Notify the startup via Socket.io
    const io = req.app.get('io');
    const users = req.app.get('connectedUsers');
    if (io && users) {
      const startupSocket = users[job.postedBy?.toString()];
      if (startupSocket) {
        io.to(startupSocket.socketId).emit('newApplication', {
          jobId: job._id,
          jobTitle: job.title,
          applicant: { id: userId, name: name || `${user.firstName} ${user.lastName}` },
        });
      }
    }

    // Kafka event
    sendJobEvent('JOB_APPLICATION', { jobId: job._id, applicantId: userId }).catch(() => {});

    // Create notification
    await Notification.create({
      user: job.postedBy,
      type: 'NEW_APPLICATION',
      title: 'New Job Application',
      message: `${user.firstName} ${user.lastName} applied for ${job.title}`,
      data: { jobId: job._id, applicantId: userId },
    });

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobs/my-applications - Get current user's applications
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobs = await Job.find({ 'applications.userId': userId });

    const applications = jobs.flatMap(job =>
      job.applications
        .filter(app => app.userId?.toString() === userId)
        .map(app => ({
          id: app._id,
          jobTitle: job.title,
          company: job.company,
          status: app.status,
          appliedDate: app.appliedAt,
          lastUpdate: app.appliedAt,
        }))
    );

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobs/my-posted - Get jobs posted by current startup
exports.getMyPostedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobs = await Job.find({ postedBy: userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching posted jobs:', error);
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/jobs/application-status - Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, applicantId, status } = req.body;
    const userId = req.user.userId;

    const job = await Job.findOne({ _id: jobId, postedBy: userId });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });

    const application = job.applications.find(app => app.userId?.toString() === applicantId);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    application.status = status;
    await job.save();

    // Notify applicant via Socket.io
    const io = req.app.get('io');
    const users = req.app.get('connectedUsers');
    if (io && users) {
      const applicantSocket = users[applicantId];
      if (applicantSocket) {
        io.to(applicantSocket.socketId).emit('applicationStatusUpdated', {
          jobId: job._id,
          jobTitle: job.title,
          status,
        });
      }
    }

    // Notification
    await Notification.create({
      user: applicantId,
      type: 'APPLICATION_STATUS',
      title: 'Application Status Updated',
      message: `Your application for ${job.title} has been ${status.toLowerCase()}`,
      data: { jobId: job._id, status },
    });

    res.json({ message: 'Application status updated' });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: error.message });
  }
};
