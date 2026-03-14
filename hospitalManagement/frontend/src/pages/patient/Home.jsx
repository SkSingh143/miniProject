import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import { API_ENDPOINTS } from '../../api/endpoints';
import Button from '../../components/common/Button';

const PatientHome = () => {
  const { user } = useAuth();
  const { data: upcomingAppointments, loading } = useFetch(`${API_ENDPOINTS.APPOINTMENTS.HISTORY}?status=upcoming`);

  const quickActions = [
    {
      title: 'Book Appointment',
      description: 'Browse clinics, find a doctor and book your slot.',
      path: '/patient/select-clinic',
      label: 'Browse Clinics',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/>
          <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
    },
    {
      title: 'My Appointments',
      description: 'View status of all your appointments and cancel if needed.',
      path: '/patient/appointments',
      label: 'View Appointments',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          <path d="M9 16l2 2 4-4"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
    },
    {
      title: 'Prescriptions',
      description: 'View and download your prescription history as PDF.',
      path: '/patient/prescriptions',
      label: 'View Prescriptions',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    },
    {
      title: 'Compare Medicines',
      description: 'Search and compare medicine prices across pharmacies.',
      path: '/patient/compare-medicine',
      label: 'Compare Prices',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    }
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div className="animate-fade-in-up" style={{
        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #06b6d4 100%)',
        padding: '28px 32px', borderRadius: '16px',
        position: 'relative', overflow: 'hidden', marginBottom: '28px',
        boxShadow: '0 8px 30px rgba(37,99,235,0.3)'
      }}>
        <div style={{
          position: 'absolute', width: '120px', height: '120px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', top: '-30px', right: '-10px'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏥</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: 0 }}>
              Welcome back, {user?.name}!
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>
            Manage your health, appointments, and prescriptions from your dashboard.
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {quickActions.map((action, idx) => (
          <div key={idx} className={`animate-fade-in-up stagger-${idx + 1}`} style={{
            background: 'white', padding: '24px', borderRadius: '14px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
            transition: 'all 0.3s ease',
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
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
              {action.description}
            </p>
            <Link to={action.path}>
              <Button variant="primary" className="w-full">{action.label}</Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="animate-fade-in-up stagger-4" style={{
        background: 'white', padding: '24px', borderRadius: '14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Upcoming Appointments</h2>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2].map(i => (
              <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '10px' }} />
            ))}
          </div>
        ) : upcomingAppointments && upcomingAppointments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingAppointments.map((apt, idx) => (
              <div key={apt._id} className={`animate-fade-in-up stagger-${idx + 1}`} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px', borderRadius: '10px',
                background: '#f8fafc', border: '1px solid #f1f5f9',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #dcfce7, #d1fae5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#059669', fontWeight: 700, fontSize: '0.85rem'
                  }}>
                    {apt.doctorName?.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>Dr. {apt.doctorName}</h4>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>{apt.specialization}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 600, color: '#1e293b', margin: 0, fontSize: '0.85rem' }}>
                    {new Date(apt.date).toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>{apt.timeSlot}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📅</div>
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>You have no upcoming appointments.</p>
            <Link to="/patient/book" style={{ marginTop: '12px', display: 'inline-block' }}>
              <Button variant="primary">Book Your First Appointment</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientHome;