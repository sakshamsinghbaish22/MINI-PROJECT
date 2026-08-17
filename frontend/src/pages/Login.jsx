import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles, BookOpen, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
      showSuccess('Welcome back to BookCycle!');
      navigate('/dashboard');
    } catch (err) {
      showError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      setLoading(true);
      await login(demoEmail, demoPass);
      showSuccess('Signed in with demo student account!');
      navigate('/dashboard');
    } catch (err) {
      showError('Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem', display: 'flex', justifyContent: 'center' }}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '3rem 2.5rem',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 240, 255, 0.15)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00F0FF, #3B82F6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050811',
              margin: '0 auto 1rem auto',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
            }}
          >
            <BookOpen size={24} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.75rem', color: '#FFFFFF', marginBottom: '4px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sign in to your campus account</p>
        </div>

        {/* 1-Click Quick Demo Login */}
        <div style={{ marginBottom: '1.75rem', background: 'rgba(5, 8, 17, 0.75)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--cyan)', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} />
            <span>1-CLICK QUICK DEMO LOGIN</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('alice@college.edu', 'password123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', padding: '6px 4px' }}
            >
              👩‍🎓 Alice (Seller)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('bob@college.edu', 'password123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', padding: '6px 4px' }}
            >
              👨‍🎓 Bob (Buyer)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@bookcycle.edu', 'admin123')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', padding: '6px 4px' }}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--cyan)', fontWeight: 700, textDecoration: 'none' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
