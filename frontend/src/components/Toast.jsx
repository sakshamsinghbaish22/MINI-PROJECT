import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer = ({ toasts, onClose }) => {
  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} color="#34d399" />;
      case 'error':
        return <AlertCircle size={20} color="#f87171" />;
      case 'warning':
        return <AlertTriangle size={20} color="#fbbf24" />;
      default:
        return <Info size={20} color="#60a5fa" />;
    }
  };

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            {getIcon(toast.type)}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => onClose(toast.id)}
            style={{ color: 'rgba(255,255,255,0.7)', padding: '2px', display: 'flex' }}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
