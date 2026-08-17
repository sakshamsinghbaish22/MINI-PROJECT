import React, { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export const SearchBar = ({ initialValue = '', onSearch, placeholder = 'Search by title, author, course, or subject...', onToggleFilters = null, showFilterToggle = false }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px solid var(--border-color)',
        padding: '0.35rem 0.5rem 0.35rem 1rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition-fast)'
      }}>
        <Search size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginRight: '0.65rem' }} />
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          style={{
            border: 'none',
            boxShadow: 'none',
            padding: '0.45rem 0',
            fontSize: '1rem',
            backgroundColor: 'transparent',
            flex: 1
          }}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            style={{ padding: '0.4rem', color: 'var(--text-muted)', display: 'flex' }}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-sm"
          style={{ marginLeft: '0.5rem', borderRadius: 'var(--radius-md)' }}
        >
          Search
        </button>

        {showFilterToggle && onToggleFilters && (
          <button
            type="button"
            onClick={onToggleFilters}
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: '0.4rem' }}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={16} />
            <span className="hide-mobile">Filters</span>
          </button>
        )}
      </div>
    </form>
  );
};
