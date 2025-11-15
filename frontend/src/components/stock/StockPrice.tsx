import React, { useEffect, useState } from 'react';
import type { StockPrice as StockPriceData } from '../../services/stockDataService';
import { getCurrentPrice, formatMarketStatus, isMarketOpen } from '../../services/stockDataService';
import websocketService from '../../services/websocketService';
import './StockPrice.css';

interface StockPriceProps {
  symbol: string;
  showDetails?: boolean;
  realTime?: boolean;
}

const StockPrice: React.FC<StockPriceProps> = ({ 
  symbol, 
  showDetails = false,
  realTime = true
}) => {
  const [priceData, setPriceData] = useState<StockPriceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch initial price data
  useEffect(() => {
    let mounted = true;

    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentPrice(symbol);
        if (mounted) {
          setPriceData(data);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchPrice();

    return () => {
      mounted = false;
    };
  }, [symbol]);

  // Set up real-time updates via WebSocket
  useEffect(() => {
    if (!realTime) return;

    // Connect to WebSocket
    websocketService.connect();
    setIsConnected(websocketService.isConnected());

    // Handle connection events
    const unsubConnect = websocketService.onConnect(() => {
      setIsConnected(true);
    });

    const unsubDisconnect = websocketService.onDisconnect(() => {
      setIsConnected(false);
    });

    // Subscribe to stock updates
    const unsubscribe = websocketService.subscribe(
      symbol,
      (update) => {
        setPriceData(update.data);
        setError(null);
      },
      (error) => {
        setError(error.error);
      }
    );

    return () => {
      unsubscribe();
      unsubConnect();
      unsubDisconnect();
    };
  }, [symbol, realTime]);

  if (loading) {
    return (
      <div className="stock-price loading">
        <div className="spinner"></div>
        <span>Loading {symbol}...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-price error">
        <span className="error-icon">⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  if (!priceData) {
    return null;
  }

  const isPositive = priceData.change >= 0;
  const changeClass = isPositive ? 'positive' : 'negative';
  const changeSymbol = isPositive ? '+' : '';
  const marketStatus = formatMarketStatus();
  const { isOpen } = isMarketOpen();

  return (
    <div className={`stock-price ${showDetails ? 'detailed' : 'compact'}`}>
      <div className="stock-header">
        <h3 className="stock-symbol">{priceData.symbol}</h3>
        {realTime && (
          <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            {isConnected ? 'Live' : 'Offline'}
          </span>
        )}
      </div>
      
      <div className="price-container">
        <span className="current-price">${priceData.price.toFixed(2)}</span>
        <div className={`price-change ${changeClass}`}>
          <span className="change-value">
            {changeSymbol}${Math.abs(priceData.change).toFixed(2)}
          </span>
          <span className="change-percent">
            ({changeSymbol}{Math.abs(priceData.changePercent).toFixed(2)}%)
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="price-details">
          <div className="detail-row">
            <span className="detail-label">Open:</span>
            <span className="detail-value">${priceData.open.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">High:</span>
            <span className="detail-value">${priceData.high.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Low:</span>
            <span className="detail-value">${priceData.low.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Prev Close:</span>
            <span className="detail-value">${priceData.previousClose.toFixed(2)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Volume:</span>
            <span className="detail-value">{priceData.volume.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="market-status">
        <span className={`status-badge ${isOpen ? 'open' : 'closed'}`}>
          {marketStatus}
        </span>
      </div>

      <div className="last-updated">
        Last updated: {new Date(priceData.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default StockPrice;
