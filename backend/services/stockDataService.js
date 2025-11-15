const axios = require('axios');

const STOCK_API_KEY = process.env.STOCK_API_KEY;
const STOCK_API_PROVIDER = process.env.STOCK_API_PROVIDER || 'alpha-vantage';

// Simple in-memory cache (in production, use Redis)
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

/**
 * Get current stock price
 */
async function getCurrentPrice(symbol) {
  const cacheKey = `price-${symbol}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    let priceData;
    
    if (STOCK_API_PROVIDER === 'alpha-vantage') {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol.toUpperCase(),
          apikey: STOCK_API_KEY
        }
      });

      if (response.data['Error Message'] || response.data['Note']) {
        throw new Error('API limit reached or invalid symbol');
      }

      const quote = response.data['Global Quote'];
      if (!quote || !quote['05. price']) {
        throw new Error('Invalid symbol or no data available');
      }

      priceData = {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        previousClose: parseFloat(quote['08. previous close']),
        timestamp: new Date()
      };
    } else {
      // Fallback to mock data if no API key
      priceData = {
        symbol: symbol.toUpperCase(),
        price: 100 + Math.random() * 50,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 1000000),
        high: 120,
        low: 90,
        open: 105,
        previousClose: 100,
        timestamp: new Date()
      };
    }

    cache.set(cacheKey, { data: priceData, timestamp: Date.now() });
    return priceData;
  } catch (error) {
    console.error('Error fetching stock price:', error.message);
    throw error;
  }
}

/**
 * Get historical price data
 */
async function getHistoricalData(symbol, interval = 'daily') {
  const cacheKey = `history-${symbol}-${interval}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL * 5) {
    return cached.data;
  }

  try {
    let historicalData;
    
    if (STOCK_API_PROVIDER === 'alpha-vantage' && STOCK_API_KEY) {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol.toUpperCase(),
          apikey: STOCK_API_KEY,
          outputsize: 'compact'
        }
      });

      if (response.data['Error Message'] || response.data['Note']) {
        throw new Error('API limit reached or invalid symbol');
      }

      const timeSeries = response.data['Time Series (Daily)'];
      if (!timeSeries) {
        throw new Error('No historical data available');
      }

      historicalData = Object.entries(timeSeries).map(([date, data]) => ({
        date,
        open: parseFloat(data['1. open']),
        high: parseFloat(data['2. high']),
        low: parseFloat(data['3. low']),
        close: parseFloat(data['4. close']),
        volume: parseInt(data['5. volume'])
      })).reverse();
    } else {
      // Mock data
      historicalData = generateMockHistoricalData(symbol);
    }

    cache.set(cacheKey, { data: historicalData, timestamp: Date.now() });
    return historicalData;
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
    throw error;
  }
}

/**
 * Search stocks by symbol or name
 */
async function searchStocks(query) {
  try {
    // Mock search results (in production, use a stock search API)
    const mockStocks = [
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation' }
    ];

    const filtered = mockStocks.filter(stock =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );

    return filtered.slice(0, 10);
  } catch (error) {
    console.error('Error searching stocks:', error.message);
    throw error;
  }
}

/**
 * Generate mock historical data
 */
function generateMockHistoricalData(symbol) {
  const data = [];
  const basePrice = 100;
  let currentPrice = basePrice;

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.5) * 4;
    currentPrice = Math.max(50, currentPrice + change);

    data.push({
      date: date.toISOString().split('T')[0],
      open: currentPrice + (Math.random() - 0.5) * 2,
      high: currentPrice + Math.random() * 3,
      low: currentPrice - Math.random() * 3,
      close: currentPrice,
      volume: Math.floor(Math.random() * 1000000)
    });
  }

  return data;
}

module.exports = {
  getCurrentPrice,
  getHistoricalData,
  searchStocks
};

