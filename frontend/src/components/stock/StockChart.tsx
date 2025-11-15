import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { HistoricalDataPoint } from '../../services/stockDataService';
import { getHistoricalData } from '../../services/stockDataService';
import './StockChart.css';

interface StockChartProps {
  symbol: string;
  interval?: 'daily' | 'weekly' | 'monthly';
  height?: number;
}

const StockChart: React.FC<StockChartProps> = ({
  symbol,
  interval = 'daily',
  height = 400
}) => {
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInterval, setSelectedInterval] = useState<'daily' | 'weekly' | 'monthly'>(interval);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const historicalData = await getHistoricalData(symbol, selectedInterval);
        if (mounted) {
          setData(historicalData);
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

    fetchData();

    return () => {
      mounted = false;
    };
  }, [symbol, selectedInterval]);

  const handleIntervalChange = (newInterval: 'daily' | 'weekly' | 'monthly') => {
    setSelectedInterval(newInterval);
  };

  if (loading) {
    return (
      <div className="stock-chart loading">
        <div className="spinner"></div>
        <span>Loading chart data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-chart error">
        <span className="error-icon">⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="stock-chart empty">
        <span>No chart data available</span>
      </div>
    );
  }

  // Determine if stock is up or down
  const firstPrice = data[0]?.close || 0;
  const lastPrice = data[data.length - 1]?.close || 0;
  const isUp = lastPrice >= firstPrice;
  const lineColor = isUp ? '#10b981' : '#ef4444';

  return (
    <div className="stock-chart">
      <div className="chart-header">
        <h3 className="chart-title">{symbol} Price Chart</h3>
        <div className="interval-selector">
          <button
            className={`interval-btn ${selectedInterval === 'daily' ? 'active' : ''}`}
            onClick={() => handleIntervalChange('daily')}
          >
            Daily
          </button>
          <button
            className={`interval-btn ${selectedInterval === 'weekly' ? 'active' : ''}`}
            onClick={() => handleIntervalChange('weekly')}
          >
            Weekly
          </button>
          <button
            className={`interval-btn ${selectedInterval === 'monthly' ? 'active' : ''}`}
            onClick={() => handleIntervalChange('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: 12 }}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '12px'
            }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Close']}
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="close"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            name="Close Price"
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="chart-stats">
        <div className="stat">
          <span className="stat-label">High</span>
          <span className="stat-value">
            ${Math.max(...data.map(d => d.high)).toFixed(2)}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Low</span>
          <span className="stat-value">
            ${Math.min(...data.map(d => d.low)).toFixed(2)}
          </span>
        </div>
        <div className="stat">
          <span className="stat-label">Avg Volume</span>
          <span className="stat-value">
            {(data.reduce((sum, d) => sum + d.volume, 0) / data.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
