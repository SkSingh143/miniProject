import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';

const ClinicDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Daily Appointments',
      description: 'View, confirm, reschedule or cancel appointments.',
      path: '/clinic-admin/appointments',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          <path d="M9 16l2 2 4-4"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    },
    {
      title: 'Manage Doctors',
      description: 'Add doctors and manage their schedules.',
      path: '/clinic_admin/doctors',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    },
    {
      title: 'Walk-In Booking',
      description: 'Register a walk-in patient and book their slot.',
      path: '/clinic_admin/book-walk-in',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    },
    {
      title: 'Clinic Profile',
      description: 'Edit clinic info, contact details, and working hours.',
      path: '/clinic-admin/profile',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/>
          <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
    }
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div className="animate-fade-in-up" style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
        padding: '28px 32px', borderRadius: '16px',
        position: 'relative', overflow: 'hidden', marginBottom: '28px',
        boxShadow: '0 8px 30px rgba(59,130,246,0.3)'
      }}>
        <div style={{
          position: 'absolute', width: '120px', height: '120px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', top: '-30px', right: '-10px'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: 0 }}>
            Clinic Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '6px' }}>
            Welcome, {user?.name} — Manage your doctors, appointments, and patients here.
          </p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {quickActions.map((action, idx) => (
          <Link key={idx} to={action.path} style={{ textDecoration: 'none' }}>
            <div className={`animate-fade-in-up stagger-${idx + 1}`} style={{
              background: 'white', padding: '24px', borderRadius: '14px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
              transition: 'all 0.3s ease', cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 10px 35px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: action.gradient, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'white',
                marginBottom: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                {action.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                {action.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ClinicDashboard;