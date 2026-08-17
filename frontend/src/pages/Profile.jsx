import React, { useState, useEffect } from 'react';
import { User, Building, MapPin, Star, Sparkles, CheckCircle2, ShieldCheck, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { reviewsApi } from '../services/api';
import { useToast } from '../context/ToastContext';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    location: user?.location || '',
    profile_image: user?.profile_image || AVATAR_PRESETS[0],
  });

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        college: user.college || '',
        location: user.location || '',
        profile_image: user.profile_image || AVATAR_PRESETS[0],
      });

      async function fetchMyReviews() {
        try {
          setLoadingReviews(true);
          const revs = await reviewsApi.getUserReviews(user.id);
          setReviews(revs);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingReviews(false);
        }
      }
      fetchMyReviews();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(formData);
      showSuccess('Profile updated successfully!');
    } catch (err) {
      showError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '5.5rem', paddingBottom: '6rem', maxWidth: '1080px' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="badge badge-sell" style={{ marginBottom: '0.5rem' }}>
          <span>CAMPUS IDENTITY</span>
        </div>
        <h1 className="heading-section">
          My Student <span className="gradient-text">Profile</span>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'flex-start' }}>
        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
            Edit Account Information
          </h3>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">College / Department</label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              placeholder="e.g. GL Bajaj / IIT Computer Science"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Primary Campus Location / City</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Main Campus Library"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Choose Avatar Preset</label>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {AVATAR_PRESETS.map((preset, idx) => (
                <img
                  key={idx}
                  src={preset}
                  alt="Preset"
                  onClick={() => setFormData({ ...formData, profile_image: preset })}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: formData.profile_image === preset ? '3px solid var(--cyan)' : '2px solid transparent',
                    boxShadow: formData.profile_image === preset ? '0 0 15px var(--cyan)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>
            <input
              type="url"
              placeholder="Or paste custom image URL"
              value={formData.profile_image}
              onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
              className="form-input"
            />
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary btn-md" style={{ marginTop: '1rem' }}>
            <Sparkles size={16} />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </form>

        {/* Profile Reputation Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'linear-gradient(135deg, #00F0FF, #3B82F6)', padding: '3px' }}>
              <img
                src={formData.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={formData.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>{user?.name}</h3>
              <div style={{ fontSize: '12px', color: 'var(--cyan)' }}>{user?.email}</div>
            </div>

            <div style={{ width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Reputation Rating:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 700 }}>
                  <Star size={14} fill="#F59E0B" />
                  <span>{user?.rating ? user.rating.toFixed(1) : '5.0'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Role:</span>
                <span style={{ fontWeight: 700, color: user?.role === 'ADMIN' ? '#3B82F6' : '#00F0FF' }}>
                  {user?.role}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Campus:</span>
                <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{user?.college}</span>
              </div>
            </div>
          </div>

          {/* Student Reviews on My Profile */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', color: '#FFFFFF', marginBottom: '1rem' }}>
              Peer Reviews ({reviews.length})
            </h4>
            {loadingReviews ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Loading reviews...</p>
            ) : reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {reviews.map((rev, i) => (
                  <div key={rev.id || i} style={{ background: 'rgba(5, 8, 17, 0.7)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: '#00F0FF' }}>{rev.reviewer_name || 'Student'}</strong>
                      <span style={{ color: '#F59E0B' }}>★ {rev.rating}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No reviews received yet. Complete trades to earn ratings!</p>
            )}
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
