import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorMessage = ({ message = 'Something went wrong.', onRetry = null }) => {
  return (
    <div className="card" style={{
      padding: '3rem 2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      maxWidth: '480px',
      margin: '2rem auto'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <AlertCircle size={32} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-navy)' }}>
        Oops! We encountered an error
      </h3>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{message}</p>

      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
