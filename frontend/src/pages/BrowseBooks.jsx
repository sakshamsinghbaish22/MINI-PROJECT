import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCw, X, SlidersHorizontal, ArrowUpDown, BookOpen } from 'lucide-react';
import { booksApi } from '../services/api';
import BookCard3D from '../components/BookCard3D';

const CATEGORIES = [
  'All Categories',
  'Computer Science',
  'Engineering',
  'Artificial Intelligence',
  'Mathematics',
  'Medical',
  'Business',
  'Physics',
  'Chemistry',
  'Competitive Exams',
  'Fiction',
];

const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair'];
const MODES = [
  { id: '', label: 'All Modes' },
  { id: 'SELL', label: 'For Sale' },
  { id: 'DONATE', label: 'Free (Donate)' },
  { id: 'EXCHANGE', label: 'Exchange' },
];

export default function BrowseBooks() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [mode, setMode] = useState(searchParams.get('mode') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || 100);
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState('newest');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    // Sync URL search params
    const qSearch = searchParams.get('search') || '';
    const qCategory = searchParams.get('category') || '';
    const qMode = searchParams.get('mode') || '';
    setSearch(qSearch);
    setCategory(qCategory);
    setMode(qMode);
  }, [searchParams]);

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (search.trim()) params.search = search.trim();
        if (category && category !== 'All Categories') params.category = category;
        if (mode) params.mode = mode;
        if (condition) params.condition = condition;
        if (mode === 'SELL' && maxPrice) params.max_price = maxPrice;
        if (location.trim()) params.location = location.trim();
        if (sortBy) params.sort_by = sortBy;

        const data = await booksApi.getBooks(params);
        setBooks(data);
      } catch (err) {
        console.error('Error loading books:', err);
        setError('Could not load marketplace books. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, [search, category, mode, condition, maxPrice, location, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setMode('');
    setCondition('');
    setMaxPrice(100);
    setLocation('');
    setSortBy('newest');
    setSearchParams({});
  };

  const activeFiltersCount = [
    search,
    category && category !== 'All Categories',
    mode,
    condition,
    location,
  ].filter(Boolean).length;

  return (
    <div className="container" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-sell" style={{ marginBottom: '0.75rem' }}>
          <span>STUDENT TEXTBOOK MARKETPLACE</span>
        </div>
        <h1 className="heading-section">
          Browse Available <span className="gradient-text">Textbooks</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Discover curriculum books, senior donations, and exchange offers across campuses.
        </p>
      </div>

      {/* Main Grid: Sidebar Filters + Cards Catalog */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '2.5rem',
        alignItems: 'start',
      }}>
        {/* Left Sticky Filter Sidebar (Desktop) */}
        <aside
          className="glass-panel"
          style={{
            padding: '1.75rem',
            borderRadius: 'var(--radius-xl)',
            position: 'sticky',
            top: '90px',
            border: '1px solid rgba(0, 240, 255, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#FFFFFF', fontSize: '1.05rem' }}>
              <SlidersHorizontal size={18} color="#00F0FF" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span style={{ background: 'var(--cyan)', color: '#050811', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {activeFiltersCount}
                </span>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                style={{ background: 'transparent', border: 'none', color: '#EC4899', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search by keyword */}
          <div className="form-group">
            <label className="form-label">Search Keyword</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Title, author, course..."
                className="form-input"
                style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
              />
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Mode Selector */}
          <div className="form-group">
            <label className="form-label">Listing Type</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: mode === m.id ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: mode === m.id ? '1px solid rgba(0, 240, 255, 0.4)' : '1px solid var(--border-subtle)',
                    color: mode === m.id ? '#00F0FF' : 'var(--text-secondary)',
                    fontWeight: mode === m.id ? 700 : 500,
                    fontSize: '13px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Academic Discipline Category */}
          <div className="form-group">
            <label className="form-label">Discipline / Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.85rem' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c === 'All Categories' ? '' : c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div className="form-group">
            <label className="form-label">Book Condition</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="form-select"
              style={{ fontSize: '0.85rem' }}
            >
              <option value="">Any Condition</option>
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Range Slider */}
          {mode !== 'DONATE' && (
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Max Price (₹)</label>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#00F0FF' }}>₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max="2500"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--cyan)' }}
              />
            </div>
          )}

          {/* Campus Location Search */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Campus / City</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. North Library, Delhi"
              className="form-input"
              style={{ fontSize: '0.85rem' }}
            />
          </div>
        </aside>

        {/* Right Catalog Main Content */}
        <div>
          {/* Top Bar: Results Count + Sort Dropdown */}
          <div
            className="glass-panel"
            style={{
              padding: '0.9rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Showing <strong style={{ color: '#FFFFFF' }}>{books.length}</strong> available books
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpDown size={15} color="var(--cyan)" />
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(5, 8, 17, 0.8)',
                  border: '1px solid var(--border-glass)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="newest">Newest Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Catalog Grid or Empty State */}
          {loading ? (
            <div style={{ padding: '4rem 0', textAlign: 'center' }}>
              <div className="animate-pulse-glow" style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
              <div style={{ color: 'var(--cyan)', fontWeight: 600 }}>Scanning marketplace nodes...</div>
            </div>
          ) : error ? (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: '#EF4444' }}>
              {error}
            </div>
          ) : books.length === 0 ? (
            <div
              className="glass-panel"
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
                No textbooks matched your filter criteria
              </h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                Try adjusting your search terms, changing the category, or clearing selected filters.
              </p>
              <button onClick={handleResetFilters} className="btn btn-primary">
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid-cards">
              {books.map((book) => (
                <BookCard3D key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .container > div {
            grid-template-columns: 1fr !important;
          }
          aside {
            position: relative !important;
            top: 0 !important;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
