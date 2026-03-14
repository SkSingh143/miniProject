import React from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

const SelectClinic = () => {
  const navigate = useNavigate();
  const { data: clinics, loading, error } = useFetch('/patient/clinics');

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div className="animate-fade-in-up" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Select a Clinic</h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
          Choose a clinic to view available doctors and book an appointment
        </p>
      </div>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '14px' }} />)}
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '12px', color: '#991b1b', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {!loading && clinics?.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏥</div>
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No active clinics available right now.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {clinics?.map((clinic, idx) => (
          <div
            key={clinic._id}
            className={`animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`}
            onClick={() => navigate(`/patient/book?clinicId=${clinic._id}&clinicName=${encodeURIComponent(clinic.name)}`)}
            style={{
              background: 'white', borderRadius: '16px', padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
              cursor: 'pointer', transition: 'all 0.25s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = '#99f6e4';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
              e.currentTarget.style.borderColor = '#f1f5f9';
            }}
          >
            {/* Clinic Icon */}
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #0f766e, #14b8a6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px', boxShadow: '0 4px 12px rgba(15,118,110,0.25)'
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/>
                <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
              </svg>
            </div>

            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1e293b', margin: '0 0 6px' }}>
              {clinic.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {clinic.address}
            </p>

            {clinic.workingHours && (
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {clinic.workingHours}
              </p>
            )}

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingTop: '14px', borderTop: '1px solid #f1f5f9'
            }}>
              <span className="badge badge-success">Active</span>
              <span style={{ fontSize: '0.8rem', color: '#0f766e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                Book Here
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectClinic;
