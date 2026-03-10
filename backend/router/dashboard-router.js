const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/stats', authMiddleware.verifyToken, dashboardController.getDashboardStats);
router.get('/notifications', authMiddleware.verifyToken, dashboardController.getNotifications);
router.patch('/notifications/read', authMiddleware.verifyToken, dashboardController.markNotificationsRead);
router.get('/platform-stats', dashboardController.getPlatformStats);

module.exports = router;
