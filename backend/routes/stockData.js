const express = require('express');
const router = express.Router();
const stockDataController = require('../controllers/stockDataController');

// Public routes (could be protected if needed)
router.get('/:symbol', stockDataController.getCurrentPrice);
router.get('/:symbol/history', stockDataController.getHistoricalData);
router.get('/search', stockDataController.searchStocks);

module.exports = router;

