import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';

// SVG Icon components for sidebar
const icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  clinics: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" />
      <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
    </svg>
  ),
  stats: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10M12 20V4M6 20v-6" />
    </svg>
  ),
  doctors: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  ),
  walkin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M9 14l2 2 4-4" />
    </svg>
  ),
  schedule: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  appointments: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  prescription: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  book: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M2 12h20" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  history: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      <path d="M2 12h2M20 12h2" />
    </svg>
  ),
  patients: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
};

const iconMap = {
  'Dashboard': 'dashboard',
  'Manage Clinics': 'clinics',
  'System Stats': 'stats',
  'Doctors': 'doctors',
  'Walk-In Booking': 'walkin',
  'Patient History': 'patients',
  'Clinic Profile': 'clinics',
  'My Schedule': 'schedule',
  'Appointments': 'appointments',
  'Create Prescription': 'prescription',
  'Home': 'home',
  'Book Appointment': 'book',
  'My History': 'history',
  'Prescriptions': 'prescription',
};

const roleTheme = {
  super_admin: { accent: '#8b5cf6', accentLight: '#ede9fe', gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)' },
  clinic_admin: { accent: '#3b82f6', accentLight: '#dbeafe', gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
  doctor: { accent: '#0f766e', accentLight: '#ccfbf1', gradient: 'linear-gradient(135deg, #0f766e, #14b8a6)' },
  patient: { accent: '#2563eb', accentLight: '#dbeafe', gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)' },
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const theme = user ? roleTheme[user.role] || roleTheme.patient : roleTheme.patient;

  const roleNavItems = {
    super_admin: [
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'Manage Clinics', path: '/admin/clinics' },
      { name: 'System Stats', path: '/admin/stats' },
    ],
    clinic_admin: [
      { name: 'Dashboard', path: '/clinic_admin/dashboard' },
      { name: 'Appointments', path: '/clinic-admin/appointments' },
      { name: 'Doctors', path: '/clinic_admin/doctors' },
      { name: 'Walk-In Booking', path: '/clinic_admin/book-walk-in' },
      { name: 'Clinic Profile', path: '/clinic-admin/profile' },
      { name: 'Patient History', path: '/clinic-admin/appointments' },
    ],
    doctor: [
      { name: 'Dashboard', path: '/doctor/dashboard' },
      { name: 'My Schedule', path: '/doctor/schedule' },
      { name: 'Appointments', path: '/doctor/appointments' },
    ],
    patient: [
      { name: 'Home', path: '/patient/home' },
      { name: 'Book Appointment', path: '/patient/select-clinic' },
      { name: 'My History', path: '/patient/appointments' },
      { name: 'Prescriptions', path: '/patient/prescriptions' },
    ],
  };

  const navItems = user ? roleNavItems[user.role] || [] : [];

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} logout={logout} />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside
          className="mobile-hide"
          style={{
            width: isSidebarOpen ? '260px' : '72px',
            background: 'white',
            borderRight: '1px solid #e2e8f0',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '2px 0 8px rgba(0,0,0,0.03)',
            flexShrink: 0,
            position: 'relative',
            zIndex: 10
          }}
        >
          <div style={{ padding: '16px 12px', flex: 1 }}>
            {/* Collapse button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                width: '100%', padding: '8px', marginBottom: '16px',
                borderRadius: '8px', border: 'none', background: '#f8fafc',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: '#64748b',
                transition: 'all 0.2s ease', fontSize: '0.8rem', fontWeight: 600
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; }}
            >
              {isSidebarOpen ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
                  Collapse
                </div>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
              )}
            </button>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.path;
                const iconKey = iconMap[item.name] || 'dashboard';
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`animate-fade-in stagger-${idx + 1}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: isSidebarOpen ? '10px 14px' : '10px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                      position: 'relative',
                      background: isActive ? theme.accentLight : 'transparent',
                      color: isActive ? theme.accent : '#64748b',
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.875rem',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#334155'; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; } }}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <div style={{
                        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                        width: '3px', height: '24px', borderRadius: '0 4px 4px 0',
                        background: theme.gradient
                      }} />
                    )}

                    <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      {icons[iconKey]}
                    </span>

                    {isSidebarOpen && (
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar footer */}
          {isSidebarOpen && (
            <div style={{
              padding: '16px', borderTop: '1px solid #f1f5f9',
              fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center'
            }}>
              MediCare SaaS v2.0
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main style={{
          flex: 1, padding: '24px', overflowY: 'auto',
          maxWidth: '100%'
        }}>
          <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;