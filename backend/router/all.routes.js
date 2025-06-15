const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, './database.json');

// Helpers
const readData = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    console.error("❌ Failed to read data:", e.message);
    return { users: { individuals: [], startups: [], investors: [] }, jobs: [], applications: [], messages: [] };
  }
};

const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// ========== INDIVIDUAL ROUTES ==========

// Get dashboard data
router.get('/api/individual/:id/dashboard', (req, res) => {
  const data = readData();
  const individual = data.users.individuals.find(u => u.id === req.params.id);
  if (!individual) return res.status(404).json({ error: 'Individual not found' });

  const myApps = data.applications.filter(a => a.individualId === individual.id);
  const appliedJobIds = myApps.map(a => a.jobId);
  const recommendedJobs = data.jobs.filter(job =>
    job.status === 'active' &&
    !appliedJobIds.includes(job.id) &&
    job.skillsRequired.some(skill => individual.skills.includes(skill))
  );

  res.json({ individual, myApps, recommendedJobs });
});

// Apply for a job
router.post('/api/individual/:id/apply', (req, res) => {
  const { jobId } = req.body;
  const data = readData();
  const user = data.users.individuals.find(u => u.id === req.params.id);
  const job = data.jobs.find(j => j.id === jobId);

  if (!user || !job) return res.status(404).json({ error: 'User or Job not found' });

  const newApp = {
    id: `app_${Date.now()}`,
    jobId,
    individualId: req.params.id,
    status: 'submitted',
    appliedAt: new Date().toISOString(),
    coverLetter: "Auto-generated cover letter"
  };

  job.applicants.push(user.id);
  user.applications.push(newApp.id);
  data.applications.push(newApp);

  saveData(data);
  res.json({ success: true, application: newApp });
});

// Save a job
router.post('/api/individual/:id/save', (req, res) => {
  const { jobId } = req.body;
  const data = readData();
  const user = data.users.individuals.find(u => u.id === req.params.id);
  if (!user || !jobId) return res.status(400).json({ error: 'Invalid user or jobId' });

  if (!user.savedJobs.includes(jobId)) user.savedJobs.push(jobId);

  saveData(data);
  res.json({ savedJobs: user.savedJobs });
});

// Get applications
router.get('/api/individual/:id/applications', (req, res) => {
  const data = readData();
  const apps = data.applications.filter(a => a.individualId === req.params.id);
  res.json(apps);
});

// ========== STARTUP ROUTES ==========

// Post a job
router.post('/api/startup/:id/jobs', (req, res) => {
  const { title, description, skillsRequired } = req.body;
  const data = readData();
  const startup = data.users.startups.find(s => s.id === req.params.id);
  if (!startup) return res.status(404).json({ error: 'Startup not found' });

  const newJob = {
    id: `job_${Date.now()}`,
    title,
    description,
    startup: startup.id,
    skillsRequired,
    applicants: [],
    status: 'active',
    postedAt: new Date().toISOString()
  };

  startup.jobs.push(newJob.id);
  data.jobs.push(newJob);
  saveData(data);
  res.json(newJob);
});

// Get all jobs by startup
router.get('/api/startup/:id/jobs', (req, res) => {
  const data = readData();
  const jobs = data.jobs.filter(j => j.startup === req.params.id);
  res.json(jobs);
});

// Get applicants for startup
router.get('/api/startup/:id/applicants', (req, res) => {
  const data = readData();
  const jobs = data.jobs.filter(j => j.startup === req.params.id);
  const applicants = jobs.flatMap(job =>
    job.applicants.map(id => ({
      jobId: job.id,
      applicant: data.users.individuals.find(u => u.id === id)
    }))
  );
  res.json(applicants);
});

// ========== INVESTOR ROUTES ==========

// Get investor dashboard
router.get('/api/investor/:id', (req, res) => {
  const data = readData();
  const investor = data.users.investors.find(i => i.id === req.params.id);
  if (!investor) return res.status(404).json({ error: 'Investor not found' });

  const portfolio = data.users.startups.filter(s => investor.portfolio.includes(s.id));
  res.json({ investor, portfolio });
});

// Discover new startups (not yet in portfolio)
router.get('/api/investor/:id/discover', (req, res) => {
  const data = readData();
  const investor = data.users.investors.find(i => i.id === req.params.id);
  if (!investor) return res.status(404).json({ error: 'Investor not found' });

  const undiscovered = data.users.startups.filter(s => !investor.portfolio.includes(s.id));
  res.json(undiscovered);
});

// ========== MESSAGING ROUTES ==========

// Get messages for user
router.get('/api/messages/:id', (req, res) => {
  const data = readData();
  const msgs = data.messages.filter(
    m => m.from === req.params.id || m.to === req.params.id
  );
  res.json(msgs);
});

// Send a message
router.post('/api/messages', (req, res) => {
  const { from, to, content } = req.body;
  const data = readData();

  const msg = {
    id: `msg_${Date.now()}`,
    from,
    to,
    content,
    timestamp: new Date().toISOString(),
    read: false
  };

  data.messages.push(msg);

  const sender = [...data.users.individuals, ...data.users.startups, ...data.users.investors].find(u => u.id === from);
  const receiver = [...data.users.individuals, ...data.users.startups, ...data.users.investors].find(u => u.id === to);

  if (sender) sender.messages.push(msg);
  if (receiver) receiver.messages.push(msg);

  saveData(data);
  res.json({ success: true, message: msg });
});

console.log("✅ All routes loaded.");
module.exports = router;
