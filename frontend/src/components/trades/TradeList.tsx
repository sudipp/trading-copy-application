import React from 'react';
import TradeCard from './TradeCard';
import './TradeList.css';

interface TradeListProps {
  trades: any[];
}

const TradeList: React.FC<TradeListProps> = ({ trades }) => {
  if (trades.length === 0) {
    return <div className="empty-state">No trades found</div>;
  }

  return (
    <div className="trade-list">
      {trades.map((trade) => (
        <TradeCard key={trade.id} trade={trade} />
      ))}
    </div>
  );
};

export default TradeList;

