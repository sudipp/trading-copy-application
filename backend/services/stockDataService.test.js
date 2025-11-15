const axios = require('axios');
const stockDataService = require('../services/stockDataService');

// Mock axios
jest.mock('axios');

describe('Stock Data Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear cache
    stockDataService.getCurrentPrice.__cache?.clear?.();
  });

  describe('getCurrentPrice', () => {
    it('should fetch and return stock price from Alpha Vantage', async () => {
      const mockResponse = {
        data: {
          'Global Quote': {
            '01. symbol': 'AAPL',
            '02. open': '150.00',
            '03. high': '152.00',
            '04. low': '149.00',
            '05. price': '151.50',
            '06. volume': '50000000',
            '08. previous close': '149.00',
            '09. change': '2.50',
            '10. change percent': '1.68%'
          }
        }
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await stockDataService.getCurrentPrice('AAPL');

      expect(axios.get).toHaveBeenCalledWith(
        'https://www.alphavantage.co/query',
        expect.objectContaining({
          params: expect.objectContaining({
            function: 'GLOBAL_QUOTE',
            symbol: 'AAPL'
          })
        })
      );

      expect(result).toMatchObject({
        symbol: 'AAPL',
        price: 151.50,
        change: 2.50,
        changePercent: 1.68
      });
    });

    it('should throw error for invalid symbol', async () => {
      const mockResponse = {
        data: {
          'Error Message': 'Invalid API call'
        }
      };

      axios.get.mockResolvedValue(mockResponse);

      await expect(stockDataService.getCurrentPrice('INVALID')).rejects.toThrow();
    });

    it('should throw error when API limit is reached', async () => {
      const mockResponse = {
        data: {
          'Note': 'API limit reached'
        }
      };

      axios.get.mockResolvedValue(mockResponse);

      await expect(stockDataService.getCurrentPrice('AAPL')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      axios.get.mockRejectedValue(new Error('Network error'));

      await expect(stockDataService.getCurrentPrice('AAPL')).rejects.toThrow('Network error');
    });
  });

  describe('getHistoricalData', () => {
    it('should fetch and return historical data', async () => {
      const mockResponse = {
        data: {
          'Time Series (Daily)': {
            '2024-01-02': {
              '1. open': '100.00',
              '2. high': '105.00',
              '3. low': '99.00',
              '4. close': '103.00',
              '5. volume': '1000000'
            },
            '2024-01-01': {
              '1. open': '98.00',
              '2. high': '102.00',
              '3. low': '97.00',
              '4. close': '100.00',
              '5. volume': '900000'
            }
          }
        }
      };

      axios.get.mockResolvedValue(mockResponse);

      const result = await stockDataService.getHistoricalData('AAPL', 'daily');

      expect(axios.get).toHaveBeenCalledWith(
        'https://www.alphavantage.co/query',
        expect.objectContaining({
          params: expect.objectContaining({
            function: 'TIME_SERIES_DAILY',
            symbol: 'AAPL'
          })
        })
      );

      expect(result).toHaveLength(2);
      expect(result[0].date).toBe('2024-01-01');
      expect(result[1].date).toBe('2024-01-02');
    });

    it('should throw error when no data available', async () => {
      const mockResponse = {
        data: {}
      };

      axios.get.mockResolvedValue(mockResponse);

      await expect(stockDataService.getHistoricalData('AAPL')).rejects.toThrow();
    });
  });

  describe('searchStocks', () => {
    it('should return filtered stock results', async () => {
      const result = await stockDataService.searchStocks('app');

      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ symbol: 'AAPL', name: 'Apple Inc.' })
        ])
      );
    });

    it('should return empty array for no matches', async () => {
      const result = await stockDataService.searchStocks('xyz123notfound');

      expect(result).toEqual([]);
    });

    it('should be case insensitive', async () => {
      const result = await stockDataService.searchStocks('APPLE');

      expect(result.length).toBeGreaterThan(0);
    });
  });
});
