import React from 'react';
import './PortfolioSummary.css';

interface PortfolioSummaryProps {
  summary: {
    followedTraders: number;
    pendingApprovals: number;
    unreadNotifications: number;
    totalInvested: number;
  };
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ summary }) => {
  return (
    <div className="portfolio-summary">
      <div className="summary-card">
        <h3>Followed Traders</h3>
        <p className="summary-value">{summary.followedTraders}</p>
      </div>
      <div className="summary-card">
        <h3>Pending Approvals</h3>
        <p className="summary-value">{summary.pendingApprovals}</p>
      </div>
      <div className="summary-card">
        <h3>Unread Notifications</h3>
        <p className="summary-value">{summary.unreadNotifications}</p>
      </div>
      <div className="summary-card">
        <h3>Total Invested</h3>
        <p className="summary-value">${summary.totalInvested.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PortfolioSummary;

