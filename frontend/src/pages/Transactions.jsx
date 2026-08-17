import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  BookOpen,
  Filter
} from 'lucide-react';
import { transactionsApi } from '../api/transactionsApi';
import { reviewsApi } from '../api/reviewsApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StatusBadge, ModeBadge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { StarRating } from '../components/StarRating';
import { LoadingSpinner } from '../components/Loading';

export const Transactions = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Review Modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await transactionsApi.getAllTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUpdateStatus = async (txId, newStatus) => {
    try {
      await transactionsApi.updateTransactionStatus(txId, newStatus);
      showSuccess(`Status changed to ${newStatus}`);
      fetchTransactions();
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to update status.');
    }
  };

  const handleOpenReview = (tx) => {
    setSelectedTx(tx);
    setRating(5);
    setComment('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      showError('Please enter a comment for the review.');
      return;
    }
    try {
      setSubmittingReview(true);
      await reviewsApi.createReview({
        transaction_id: selectedTx.id,
        book_id: selectedTx.book_id,
        reviewed_user_id: selectedTx.buyer_id === user.id ? selectedTx.seller_id : selectedTx.buyer_id,
        rating,
        comment: comment.trim(),
      });
      showSuccess('Review posted!');
      setShowReviewModal(false);
      fetchTransactions();
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filtered = transactions.filter((t) => {
    if (statusFilter === 'ALL') return true;
    return t.status === statusFilter;
  });

  if (loading) {
    return <LoadingSpinner text="Loading campus transactions..." />;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.88rem' }}>
            <ArrowUpDown size={18} />
            <span>TRANSACTION LEDGER</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', marginTop: '0.25rem' }}>
            All Transactions
          </h1>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', padding: '0.5rem 1rem' }}
          >
            <option value="ALL">All Transactions ({transactions.length})</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((tx) => {
            const isSeller = tx.seller_id === user.id;
            const otherPartyName = isSeller ? tx.buyer_name : tx.seller_name;
            const otherPartyRole = isSeller ? 'Buyer' : 'Owner/Seller';

            return (
              <div key={tx.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{otherPartyRole}: </span>
                    <strong style={{ color: 'var(--primary-navy)' }}>{otherPartyName}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', marginLeft: '0.75rem', fontWeight: 600 }}>
                      [Mode: {tx.type}]
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <StatusBadge status={tx.status} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      {new Date(tx.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Book info */}
                {tx.book && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                    <img
                      src={tx.book.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100'}
                      alt={tx.book.title}
                      style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                      <Link to={`/books/${tx.book.id}`} style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {tx.book.title}
                      </Link>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        by {tx.book.author} · Campus: {tx.book.location}
                      </div>
                    </div>
                  </div>
                )}

                {tx.message && (
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic', backgroundColor: '#f1f5f9', padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)' }}>
                    "{tx.message}"
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <Link to={`/messages?user=${isSeller ? tx.buyer_id : tx.seller_id}&book=${tx.book_id}`} className="btn btn-secondary btn-sm">
                    <MessageSquare size={14} /> Message Peer
                  </Link>

                  {/* If I am Seller & PENDING */}
                  {isSeller && tx.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleUpdateStatus(tx.id, 'REJECTED')} className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                        <XCircle size={14} /> Reject
                      </button>
                      <button onClick={() => handleUpdateStatus(tx.id, 'ACCEPTED')} className="btn btn-success btn-sm">
                        <CheckCircle2 size={14} /> Accept
                      </button>
                    </>
                  )}

                  {/* If I am Buyer & PENDING */}
                  {!isSeller && tx.status === 'PENDING' && (
                    <button onClick={() => handleUpdateStatus(tx.id, 'CANCELLED')} className="btn btn-outline btn-sm" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                      Cancel Request
                    </button>
                  )}

                  {/* If ACCEPTED */}
                  {tx.status === 'ACCEPTED' && isSeller && (
                    <button onClick={() => handleUpdateStatus(tx.id, 'COMPLETED')} className="btn btn-primary btn-sm">
                      <CheckCircle2 size={14} /> Complete Trade
                    </button>
                  )}

                  {/* If COMPLETED & not reviewed */}
                  {tx.status === 'COMPLETED' && !tx.has_reviewed && (
                    <button onClick={() => handleOpenReview(tx)} className="btn btn-primary btn-sm">
                      <Star size={14} /> Rate & Review Peer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No transactions found for filter "{statusFilter}".
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Review Transaction"
        footer={
          <>
            <button onClick={() => setShowReviewModal(false)} className="btn btn-secondary btn-sm">Cancel</button>
            <button onClick={handleSubmitReview} disabled={submittingReview} className="btn btn-primary btn-sm">
              {submittingReview ? 'Submitting...' : 'Submit Rating'}
            </button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Rating
            </label>
            <StarRating
              rating={rating}
              interactive={true}
              size={24}
              onRatingChange={(r) => setRating(r)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              Comment
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your feedback regarding the book condition and meetup..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
