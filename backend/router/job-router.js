const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/', jobController.getJobs);
router.post('/', authMiddleware.verifyToken, jobController.createJob);
router.post('/apply', authMiddleware.verifyToken, jobController.applyForJob);
router.get('/my-applications', authMiddleware.verifyToken, jobController.getMyApplications);
router.get('/my-posted', authMiddleware.verifyToken, jobController.getMyPostedJobs);
router.patch('/application-status', authMiddleware.verifyToken, jobController.updateApplicationStatus);

module.exports = router;
