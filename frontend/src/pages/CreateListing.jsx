import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookPlus, ChevronLeft } from 'lucide-react';
import { booksApi } from '../api/booksApi';
import { BookForm } from '../components/BookForm';
import { useToast } from '../context/ToastContext';

export const CreateListing = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const newBook = await booksApi.createBook(formData);
      showSuccess(`"${newBook.title}" listed successfully!`);
      navigate(`/books/${newBook.id}`);
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to create book listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <Link to="/browse" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        <ChevronLeft size={16} /> Back to Catalog
      </Link>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.88rem' }}>
          <BookPlus size={18} />
          <span>PASS ON YOUR BOOKS</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
          List a Book
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Fill in your book's details below to sell, donate, or trade with students across campus.
        </p>
      </div>

      <BookForm onSubmit={handleSubmit} submitLabel="Publish Book Listing" loading={loading} />
    </div>
  );
};
