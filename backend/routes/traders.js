const express = require('express');
const router = express.Router();
const traderController = require('../controllers/traderController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.get('/', traderController.getTraders);
router.get('/:id', traderController.getTraderById);
router.get('/:id/trades', traderController.getTraderTrades);

// Protected routes
router.post('/:id/follow', authenticate, traderController.followTrader);
router.delete('/:id/follow', authenticate, traderController.unfollowTrader);
router.get('/following/list', authenticate, traderController.getFollowingTraders);

module.exports = router;

