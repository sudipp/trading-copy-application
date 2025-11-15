const stockDataService = require('./stockDataService');

/**
 * Service to handle real-time stock price updates via WebSocket and polling
 */
class StockPriceUpdateService {
  constructor(io) {
    this.io = io;
    this.subscriptions = new Map(); // Map of symbol -> Set of socket IDs
    this.pollingIntervals = new Map(); // Map of symbol -> interval ID
    this.updateInterval = 5000; // Update every 5 seconds (respects API rate limits)
  }

  /**
   * Start polling for a stock symbol
   */
  startPolling(symbol) {
    if (this.pollingIntervals.has(symbol)) {
      return; // Already polling this symbol
    }

    console.log(`Starting price updates for ${symbol}`);

    const intervalId = setInterval(async () => {
      try {
        const priceData = await stockDataService.getCurrentPrice(symbol);
        
        // Emit to all clients subscribed to this stock
        this.io.to(`stock-${symbol}`).emit('stock-update', {
          symbol,
          data: priceData,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error(`Error fetching price for ${symbol}:`, error.message);
        
        // Emit error to subscribed clients
        this.io.to(`stock-${symbol}`).emit('stock-error', {
          symbol,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }, this.updateInterval);

    this.pollingIntervals.set(symbol, intervalId);
  }

  /**
   * Stop polling for a stock symbol
   */
  stopPolling(symbol) {
    const intervalId = this.pollingIntervals.get(symbol);
    if (intervalId) {
      console.log(`Stopping price updates for ${symbol}`);
      clearInterval(intervalId);
      this.pollingIntervals.delete(symbol);
    }
  }

  /**
   * Add a subscription for a symbol
   */
  addSubscription(symbol, socketId) {
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, new Set());
    }
    
    this.subscriptions.get(symbol).add(socketId);
    
    // Start polling if this is the first subscriber
    if (this.subscriptions.get(symbol).size === 1) {
      this.startPolling(symbol);
    }
  }

  /**
   * Remove a subscription for a symbol
   */
  removeSubscription(symbol, socketId) {
    const subscribers = this.subscriptions.get(symbol);
    if (subscribers) {
      subscribers.delete(socketId);
      
      // Stop polling if no more subscribers
      if (subscribers.size === 0) {
        this.stopPolling(symbol);
        this.subscriptions.delete(symbol);
      }
    }
  }

  /**
   * Remove all subscriptions for a socket
   */
  removeAllSubscriptions(socketId) {
    for (const [symbol, subscribers] of this.subscriptions.entries()) {
      if (subscribers.has(socketId)) {
        this.removeSubscription(symbol, socketId);
      }
    }
  }

  /**
   * Get active subscriptions
   */
  getActiveSubscriptions() {
    const active = {};
    for (const [symbol, subscribers] of this.subscriptions.entries()) {
      active[symbol] = subscribers.size;
    }
    return active;
  }

  /**
   * Cleanup - stop all polling
   */
  cleanup() {
    console.log('Cleaning up stock price update service...');
    for (const symbol of this.pollingIntervals.keys()) {
      this.stopPolling(symbol);
    }
    this.subscriptions.clear();
  }
}

module.exports = StockPriceUpdateService;
