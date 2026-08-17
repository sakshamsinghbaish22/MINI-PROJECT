import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, MessageSquare, Shield, Star, MapPin, UserCheck, RefreshCw,
  AlertTriangle, ArrowLeft, Share2, CheckCircle2, BookOpen, Clock, Tag
} from 'lucide-react';
import { booksApi, transactionsApi, messagesApi, reportsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showSuccess, showError } = useToast();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Modals
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  // Exchange Offer selector state
  const [myBooksForExchange, setMyBooksForExchange] = useState([]);
  const [selectedOfferBookId, setSelectedOfferBookId] = useState('');
  const [customOfferTitle, setCustomOfferTitle] = useState('');

  // Direct Message Modal
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [directMessageText, setDirectMessageText] = useState('');
  const [sendingDirectMessage, setSendingDirectMessage] = useState(false);

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate content');
  const [reportDescription, setReportDescription] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);

  useEffect(() => {
    async function loadBook() {
      try {
        setLoading(true);
        setError(null);
        const data = await booksApi.getBookById(id);
        setBook(data);
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Could not find or load this book details.');
      } finally {
        setLoading(false);
      }
    }
    loadBook();
  }, [id]);

  const isOwner = user && book && user.id === book.owner_id;
  const isWishlisted = book ? isInWishlist(book.id) : false;

  const handleOpenRequestModal = async () => {
    if (!user) {
      showError('Please log in to contact or request books.');
      navigate('/login');
      return;
    }

    if (book.mode === 'EXCHANGE') {
      try {
        const userBooks = await booksApi.getMyListings();
        const available = userBooks.filter((b) => b.status === 'AVAILABLE');
        setMyBooksForExchange(available);
        if (available.length > 0) {
          setSelectedOfferBookId(available[0].id);
        }
      } catch (e) {
        console.error('Could not fetch user books for exchange:', e);
      }
    }

    setRequestMessage(
      book.mode === 'SELL'
        ? `Hi ${book.owner_name}, I'd like to buy your copy of "${book.title}". Are you available to meet on campus?`
        : book.mode === 'DONATE'
        ? `Hi ${book.owner_name}, I am requesting this donated copy of "${book.title}" for my courses. Thank you!`
        : `Hi ${book.owner_name}, I would like to exchange textbooks for "${book.title}". Let's coordinate meetup details!`
    );
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async () => {
    try {
      setSubmittingRequest(true);
      let finalMessage = requestMessage;

      if (book.mode === 'EXCHANGE') {
        const offeredBook = myBooksForExchange.find((b) => b.id === selectedOfferBookId);
        const offeredName = offeredBook ? offeredBook.title : customOfferTitle.trim() || 'Textbook trade';
        finalMessage = `[Exchange Offer: "${offeredName}"] ${requestMessage}`;
      }

      await transactionsApi.createTransaction({
        book_id: book.id,
        type: book.mode === 'SELL' ? 'BUY' : book.mode,
        message: finalMessage,
      });

      showSuccess(`Request sent to ${book.owner_name}!`);
      setShowRequestModal(false);
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to submit request.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  const handleSendDirectMessage = async () => {
    if (!directMessageText.trim()) return;
    try {
      setSendingDirectMessage(true);
      await messagesApi.sendMessage({
        receiver_id: book.owner_id,
        book_id: book.id,
        message: directMessageText.trim(),
      });
      showSuccess('Message sent to seller inbox!');
      setShowMessageModal(false);
      navigate('/messages');
    } catch (err) {
      showError('Failed to send message.');
    } finally {
      setSendingDirectMessage(false);
    }
  };

  const handleSubmitReport = async () => {
    try {
      setSubmittingReport(true);
      await reportsApi.createReport({
        reported_book_id: book.id,
        reported_user_id: book.owner_id,
        reason: reportReason,
        description: reportDescription.trim() || 'User submitted report',
      });
      showSuccess('Safety report submitted to campus moderators.');
      setShowReportModal(false);
      setReportDescription('');
    } catch (err) {
      showError('Failed to submit report.');
    } finally {
      setSubmittingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '7rem', textAlign: 'center' }}>
        <div className="animate-pulse-glow" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</div>
        <div style={{ color: 'var(--cyan)', fontWeight: 600 }}>Loading 3D book details...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container" style={{ paddingTop: '7rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <h3 style={{ color: '#EF4444', marginBottom: '1rem' }}>Listing Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{error || 'This book is no longer available.'}</p>
          <Link to="/browse" className="btn btn-primary">Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const fallbackImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
  const images = book.images && book.images.length > 0 ? book.images : [fallbackImage];

  return (
    <div className="container" style={{ paddingTop: '5.5rem', paddingBottom: '6rem' }}>
      {/* Back to Browse */}
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

      {/* Main 2-Column Showcase */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 460px) 1fr',
        gap: '3.5rem',
        alignItems: 'start',
      }}>
        {/* Left: 3D Perspective Book Showcase */}
        <div>
          <div
            className="perspective-container"
            style={{
              position: 'sticky',
              top: '90px',
            }}
          >
            {/* 3D Tilted Card Surface */}
            <div
              className="glass-panel-glow"
              style={{
                padding: '2rem',
                borderRadius: 'var(--radius-xl)',
                background: 'rgba(11, 17, 33, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Main Cover Image */}
              <div
                style={{
                  width: '100%',
                  maxHeight: '460px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 240, 255, 0.2)',
                  border: '1px solid rgba(0, 240, 255, 0.3)',
                  marginBottom: '1.25rem',
                  background: '#0B0F19',
                }}
              >
                <img
                  src={images[activeImageIdx]}
                  alt={book.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Thumbnails list if multiple */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', width: '100%', overflowX: 'auto', paddingBottom: '4px' }}>
                  {images.map((imgUrl, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      style={{
                        width: '56px',
                        height: '70px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: activeImageIdx === i ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                        padding: 0,
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Safety Tips Banner */}
              <div style={{
                marginTop: '1.5rem',
                width: '100%',
                background: 'rgba(5, 8, 17, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
              }}>
                <Shield size={20} color="#00F0FF" />
                <span>Meet safely at public campus locations like libraries or cafeterias for textbook handoffs.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Book Details & Actions */}
        <div>
          {/* Top Mode Badge & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {book.mode === 'SELL' ? (
                <span className="badge badge-sell">FOR SALE</span>
              ) : book.mode === 'DONATE' ? (
                <span className="badge badge-donate">FREE DONATION</span>
              ) : (
                <span className="badge badge-exchange">BOOK EXCHANGE</span>
              )}
              <span className="badge badge-pill">{book.category}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  if (!user) {
                    showError('Please sign in to save books.');
                    navigate('/login');
                    return;
                  }
                  toggleWishlist(book.id);
                }}
                className="btn btn-secondary btn-sm"
                style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%' }}
                title="Wishlist"
              >
                <Heart size={16} fill={isWishlisted ? '#EC4899' : 'none'} color={isWishlisted ? '#EC4899' : 'currentColor'} />
              </button>

              <button
                onClick={() => setShowReportModal(true)}
                className="btn btn-secondary btn-sm"
                style={{ width: '38px', height: '38px', padding: 0, borderRadius: '50%', color: '#EF4444' }}
                title="Report listing"
              >
                <AlertTriangle size={16} />
              </button>
            </div>
          </div>

          {/* Title & Author */}
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', lineHeight: 1.15, marginBottom: '0.5rem', color: '#FFFFFF' }}>
            {book.title}
          </h1>
          <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            by <strong style={{ color: '#F8FAFC' }}>{book.author}</strong>
          </div>

          {/* Pricing Highlight Box */}
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem 2rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              marginBottom: '2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                {book.mode === 'SELL' ? 'Listing Price' : book.mode === 'DONATE' ? 'Donation Cost' : 'Exchange Mode'}
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00F0FF', fontFamily: 'Space Grotesk, sans-serif' }}>
                {book.mode === 'SELL' ? `₹${Number(book.price).toFixed(2)}` : book.mode === 'DONATE' ? 'FREE (₹0.00)' : 'Book Trade'}
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwner ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleOpenRequestModal}
                  className="btn btn-primary btn-lg"
                >
                  {book.mode === 'SELL' ? 'Request to Buy' : book.mode === 'DONATE' ? 'Request Book' : 'Propose Exchange'}
                </button>
                <button
                  onClick={() => {
                    if (!user) {
                      showError('Please sign in to message sellers.');
                      navigate('/login');
                      return;
                    }
                    setShowMessageModal(true);
                  }}
                  className="btn btn-secondary btn-lg"
                >
                  <MessageSquare size={18} color="#3B82F6" />
                  <span>Chat</span>
                </button>
              </div>
            ) : (
              <Link to="/dashboard" className="btn btn-secondary">
                Manage in Dashboard
              </Link>
            )}
          </div>

          {/* Exchange Preference Alert (if Exchange) */}
          {book.mode === 'EXCHANGE' && book.exchange_preference && (
            <div
              style={{
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C084FC', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                <RefreshCw size={15} />
                <span>SELLER'S DESIRED EXCHANGE TEXTBOOK:</span>
              </div>
              <div style={{ color: '#FFFFFF', fontSize: '0.95rem' }}>
                {book.exchange_preference}
              </div>
            </div>
          )}

          {/* Spec Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Condition</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>{book.condition || 'Good'}</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Course Code</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#00F0FF', marginTop: '2px' }}>{book.course || 'General'}</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Edition</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>{book.edition || '1st Edition'}</div>
            </div>
            <div className="glass-card" style={{ padding: '1rem' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Campus Location</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>{book.location || 'Campus'}</div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#FFFFFF' }}>Book Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              {book.description}
            </p>
          </div>

          {/* Seller Information Card */}
          <div
            className="glass-panel"
            style={{
              padding: '1.75rem',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #00F0FF, #3B82F6)', padding: '2px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                    alt={book.owner_name}
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ fontSize: '1.15rem', color: '#FFFFFF' }}>{book.owner_name || 'Student Seller'}</h4>
                    <UserCheck size={16} color="#00F0FF" />
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{book.owner_college || 'University Campus'}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>
                      {book.owner_rating ? book.owner_rating.toFixed(1) : '5.0'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({book.owner_review_count || 12} reviews)</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/sellers/${book.owner_id}`}
                className="btn btn-outline btn-sm"
              >
                <span>View Seller Profile</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* REQUEST TRANSACTION MODAL */}
      {showRequestModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '2rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(0, 240, 255, 0.35)' }}>
            <h3 style={{ fontSize: '1.35rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              {book.mode === 'SELL' ? 'Request to Buy' : book.mode === 'DONATE' ? 'Request Donated Copy' : 'Propose Textbook Exchange'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Send a request to <strong>{book.owner_name}</strong> to coordinate meetup details.
            </p>

            {book.mode === 'EXCHANGE' && (
              <div className="form-group">
                <label className="form-label">Which book will you offer in exchange?</label>
                {myBooksForExchange.length > 0 ? (
                  <select
                    value={selectedOfferBookId}
                    onChange={(e) => setSelectedOfferBookId(e.target.value)}
                    className="form-select"
                  >
                    {myBooksForExchange.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.condition})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={customOfferTitle}
                    onChange={(e) => setCustomOfferTitle(e.target.value)}
                    placeholder="Enter book title you want to offer in trade..."
                    className="form-input"
                  />
                )}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Message to Seller</label>
              <textarea
                rows={4}
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="form-textarea"
                placeholder="Include preferred meetup times or campus locations..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={submittingRequest}
                className="btn btn-primary btn-sm"
              >
                {submittingRequest ? 'Submitting...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT CHAT MODAL */}
      {showMessageModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', marginBottom: '0.5rem' }}>
              Message {book.owner_name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Regarding: <em>"{book.title}"</em>
            </p>

            <textarea
              rows={4}
              value={directMessageText}
              onChange={(e) => setDirectMessageText(e.target.value)}
              className="form-textarea"
              placeholder="Type your message to the seller..."
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.25rem' }}>
              <button onClick={() => setShowMessageModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button
                onClick={handleSendDirectMessage}
                disabled={sendingDirectMessage}
                className="btn btn-primary btn-sm"
              >
                {sendingDirectMessage ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showReportModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#EF4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={20} />
              <span>Report Listing</span>
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Help keep BookCycle safe. Flag fraudulent listings, wrong editions, or offensive content.
            </p>

            <div className="form-group">
              <label className="form-label">Reason</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="form-select"
              >
                <option value="Inappropriate content">Inappropriate content</option>
                <option value="Spam or scam">Spam or scam</option>
                <option value="Wrong information">Wrong edition or information</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Details</label>
              <textarea
                rows={3}
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                className="form-textarea"
                placeholder="Provide additional context for campus admins..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.25rem' }}>
              <button onClick={() => setShowReportModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={submittingReport}
                className="btn btn-primary btn-sm"
                style={{ background: '#EF4444' }}
              >
                {submittingReport ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
