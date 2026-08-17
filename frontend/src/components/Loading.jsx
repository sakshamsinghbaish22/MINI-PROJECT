import React from 'react';
import { Loader2, BookOpen } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading BookCycle...', size = 32 }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      gap: '1rem',
      color: 'var(--text-muted)'
    }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={size} className="spin" color="var(--primary-blue)" />
      </div>
      <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary-navy)' }}>{text}</p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export const BookCardSkeleton = () => {
  return (
    <div className="card" style={{ height: '360px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '190px', backgroundColor: '#e2e8f0', animation: 'pulse 1.5s infinite ease-in-out' }} />
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        <div style={{ height: '18px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '70%', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ height: '14px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '40%', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ marginTop: 'auto', height: '24px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '100%', animation: 'pulse 1.5s infinite ease-in-out' }} />
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
