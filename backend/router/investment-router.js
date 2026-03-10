const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investment-controller');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/', authMiddleware.verifyToken, investmentController.getInvestments);
router.get('/portfolio', authMiddleware.verifyToken, investmentController.getPortfolio);
router.post('/request', authMiddleware.verifyToken, investmentController.createInvestmentRequest);
router.patch('/:id/status', authMiddleware.verifyToken, investmentController.updateInvestmentStatus);

module.exports = router;
