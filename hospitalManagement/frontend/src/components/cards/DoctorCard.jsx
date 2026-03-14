import React from 'react';
import Button from '../common/Button';

const DoctorCard = ({ doctor, onAction, actionLabel = "Book" }) => {
  const getSpecColor = (spec) => {
    const colors = {
      'Cardiology': '#ef4444',
      'Dermatology': '#f59e0b',
      'Neurology': '#8b5cf6',
      'Pediatrics': '#06b6d4',
      'Orthopedics': '#10b981',
      'General': '#3b82f6',
    };
    return colors[spec] || '#6366f1';
  };

  const specColor = getSpecColor(doctor.specialization);

  return (
    <div className="animate-fade-in-up" style={{
      background: 'white',
      borderRadius: '14px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid #f1f5f9',
      cursor: 'pointer',
      position: 'relative'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
      e.currentTarget.style.transform = 'translateY(-4px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      {/* Gradient accent strip */}
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${specColor}, ${specColor}88)` }} />
      
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          {/* Avatar with ring */}
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: `linear-gradient(135deg, ${specColor}20, ${specColor}10)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: specColor, fontWeight: 800, fontSize: '1.2rem',
            border: `2px solid ${specColor}30`,
            flexShrink: 0
          }}>
            {doctor.name?.charAt(0)}
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0, lineHeight: 1.3 }}>
              {doctor.name}
            </h3>
            <span style={{
              display: 'inline-block', marginTop: '4px',
              padding: '2px 10px', borderRadius: '20px',
              fontSize: '0.7rem', fontWeight: 600,
              background: `${specColor}15`, color: specColor
            }}>
              {doctor.specialization}
            </span>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
              {doctor.experience} years experience
            </p>
          </div>
        </div>
        
        {doctor.availability && (
          <div style={{ marginTop: '12px', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b' }}>
            <span style={{ fontWeight: 600, color: '#475569' }}>Available: </span>
            {doctor.availability.join(', ')}
          </div>
        )}
        
        <div style={{ marginTop: '16px' }}>
          <Button variant="primary" onClick={() => onAction(doctor)} className="w-full">
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;