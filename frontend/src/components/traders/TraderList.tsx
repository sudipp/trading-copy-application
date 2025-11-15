import React from 'react';
import TraderCard from './TraderCard';
import './TraderList.css';

interface TraderListProps {
  traders: any[];
}

const TraderList: React.FC<TraderListProps> = ({ traders }) => {
  if (traders.length === 0) {
    return <div className="empty-state">No traders found</div>;
  }

  return (
    <div className="trader-list">
      {traders.map((trader) => (
        <TraderCard key={trader.id} trader={trader} />
      ))}
    </div>
  );
};

export default TraderList;

