import React from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { API_ENDPOINTS } from '../../api/endpoints';

const MetricRow = ({ label, value, max, color }) => {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>{label}</span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{value}</span>
      </div>
      <div style={{ height: '8px', borderRadius: '99px', background: '#f1f5f9', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '99px', width: `${pct}%`,
          background: color, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)'
        }} />
      </div>
    </div>
  );
};

const SystemStats = () => {
  const { data: stats, loading, error, refetch } = useFetch(API_ENDPOINTS.ADMIN.STATS);

  const statBlocks = stats ? [
    {
      label: 'Total Clinics',        value: stats.totalClinics,       icon: '🏥', color: '#2563eb', bg: 'linear-gradient(135deg,#dbeafe,#e0f2fe)',
    },
    {
      label: 'Active Clinics',       value: stats.activeClinics,      icon: '✅', color: '#059669', bg: 'linear-gradient(135deg,#d1fae5,#ccfbf1)',
    },
    {
      label: 'Inactive Clinics',     value: stats.totalClinics - stats.activeClinics, icon: '⏸️', color: '#dc2626', bg: 'linear-gradient(135deg,#fee2e2,#fecaca)',
    },
    {
      label: 'Total Doctors',        value: stats.totalDoctors,       icon: '👨‍⚕️', color: '#7c3aed', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
    },
    {
      label: 'Total Patients',       value: stats.totalPatients,      icon: '🧑', color: '#0891b2', bg: 'linear-gradient(135deg,#cffafe,#a5f3fc)',
    },
    {
      label: 'Total Appointments',   value: stats.totalAppointments,  icon: '📅', color: '#d97706', bg: 'linear-gradient(135deg,#fef3c7,#fde68a)',
    },
  ] : [];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>System Stats</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Platform-wide usage metrics and health overview</p>
        </div>
        <button onClick={refetch} style={{
          padding: '8px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0',
          background: 'white', cursor: 'pointer', fontFamily: 'inherit',
          fontWeight: 600, fontSize: '0.82rem', color: '#475569',
          display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#14b8a6'; e.currentTarget.style.color = '#0f766e'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: '96px', borderRadius: '14px' }} />)}
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca', color: '#991b1b', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Stat Cards */}
      {!loading && stats && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            {statBlocks.map((s, idx) => (
              <div key={s.label} className={`animate-fade-in-up stagger-${idx + 1}`} style={{
                background: 'white', borderRadius: '14px', padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
                display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.25s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}
              >
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{s.label}</p>
                  <p style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, margin: '2px 0 0', lineHeight: 1 }}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Breakdown Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {/* Clinic Health */}
            <div className="animate-fade-in-up stagger-4" style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 18px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏥 Clinic Health
              </h3>
              <MetricRow label="Active Clinics"   value={stats.activeClinics}  max={stats.totalClinics} color="linear-gradient(90deg,#059669,#10b981)" />
              <MetricRow label="Inactive Clinics" value={stats.totalClinics - stats.activeClinics} max={stats.totalClinics} color="linear-gradient(90deg,#dc2626,#ef4444)" />
              <div style={{ marginTop: '12px', padding: '10px', borderRadius: '10px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Active Rate</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>
                  {stats.totalClinics > 0 ? Math.round((stats.activeClinics / stats.totalClinics) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* User Breakdown */}
            <div className="animate-fade-in-up stagger-5" style={{ background: 'white', borderRadius: '14px', padding: '22px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 18px', fontSize: '0.95rem' }}>
                👥 User Breakdown
              </h3>
              <MetricRow label="Doctors"  value={stats.totalDoctors}  max={stats.totalDoctors + stats.totalPatients} color="linear-gradient(90deg,#7c3aed,#8b5cf6)" />
              <MetricRow label="Patients" value={stats.totalPatients} max={stats.totalDoctors + stats.totalPatients} color="linear-gradient(90deg,#0891b2,#06b6d4)" />
              <div style={{ marginTop: '12px', padding: '10px', borderRadius: '10px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Total Users</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>{stats.totalDoctors + stats.totalPatients}</span>
              </div>
            </div>
          </div>

          {/* Quick Action */}
          <div className="animate-fade-in-up stagger-6" style={{ marginTop: '20px', padding: '16px 20px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(37,99,235,0.05),rgba(14,165,233,0.05))', border: '1px solid rgba(37,99,235,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', fontWeight: 600 }}>
              📋 {stats.totalClinics} clinic{stats.totalClinics !== 1 ? 's' : ''} registered • {stats.totalAppointments} appointment{stats.totalAppointments !== 1 ? 's' : ''} total
            </p>
            <Link to="/admin/clinics" style={{
              padding: '8px 18px', borderRadius: '9px', textDecoration: 'none',
              background: 'linear-gradient(135deg,#2563eb,#06b6d4)',
              color: 'white', fontWeight: 700, fontSize: '0.82rem',
              boxShadow: '0 2px 10px rgba(37,99,235,0.25)', transition: 'all 0.2s'
            }}>
              Manage Clinics →
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemStats;
