import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Heart, MessageSquare, PlusCircle, User, LogOut, Shield, Menu, X, Layers, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navItemClass = ({ isActive }) =>
    `nav-link ${isActive ? 'nav-link-active' : ''}`;

  return (
    <header
      style={{
        position: 'sticky',
        top: '16px',
        zIndex: 100,
        width: '100%',
        padding: '0 1.5rem',
        marginBottom: '-16px',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1280px',
          padding: 0,
        }}
      >
        <nav
          style={{
            background: isScrolled ? 'rgba(8, 12, 24, 0.88)' : 'rgba(11, 17, 33, 0.72)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isScrolled ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: isScrolled
              ? '0 12px 35px rgba(0, 0, 0, 0.5), 0 0 25px rgba(0, 240, 255, 0.15)'
              : '0 8px 24px rgba(0, 0, 0, 0.35)',
            borderRadius: 'var(--radius-full)',
            padding: '0.65rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
              color: '#FFFFFF',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00F0FF 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
                color: '#050811',
              }}
            >
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '-0.03em',
                  color: '#FFFFFF',
                }}
              >
                Book<span style={{ color: '#00F0FF' }}>Cycle</span>
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <div
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
            }}
          >
            <NavLink
              to="/"
              className={navItemClass}
              style={({ isActive }) => ({
                color: isActive ? '#00F0FF' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'color 0.2s ease',
              })}
            >
              Home
            </NavLink>

            <NavLink
              to="/browse"
              style={({ isActive }) => ({
                color: isActive ? '#00F0FF' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'color 0.2s ease',
              })}
            >
              Browse
            </NavLink>

            <NavLink
              to="/sell"
              style={({ isActive }) => ({
                color: isActive ? '#00F0FF' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'color 0.2s ease',
              })}
            >
              Sell Book
            </NavLink>

            <NavLink
              to="/exchange"
              style={({ isActive }) => ({
                color: isActive ? '#00F0FF' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              })}
            >
              <RefreshCw size={14} color="#C084FC" />
              <span>Exchange</span>
            </NavLink>

            <a
              href="/#how-it-works"
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'color 0.2s ease',
              }}
            >
              How It Works
            </a>
          </div>

          {/* Right Action Icons & Auth Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Quick Search Trigger */}
            <Link
              to="/browse"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              title="Search marketplace"
            >
              <Search size={17} />
            </Link>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-subtle)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              title="Your Wishlist"
            >
              <Heart size={17} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    background: '#EC4899',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 8px #EC4899',
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth State */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(0, 240, 255, 0.3)',
                    padding: '4px 12px 4px 4px',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    color: '#FFFFFF',
                  }}
                >
                  <img
                    src={user.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 600, maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="glass-panel"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: 0,
                      width: '210px',
                      padding: '0.5rem',
                      background: 'rgba(8, 12, 24, 0.95)',
                      border: '1px solid rgba(0, 240, 255, 0.25)',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
                      borderRadius: 'var(--radius-md)',
                      zIndex: 200,
                    }}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{user.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--cyan)' }}>{user.college || 'Campus Member'}</div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '13px',
                        borderRadius: '6px',
                      }}
                    >
                      <Layers size={15} color="#00F0FF" />
                      <span>Student Dashboard</span>
                    </Link>

                    <Link
                      to="/messages"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '13px',
                        borderRadius: '6px',
                      }}
                    >
                      <MessageSquare size={15} color="#3B82F6" />
                      <span>Messages</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        fontSize: '13px',
                        borderRadius: '6px',
                      }}
                    >
                      <User size={15} color="#A855F7" />
                      <span>My Profile</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          color: '#F59E0B',
                          textDecoration: 'none',
                          fontSize: '13px',
                          borderRadius: '6px',
                        }}
                      >
                        <Shield size={15} />
                        <span>Campus Admin</span>
                      </Link>
                    )}

                    <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        color: '#EF4444',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '13px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  to="/login"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.45rem 1rem', fontSize: '13px' }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                  style={{ padding: '0.45rem 1.1rem', fontSize: '13px' }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'none',
              }}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="glass-panel"
            style={{
              marginTop: '10px',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(8, 12, 24, 0.96)',
              border: '1px solid rgba(0, 240, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}
            >
              Home
            </Link>
            <Link
              to="/browse"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}
            >
              Browse Books
            </Link>
            <Link
              to="/sell"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}
            >
              Sell a Book
            </Link>
            <Link
              to="/exchange"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#C084FC', textDecoration: 'none', fontWeight: 600 }}
            >
              Exchange Books
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}
            >
              How It Works
            </a>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 840px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
}
