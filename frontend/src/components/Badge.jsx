import React from 'react';
import { Tag, Gift, RefreshCw, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

export const ModeBadge = ({ mode, price }) => {
  if (mode === 'DONATE') {
    return (
      <span className="badge badge-donate">
        <Gift size={12} /> FREE DONATION
      </span>
    );
  }
  if (mode === 'EXCHANGE') {
    return (
      <span className="badge badge-exchange">
        <RefreshCw size={12} /> EXCHANGE
      </span>
    );
  }
  return (
    <span className="badge badge-sell">
      <Tag size={12} /> FOR SALE {price !== undefined && price !== null ? `· ₹${Number(price).toFixed(2)}` : ''}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const normalized = status ? status.toUpperCase() : 'AVAILABLE';
  switch (normalized) {
    case 'AVAILABLE':
      return <span className="badge badge-available"><CheckCircle size={12} /> AVAILABLE</span>;
    case 'RESERVED':
      return <span className="badge badge-reserved"><Clock size={12} /> RESERVED</span>;
    case 'SOLD':
      return <span className="badge badge-sold">SOLD</span>;
    case 'DONATED':
      return <span className="badge badge-sold">DONATED</span>;
    case 'EXCHANGED':
      return <span className="badge badge-sold">EXCHANGED</span>;
    case 'PENDING':
      return <span className="badge badge-pending"><Clock size={12} /> PENDING</span>;
    case 'ACCEPTED':
      return <span className="badge badge-available"><CheckCircle size={12} /> ACCEPTED</span>;
    case 'COMPLETED':
      return <span className="badge badge-completed"><CheckCircle size={12} /> COMPLETED</span>;
    case 'REJECTED':
      return <span className="badge badge-rejected"><XCircle size={12} /> REJECTED</span>;
    case 'CANCELLED':
      return <span className="badge badge-cancelled"><XCircle size={12} /> CANCELLED</span>;
    default:
      return <span className="badge badge-sell">{status}</span>;
  }
};

export const ConditionBadge = ({ condition }) => {
  return (
    <span style={{
      fontSize: '0.75rem',
      fontWeight: 600,
      padding: '0.2rem 0.5rem',
      borderRadius: 'var(--radius-sm)',
      backgroundColor: '#f1f5f9',
      color: '#475569',
      border: '1px solid #e2e8f0'
    }}>
      {condition}
    </span>
  );
};
