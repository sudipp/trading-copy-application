const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const { authenticate } = require('../middleware/auth');

// Protected routes
router.get('/', authenticate, tradeController.getTrades);
router.get('/copied', authenticate, tradeController.getCopiedTrades);
router.get('/:id', authenticate, tradeController.getTradeById);
router.post('/:id/copy', authenticate, tradeController.copyTrade);

module.exports = router;

