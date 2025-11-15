const stockDataService = require('../services/stockDataService');
const stockDataController = require('../controllers/stockDataController');

// Mock the service
jest.mock('../services/stockDataService');

describe('Stock Data Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      query: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentPrice', () => {
    it('should return stock price data', async () => {
      const mockPriceData = {
        symbol: 'AAPL',
        price: 150.25,
        change: 2.50,
        changePercent: 1.69,
        volume: 50000000,
        high: 151.00,
        low: 148.50,
        open: 149.00,
        previousClose: 147.75,
        timestamp: new Date()
      };

      req.params.symbol = 'AAPL';
      stockDataService.getCurrentPrice.mockResolvedValue(mockPriceData);

      await stockDataController.getCurrentPrice(req, res, next);

      expect(stockDataService.getCurrentPrice).toHaveBeenCalledWith('AAPL');
      expect(res.json).toHaveBeenCalledWith(mockPriceData);
    });

    it('should handle errors', async () => {
      req.params.symbol = 'INVALID';
      const error = new Error('Invalid symbol');
      stockDataService.getCurrentPrice.mockRejectedValue(error);

      await stockDataController.getCurrentPrice(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('getHistoricalData', () => {
    it('should return historical data', async () => {
      const mockHistoricalData = [
        { date: '2024-01-01', open: 100, high: 105, low: 98, close: 103, volume: 1000000 },
        { date: '2024-01-02', open: 103, high: 108, low: 102, close: 107, volume: 1200000 }
      ];

      req.params.symbol = 'AAPL';
      req.query.interval = 'daily';
      stockDataService.getHistoricalData.mockResolvedValue(mockHistoricalData);

      await stockDataController.getHistoricalData(req, res, next);

      expect(stockDataService.getHistoricalData).toHaveBeenCalledWith('AAPL', 'daily');
      expect(res.json).toHaveBeenCalledWith({ symbol: 'AAPL', data: mockHistoricalData });
    });

    it('should use default interval if not provided', async () => {
      const mockHistoricalData = [];
      req.params.symbol = 'AAPL';
      stockDataService.getHistoricalData.mockResolvedValue(mockHistoricalData);

      await stockDataController.getHistoricalData(req, res, next);

      expect(stockDataService.getHistoricalData).toHaveBeenCalledWith('AAPL', 'daily');
    });

    it('should handle errors', async () => {
      req.params.symbol = 'INVALID';
      const error = new Error('Failed to fetch data');
      stockDataService.getHistoricalData.mockRejectedValue(error);

      await stockDataController.getHistoricalData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe('searchStocks', () => {
    it('should return search results', async () => {
      const mockResults = [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corporation' }
      ];

      req.query.q = 'app';
      stockDataService.searchStocks.mockResolvedValue(mockResults);

      await stockDataController.searchStocks(req, res, next);

      expect(stockDataService.searchStocks).toHaveBeenCalledWith('app');
      expect(res.json).toHaveBeenCalledWith({ results: mockResults });
    });

    it('should return 400 if query is missing', async () => {
      req.query = {};

      await stockDataController.searchStocks(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Search query is required' });
    });

    it('should handle errors', async () => {
      req.query.q = 'test';
      const error = new Error('Search failed');
      stockDataService.searchStocks.mockRejectedValue(error);

      await stockDataController.searchStocks(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});
