const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job-controller');
const authMiddleware = require('../middleware/auth-middleware');

// Job routes
router.get('/', authMiddleware.verifyToken, jobController.getJobs);
router.post('/', authMiddleware.verifyToken, jobController.createJob);
router.post('/apply', authMiddleware.verifyToken, jobController.applyForJob);
router.patch('/application-status', authMiddleware.verifyToken, jobController.updateApplicationStatus);

module.exports = router;
