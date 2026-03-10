const express = require('express');
const router = express.Router();
const pitchController = require('../controllers/pitch-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/', authMiddleware.verifyToken, pitchController.getPitchSessions);
router.post('/', authMiddleware.verifyToken, pitchController.createPitchSession);
router.patch('/:id/respond', authMiddleware.verifyToken, pitchController.respondToInvite);
router.post('/:id/feedback', authMiddleware.verifyToken, pitchController.addFeedback);

module.exports = router;
