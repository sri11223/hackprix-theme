const express = require('express');
const router = express.Router();
const { completeProfile } = require('../controllers/profile-controller');
const authMiddleware = require('../middleware/auth-middleware');

// Complete profile route
router.post('/complete', authMiddleware.verifyToken, completeProfile);

module.exports = router;
