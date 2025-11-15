import React, { useEffect, useState } from 'react';
import api from '../services/api';
import PortfolioSummary from '../components/dashboard/PortfolioSummary';
import TradeList from '../components/trades/TradeList';
import './DashboardPage.css';

interface DashboardSummary {
  followedTraders: number;
  pendingApprovals: number;
  unreadNotifications: number;
  totalInvested: number;
}

const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentTrades, setRecentTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        console.log('Dashboard response:', response.data);
        setSummary(response.data.summary);
        setRecentTrades(response.data.recentTrades || []);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
        console.error('Error details:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      {summary ? (
        <>
          <PortfolioSummary summary={summary} />
          <div className="recent-trades-section">
            <h2>Recent Trades from Followed Traders</h2>
            <TradeList trades={recentTrades} />
          </div>
        </>
      ) : (
        <div className="error-message">
          <p>Failed to load dashboard data. Please try refreshing the page.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

