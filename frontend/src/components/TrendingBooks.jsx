import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ChevronLeft, ChevronRight, ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';

export default function TrendingBooks({ books = [] }) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  const trendingList = books.slice(0, 6);
  if (trendingList.length === 0) return null;

  return (
    <section className="section" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Section Title & Controls */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
          <div>
            <div className="badge badge-srank" style={{ marginBottom: '0.75rem' }}>
              <Flame size={13} fill="#FF0055" color="#FF0055" />
              <span>S-RANK CAMPUS PICKS</span>
            </div>
            <h2 className="heading-section">
              Trending <span className="gradient-text-crimson">This Week</span>
            </h2>
          </div>

          {/* Navigation Scroll Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => scroll('left')}
              className="btn btn-secondary btn-sm"
              style={{ width: '42px', height: '42px', padding: 0, borderRadius: '50%' }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="btn btn-secondary btn-sm"
              style={{ width: '42px', height: '42px', padding: 0, borderRadius: '50%' }}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Overlapping Carousel Container */}
        <div
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            gap: '1.75rem',
            overflowX: 'auto',
            paddingBottom: '1.5rem',
            paddingTop: '0.5rem',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {trendingList.map((book, idx) => {
            const rankStr = `#0${idx + 1}`;
            const coverImage = (book.images && book.images[0]) || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';

            return (
              <div
                key={book.id}
                style={{
                  minWidth: '320px',
                  maxWidth: '340px',
                  flexShrink: 0,
                  position: 'relative',
                }}
              >
                <div
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'var(--radius-xl)',
                    border: '1.5px solid rgba(255, 0, 85, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Big Glowing Rank Watermark */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '16px',
                      fontSize: '3.8rem',
                      fontWeight: 900,
                      fontFamily: 'Space Grotesk, sans-serif',
                      color: 'rgba(255, 0, 85, 0.08)',
                      pointerEvents: 'none',
                      lineHeight: 1,
                      userSelect: 'none',
                    }}
                  >
                    {rankStr}
                  </div>

                  {/* Top Rank Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', zIndex: 2 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'linear-gradient(135deg, rgba(255, 0, 85, 0.25), rgba(157, 78, 221, 0.25))',
                      border: '1px solid rgba(255, 0, 85, 0.6)',
                      padding: '3px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      boxShadow: '0 0 15px rgba(255, 0, 85, 0.4)',
                    }}>
                      <Flame size={12} fill="#FF0055" color="#FF0055" />
                      <span>{rankStr} S-RANK</span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#00F0FF', fontWeight: 700 }}>
                      {book.category}
                    </div>
                  </div>

                  {/* Cover Image Showcase */}
                  <Link
                    to={`/books/${book.id}`}
                    style={{
                      display: 'block',
                      height: '180px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                      background: '#020408',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      zIndex: 2,
                    }}
                  >
                    <img
                      src={coverImage}
                      alt={book.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                      onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </Link>

                  {/* Title & Author */}
                  <div style={{ zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Link
                      to={`/books/${book.id}`}
                      style={{
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        marginBottom: '4px',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {book.title}
                    </Link>

                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                      by <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{book.author}</span>
                    </div>

                    {/* Price & Action */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#00F0FF', fontFamily: 'Space Grotesk, sans-serif' }}>
                        {book.mode === 'SELL' ? `₹${Number(book.price).toFixed(2)}` : book.mode === 'DONATE' ? 'FREE' : 'TRADE'}
                      </div>

                      <Link
                        to={`/books/${book.id}`}
                        className="btn btn-crimson btn-sm"
                        style={{ padding: '0.45rem 1.1rem', fontSize: '12px', gap: '5px' }}
                      >
                        <span>View Details</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
