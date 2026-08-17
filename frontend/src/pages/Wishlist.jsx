import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import BookCard3D from '../components/BookCard3D';

export default function Wishlist() {
  const { wishlist, loading, fetchWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  return (
    <div className="container" style={{ paddingTop: '5.5rem', paddingBottom: '6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-sell" style={{ marginBottom: '0.5rem' }}>
          <span>SAVED COLLECTIONS</span>
        </div>
        <h1 className="heading-section">
          Your <span className="gradient-text">Wishlist</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Keep track of upcoming semester books, price drops, and trade opportunities.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="animate-pulse-glow" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💖</div>
          <div style={{ color: '#EC4899', fontWeight: 600 }}>Loading saved books...</div>
        </div>
      ) : wishlist.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '540px',
            margin: '0 auto',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔖</div>
          <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Your Wishlist is Empty
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Explore the student textbook catalog and click the heart icon to save books for later.
          </p>
          <Link to="/browse" className="btn btn-primary btn-lg">
            <span>Explore Books</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '14px' }}>
            You have <strong style={{ color: '#FFFFFF' }}>{wishlist.length}</strong> books saved in your wishlist
          </div>

          <div className="grid-cards">
            {wishlist.map((item) => (
              <BookCard3D key={item.id || item.book_id} book={item.book || item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
