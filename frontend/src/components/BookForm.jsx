import React, { useState } from 'react';
import { Tag, Gift, RefreshCw, Image as ImageIcon, Sparkles, MapPin, DollarSign, BookOpen } from 'lucide-react';
import { BookCard } from './BookCard';

const CATEGORIES = [
  'Computer Science',
  'Engineering',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Medical & Pre-Med',
  'Competitive Exam Prep',
  'Business & Economics',
  'Humanities & Social Sciences',
  'Other'
];

const CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair'];

const IMAGE_PRESETS = [
  { label: 'CS / Algorithms', url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80' },
  { label: 'Code / Python', url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80' },
  { label: 'Engineering / Systems', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80' },
  { label: 'Math / Science', url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80' },
  { label: 'Medical / Biology', url: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=600&auto=format&fit=crop&q=80' },
  { label: 'General Textbook', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80' }
];

export const BookForm = ({ initialData = {}, onSubmit, submitLabel = 'Publish Listing', loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    author: initialData.author || '',
    description: initialData.description || '',
    subject: initialData.subject || '',
    course: initialData.course || '',
    category: initialData.category || 'Computer Science',
    edition: initialData.edition || '1st Edition',
    condition: initialData.condition || 'Good',
    price: initialData.price !== undefined ? initialData.price : 15.0,
    mode: initialData.mode || 'SELL',
    exchange_preference: initialData.exchange_preference || '',
    images: initialData.images && initialData.images.length > 0 ? initialData.images : [IMAGE_PRESETS[0].url],
    location: initialData.location || '',
  });

  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSelectPresetImage = (url) => {
    handleChange('images', [url]);
  };

  const handleAddCustomImage = () => {
    if (customImageUrl && customImageUrl.startsWith('http')) {
      handleChange('images', [customImageUrl]);
      setCustomImageUrl('');
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Book title is required';
    if (!formData.author.trim()) errs.author = 'Author name is required';
    if (!formData.description.trim() || formData.description.length < 5) {
      errs.description = 'Please provide a descriptive overview (at least 5 characters)';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.course.trim()) errs.course = 'Course code or name is required';
    if (!formData.location.trim()) errs.location = 'Campus pickup location is required';

    if (formData.mode === 'SELL' && (isNaN(formData.price) || Number(formData.price) <= 0)) {
      errs.price = 'Please enter a valid price greater than ₹0';
    }

    if (formData.mode === 'EXCHANGE' && !formData.exchange_preference.trim()) {
      errs.exchange_preference = 'Please state what book(s) you would like in return';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {
        ...formData,
        price: formData.mode === 'SELL' ? Number(formData.price) : 0.0,
        exchange_preference: formData.mode === 'EXCHANGE' ? formData.exchange_preference : null,
      };
      onSubmit(payload);
    }
  };

  // Construct mock preview object
  const previewBook = {
    id: 'preview',
    title: formData.title || 'Untitled Textbook',
    author: formData.author || 'Author Name',
    description: formData.description || 'Description will appear here...',
    subject: formData.subject || 'Subject',
    course: formData.course || 'CS 101',
    category: formData.category,
    edition: formData.edition,
    condition: formData.condition,
    price: formData.mode === 'SELL' ? Number(formData.price || 0) : 0,
    mode: formData.mode,
    exchange_preference: formData.exchange_preference,
    images: formData.images,
    owner_name: 'You (Preview)',
    owner_rating: 5.0,
    location: formData.location || 'Campus Center',
    status: 'AVAILABLE',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 340px' : '1fr', gap: '2rem', alignItems: 'flex-start' }}>
      <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Mode Selector */}
        <div>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--primary-navy)' }}>
            Listing Mode <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => handleChange('mode', 'SELL')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: formData.mode === 'SELL' ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                backgroundColor: formData.mode === 'SELL' ? 'var(--primary-blue-light)' : 'var(--bg-surface)',
                color: formData.mode === 'SELL' ? 'var(--primary-blue)' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}
            >
              <Tag size={20} />
              <span>SELL</span>
            </button>

            <button
              type="button"
              onClick={() => handleChange('mode', 'DONATE')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: formData.mode === 'DONATE' ? '2px solid #059669' : '1px solid var(--border-color)',
                backgroundColor: formData.mode === 'DONATE' ? '#ecfdf5' : 'var(--bg-surface)',
                color: formData.mode === 'DONATE' ? '#047857' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}
            >
              <Gift size={20} />
              <span>DONATE (FREE)</span>
            </button>

            <button
              type="button"
              onClick={() => handleChange('mode', 'EXCHANGE')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: formData.mode === 'EXCHANGE' ? '2px solid #d97706' : '1px solid var(--border-color)',
                backgroundColor: formData.mode === 'EXCHANGE' ? '#fffbeb' : 'var(--bg-surface)',
                color: formData.mode === 'EXCHANGE' ? '#b45309' : 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}
            >
              <RefreshCw size={20} />
              <span>EXCHANGE</span>
            </button>
          </div>
        </div>

        {/* Dynamic Mode specific inputs */}
        {formData.mode === 'SELL' && (
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              Selling Price (₹ INR) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700 }}>₹</span>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="250.00"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                style={{ paddingLeft: '1.75rem' }}
              />
            </div>
            {errors.price && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.price}</span>}
          </div>
        )}

        {formData.mode === 'EXCHANGE' && (
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              Exchange Preference / What do you want in return? <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Looking for Operating Systems 10th edition or Organic Chemistry Vol 2"
              value={formData.exchange_preference}
              onChange={(e) => handleChange('exchange_preference', e.target.value)}
            />
            {errors.exchange_preference && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.exchange_preference}</span>}
          </div>
        )}

        {/* Title and Author */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              Book Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Introduction to Algorithms"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            {errors.title && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.title}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              Author(s) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Cormen, Leiserson, Rivest, Stein"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
            />
            {errors.author && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.author}</span>}
          </div>
        </div>

        {/* Category & Condition & Edition */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Category</label>
            <select value={formData.category} onChange={(e) => handleChange('category', e.target.value)}>
              {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Condition</label>
            <select value={formData.condition} onChange={(e) => handleChange('condition', e.target.value)}>
              {CONDITIONS.filter(c => c !== 'All').map((cond) => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>Edition</label>
            <input
              type="text"
              placeholder="e.g. 3rd Edition"
              value={formData.edition}
              onChange={(e) => handleChange('edition', e.target.value)}
            />
          </div>
        </div>

        {/* Subject & Course */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              Subject / Topic <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Data Structures & Algorithms"
              value={formData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
            />
            {errors.subject && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.subject}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              Course Code / Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. CS 201 / COMP 302"
              value={formData.course}
              onChange={(e) => handleChange('course', e.target.value)}
            />
            {errors.course && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.course}</span>}
          </div>
        </div>

        {/* Campus Location */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
            Campus Pickup Location <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="e.g. North Campus Science Library / Student Union Cafe"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              style={{ paddingLeft: '2.3rem' }}
            />
          </div>
          {errors.location && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.location}</span>}
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
            Description & Book Details <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Mention notes, highlights, whether solutions/CD/access code is included, preferred meetup timings..."
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          {errors.description && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.description}</span>}
        </div>

        {/* Cover Photo / Presets */}
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
            Book Cover Image
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {IMAGE_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.label}
                onClick={() => handleSelectPresetImage(preset.url)}
                className={`btn btn-sm ${formData.images[0] === preset.url ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.8rem' }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="url"
              placeholder="Or paste an image URL (https://...)"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAddCustomImage}
              className="btn btn-secondary btn-sm"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Submit button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ minWidth: '180px' }}
          >
            <Sparkles size={18} />
            <span>{loading ? 'Submitting...' : submitLabel}</span>
          </button>
        </div>
      </form>

      {/* Live Preview Card */}
      {showPreview && (
        <div style={{ position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Live Preview
            </span>
          </div>
          <BookCard book={previewBook} />
        </div>
      )}
    </div>
  );
};
