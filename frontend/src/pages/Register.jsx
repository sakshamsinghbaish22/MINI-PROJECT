import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building, MapPin, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    location: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.college) {
      showError('Please complete all required fields.');
      return;
    }
    try {
      setLoading(true);
      await register(formData);
      showSuccess('Account created! Welcome to BookCycle.');
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '5.5rem', paddingBottom: '6rem', display: 'flex', justifyContent: 'center' }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(168, 85, 247, 0.15)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8A2BE2, #EC4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              margin: '0 auto 1rem auto',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
            }}
          >
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '4px' }}>Join BookCycle</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Create your student marketplace account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Rivera"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Student Email Address *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="alex@college.edu"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">College / University *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="college"
                  required
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="GL Bajaj / IIT"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
                />
                <Building size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Location</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Main Campus Library"
                  className="form-input"
                  style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
                />
                <MapPin size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-purple btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#C084FC', fontWeight: 700, textDecoration: 'none' }}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
