const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connection-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/', authMiddleware.verifyToken, connectionController.getConnections);
router.post('/request', authMiddleware.verifyToken, connectionController.sendRequest);
router.patch('/:id', authMiddleware.verifyToken, connectionController.respondToRequest);

module.exports = router;
