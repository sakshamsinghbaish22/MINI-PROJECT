import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Search, ArrowRight, Sparkles, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { booksApi } from '../services/api';
import BookCard3D from '../components/BookCard3D';

export default function Exchange() {
  const [exchangeBooks, setExchangeBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function loadExchanges() {
      try {
        setLoading(true);
        const data = await booksApi.getBooks({ mode: 'EXCHANGE' });
        setExchangeBooks(data);
      } catch (err) {
        console.error('Failed to load exchange books:', err);
      } finally {
        setLoading(false);
      }
    }
    loadExchanges();
  }, []);

  const filtered = exchangeBooks.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      (b.exchange_preference && b.exchange_preference.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = !selectedCategory || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="container" style={{ paddingTop: '5.5rem', paddingBottom: '6rem' }}>
      {/* Hero Banner */}
      <div
        className="glass-panel-glow"
        style={{
          padding: '3.5rem 2.5rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '3.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div className="badge badge-exchange" style={{ marginBottom: '1rem' }}>
            <RefreshCw size={13} />
            <span>ZERO FINANCIAL COST TRADING</span>
          </div>
          <h1 className="heading-section" style={{ marginBottom: '1rem' }}>
            Book-for-Book <br />
            <span className="gradient-text-purple">Exchange Board</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Swap textbooks directly with peers. Trade books you have finished for the ones you need for your upcoming midterms and finals.
          </p>
          <Link to="/sell?mode=EXCHANGE" className="btn btn-purple btn-lg">
            <span>List an Exchange Book</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '220px' }}>
          <Search size={18} color="#C084FC" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books or desired trade titles (e.g. Operating Systems, Networks)..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              width: '100%',
              fontSize: '0.95rem',
            }}
          />
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: '#C084FC' }}>{filtered.length}</strong> active trade offers
        </div>
      </div>

      {/* Exchange Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="animate-pulse-glow" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔄</div>
          <div style={{ color: '#C084FC', fontWeight: 600 }}>Loading active exchange proposals...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3.5rem', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <h3 style={{ color: '#FFFFFF', marginBottom: '0.5rem' }}>No exchange listings found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Be the first student to post an exchange offer!</p>
          <Link to="/sell?mode=EXCHANGE" className="btn btn-purple">
            List a Book for Exchange
          </Link>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map((book) => (
            <BookCard3D key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
