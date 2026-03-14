import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

const toastConfig = {
  success: { bg: 'linear-gradient(135deg, #059669, #10b981)', icon: '✓' },
  error: { bg: 'linear-gradient(135deg, #dc2626, #ef4444)', icon: '✕' },
  info: { bg: 'linear-gradient(135deg, #2563eb, #3b82f6)', icon: 'ℹ' },
  warning: { bg: 'linear-gradient(135deg, #d97706, #f59e0b)', icon: '⚠' }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    // Start exit animation before removal
    setTimeout(() => {
      setToasts((prev) => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    }, 2700);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: '20px', right: '20px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        zIndex: 9999, maxWidth: '380px'
      }}>
        {toasts.map((toast) => {
          const config = toastConfig[toast.type] || toastConfig.info;
          return (
            <div
              key={toast.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 20px',
                background: config.bg,
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                animation: toast.exiting ? 'slideOutRight 0.3s ease forwards' : 'slideInRight 0.3s ease both',
                position: 'relative',
                overflow: 'hidden',
                minWidth: '280px'
              }}
            >
              {/* Icon */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.8rem', flexShrink: 0
              }}>
                {config.icon}
              </div>
              
              <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
              
              {/* Progress bar */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
                background: 'rgba(255,255,255,0.2)'
              }}>
                <div style={{
                  height: '100%', background: 'rgba(255,255,255,0.5)',
                  animation: 'progressShrink 3s linear forwards',
                  borderRadius: '0 0 12px 12px'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};