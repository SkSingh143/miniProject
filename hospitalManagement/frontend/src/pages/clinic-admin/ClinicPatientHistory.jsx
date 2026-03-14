import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';

const statusConfig = {
  pending:   { label: 'Pending',   cls: 'badge-warning', icon: '⏳' },
  confirmed: { label: 'Confirmed', cls: 'badge-success', icon: '✅' },
  completed: { label: 'Completed', cls: 'badge-info',    icon: '🏁' },
  cancelled: { label: 'Cancelled', cls: 'badge-danger',  icon: '❌' },
};

const ClinicPatientHistory = () => {
  const { patientId } = useParams();
  const { data, loading, error } = useFetch(`/clinic/patients/${patientId}/history`);
  const [activeTab, setActiveTab] = useState('appointments');

  const patient = data?.patient;
  const appointments = data?.appointments || [];
  const prescriptions = data?.prescriptions || [];

  if (loading) return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '90px', borderRadius: '12px', marginBottom: '10px' }} />)}
    </div>
  );

  if (error || !patient) return (
    <div style={{ textAlign: 'center', padding: '50px 0' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⚠️</div>
      <p style={{ color: '#94a3b8' }}>Patient not found.</p>
      <Link to="/clinic-admin/appointments"><button style={{ marginTop: '12px', padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>← Back</button></Link>
    </div>
  );

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      {/* Back */}
      <Link to="/clinic-admin/appointments" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem', textDecoration: 'none', marginBottom: '16px' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        Back to Appointments
      </Link>

      {/* Patient Card */}
      <div className="animate-fade-in-up" style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, rgba(139,92,246,0.06), rgba(99,102,241,0.06))', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.4rem', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}>
            {patient.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1e293b', margin: 0 }}>{patient.name}</h2>
            <p style={{ color: '#64748b', fontSize: '0.83rem', margin: '4px 0 0' }}>📧 {patient.email}</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <p style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Visits</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6366f1', margin: '2px 0 0' }}>{appointments.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
          {[
            { key: 'appointments', label: `Appointments (${appointments.length})` },
            { key: 'prescriptions', label: `Prescriptions (${prescriptions.length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1, padding: '12px', border: 'none', background: 'transparent',
                fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                color: activeTab === tab.key ? '#1e293b' : '#94a3b8',
                borderBottom: activeTab === tab.key ? '2px solid #6366f1' : '2px solid transparent',
                transition: 'all 0.2s ease'
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {appointments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>No appointments recorded.</div>
            ) : appointments.map((apt, idx) => {
              const cfg = statusConfig[apt.status] || statusConfig.pending;
              return (
                <div key={apt._id} style={{ padding: '14px 24px', borderBottom: idx < appointments.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>Dr. {apt.doctor?.name}</p>
                    <p style={{ fontSize: '0.77rem', color: '#64748b', margin: '3px 0 0', display: 'flex', gap: '8px' }}>
                      <span>📅 {new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span>🕐 {apt.timeSlot}</span>
                    </p>
                  </div>
                  <span className={`badge ${cfg.cls}`} style={{ fontSize: '0.68rem' }}>{cfg.icon} {cfg.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
            {prescriptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>No prescriptions recorded.</div>
            ) : prescriptions.map((rx, idx) => (
              <div key={rx._id} style={{ padding: '14px 24px', borderBottom: idx < prescriptions.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>{rx.diagnosis}</p>
                    <p style={{ fontSize: '0.77rem', color: '#64748b', margin: '3px 0 6px' }}>Dr. {rx.doctor?.name} • {rx.medicines?.length} medicine{rx.medicines?.length !== 1 ? 's' : ''}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {rx.medicines?.slice(0, 3).map((m, mi) => (
                        <span key={mi} style={{ padding: '2px 9px', borderRadius: '20px', background: '#f0fdfa', border: '1px solid #99f6e4', fontSize: '0.7rem', fontWeight: 600, color: '#0f766e' }}>{m.name}</span>
                      ))}
                      {rx.medicines?.length > 3 && <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>+{rx.medicines.length - 3} more</span>}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(rx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicPatientHistory;
