import api from './api';

export interface StockPrice {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: Date;
}

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
}

/**
 * Get current stock price
 */
export async function getCurrentPrice(symbol: string): Promise<StockPrice> {
  try {
    const response = await api.get<StockPrice>(`/stock/${symbol}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch stock price');
  }
}

/**
 * Get historical stock data
 */
export async function getHistoricalData(
  symbol: string,
  interval: 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<HistoricalDataPoint[]> {
  try {
    const response = await api.get<{ symbol: string; data: HistoricalDataPoint[] }>(
      `/stock/${symbol}/history`,
      { params: { interval } }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch historical data');
  }
}

/**
 * Search stocks by symbol or name
 */
export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  try {
    const response = await api.get<{ results: StockSearchResult[] }>('/stock/search', {
      params: { q: query }
    });
    return response.data.results;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to search stocks');
  }
}

/**
 * Check if market is currently open
 * US stock market hours: 9:30 AM - 4:00 PM ET on weekdays
 */
export function isMarketOpen(): {
  isOpen: boolean;
  status: 'open' | 'closed' | 'pre-market' | 'after-hours';
  nextOpenTime?: Date;
} {
  const now = new Date();
  const etTime = new Date(
    now.toLocaleString('en-US', { timeZone: 'America/New_York' })
  );
  
  const day = etTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = etTime.getHours();
  const minutes = etTime.getMinutes();
  const time = hours * 60 + minutes; // Time in minutes from midnight

  // Market closed on weekends
  if (day === 0 || day === 6) {
    return {
      isOpen: false,
      status: 'closed',
      nextOpenTime: getNextMarketOpen(etTime)
    };
  }

  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM
  const preMarketStart = 4 * 60; // 4:00 AM
  const afterHoursEnd = 20 * 60; // 8:00 PM

  if (time >= marketOpen && time < marketClose) {
    return { isOpen: true, status: 'open' };
  } else if (time >= preMarketStart && time < marketOpen) {
    return {
      isOpen: false,
      status: 'pre-market',
      nextOpenTime: getNextMarketOpen(etTime)
    };
  } else if (time >= marketClose && time < afterHoursEnd) {
    return {
      isOpen: false,
      status: 'after-hours',
      nextOpenTime: getNextMarketOpen(etTime)
    };
  } else {
    return {
      isOpen: false,
      status: 'closed',
      nextOpenTime: getNextMarketOpen(etTime)
    };
  }
}

/**
 * Get next market open time
 */
function getNextMarketOpen(etTime: Date): Date {
  const nextOpen = new Date(etTime);
  nextOpen.setHours(9, 30, 0, 0);

  // If it's currently past market hours, move to next day
  if (etTime.getHours() >= 16) {
    nextOpen.setDate(nextOpen.getDate() + 1);
  }

  // Skip weekends
  while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6) {
    nextOpen.setDate(nextOpen.getDate() + 1);
  }

  return nextOpen;
}

/**
 * Format market status for display
 */
export function formatMarketStatus(): string {
  const { status, nextOpenTime } = isMarketOpen();
  
  switch (status) {
    case 'open':
      return 'Market is Open';
    case 'closed':
      return `Market Closed - Opens ${nextOpenTime?.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/New_York'
      })} ET`;
    case 'pre-market':
      return 'Pre-Market Trading';
    case 'after-hours':
      return 'After-Hours Trading';
    default:
      return 'Market Closed';
  }
}
