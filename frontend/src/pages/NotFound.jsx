import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Compass, Home as HomeIcon } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '3.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-blue-light)',
          color: 'var(--primary-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          fontWeight: 800
        }}>
          404
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
          Page Not Found
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          The page or textbook listing you are looking for might have been removed, moved, or never existed.
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary btn-sm">
            <HomeIcon size={16} /> Back to Home
          </Link>
          <Link to="/browse" className="btn btn-secondary btn-sm">
            <Compass size={16} /> Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};
