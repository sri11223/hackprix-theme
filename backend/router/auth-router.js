const express = require('express');
const router = express.Router();
const { 
    home,
    register, 
    login, 
    institutes,
    updateProfile
} = require('../controllers/auth-contoller');
const validateMiddleware = require('../middleware/validate-middleware');
const authMiddleware = require('../middleware/auth-middleware');
const cacheMiddleware = require('../middleware/cache-middleware');

// Public routes
router.post('/register', validateMiddleware.validateRegistration, register);
router.post('/login', validateMiddleware.validateLogin, login);

// Protected routes
router.get('/profile', authMiddleware.verifyToken, cacheMiddleware(300), home); // or getUserProfile if defined
router.patch('/profile', authMiddleware.verifyToken, updateProfile);
router.post('/logout', authMiddleware.verifyToken, home); // or logout if defined

module.exports = router;
