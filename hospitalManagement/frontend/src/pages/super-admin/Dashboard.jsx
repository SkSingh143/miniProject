import React from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { API_ENDPOINTS } from '../../api/endpoints';
import useAuth from '../../hooks/useAuth';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const { data: stats, loading } = useFetch(API_ENDPOINTS.ADMIN.STATS);

  const quickActions = [
    {
      title: 'Manage Clinics',
      description: 'Add, activate or deactivate clinics across the platform.',
      path: '/admin/clinics',
      icon: '🏥',
      gradient: 'linear-gradient(135deg, #2563eb, #06b6d4)',
      shadow: 'rgba(37,99,235,0.25)',
    },
    {
      title: 'System Stats',
      description: 'View detailed usage metrics, user counts and clinic health.',
      path: '/admin/stats',
      icon: '📊',
      gradient: 'linear-gradient(135deg, #059669, #10b981)',
      shadow: 'rgba(5,150,105,0.25)',
    },
  ];

  const summaryItems = loading ? [] : [
    { label: 'Total Clinics',      value: stats?.totalClinics      ?? 0, icon: '🏥', color: '#2563eb' },
    { label: 'Active Clinics',     value: stats?.activeClinics     ?? 0, icon: '✅', color: '#059669' },
    { label: 'Total Doctors',      value: stats?.totalDoctors      ?? 0, icon: '👨‍⚕️', color: '#7c3aed' },
    { label: 'Total Patients',     value: stats?.totalPatients     ?? 0, icon: '🧑', color: '#0891b2' },
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div className="animate-fade-in-up" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #0f766e 100%)',
        borderRadius: '18px', padding: '30px 32px', marginBottom: '28px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(15,23,42,0.3)'
      }}>
        <div style={{ position: 'absolute', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', top: '-50px', right: '-30px' }} />
        <div style={{ position: 'absolute', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(20,184,166,0.1)', bottom: '-20px', left: '60%' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.6rem' }}>👑</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.02em' }}>
              Welcome back, {user?.name || 'Super Admin'}!
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', margin: 0 }}>
            You have full control over the MediCare platform.
          </p>
        </div>
      </div>

      {/* Summary Row */}
      {!loading && stats && (
        <div className="animate-fade-in-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          {summaryItems.map((item, idx) => (
            <div key={idx} style={{
              background: 'white', borderRadius: '12px', padding: '16px 18px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{item.label}</p>
                <p style={{ fontSize: '1.4rem', fontWeight: 800, color: item.color, margin: '2px 0 0', lineHeight: 1 }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '72px', borderRadius: '12px' }} />)}
        </div>
      )}

      {/* Quick Actions */}
      <div className="animate-fade-in-up stagger-2" style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 14px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {quickActions.map((action, idx) => (
            <Link key={idx} to={action.path} style={{ textDecoration: 'none' }}>
              <div style={{
                background: action.gradient, borderRadius: '16px', padding: '24px',
                boxShadow: `0 6px 20px ${action.shadow}`, cursor: 'pointer',
                transition: 'all 0.25s ease', position: 'relative', overflow: 'hidden'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${action.shadow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 6px 20px ${action.shadow}`; }}
              >
                <div style={{ position: 'absolute', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: '-15px', right: '-10px' }} />
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{action.icon}</div>
                <h3 style={{ fontWeight: 700, color: 'white', margin: '0 0 6px', fontSize: '1rem' }}>{action.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;