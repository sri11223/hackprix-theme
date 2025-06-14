const express = require('express');
const router = express.Router();
const { 
    completeProfile,
    getProfile,
    updateProfile
} = require('../controllers/profile-controller');
const authMiddleware = require('../middleware/auth-middleware');

// Profile Routes
router.post('/complete', authMiddleware.verifyToken, completeProfile);
router.get('/', authMiddleware.verifyToken, getProfile);
router.patch('/update', authMiddleware.verifyToken, updateProfile);

module.exports = router;
