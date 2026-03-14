import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/common/Button';
import { ToastContext } from '../../context/ToastContext';

const statusConfig = {
  pending:   { label: 'Pending',   cls: 'badge-warning', icon: '⏳' },
  confirmed: { label: 'Confirmed', cls: 'badge-success', icon: '✅' },
  completed: { label: 'Completed', cls: 'badge-info',    icon: '🏁' },
  cancelled: { label: 'Cancelled', cls: 'badge-danger',  icon: '❌' },
};

const StatusDropdown = ({ appointment, onUpdated }) => {
  const { addToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleStatusChange = async (status) => {
    setOpen(false);
    setLoading(true);
    try {
      await axiosClient.put(`/doctor/appointments/${appointment._id}/status`, { status });
      addToast(`Appointment marked as ${status}`, 'success');
      if (onUpdated) onUpdated();
    } catch (error) {
      addToast(error.response?.data?.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { status: 'confirmed', label: '✅ Confirm',  color: '#059669' },
    { status: 'completed', label: '🏁 Complete', color: '#2563eb' },
    { status: 'cancelled', label: '❌ Cancel',   color: '#dc2626' },
  ].filter(a => a.status !== appointment.status);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        disabled={loading || appointment.status === 'completed' || appointment.status === 'cancelled'}
        style={{
          padding: '6px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0',
          background: 'white', color: '#475569', fontSize: '0.8rem', fontWeight: 600,
          cursor: loading || ['completed','cancelled'].includes(appointment.status) ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease',
          fontFamily: 'inherit', opacity: ['completed','cancelled'].includes(appointment.status) ? 0.5 : 1
        }}
        onMouseEnter={e => { if (!['completed','cancelled'].includes(appointment.status)) e.currentTarget.style.borderColor = '#0f766e'; }}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
      >
        {loading ? '...' : 'Update Status'}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%', zIndex: 50,
          background: 'white', borderRadius: '10px', padding: '6px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9',
          minWidth: '150px'
        }}>
          {actions.map(a => (
            <button key={a.status} onClick={() => handleStatusChange(a.status)}
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '7px',
                border: 'none', background: 'transparent', textAlign: 'left',
                color: a.color, fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer',
                transition: 'background 0.15s ease', fontFamily: 'inherit', display: 'block'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MyAppointments = () => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [refresh, setRefresh] = useState(0);

  const { data: appointments, loading, error } = useFetch(
    `/doctor/appointments?date=${selectedDate}`,
    [selectedDate, refresh]
  );

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto' }}>
      <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Appointments</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
            {selectedDate === today ? "Today's schedule" : `Schedule for ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}`}
          </p>
        </div>
        <input type="date" value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#14b8a6'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {/* Summary bar */}
      {!loading && appointments?.length > 0 && (
        <div className="animate-fade-in-up stagger-1" style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {Object.entries(
            appointments.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {})
          ).map(([status, count]) => {
            const cfg = statusConfig[status] || statusConfig.pending;
            return (
              <div key={status} style={{
                padding: '8px 16px', borderRadius: '10px', background: 'white',
                border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '6px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}>
                <span>{cfg.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>{count}</span>
                <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'capitalize' }}>{status}</span>
              </div>
            );
          })}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '14px' }} />)}
        </div>
      )}

      {error && (
        <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.9rem' }}>{error}</div>
      )}

      {!loading && appointments?.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No appointments for this date.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {appointments?.map((apt, idx) => {
          const cfg = statusConfig[apt.status] || statusConfig.pending;
          return (
            <div key={apt._id} className={`animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`} style={{
              background: 'white', borderRadius: '14px', padding: '18px 20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                {/* Patient info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#3b82f6', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0
                  }}>
                    {(apt.patient?.name || 'P').charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700, color: '#1e293b', margin: 0, fontSize: '0.95rem' }}>
                      {apt.patient?.name || 'Patient'}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {apt.timeSlot}
                      </span>
                      {apt.patient?.email && (
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>• {apt.patient.email}</span>
                      )}
                      <span className={`badge ${cfg.cls}`} style={{ fontSize: '0.68rem' }}>{cfg.icon} {cfg.label}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <StatusDropdown appointment={apt} onUpdated={() => setRefresh(r => r + 1)} />
                  {apt.patient?._id && (
                    <Link to={`/doctor/patient/${apt.patient._id}`}>
                      <button style={{
                        padding: '6px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0',
                        background: 'white', color: '#475569', fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#818cf8'; e.currentTarget.style.color = '#6366f1'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        View Patient
                      </button>
                    </Link>
                  )}
                  {(apt.status === 'confirmed' || apt.status === 'pending') && (
                    <Link to={`/doctor/prescription?aptId=${apt._id}&patientId=${apt.patient?._id}`}>
                      <button style={{
                        padding: '6px 14px', borderRadius: '8px', border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: 'white', fontSize: '0.8rem', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                        boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(99,102,241,0.3)'; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                        Prescribe
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointments;