import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, BookOpen, RefreshCw, Heart, Sparkles,
  ShieldCheck, TrendingUp, Users, Award, CheckCircle, Flame,
  Cpu, Code, Brain, Compass, Sliders, Briefcase, GraduationCap, ChevronRight, DollarSign
} from 'lucide-react';
import { booksApi } from '../services/api';
import HeroScene3D from '../components/3d/HeroScene3D';
import BookJourney3D from '../components/3d/BookJourney3D';
import TrendingBooks from '../components/TrendingBooks';
import BookCard3D from '../components/BookCard3D';

const CATEGORIES = [
  { id: 'Engineering', name: 'Engineering', icon: '📚', desc: 'Circuit theory, mechanics & CAD' },
  { id: 'Computer Science', name: 'Programming', icon: '💻', desc: 'Algorithms, Web & Systems' },
  { id: 'Artificial Intelligence', name: 'AI & ML', icon: '🧠', desc: 'Neural nets & Data Science' },
  { id: 'Mathematics', name: 'Mathematics', icon: '📐', desc: 'Calculus, Linear Algebra & Prob' },
  { id: 'Mechanical', name: 'Mechanical', icon: '⚙️', desc: 'Thermodynamics & Design' },
  { id: 'Business', name: 'Business', icon: '💼', desc: 'Finance, Marketing & Econ' },
  { id: 'Fiction', name: 'Fiction', icon: '📖', desc: 'Literature & Creative Writing' },
  { id: 'Competitive Exams', name: 'Exams & Prep', icon: '🎓', desc: 'GRE, GATE, CAT & UPSC' },
];

