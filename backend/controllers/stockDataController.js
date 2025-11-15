const stockDataService = require('../services/stockDataService');

/**
 * Get current stock price
 */
async function getCurrentPrice(req, res, next) {
  try {
    const { symbol } = req.params;
    const priceData = await stockDataService.getCurrentPrice(symbol);
    res.json(priceData);
  } catch (error) {
    res.status(404).json({ message: error.message || 'Failed to fetch stock price' });
  }
}

/**
 * Get historical stock data
 */
async function getHistoricalData(req, res, next) {
  try {
    const { symbol } = req.params;
    const { interval = 'daily' } = req.query;
    const historicalData = await stockDataService.getHistoricalData(symbol, interval);
    res.json({ symbol, data: historicalData });
  } catch (error) {
    res.status(404).json({ message: error.message || 'Failed to fetch historical data' });
  }
}

/**
 * Search stocks
 */
async function searchStocks(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    const results = await stockDataService.searchStocks(q);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to search stocks' });
  }
}

module.exports = {
  getCurrentPrice,
  getHistoricalData,
  searchStocks
};

