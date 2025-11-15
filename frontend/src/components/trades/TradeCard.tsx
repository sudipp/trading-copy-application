import React from 'react';
import './TradeCard.css';

interface TradeCardProps {
  trade: any;
}

const TradeCard: React.FC<TradeCardProps> = ({ trade }) => {
  const isBuy = trade.tradeType === 'buy';
  const changeColor = isBuy ? '#4caf50' : '#f44336';

  return (
    <div className="trade-card">
      <div className="trade-header">
        <div>
          <h3>{trade.symbol}</h3>
          <span className="trader-name">{trade.trader?.name}</span>
        </div>
        <span className={`trade-type ${trade.tradeType}`}>
          {trade.tradeType.toUpperCase()}
        </span>
      </div>
      <div className="trade-details">
        <div className="detail">
          <span className="detail-label">Entry Price</span>
          <span className="detail-value">${trade.entryPrice}</span>
        </div>
        <div className="detail">
          <span className="detail-label">Position Size</span>
          <span className="detail-value">${trade.positionSize}</span>
        </div>
        <div className="detail">
          <span className="detail-label">Time</span>
          <span className="detail-value">
            {new Date(trade.timestamp).toLocaleString()}
          </span>
        </div>
      </div>
      {trade.rationale && (
        <div className="trade-rationale">
          <strong>Rationale:</strong> {trade.rationale}
        </div>
      )}
    </div>
  );
};

export default TradeCard;

