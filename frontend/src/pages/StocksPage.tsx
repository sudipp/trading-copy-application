import React, { useState, useEffect, useCallback } from 'react';
import { getCurrentPrice, searchStocks, isMarketOpen, formatMarketStatus } from '../services/stockDataService';
import websocketService from '../services/websocketService';
import api from '../services/api';
import './StocksPage.css';

interface Stock {
  symbol: string;
  name: string;
  price?: number;
  change?: number;
  changePercent?: number;
  isLoading?: boolean;
}

const StocksPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [watchlist, setWatchlist] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

  // Load watchlist from backend on mount
  useEffect(() => {
    const loadWatchlist = async () => {
      try {
        // Try to fetch from backend first
        const response = await api.get('/watchlist');
        const backendWatchlist = response.data;

        if (backendWatchlist.length > 0) {
          // Backend has data, use it
          const stocks = backendWatchlist.map((item: any) => ({
            symbol: item.symbol,
            name: item.name || item.symbol,
            isLoading: true
          }));
          setWatchlist(stocks);

          // Fetch prices for each stock
          stocks.forEach((stock: Stock) => {
            loadStockPrice(stock.symbol);
          });

          // Update localStorage to match backend
          const symbols = backendWatchlist.map((item: any) => item.symbol);
          localStorage.setItem('stockWatchlist', JSON.stringify(symbols));
        } else {
          // Backend is empty, check localStorage
          const saved = localStorage.getItem('stockWatchlist');
          if (saved) {
            const symbols = JSON.parse(saved);
            
            // Sync localStorage to backend
            if (symbols.length > 0) {
              await api.put('/watchlist/sync', { symbols });
            }

            const stocks = symbols.map((symbol: string) => ({
              symbol,
              name: symbol,
              isLoading: true
            }));
            setWatchlist(stocks);

            // Fetch prices
            symbols.forEach((symbol: string) => {
              loadStockPrice(symbol);
            });
          }
        }
      } catch (error) {
        console.error('Failed to load watchlist from backend:', error);
        
        // Fallback to localStorage only
        const saved = localStorage.getItem('stockWatchlist');
        if (saved) {
          try {
            const symbols = JSON.parse(saved);
            const stocks = symbols.map((symbol: string) => ({
              symbol,
              name: symbol,
              isLoading: true
            }));
            setWatchlist(stocks);
            
            symbols.forEach((symbol: string) => {
              loadStockPrice(symbol);
            });
          } catch (e) {
            console.error('Failed to load watchlist from localStorage:', e);
          }
        }
      }
    };

    loadWatchlist();
  }, []);

  // Connect to WebSocket for real-time updates
  useEffect(() => {
    websocketService.connect();

    return () => {
      watchlist.forEach(stock => {
        websocketService.unsubscribe(stock.symbol, () => {});
      });
    };
  }, []);

  // Subscribe to price updates for watchlist stocks
  useEffect(() => {
    watchlist.forEach(stock => {
      websocketService.subscribe(stock.symbol, (update) => {
        setWatchlist(prev => prev.map(s => 
          s.symbol === update.symbol 
            ? { 
                ...s, 
                price: update.data.price, 
                change: update.data.change,
                changePercent: update.data.changePercent,
                isLoading: false 
              }
            : s
        ));
      });
    });

    return () => {
      watchlist.forEach(stock => {
        websocketService.unsubscribe(stock.symbol, () => {});
      });
    };
  }, [watchlist.length]);

  const loadStockPrice = async (symbol: string) => {
    try {
      const data = await getCurrentPrice(symbol);
      setWatchlist(prev => prev.map(s => 
        s.symbol === symbol 
          ? { 
              ...s, 
              price: data.price, 
              change: data.change,
              changePercent: data.changePercent,
              name: symbol,
              isLoading: false 
            }
          : s
      ));
    } catch (err) {
      console.error(`Failed to load price for ${symbol}:`, err);
      setWatchlist(prev => prev.map(s => 
        s.symbol === symbol ? { ...s, isLoading: false } : s
      ));
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const results = await searchStocks(query);
      setSearchResults(results.map(r => ({
        symbol: r.symbol,
        name: r.name
      })));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search stocks');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce search
    const timeout = window.setTimeout(() => {
      handleSearch(value);
    }, 300);
    setSearchTimeout(timeout);
  };

  const addToWatchlist = async (stock: Stock) => {
    if (watchlist.some(s => s.symbol === stock.symbol)) {
      return; // Already in watchlist
    }

    const newStock = { ...stock, isLoading: true };
    const updatedWatchlist = [...watchlist, newStock];
    setWatchlist(updatedWatchlist);

    // Save to localStorage
    const symbols = updatedWatchlist.map(s => s.symbol);
    localStorage.setItem('stockWatchlist', JSON.stringify(symbols));

    // Save to backend
    try {
      await api.post('/watchlist', { 
        symbol: stock.symbol, 
        name: stock.name 
      });
    } catch (error) {
      console.error('Failed to save to backend:', error);
    }

    // Load price
    loadStockPrice(stock.symbol);

    // Subscribe to updates
    websocketService.subscribe(stock.symbol, (update) => {
      setWatchlist(prev => prev.map(s => 
        s.symbol === update.symbol 
          ? { 
              ...s, 
              price: update.data.price, 
              change: update.data.change,
              changePercent: update.data.changePercent,
              isLoading: false 
            }
          : s
      ));
    });

    // Clear search
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeFromWatchlist = async (symbol: string) => {
    const updatedWatchlist = watchlist.filter(s => s.symbol !== symbol);
    setWatchlist(updatedWatchlist);

    // Save to localStorage
    const symbols = updatedWatchlist.map(s => s.symbol);
    localStorage.setItem('stockWatchlist', JSON.stringify(symbols));

    // Remove from backend
    try {
      await api.delete(`/watchlist/${symbol}`);
    } catch (error) {
      console.error('Failed to remove from backend:', error);
    }

    // Unsubscribe from updates
    websocketService.unsubscribe(symbol, () => {});
  };

  const formatPrice = (price?: number) => {
    if (price === undefined) return '--';
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change?: number, changePercent?: number) => {
    if (change === undefined || changePercent === undefined) return '--';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  return (
    <div className="stocks-page">
      <div className="stocks-header">
        <h1>Stock Market</h1>
        <p className="subtitle">Search and track real-time stock prices</p>
      </div>

      <div className="search-section">
        <div className="search-box">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search stocks by symbol or name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {isSearching && <div className="search-spinner" />}
        </div>

        {error && <div className="error-message">{error}</div>}

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(stock => (
              <div 
                key={stock.symbol} 
                className="search-result-item"
                onClick={() => addToWatchlist(stock)}
              >
                <div className="stock-info">
                  <span className="stock-symbol">{stock.symbol}</span>
                  <span className="stock-name">{stock.name}</span>
                </div>
                <button className="add-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="watchlist-section">
        <h2>My Watchlist</h2>
        
        {watchlist.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="1" y1="4" x2="23" y2="4" strokeWidth="2" strokeLinecap="round" />
              <line x1="1" y1="12" x2="23" y2="12" strokeWidth="2" strokeLinecap="round" />
              <line x1="1" y1="20" x2="23" y2="20" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3>No stocks in watchlist</h3>
            <p>Search and add stocks to track their prices in real-time</p>
          </div>
        ) : (
          <div className="stock-list">
            {watchlist.map(stock => (
              <div key={stock.symbol} className="stock-item">
                <div className="stock-main">
                  <div className="stock-identity">
                    <h3 className="stock-symbol">{stock.symbol}</h3>
                    <p className="stock-name">{stock.name}</p>
                  </div>
                  
                  {stock.isLoading ? (
                    <div className="stock-price-loading">
                      <div className="spinner" />
                    </div>
                  ) : (
                    <div className="stock-price-section">
                      <div className="stock-price">{formatPrice(stock.price)}</div>
                      <div className={`stock-change ${(stock.change ?? 0) >= 0 ? 'positive' : 'negative'}`}>
                        {formatChange(stock.change, stock.changePercent)}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  className="remove-button"
                  onClick={() => removeFromWatchlist(stock.symbol)}
                  title="Remove from watchlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
                    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="market-status">
        <span className="status-label">Market Status:</span>
        <span className={`status-indicator ${isMarketOpen().status === 'open' ? 'open' : 'closed'}`}>
          {formatMarketStatus()}
        </span>
      </div>
    </div>
  );
};

export default StocksPage;
