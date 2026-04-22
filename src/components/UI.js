import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts } = useApp();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' && <CheckCircle size={16} color="var(--success)" />}
          {t.type === 'error' && <AlertCircle size={16} color="var(--danger)" />}
          {t.type === 'info' && <Info size={16} color="var(--teal)" />}
          <span style={{ fontSize: 14, color: 'var(--text)' }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

export function Modal({ title, onClose, children, maxWidth = 520 }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth }}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    active: 'success', approved: 'success', confirmed: 'success', delivered: 'success', available: 'success',
    pending: 'warning', processing: 'warning',
    inactive: 'danger', rejected: 'danger', cancelled: 'danger', unavailable: 'danger',
    shipped: 'info', 'in transit': 'info',
  };
  const cls = map[status?.toLowerCase()] || 'neutral';
  return <span className={`badge badge-${cls}`}>{status}</span>;
}

export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon || '📭'}</div>
      <h3>{title}</h3>
      {subtitle && <p style={{ fontSize: 14, marginBottom: 20 }}>{subtitle}</p>}
      {action}
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}
