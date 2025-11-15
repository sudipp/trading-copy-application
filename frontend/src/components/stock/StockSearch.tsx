import React, { useState, useEffect, useRef } from 'react';
import type { StockSearchResult } from '../../services/stockDataService';
import { searchStocks } from '../../services/stockDataService';
import './StockSearch.css';

interface StockSearchProps {
  onSelectStock: (symbol: string) => void;
  placeholder?: string;
}

const StockSearch: React.FC<StockSearchProps> = ({
  onSelectStock,
  placeholder = 'Search stocks by symbol or name...'
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number | null>(null);

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      setShowResults(false);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const searchResults = await searchStocks(query);
        setResults(searchResults);
        setShowResults(true);
      } catch (err: any) {
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSelectStock = (symbol: string) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    onSelectStock(symbol);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="stock-search" ref={searchRef}>
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
        />
        {loading && (
          <div className="search-spinner"></div>
        )}
        {query && !loading && (
          <button
            className="clear-button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowResults(false);
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {showResults && (
        <div className="search-results">
          {error && (
            <div className="search-error">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {!error && results.length === 0 && !loading && (
            <div className="no-results">
              <span>No stocks found for "{query}"</span>
            </div>
          )}

          {results.length > 0 && (
            <ul className="results-list">
              {results.map((result) => (
                <li
                  key={result.symbol}
                  className="result-item"
                  onClick={() => handleSelectStock(result.symbol)}
                >
                  <div className="result-symbol">
                    {highlightMatch(result.symbol, query)}
                  </div>
                  <div className="result-name">
                    {highlightMatch(result.name, query)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
