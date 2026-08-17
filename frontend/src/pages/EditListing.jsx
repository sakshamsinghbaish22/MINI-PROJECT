import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, ChevronLeft } from 'lucide-react';
import { booksApi } from '../api/booksApi';
import { BookForm } from '../components/BookForm';
import { LoadingSpinner } from '../components/Loading';
import { ErrorMessage } from '../components/ErrorMessage';
import { useToast } from '../context/ToastContext';

export const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await booksApi.getBookById(id);
      setBook(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load book listing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      const updated = await booksApi.updateBook(id, formData);
      showSuccess(`"${updated.title}" updated successfully!`);
      navigate(`/books/${updated.id}`);
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to update book listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading listing to edit..." />;
  }

  if (error || !book) {
    return <ErrorMessage message={error || 'Book not found.'} onRetry={fetchBook} />;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <Link to={`/books/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        <ChevronLeft size={16} /> Back to Book Details
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.88rem' }}>
          <Edit size={18} />
          <span>UPDATE DETAILS</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
          Edit Book Listing
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Make changes to your book's pricing, condition notes, or exchange preferences.
        </p>
      </div>

      <BookForm
        initialData={book}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        loading={submitting}
      />
    </div>
  );
};