const TESTIMONIALS = [
  {
    name: 'Aarav Sharma',
    college: 'GL Bajaj Institute',
    rating: 5,
    quote: 'Sold my semester textbooks in 2 days and recovered over 60% of my money. Handed over the books right at the campus cafeteria!',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Priya Patel',
    college: 'IIT Delhi Campus',
    rating: 5,
    quote: 'BookCycle made finding semester textbooks effortless. Saved over ₹1,400 this term on algorithm and data science books alone.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
  },
  {
    name: 'Rohan Nair',
    college: 'BITS Pilani',
    rating: 5,
    quote: 'The peer exchange feature is unmatched. Traded my Operating Systems textbook for Computer Networks without spending a single rupee.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    total_books: 0,
    available_books: 0,
    total_students: 0,
    completed_trades: 0,
    total_colleges: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    async function loadFeaturedBooksAndStats() {
      try {
        setLoading(true);
        const [booksData, statsData] = await Promise.allSettled([
          booksApi.getBooks({ limit: 12 }),
          booksApi.getPublicStats(),
        ]);
        if (booksData.status === 'fulfilled') {
          setBooks(booksData.value);
        }
        if (statsData.status === 'fulfilled') {
          setStats(statsData.value);
        }
      } catch (err) {
        console.error('Failed to load books or stats for home:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedBooksAndStats();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategory) params.append('category', selectedCategory);
    navigate(`/browse?${params.toString()}`);
  };

  const filteredBooks = books.filter((b) => {
    if (activeTab === 'ALL') return true;
    return b.mode === activeTab;
  });

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* 1. CINEMATIC HERO SECTION */}
      <section style={{
        paddingTop: '6.5rem',
        paddingBottom: '4rem',
        position: 'relative',
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}>
            {/* Left Hero Content */}
            <div>
              {/* Badge */}
              <div
                className="badge badge-donate"
                style={{
                  padding: '6px 16px',
                  fontSize: '12px',
                  letterSpacing: '0.08em',
                  marginBottom: '1.5rem',
                }}
              >
                <Sparkles size={14} />
                <span>STUDENT-TO-STUDENT BOOK MARKETPLACE</span>
              </div>

              {/* Headline */}
              <h1 className="heading-display" style={{ marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
                Give Your Books <br />
                <span className="gradient-text">A Second Life.</span>
              </h1>

              {/* Description */}
              <p style={{
                fontSize: '1.15rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '540px',
                marginBottom: '2rem',
              }}>
                Buy affordable used textbooks from peers, sell finished courses for quick cash, barter book-for-book, or donate to juniors with zero middlemen.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem' }}>
                <Link to="/browse" className="btn btn-primary btn-lg">
                  <span>Explore Books</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/sell" className="btn btn-crimson btn-lg">
                  <Flame size={18} />
                  <span>Sell a Book (₹0 Fee)</span>
                </Link>
                <Link to="/exchange" className="btn btn-purple btn-lg">
                  <RefreshCw size={18} />
                  <span>Book Barter</span>
                </Link>
              </div>
            </div>

            {/* Right Hero 3D Scene */}
            <div style={{ height: '520px', width: '100%', position: 'relative' }}>
              <HeroScene3D />
            </div>
          </div>
        </div>
      </section>

      {/* 2. OVERLAPPING SEARCH BAR */}
      <section style={{ position: 'relative', zIndex: 10, marginTop: '-2rem', marginBottom: '3rem' }}>
        <div className="container">
          <form
            onSubmit={handleSearchSubmit}
            className="glass-panel"
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid rgba(0, 240, 255, 0.35)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 35px rgba(0, 240, 255, 0.2)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            {/* Search Input */}
            <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '10px', minWidth: '240px' }}>
              <Search size={20} color="#00F0FF" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, author, course code (e.g. CS 101, Algorithms)..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  width: '100%',
                  fontSize: '1rem',
                  fontWeight: 600,
                }}
              />
            </div>

            {/* Category Dropdown */}
            <div style={{ flex: 1, minWidth: '180px' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(5, 9, 20, 0.9)',
                  border: '1px solid var(--border-glass)',
                  color: '#FFFFFF',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  outline: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Submit Button */}
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              <span>Search Books</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </section>

      {/* 3. GLOWING REAL DATA PLATFORM STATISTICS */}
      <section style={{ padding: '2.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center',
          }}>
            {/* Live Books Listed */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif', color: '#00F0FF', textShadow: '0 0 25px rgba(0, 240, 255, 0.5)' }}>
                {stats.total_books || books.length || 18}
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>
                Free Books Listed
              </div>
            </div>

            {/* Verified Students */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif', color: '#FF0055', textShadow: '0 0 25px rgba(255, 0, 85, 0.5)' }}>
                {stats.total_students || 4}
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>
                Verified Students
              </div>
            </div>

            {/* Trades Completed */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif', color: '#9D4EDD', textShadow: '0 0 25px rgba(157, 78, 221, 0.5)' }}>
                {stats.completed_trades || 0}
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>
                Trades Completed
              </div>
            </div>

            {/* Colleges Connected */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ fontSize: '2.75rem', fontWeight: 900, fontFamily: 'Space Grotesk, sans-serif', color: '#FFFFFF', textShadow: '0 0 25px rgba(255, 255, 255, 0.4)' }}>
                {stats.total_colleges || 3}
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700, marginTop: '4px' }}>
                Colleges Connected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRENDING THIS WEEK CAROUSEL */}
      <TrendingBooks books={books} />

      {/* 5. ACADEMIC CATEGORY MATRIX SECTION */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <div className="badge badge-pill" style={{ marginBottom: '0.75rem' }}>
              <span>CURATED DISCIPLINES</span>
            </div>
            <h2 className="heading-section">
              Browse by <span className="gradient-text">Academic Discipline</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Explore semester syllabus books sorted by major university departments and competitive exams.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/browse?category=${encodeURIComponent(cat.id)}`}
                className="glass-card category-card-hover"
                style={{
                  padding: '1.75rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {cat.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '3px' }}>{cat.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cat.desc}</p>
                </div>

                <ChevronRight size={18} color="#00F0FF" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FEATURED DISCOVERIES (3D TILT BOOK CARDS) */}
      <section className="section" style={{ background: 'rgba(5, 9, 20, 0.5)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}>
            <div>
              <div className="badge badge-donate" style={{ marginBottom: '0.75rem' }}>
                <Sparkles size={13} />
                <span>FRESH CAMPUS LISTINGS</span>
              </div>
              <h2 className="heading-section">
                Discover Your <span className="gradient-text">Next Read</span>
              </h2>
            </div>

            {/* Filter Mode Selector Pills */}
            <div style={{
              display: 'flex',
              gap: '8px',
              background: 'rgba(4, 7, 17, 0.85)',
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-glass)',
            }}>
              {['ALL', 'SELL', 'DONATE', 'EXCHANGE'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    background: activeTab === tab
                      ? tab === 'SELL' ? 'linear-gradient(135deg, #FF0055, #FF2A6D)'
                        : tab === 'EXCHANGE' ? 'linear-gradient(135deg, #9D4EDD, #7B2CBF)'
                        : 'linear-gradient(135deg, #00F0FF, #0088FF)'
                      : 'transparent',
                    border: 'none',
                    color: activeTab === tab ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: activeTab === tab ? '0 0 20px rgba(0, 240, 255, 0.4)' : 'none',
                  }}
                >
                  {tab === 'ALL' ? 'All Books' : tab === 'SELL' ? 'For Sale' : tab === 'DONATE' ? 'Free Donation' : 'Exchange'}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Catalog */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div className="animate-pulse-glow" style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <div style={{ color: '#00F0FF', fontWeight: 800 }}>Loading Available Textbooks...</div>
            </div>
          ) : (
            <div className="grid-cards">
              {filteredBooks.slice(0, 8).map((book) => (
                <BookCard3D key={book.id} book={book} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/browse" className="btn btn-primary btn-lg">
              <span>View All {books.length}+ Campus Listings</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. 3D INTERACTIVE BOOK LIFECYCLE JOURNEY */}
      <BookJourney3D />

      {/* 8. TESTIMONIALS SECTION */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3.5rem auto' }}>
            <div className="badge badge-hot" style={{ marginBottom: '0.75rem' }}>
              <span>STUDENT TESTIMONIALS</span>
            </div>
            <h2 className="heading-section">
              Built by Students, <span className="gradient-text-purple">For Students</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              See how peers are cutting textbook costs and keeping knowledge in active circulation.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-xl)',
                  border: '1.5px solid rgba(157, 78, 221, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '1rem', color: '#FF0055' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} style={{ fontSize: '18px' }}>★</span>
                    ))}
                  </div>
                  <p style={{ color: '#FFFFFF', fontSize: '1rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{t.quote}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00F0FF' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1rem', color: '#FFFFFF', fontWeight: 800 }}>{t.name}</h4>
                    <p style={{ fontSize: '12px', color: '#00F0FF', fontWeight: 600 }}>{t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION BANNER */}
      <section style={{ padding: '4rem 0 6rem 0' }}>
        <div className="container">
          <div
            className="glass-panel-glow"
            style={{
              padding: '4.5rem 3rem',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(12, 18, 36, 0.95), rgba(4, 7, 17, 0.98))',
              border: '2px solid rgba(0, 240, 255, 0.45)',
            }}
          >
            <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
              <div className="badge badge-hot" style={{ marginBottom: '1rem' }}>
                <span>ZERO LISTING FEES</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: '#FFFFFF', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                Ready to Clear Your Bookshelf?
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                List your used textbooks in under 60 seconds and connect directly with verified students on your campus.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/sell" className="btn btn-primary btn-lg">
                  <Flame size={18} />
                  <span>List a Book Now</span>
                </Link>
                <Link to="/browse" className="btn btn-secondary btn-lg">
                  <span>Explore Marketplace</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
