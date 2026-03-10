const express = require('express');
const router = express.Router();
const startupController = require('../controllers/startup-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/', startupController.getStartups);
router.get('/:id', startupController.getStartupById);

module.exports = router;
