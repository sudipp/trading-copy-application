import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './TraderCard.css';

interface TraderCardProps {
  trader: any;
}

const TraderCard: React.FC<TraderCardProps> = ({ trader }) => {
  const [isFollowing, setIsFollowing] = useState(trader.isFollowing || false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/traders/${trader.id}/follow`);
        setIsFollowing(false);
      } else {
        await api.post(`/traders/${trader.id}/follow`);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Failed to follow/unfollow trader:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trader-card">
      <div className="trader-header">
        <h3>{trader.name}</h3>
        {trader.isVerified && <span className="verified-badge">✓ Verified</span>}
      </div>
      {trader.bio && <p className="trader-bio">{trader.bio}</p>}
      <div className="trader-stats">
        <div className="stat">
          <span className="stat-label">Win Rate</span>
          <span className="stat-value">{trader.winRate}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Total Returns</span>
          <span className="stat-value">${trader.totalReturns}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Trades</span>
          <span className="stat-value">{trader.tradeCount}</span>
        </div>
      </div>
      <div className="trader-actions">
        <Link to={`/traders/${trader.id}`} className="view-profile-btn">
          View Profile
        </Link>
        <button
          onClick={handleFollow}
          disabled={loading}
          className={isFollowing ? 'following-btn' : 'follow-btn'}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
    </div>
  );
};

export default TraderCard;

