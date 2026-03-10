const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth-middleware');
const {
    evaluatePitch,
    evaluatePitchSync,
    analyzeMarket,
    analyzeMarketSync,
    quickFeedback,
    getJobStatus,
} = require('../controllers/ai-controller');

// All AI routes require authentication
router.use(authMiddleware.verifyToken);

// Async (job queue) - returns jobId, poll with GET /job/:jobId
router.post('/evaluate-pitch', evaluatePitch);
router.post('/market-analysis', analyzeMarket);

// Sync - direct response (slower but simpler)
router.post('/evaluate-pitch/sync', evaluatePitchSync);
router.post('/market-analysis/sync', analyzeMarketSync);

// Real-time quick feedback (for live pitch rooms)
router.post('/quick-feedback', quickFeedback);

// Poll job result
router.get('/job/:jobId', getJobStatus);

module.exports = router;
