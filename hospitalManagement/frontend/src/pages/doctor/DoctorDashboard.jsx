import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import { API_ENDPOINTS } from '../../api/endpoints';
import Button from '../../components/common/Button';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];
  const { data: appointments, loading } = useFetch(
    `${API_ENDPOINTS.DOCTOR.APPOINTMENTS}?date=${today}`
  );

  const quickActions = [
    {
      title: 'My Appointments',
      description: 'View and manage your patient appointments.',
      path: '/doctor/appointments',
      variant: 'primary',
      label: 'View Appointments',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #0f766e, #14b8a6)',
    },
    {
      title: 'My Schedule',
      description: 'Manage your weekly availability and working hours.',
      path: '/doctor/schedule',
      variant: 'secondary',
      label: 'Manage Schedule',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      completed: 'badge-info',
      cancelled: 'badge-danger'
    };
    return styles[status?.toLowerCase()] || 'badge-info';
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div className="animate-fade-in-up" style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 50%, #06b6d4 100%)',
        padding: '28px 32px', borderRadius: '16px',
        position: 'relative', overflow: 'hidden', marginBottom: '28px',
        boxShadow: '0 8px 30px rgba(15,118,110,0.3)'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', width: '120px', height: '120px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)', top: '-30px', right: '-10px'
        }} />
        <div style={{
          position: 'absolute', width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', bottom: '-20px', right: '80px'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.5rem' }}>👋</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: 0 }}>
              Welcome back, Dr. {user?.name}!
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: 0 }}>
            Here's an overview of your day — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {quickActions.map((action, idx) => (
          <div key={idx} className={`animate-fade-in-up stagger-${idx + 1}`} style={{
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
              marginBottom: '14px', boxShadow: `0 4px 12px ${action.gradient.includes('0f766e') ? 'rgba(15,118,110,0.3)' : action.gradient.includes('6366f1') ? 'rgba(99,102,241,0.3)' : 'rgba(245,158,11,0.3)'}`
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
              <Button variant={action.variant} className="w-full">{action.label}</Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="animate-fade-in-up stagger-4" style={{
        background: 'white', padding: '24px', borderRadius: '14px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Today's Appointments</h2>
          </div>
          <Link to="/doctor/appointments">
            <Button variant="ghost">View All →</Button>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '10px' }} />
            ))}
          </div>
        ) : appointments && appointments.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {appointments.map((apt, idx) => (
              <div key={apt._id} className={`animate-fade-in-up stagger-${idx + 1}`} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px', borderRadius: '10px',
                background: '#f8fafc', border: '1px solid #f1f5f9',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f0fdfa'; e.currentTarget.style.borderColor = '#99f6e4'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#3b82f6', fontWeight: 700, fontSize: '1rem'
                  }}>
                    {(apt.patient?.name || apt.patientName || 'P').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, color: '#1e293b', margin: 0, fontSize: '0.95rem' }}>
                      {apt.patient?.name || apt.patientName || 'Unknown Patient'}
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        🕒 {apt.timeSlot}
                      </span>
                      {apt.patient?.phone && (
                        <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          📞 {apt.patient.phone}
                        </span>
                      )}
                      {apt.patient?.email && (
                        <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ✉️ {apt.patient.email}
                        </span>
                      )}
                      <span className={`badge ${getStatusBadge(apt.status)}`} style={{ marginLeft: 'auto' }}>{apt.status}</span>
                    </div>
                  </div>
                </div>
                <Link to={`/doctor/prescription?aptId=${apt._id}&patientId=${apt.patient?._id || apt.patient}`}>
                  <Button variant="primary">Prescribe</Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📋</div>
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No appointments scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
