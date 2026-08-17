import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  UserCheck, Star, MapPin, BookOpen, MessageSquare, Shield,
  Award, CheckCircle2, ArrowLeft, Heart, RefreshCw
} from 'lucide-react';
import { authApi, booksApi, reviewsApi } from '../services/api';
import BookCard3D from '../components/BookCard3D';

export default function SellerProfile() {
  const { id } = useParams();

  const [seller, setSeller] = useState(null);
  const [sellerBooks, setSellerBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSeller() {
      try {
        setLoading(true);
        setError(null);

        const [profileData, allBooks, reviewList] = await Promise.all([
          authApi.getSellerProfile(id),
          booksApi.getBooks(),
          reviewsApi.getUserReviews(id),
        ]);

        setSeller(profileData);
        setSellerBooks(allBooks.filter((b) => b.owner_id === id));
        setReviews(reviewList);
      } catch (err) {
        console.error('Failed to load seller profile:', err);
        setError('Could not load student seller profile.');
      } finally {
        setLoading(false);
      }
    }
    loadSeller();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '7rem', textAlign: 'center' }}>
        <div className="animate-pulse-glow" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
        <div style={{ color: 'var(--cyan)', fontWeight: 600 }}>Loading seller reputation profile...</div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="container" style={{ paddingTop: '7rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '480px', margin: '0 auto' }}>
          <h3 style={{ color: '#EF4444', marginBottom: '1rem' }}>Profile Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/browse" className="btn btn-primary">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '5.5rem', paddingBottom: '6rem' }}>
      <Link
        to="/browse"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          marginBottom: '2rem',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Marketplace</span>
      </Link>

      {/* Seller Header Banner */}
      <div
        className="glass-panel-glow"
        style={{
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '3rem',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '2.5rem',
          alignItems: 'center',
        }}
      >
        {/* Avatar */}
        <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #00F0FF, #3B82F6)', padding: '3px' }}>
          <img
            src={seller.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt={seller.name}
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>

        {/* Identity & Campus Meta */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '2rem', color: '#FFFFFF' }}>{seller.name}</h1>
            <UserCheck size={22} color="#00F0FF" />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={15} color="var(--cyan)" />
              <span>{seller.college || 'Verified Campus Scholar'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={15} color="var(--cyan)" />
              <span>{seller.location || 'Main Campus'}</span>
            </div>
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={16} fill="#F59E0B" color="#F59E0B" />
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
              {seller.rating ? seller.rating.toFixed(1) : '5.0'}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              ({seller.review_count || reviews.length} student reviews)
            </span>
          </div>
        </div>

        {/* Action button */}
        <div>
          <Link
            to={`/messages?userId=${seller.id}`}
            className="btn btn-primary btn-lg"
            style={{ gap: '8px' }}
          >
            <MessageSquare size={18} />
            <span>Message Student</span>
          </Link>
        </div>
      </div>

      {/* Seller Stats Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3.5rem',
        }}
      >
        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Listings</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00F0FF', marginTop: '4px' }}>{sellerBooks.length}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Trades Completed</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>{seller.books_sold_count || 4}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Reputation Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#A855F7', marginTop: '4px' }}>99.2%</div>
        </div>
      </div>

      {/* Active Listings Grid */}
      <div style={{ marginBottom: '4rem' }}>
        <h2 className="heading-section" style={{ marginBottom: '1.5rem' }}>
          Books Listed by <span className="gradient-text">{seller.name.split(' ')[0]}</span>
        </h2>

        {sellerBooks.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>This student has no active book listings right now.</p>
          </div>
        ) : (
          <div className="grid-cards">
            {sellerBooks.map((book) => (
              <BookCard3D key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>

      {/* Verified Peer Reviews */}
      <div>
        <h2 className="heading-section" style={{ marginBottom: '1.5rem' }}>
          Peer Ratings & <span className="gradient-text-purple">Reviews</span>
        </h2>

        {reviews.length === 0 ? (
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No written reviews posted yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {reviews.map((rev, i) => (
              <div key={rev.id || i} className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '0.75rem' }}>
                  {[...Array(rev.rating || 5)].map((_, starI) => (
                    <Star key={starI} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>

                <p style={{ color: '#F8FAFC', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem', fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  Reviewed by student • {new Date(rev.created_at || Date.now()).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
