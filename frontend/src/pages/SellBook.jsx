import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Sparkles, Upload, DollarSign, RefreshCw, Heart, MapPin, Eye } from 'lucide-react';
import { booksApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BookCard3D from '../components/BookCard3D';

const CATEGORIES = [
  'Computer Science',
  'Engineering',
  'Artificial Intelligence',
  'Mathematics',
  'Medical',
  'Business',
  'Physics',
  'Chemistry',
  'Competitive Exams',
  'Fiction',
];

const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair'];

export default function SellBook() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    subject: '',
    course: '',
    category: 'Computer Science',
    edition: '1st Edition',
    condition: 'Good',
    price: 25.0,
    mode: searchParams.get('mode') || 'SELL',
    exchange_preference: '',
    images: ['https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80'],
    location: user?.location || 'Main Campus Library',
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleModeSelect = (mode) => {
    setFormData((prev) => ({
      ...prev,
      mode,
      price: mode === 'DONATE' || mode === 'EXCHANGE' ? 0 : prev.price || 20,
    }));
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [imageUrlInput.trim(), ...prev.images],
    }));
    setImageUrlInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showError('Please sign in to list textbooks.');
      navigate('/login');
      return;
    }

    if (!formData.title.trim() || !formData.author.trim() || !formData.description.trim()) {
      showError('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await booksApi.createBook(formData);
      showSuccess(`"${res.title}" listed on the marketplace!`);
      navigate(`/books/${res.id}`);
    } catch (err) {
      showError(err.response?.data?.detail || 'Failed to create listing.');
    } finally {
      setSubmitting(false);
    }
  };

  // Live preview book object
  const previewBook = {
    id: 'preview',
    title: formData.title || 'Book Title Preview',
    author: formData.author || 'Author Name',
    description: formData.description || 'Description will appear here...',
    subject: formData.subject || 'Subject',
    course: formData.course || 'Course 101',
    category: formData.category,
    edition: formData.edition,
    condition: formData.condition,
    price: formData.mode === 'SELL' ? formData.price : 0,
    mode: formData.mode,
    images: formData.images,
    owner_id: user?.id || 'demo',
    owner_name: user?.name || 'You (Seller)',
    owner_college: user?.college || 'Your Campus',
    owner_rating: user?.rating || 5.0,
    location: formData.location || 'Campus Center',
    status: 'AVAILABLE',
  };

  return (
    <div className="container" style={{ paddingTop: '5.5rem', paddingBottom: '6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-sell" style={{ marginBottom: '0.75rem' }}>
          <span>LISTING STUDIO</span>
        </div>
        <h1 className="heading-section">
          List a Book on <span className="gradient-text">BookCycle</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Pass on textbooks to junior students or exchange for upcoming semester courses.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr minmax(300px, 380px)',
        gap: '3rem',
        alignItems: 'start',
      }}>
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="glass-panel"
          style={{
            padding: '2.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
          }}
        >
          {/* Mode Selector Tabs */}
          <div className="form-group">
            <label className="form-label">How do you want to list this textbook?</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => handleModeSelect('SELL')}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: formData.mode === 'SELL' ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  border: formData.mode === 'SELL' ? '1.5px solid #3B82F6' : '1px solid var(--border-subtle)',
                  color: formData.mode === 'SELL' ? '#60A5FA' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <DollarSign size={16} />
                <span>Sell for Cash</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeSelect('DONATE')}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: formData.mode === 'DONATE' ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  border: formData.mode === 'DONATE' ? '1.5px solid #00F0FF' : '1px solid var(--border-subtle)',
                  color: formData.mode === 'DONATE' ? '#00F0FF' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Heart size={16} />
                <span>Donate Free</span>
              </button>

              <button
                type="button"
                onClick={() => handleModeSelect('EXCHANGE')}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: formData.mode === 'EXCHANGE' ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  border: formData.mode === 'EXCHANGE' ? '1.5px solid #A855F7' : '1px solid var(--border-subtle)',
                  color: formData.mode === 'EXCHANGE' ? '#C084FC' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={16} />
                <span>Book Trade</span>
              </button>
            </div>
          </div>

          {/* Title & Author */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Book Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to Algorithms (CLRS)"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Author(s) *</label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="e.g. Cormen, Leiserson, Rivest, Stein"
                className="form-input"
              />
            </div>
          </div>

          {/* Category, Condition & Edition */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Academic Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-select">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Condition</label>
              <select name="condition" value={formData.condition} onChange={handleChange} className="form-select">
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Edition</label>
              <input
                type="text"
                name="edition"
                value={formData.edition}
                onChange={handleChange}
                placeholder="e.g. 3rd Edition"
                className="form-input"
              />
            </div>
          </div>

          {/* Course & Subject */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Course Code / Exam</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="e.g. CS 201 / Data Structures"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject Domain</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Algorithms & Complexity"
                className="form-input"
              />
            </div>
          </div>

          {/* Price (if SELL) or Desired Exchange Title (if EXCHANGE) */}
          {formData.mode === 'SELL' && (
            <div className="form-group">
              <label className="form-label">Asking Price (₹ INR) *</label>
              <input
                type="number"
                name="price"
                min="0"
                step="1"
                required
                placeholder="250.00"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          )}

          {formData.mode === 'EXCHANGE' && (
            <div className="form-group">
              <label className="form-label">Which book or subject would you like in trade? *</label>
              <input
                type="text"
                name="exchange_preference"
                required
                value={formData.exchange_preference}
                onChange={handleChange}
                placeholder="e.g. Looking for Operating Systems (Silberschatz) or Computer Networks"
                className="form-input"
              />
            </div>
          )}

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Book Description & Highlights *</label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Mention page conditions, pen markings, syllabus relevance, and extra notes..."
              className="form-textarea"
            />
          </div>

          {/* Image URL & Location */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Cover Image URL</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="btn btn-secondary btn-sm"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Campus Handoff Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. North Campus Library"
                className="form-input"
              />
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <Sparkles size={18} />
            <span>{submitting ? 'Publishing to Network...' : 'Publish Book to Marketplace'}</span>
          </button>
        </form>

        {/* Right Live Interactive Preview */}
        <div>
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--cyan)',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.05em',
              marginBottom: '1rem',
            }}>
              <Eye size={15} />
              <span>LIVE 3D CARD PREVIEW</span>
            </div>

            <BookCard3D book={previewBook} />
          </div>
        </div>
      </div>

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
