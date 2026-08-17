import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star, ArrowRight, UserCheck, RefreshCw, Zap } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function BookCard3D({ book }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const isWishlisted = isInWishlist(book?.id);

  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  if (!book) return null;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showError('Please sign in to save books to your wishlist.');
      navigate('/login');
      return;
    }
    toggleWishlist(book.id);
  };

  // Solo Leveling Badge Mapping
  const renderModeBadge = () => {
    switch (book.mode) {
      case 'SELL':
        return <span className="badge badge-sell">FOR SALE</span>;
      case 'DONATE':
        return <span className="badge badge-donate">FREE</span>;
      case 'EXCHANGE':
        return <span className="badge badge-exchange">TRADE</span>;
      default:
        return <span className="badge badge-pill">{book.mode}</span>;
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
  const coverImage = (book.images && book.images.length > 0 && book.images[0]) ? book.images[0] : fallbackImage;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-container"
      style={{ height: '100%' }}
    >
      <div
        className="glass-card tilt-3d"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
        }}
      >
        {/* Dynamic Mana Glare Reflection (Electric Cyan & Crimson) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(0, 240, 255, ${glarePos.opacity}) 0%, rgba(255, 0, 85, ${glarePos.opacity * 0.5}) 35%, transparent 65%)`,
            transition: 'opacity 0.15s ease',
            zIndex: 3,
          }}
        />

        {/* Top Header: Mode Badge + Wishlist Heart */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', zIndex: 4 }}>
          {renderModeBadge()}
          <button
            onClick={handleWishlistClick}
            aria-label="Wishlist toggle"
            style={{
              background: isWishlisted ? 'rgba(255, 0, 85, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: isWishlisted ? '1.5px solid #FF0055' : '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isWishlisted ? '#FF0055' : '#FFFFFF',
              boxShadow: isWishlisted ? '0 0 15px rgba(255, 0, 85, 0.6)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Heart size={16} fill={isWishlisted ? '#FF0055' : 'none'} />
          </button>
        </div>

        {/* 3D Elevated Book Cover */}
        <Link
          to={`/books/${book.id}`}
          style={{
            textDecoration: 'none',
            display: 'block',
            position: 'relative',
            height: '210px',
            marginBottom: '1.25rem',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: '#040711',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            zIndex: 4,
          }}
        >
          <img
            src={coverImage}
            alt={book.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          {/* Condition Tag Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(2, 4, 8, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
            }}
          >
            {book.condition || 'Good'}
          </div>
        </Link>

        {/* Book Information */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 4 }}>
          {/* Discipline Tag in Electric Cyan */}
          <div style={{ fontSize: '11px', color: '#00F0FF', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
            {book.subject || book.category}
          </div>

          <Link
            to={`/books/${book.id}`}
            style={{
              color: '#FFFFFF',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '1.08rem',
              lineHeight: 1.3,
              marginBottom: '4px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {book.title}
          </Link>

          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            by <span style={{ color: '#E2E8F0', fontWeight: 600 }}>{book.author}</span>
          </div>

          {/* Seller & Campus Location */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            marginTop: 'auto',
            marginBottom: '1rem',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            <Link
              to={`/sellers/${book.owner_id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#FFFFFF',
                textDecoration: 'none',
                fontWeight: 700
              }}
            >
              <UserCheck size={14} color="#00F0FF" />
              <span>{book.owner_name || 'Scholar'}</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={12} fill="#FF0055" color="#FF0055" />
              <span style={{ color: '#FFFFFF', fontWeight: 800 }}>
                {book.owner_rating ? book.owner_rating.toFixed(1) : '5.0'}
              </span>
            </div>
          </div>

          {/* Price & Action Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              {book.mode === 'SELL' ? (
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FF2A6D', fontFamily: 'Space Grotesk, sans-serif' }}>
                  ₹{Number(book.price).toFixed(2)}
                </div>
              ) : book.mode === 'DONATE' ? (
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#00F0FF', fontFamily: 'Space Grotesk, sans-serif' }}>
                  FREE
                </div>
              ) : (
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#C084FC', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'Space Grotesk, sans-serif' }}>
                  <RefreshCw size={15} /> TRADE
                </div>
              )}
            </div>

            <Link
              to={`/books/${book.id}`}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.45rem 1.1rem', fontSize: '12px', gap: '5px', fontWeight: 800 }}
            >
              <span>View Details</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
