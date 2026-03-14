import React, { useState } from 'react';

const InputField = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  error, 
  required = false,
  icon = null
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label 
          htmlFor={name} 
          style={{ 
            display: 'block', fontSize: '0.8rem', fontWeight: 600, 
            color: focused ? '#0f766e' : '#475569', marginBottom: '6px',
            transition: 'color 0.2s ease', letterSpacing: '0.02em'
          }}
        >
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: focused ? '#0f766e' : '#94a3b8', transition: 'color 0.2s ease',
            display: 'flex', alignItems: 'center'
          }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: icon ? '10px 14px 10px 40px' : '10px 14px',
            border: `2px solid ${error ? '#fca5a5' : focused ? '#14b8a6' : '#e2e8f0'}`,
            borderRadius: '10px',
            fontSize: '0.9rem',
            color: '#1e293b',
            background: focused ? '#f0fdfa' : '#ffffff',
            transition: 'all 0.25s ease',
            outline: 'none',
            boxShadow: focused ? '0 0 0 3px rgba(20,184,166,0.15)' : 'none',
            fontFamily: 'inherit',
            animation: error ? 'shake 0.4s ease-in-out' : 'none'
          }}
        />
      </div>
      {error && (
        <p style={{ marginTop: '4px', fontSize: '0.78rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;