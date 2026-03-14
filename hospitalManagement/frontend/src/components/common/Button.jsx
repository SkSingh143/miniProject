import React, { useState } from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false,
  isLoading = false,
  icon = null,
  className = '' 
}) => {
  const [ripple, setRipple] = useState(null);

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 22px',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    opacity: disabled ? 0.5 : 1,
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
    lineHeight: 1.4,
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
      color: 'white',
      boxShadow: '0 2px 12px rgba(20,184,166,0.3)',
    },
    secondary: {
      background: '#f1f5f9',
      color: '#475569',
      boxShadow: 'none',
      border: '1px solid #e2e8f0',
    },
    danger: {
      background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      color: 'white',
      boxShadow: '0 2px 12px rgba(239,68,68,0.3)',
    },
    outline: {
      background: 'transparent',
      color: '#0f766e',
      boxShadow: 'none',
      border: '2px solid #0f766e',
    },
    ghost: {
      background: 'transparent',
      color: '#64748b',
      boxShadow: 'none',
    }
  };

  const hoverStyles = {
    primary: { boxShadow: '0 4px 20px rgba(20,184,166,0.45)', transform: 'translateY(-1px)' },
    secondary: { background: '#e2e8f0', transform: 'translateY(-1px)' },
    danger: { boxShadow: '0 4px 20px rgba(239,68,68,0.45)', transform: 'translateY(-1px)' },
    outline: { background: 'rgba(15,118,110,0.08)', transform: 'translateY(-1px)' },
    ghost: { background: '#f1f5f9' },
  };

  const handleClick = (e) => {
    if (disabled || isLoading) return;
    
    // Ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y });
    setTimeout(() => setRipple(null), 500);

    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={className}
      style={{ ...baseStyles, ...variants[variant] }}
      onMouseEnter={e => {
        if (!disabled && !isLoading) {
          Object.assign(e.currentTarget.style, hoverStyles[variant]);
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = variants[variant]?.boxShadow || 'none';
        if (variant === 'secondary') e.currentTarget.style.background = '#f1f5f9';
        if (variant === 'outline') e.currentTarget.style.background = 'transparent';
        if (variant === 'ghost') e.currentTarget.style.background = 'transparent';
      }}
    >
      {ripple && (
        <span style={{
          position: 'absolute', borderRadius: '50%',
          background: 'rgba(255,255,255,0.35)',
          width: '20px', height: '20px',
          left: ripple.x - 10, top: ripple.y - 10,
          animation: 'ripple 0.5s ease-out forwards',
          pointerEvents: 'none'
        }} />
      )}
      
      {isLoading ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      ) : icon ? (
        <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
      ) : null}
      
      {children}
    </button>
  );
};

export default Button;