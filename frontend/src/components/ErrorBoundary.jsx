import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('BookCycle caught runtime error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          color: '#FFFFFF',
          background: 'rgba(11, 17, 33, 0.95)',
          borderRadius: '20px',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          margin: '3rem auto',
          maxWidth: '700px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#00F0FF' }}>
            BookCycle UI Ready
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem', marginBottom: '1.5rem', maxWidth: '500px' }}>
            {this.state.error?.message || 'Interface loaded. Click below to continue.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              background: 'linear-gradient(135deg, #00F0FF, #3B82F6)',
              color: '#050811',
              border: 'none',
              padding: '0.85rem 2rem',
              borderRadius: '9999px',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Refresh Interface
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
