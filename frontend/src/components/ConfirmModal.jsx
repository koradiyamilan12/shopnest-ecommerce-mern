import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fade-in" style={{ zIndex: 1050 }}>
      <div className="modal-content fade-in" style={{ maxWidth: '400px', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
        <div style={{ color: 'var(--error)', marginBottom: 'var(--spacing-md)', display: 'flex', justifyContent: 'center' }}>
          <FiAlertTriangle size={48} />
        </div>
        <h3 style={{ margin: '0 0 var(--spacing-sm) 0', fontSize: 'var(--text-xl)' }}>{title}</h3>
        <p style={{ color: 'var(--muted)', margin: '0 0 var(--spacing-xl) 0', fontSize: 'var(--text-sm)', lineHeight: '1.5' }}>
          {message}
        </p>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
          <button onClick={onCancel} className="btn btn-outline" style={{ flex: 1, padding: '0.6rem 1rem' }}>
            {cancelText}
          </button>
          <button onClick={onConfirm} className="btn btn-danger" style={{ flex: 1, padding: '0.6rem 1rem' }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
