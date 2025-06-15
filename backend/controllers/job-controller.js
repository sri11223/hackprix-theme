const jsonDb = require('../utility/jsonDb');

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await jsonDb.getJobs();
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: error.message });
  }
};

// Post a new job
exports.createJob = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await jsonDb.getUser(userId);

    if (!user || user.userType !== 'STARTUP') {
      return res.status(403).json({ message: 'Only startups can post jobs' });
    }

    const jobData = {
      id: jsonDb.generateId(),
      ...req.body,
      postedBy: userId,
      posted: new Date().toISOString(),
      applications: []
    };

    const job = await jsonDb.addJob(jobData);
    
    // Emit socket event for real-time updates
    req.io.emit('jobAdded', job);

    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: error.message });
  }
};

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.userId;

    const user = await jsonDb.getUser(userId);
    if (!user || user.userType !== 'INDIVIDUAL') {
      return res.status(403).json({ message: 'Only individuals can apply for jobs' });
    }

    const jobs = await jsonDb.getJobs();
    const job = jobs.find(j => j.id === jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applications.some(app => app.userId === userId);
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    const application = {
      userId,
      status: 'PENDING',
      appliedAt: new Date().toISOString()
    };

    job.applications.push(application);
    await jsonDb.updateJob(jobId, job);

    // Emit socket event to notify the startup
    const startup = await jsonDb.getUser(job.postedBy);
    if (startup) {
      req.io.to(startup.socketId).emit('newApplication', {
        jobId,
        applicant: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
        },
      });
    }

    res.status(200).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying for job:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update job application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, applicantId, status } = req.body;
    const userId = req.user.userId;

    const job = await Job.findOne({ _id: jobId, postedBy: userId });
    if (!job) {
      return res.status(404).json({ message: 'Job not found or unauthorized' });
    }

    const application = job.applications.find(app => 
      app.userId.toString() === applicantId
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await job.save();

    // Notify the applicant
    const applicant = await User.findById(applicantId);
    if (applicant) {
      req.io.to(applicant.socketId).emit('applicationStatusUpdated', {
        jobId,
        status,
      });
    }

    res.status(200).json({ message: 'Application status updated' });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ message: error.message });
  }
};
