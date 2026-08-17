import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Sparkles } from 'lucide-react';
import { ModeBadge, ConditionBadge, StatusBadge } from './Badge';
import { StarRating } from './StarRating';
import { useWishlist } from '../context/WishlistContext';

export const BookCard = ({ book }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(book.id);

  const fallbackImg = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80";
  const imageSrc = book.images && book.images.length > 0 ? book.images[0] : fallbackImg;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(book.id, book.title);
  };

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {/* Wishlist Button Overlay */}
      <button
        onClick={handleWishlistClick}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(4px)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          color: wishlisted ? '#ef4444' : '#64748b',
          transition: 'transform 0.15s ease, color 0.15s ease'
        }}
      >
        <Heart size={18} fill={wishlisted ? '#ef4444' : 'none'} strokeWidth={2} />
      </button>

      {/* Book Cover Image */}
      <Link to={`/books/${book.id}`} style={{ position: 'relative', height: '190px', overflow: 'hidden', backgroundColor: '#f1f5f9', display: 'block' }}>
        <img
          src={imageSrc}
          alt={book.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          loading="lazy"
        />
        {/* Status Overlay if not AVAILABLE */}
        {book.status !== 'AVAILABLE' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <StatusBadge status={book.status} />
          </div>
        )}
      </Link>

      {/* Card Content */}
      <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.65rem' }}>
        {/* Mode & Condition badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
          <ModeBadge mode={book.mode} price={book.price} />
          <ConditionBadge condition={book.condition} />
        </div>

        {/* Title */}
        <Link to={`/books/${book.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7em'
          }}>
            {book.title}
          </h3>
        </Link>

        {/* Author */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          by {book.author}
        </p>

        {/* Subject / Course Tag */}
        <div style={{
          fontSize: '0.78rem',
          color: 'var(--primary-blue)',
          backgroundColor: 'var(--primary-blue-light)',
          padding: '0.2rem 0.6rem',
          borderRadius: 'var(--radius-sm)',
          alignSelf: 'flex-start',
          fontWeight: 600
        }}>
          {book.category || book.subject}
        </div>

        {/* Footer Area: Owner & Rating & Location */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link
              to={book.owner_id ? `/sellers/${book.owner_id}` : '#'}
              style={{
                color: 'var(--primary-navy)',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '140px',
                textDecoration: 'none'
              }}
              title={`View ${book.owner_name}'s profile`}
            >
              👤 {book.owner_name}
            </Link>
            <StarRating rating={book.owner_rating || 5.0} size={13} />
          </div>


          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)' }}>
            <MapPin size={13} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {book.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
