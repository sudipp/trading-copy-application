import React, { useState } from 'react';
import './TraderFilters.css';

interface TraderFiltersProps {
  onFilterChange: (filters: any) => void;
}

const TraderFilters: React.FC<TraderFiltersProps> = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [minWinRate, setMinWinRate] = useState('');
  const [isVerified, setIsVerified] = useState('');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateFilters({ search: value, minWinRate, isVerified });
  };

  const handleWinRateChange = (value: string) => {
    setMinWinRate(value);
    updateFilters({ search, minWinRate: value, isVerified });
  };

  const handleVerifiedChange = (value: string) => {
    setIsVerified(value);
    updateFilters({ search, minWinRate, isVerified: value });
  };

  const updateFilters = (filters: any) => {
    const cleanFilters: any = {};
    if (filters.search) cleanFilters.search = filters.search;
    if (filters.minWinRate) cleanFilters.minWinRate = filters.minWinRate;
    if (filters.isVerified) cleanFilters.isVerified = filters.isVerified;
    onFilterChange(cleanFilters);
  };

  return (
    <div className="trader-filters">
      <input
        type="text"
        placeholder="Search traders..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="filter-input"
      />
      <input
        type="number"
        placeholder="Min Win Rate %"
        value={minWinRate}
        onChange={(e) => handleWinRateChange(e.target.value)}
        className="filter-input"
        min="0"
        max="100"
      />
      <select
        value={isVerified}
        onChange={(e) => handleVerifiedChange(e.target.value)}
        className="filter-select"
      >
        <option value="">All Traders</option>
        <option value="true">Verified Only</option>
        <option value="false">Unverified Only</option>
      </select>
    </div>
  );
};

export default TraderFilters;

