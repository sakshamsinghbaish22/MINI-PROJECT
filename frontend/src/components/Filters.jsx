import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Computer Science',
  'Engineering',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Medical & Pre-Med',
  'Competitive Exam Prep',
  'Business & Economics',
  'Humanities & Social Sciences',
  'Other'
];

const CONDITIONS = ['All', 'Brand New', 'Like New', 'Good', 'Fair'];
const MODES = [
  { value: '', label: 'All Modes' },
  { value: 'SELL', label: 'For Sale' },
  { value: 'DONATE', label: 'Free Donation' },
  { value: 'EXCHANGE', label: 'Exchange' }
];

export const Filters = ({ filters, onChange, onReset }) => {
  const handleFieldChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
          <Filter size={18} color="var(--primary-blue)" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: 600 }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      {/* Mode Filter */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Listing Mode
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {MODES.map((mode) => (
            <label key={mode.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="mode"
                checked={(filters.mode || '') === mode.value}
                onChange={() => handleFieldChange('mode', mode.value)}
                style={{ width: 'auto', margin: 0 }}
              />
              <span>{mode.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Category
        </label>
        <select
          value={filters.category || 'All'}
          onChange={(e) => handleFieldChange('category', e.target.value === 'All' ? '' : e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Condition Filter */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Book Condition
        </label>
        <select
          value={filters.condition || 'All'}
          onChange={(e) => handleFieldChange('condition', e.target.value === 'All' ? '' : e.target.value)}
        >
          {CONDITIONS.map((cond) => (
            <option key={cond} value={cond}>{cond}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Price Range ($)
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.min_price || ''}
            onChange={(e) => handleFieldChange('min_price', e.target.value)}
            style={{ padding: '0.5rem 0.6rem' }}
          />
          <span style={{ color: 'var(--text-muted)' }}>-</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.max_price || ''}
            onChange={(e) => handleFieldChange('max_price', e.target.value)}
            style={{ padding: '0.5rem 0.6rem' }}
          />
        </div>
      </div>

      {/* Campus Location Filter */}
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
          Campus / Location
        </label>
        <input
          type="text"
          placeholder="e.g. North Campus, Library..."
          value={filters.location || ''}
          onChange={(e) => handleFieldChange('location', e.target.value)}
        />
      </div>
    </div>
  );
};
