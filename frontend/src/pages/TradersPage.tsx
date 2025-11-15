import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TraderList from '../components/traders/TraderList';
import TraderFilters from '../components/traders/TraderFilters';
import './TradersPage.css';

const TradersPage: React.FC = () => {
  const [traders, setTraders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    fetchTraders();
  }, [filters]);

  const fetchTraders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await api.get(`/traders?${params}`);
      setTraders(response.data.traders || []);
    } catch (error) {
      console.error('Failed to fetch traders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="traders-page">
      <h1>Discover Traders</h1>
      <TraderFilters onFilterChange={setFilters} />
      {loading ? <div>Loading traders...</div> : <TraderList traders={traders} />}
    </div>
  );
};

export default TradersPage;

