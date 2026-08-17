import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Disc as Discord, Instagram, Heart, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ position: 'relative', marginTop: 'auto', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      {/* Top Subtle Glowing Divider Line */}
      <div style={{
        width: '100%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(0, 240, 255, 0.4) 30%, rgba(168, 85, 247, 0.4) 70%, transparent 100%)',
        boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)',
      }} />

      <div className="container" style={{ paddingTop: '4.5rem', paddingBottom: '3rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '3.5rem',
        }}>
          {/* Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00F0FF, #3B82F6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#050811',
                  boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
                }}
              >
                <BookOpen size={18} strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.35rem', color: '#FFFFFF' }}>
                Book<span style={{ color: '#00F0FF' }}>Cycle</span>
              </span>
            </Link>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              The 3D student textbook marketplace. Buy, sell, donate, and exchange used academic books with peers across campuses.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(0, 240, 255, 0.08)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#00F0FF',
              letterSpacing: '0.05em'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
              <span>MARKETPLACE NODES OPERATIONAL</span>
            </div>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>Marketplace</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/browse" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s ease' }}>
                  Browse All Books
                </Link>
              </li>
              <li>
                <Link to="/sell" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s ease' }}>
                  Sell Textbooks
                </Link>
              </li>
              <li>
                <Link to="/exchange" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s ease' }}>
                  Book-for-Book Exchange
                </Link>
              </li>
              <li>
                <Link to="/browse?mode=DONATE" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s ease' }}>
                  Free Book Donations
                </Link>
              </li>
              <li>
                <Link to="/wishlist" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s ease' }}>
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Campus Categories */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>Popular Disciplines</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/browse?category=Computer+Science" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Computer Science & Coding
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Engineering" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Engineering & Robotics
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Mathematics" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Mathematics & Statistics
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Medical" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Medicine & Biology
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Business" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                  Business & Economics
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Mission */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '1.25rem' }}>Community</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Join student discussions, textbook drives, and campus coordinator initiatives.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}>
                <Github size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}>
                <Twitter size={16} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}>
                <Discord size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}>
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Campus Credit */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '13px',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} BookCycle. Tagline: <em>Read. Exchange. Repeat.</em>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Built with</span>
            <Heart size={13} fill="#EC4899" color="#EC4899" />
            <span>for students worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
