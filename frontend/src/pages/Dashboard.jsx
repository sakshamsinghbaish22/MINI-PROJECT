import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers, BookOpen, PlusCircle, MessageSquare, Heart, RefreshCw,
  Star, User, Settings, CheckCircle2, XCircle, Clock, Trash2,
  TrendingUp, Shield, ArrowRight, DollarSign, Award
} from 'lucide-react';
import { booksApi, transactionsApi, reviewsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Data states
  const [myBooks, setMyBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [booksData, txData] = await Promise.all([
          booksApi.getMyListings(),
          transactionsApi.getTransactions(),
        ]);
        setMyBooks(booksData);
        setTransactions(txData);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleUpdateStatus = async (txId, newStatus) => {
    try {
      await transactionsApi.updateStatus(txId, newStatus);
      showSuccess(`Trade status updated to ${newStatus}!`);
      // Refresh transactions & books
      const [booksData, txData] = await Promise.all([
        booksApi.getMyListings(),
        transactionsApi.getTransactions(),
      ]);
      setMyBooks(booksData);
      setTransactions(txData);
    } catch (err) {
      showError('Failed to update status.');
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to remove this book listing?')) return;
    try {
      await booksApi.deleteBook(bookId);
      showSuccess('Book listing removed.');
      setMyBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      showError('Failed to delete listing.');
    }
  };

  const handleOpenReview = (tx) => {
    setSelectedTx(tx);
    setReviewRating(5);
    setReviewComment('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedTx) return;
    const reviewedUserId = selectedTx.buyer_id === user.id ? selectedTx.seller_id : selectedTx.buyer_id;

    try {
      setSubmittingReview(true);
      await reviewsApi.createReview({
        transaction_id: selectedTx.id,
        reviewed_user_id: reviewedUserId,
        rating: reviewRating,
        comment: reviewComment.trim() || 'Great trade experience on BookCycle!',
      });
      showSuccess('Review submitted to seller reputation profile!');
      setShowReviewModal(false);
      // Refresh
      const txData = await transactionsApi.getTransactions();
      setTransactions(txData);
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Stats calculation
  const booksListed = myBooks.length;
  const booksSold = myBooks.filter((b) => b.status === 'SOLD' || b.status === 'EXCHANGED').length;
  const booksDonated = myBooks.filter((b) => b.mode === 'DONATE' && b.status === 'DONATED').length;
  const incomingRequests = transactions.filter((t) => t.seller_id === user?.id && t.status === 'PENDING');
  const outgoingRequests = transactions.filter((t) => t.buyer_id === user?.id);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-exchange">PENDING</span>;
      case 'ACCEPTED':
        return <span className="badge badge-sell">ACCEPTED</span>;
      case 'COMPLETED':
        return <span className="badge badge-donate">COMPLETED</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="badge badge-pill" style={{ color: '#EF4444' }}>{status}</span>;
      default:
        return <span className="badge badge-pill">{status}</span>;
    }
  };

  return (
    <div className="container" style={{ paddingTop: '5.5rem', paddingBottom: '6rem' }}>
      {/* Welcome Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        marginBottom: '2.5rem',
      }}>
        <div>
          <div className="badge badge-sell" style={{ marginBottom: '0.5rem' }}>
            <span>STUDENT COCKPIT</span>
          </div>
          <h1 className="heading-section">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Scholar'}</span> 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {user?.college || 'University Member'} • Manage your listings, trade requests, and messaging.
          </p>
        </div>

        <Link to="/sell" className="btn btn-primary">
          <PlusCircle size={17} />
          <span>List Another Book</span>
        </Link>
      </div>

      {/* Main Layout: Sidebar Navigation + Tab Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '2.5rem',
        alignItems: 'start',
      }}>
        {/* Sidebar Controls */}
        <aside
          className="glass-panel"
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: activeTab === 'overview' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                border: activeTab === 'overview' ? '1px solid rgba(0, 240, 255, 0.35)' : 'none',
                color: activeTab === 'overview' ? '#00F0FF' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Layers size={17} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('books')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: activeTab === 'books' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                border: activeTab === 'books' ? '1px solid rgba(0, 240, 255, 0.35)' : 'none',
                color: activeTab === 'books' ? '#00F0FF' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={17} />
                <span>My Books</span>
              </div>
              <span className="badge badge-pill">{myBooks.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('incoming')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: activeTab === 'incoming' ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                border: activeTab === 'incoming' ? '1px solid rgba(0, 240, 255, 0.35)' : 'none',
                color: activeTab === 'incoming' ? '#00F0FF' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RefreshCw size={17} />
                <span>Trade Requests</span>
              </div>
              {incomingRequests.length > 0 && (
                <span style={{ background: '#EC4899', color: '#FFFFFF', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {incomingRequests.length}
                </span>
              )}
            </button>

            <Link
              to="/messages"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              <MessageSquare size={17} color="#3B82F6" />
              <span>Messages</span>
            </Link>

            <Link
              to="/wishlist"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              <Heart size={17} color="#EC4899" />
              <span>Wishlist</span>
            </Link>

            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              <User size={17} color="#A855F7" />
              <span>My Profile</span>
            </Link>
          </div>
        </aside>

        {/* Tab Content Panel */}
        <div>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats Counters Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                }}
              >
                <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Books Listed</div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#00F0FF', marginTop: '4px' }}>{booksListed}</div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Books Sold / Traded</div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#3B82F6', marginTop: '4px' }}>{booksSold}</div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Free Donated</div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#A855F7', marginTop: '4px' }}>{booksDonated}</div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pending Requests</div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#EC4899', marginTop: '4px' }}>{incomingRequests.length}</div>
                </div>
              </div>

              {/* Pending Action Alerts */}
              {incomingRequests.length > 0 && (
                <div
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(236, 72, 153, 0.35)',
                    marginBottom: '2rem',
                  }}
                >
                  <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color="#EC4899" />
                    <span>Incoming Requests Awaiting Your Response ({incomingRequests.length})</span>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {incomingRequests.map((req) => (
                      <div
                        key={req.id}
                        style={{
                          background: 'rgba(5, 8, 17, 0.7)',
                          padding: '1rem',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{req.book?.title || 'Textbook'}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            From: <strong style={{ color: '#00F0FF' }}>{req.buyer_name}</strong> • Message: "{req.message}"
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.4rem 0.9rem', fontSize: '12px' }}
                          >
                            Accept Trade
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.4rem 0.9rem', fontSize: '12px', color: '#EF4444' }}
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Trade History */}
              <div className="glass-panel" style={{ padding: '1.75rem', borderRadius: 'var(--radius-xl)' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1.25rem' }}>Recent Trade History</h3>
                {transactions.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No past trade records found.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {transactions.slice(0, 5).map((tx) => {
                      const isBuyer = tx.buyer_id === user?.id;
                      const partnerName = isBuyer ? tx.seller_name : tx.buyer_name;

                      return (
                        <div
                          key={tx.id}
                          style={{
                            background: 'rgba(5, 8, 17, 0.6)',
                            border: '1px solid var(--border-subtle)',
                            padding: '1rem 1.25rem',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1rem',
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{tx.book?.title || 'Textbook Trade'}</span>
                              {getStatusBadge(tx.status)}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {isBuyer ? 'Seller' : 'Buyer'}: <strong>{partnerName}</strong> • {new Date(tx.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {tx.status === 'ACCEPTED' && !isBuyer && (
                              <button
                                onClick={() => handleUpdateStatus(tx.id, 'COMPLETED')}
                                className="btn btn-primary btn-sm"
                                style={{ padding: '0.4rem 0.9rem', fontSize: '12px' }}
                              >
                                Mark Completed
                              </button>
                            )}

                            {tx.status === 'COMPLETED' && !tx.has_reviewed && (
                              <button
                                onClick={() => handleOpenReview(tx)}
                                className="btn btn-purple btn-sm"
                                style={{ padding: '0.4rem 0.9rem', fontSize: '12px', gap: '4px' }}
                              >
                                <Star size={13} />
                                <span>Review Partner</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY BOOKS */}
          {activeTab === 'books' && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>My Active & Past Listings</h3>
                <Link to="/sell" className="btn btn-primary btn-sm">
                  <PlusCircle size={15} />
                  <span>List New Book</span>
                </Link>
              </div>

              {myBooks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You haven't listed any textbooks yet.</p>
                  <Link to="/sell" className="btn btn-primary">List Your First Book</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {myBooks.map((book) => (
                    <div
                      key={book.id}
                      style={{
                        background: 'rgba(5, 8, 17, 0.65)',
                        border: '1px solid var(--border-subtle)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'grid',
                        gridTemplateColumns: '60px 1fr auto',
                        gap: '1.25rem',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src={book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80'}
                        alt={book.title}
                        style={{ width: '60px', height: '75px', borderRadius: '6px', objectFit: 'cover' }}
                      />

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <span className="badge badge-pill">{book.mode}</span>
                          <span className="badge" style={{ background: book.status === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: book.status === 'AVAILABLE' ? '#10B981' : '#EF4444' }}>
                            {book.status}
                          </span>
                        </div>
                        <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', marginBottom: '2px' }}>{book.title}</h4>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {book.category} • ₹{Number(book.price).toFixed(2)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/books/${book.id}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.35)',
                            color: '#EF4444',
                            padding: '0.45rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                          }}
                          title="Delete listing"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: INCOMING REQUESTS */}
          {activeTab === 'incoming' && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '1.5rem' }}>Incoming Trade & Purchase Requests</h3>
              {incomingRequests.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No pending incoming requests at the moment.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {incomingRequests.map((req) => (
                    <div
                      key={req.id}
                      style={{
                        background: 'rgba(5, 8, 17, 0.7)',
                        border: '1px solid var(--border-subtle)',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF' }}>{req.book?.title}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Requester: <strong style={{ color: '#00F0FF' }}>{req.buyer_name}</strong> ({req.buyer_college || 'Campus'})
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Note: "{req.message}"
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                          className="btn btn-primary btn-sm"
                        >
                          Accept Trade
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                          className="btn btn-secondary btn-sm"
                          style={{ color: '#EF4444' }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* REVIEW SUBMISSION MODAL */}
      {showReviewModal && selectedTx && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Leave Peer Rating & Review
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              How was your textbook exchange for <strong>"{selectedTx.book?.title}"</strong>?
            </p>

            <div className="form-group">
              <label className="form-label">Rating (1 to 5 Stars)</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '28px',
                      cursor: 'pointer',
                      color: star <= reviewRating ? '#F59E0B' : 'rgba(255,255,255,0.2)',
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Feedback</label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Mention communication, prompt meetup, and textbook condition..."
                className="form-textarea"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.25rem' }}>
              <button onClick={() => setShowReviewModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="btn btn-purple btn-sm"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .container > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
