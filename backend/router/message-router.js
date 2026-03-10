const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/chats', authMiddleware.verifyToken, messageController.getChats);
router.get('/search-users', authMiddleware.verifyToken, messageController.searchUsers);
router.get('/:userId', authMiddleware.verifyToken, messageController.getMessages);
router.post('/', authMiddleware.verifyToken, messageController.sendMessage);

module.exports = router;
