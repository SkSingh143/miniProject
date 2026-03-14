import React, { useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/common/Button';
import { ToastContext } from '../../context/ToastContext';

const statusConfig = {
  pending:   { label: 'Pending',   cls: 'badge-warning', icon: '⏳' },
  confirmed: { label: 'Confirmed', cls: 'badge-success', icon: '✅' },
  completed: { label: 'Completed', cls: 'badge-info',    icon: '✔️' },
  cancelled: { label: 'Cancelled', cls: 'badge-danger',  icon: '❌' },
};

const AppointmentHistory = () => {
  const { addToast } = useContext(ToastContext);
  const { data: appointments, loading, error, refetch } = useFetch('/patient/appointments');
  const [cancellingId, setCancellingId] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(id);
    try {
      await axiosClient.put(`/patient/appointments/${id}/cancel`);
      addToast('Appointment cancelled successfully', 'success');
      if (refetch) refetch();
    } catch (error) {
      addToast(error.response?.data?.message || 'Cancellation failed', 'error');
    } finally {
      setCancellingId(null);
    }
  };

  const filtered = appointments?.filter(a => filter === 'all' ? true : a.status === filter) || [];

  const filterTabs = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>My Appointments</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
            {appointments?.length || 0} total appointments
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="animate-fade-in-up stagger-1" style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {filterTabs.map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            style={{
              padding: '6px 14px', borderRadius: '20px', border: '1.5px solid',
              borderColor: filter === tab ? '#0f766e' : '#e2e8f0',
              background: filter === tab ? 'linear-gradient(135deg, #0f766e, #14b8a6)' : 'white',
              color: filter === tab ? 'white' : '#64748b',
              fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
              transition: 'all 0.2s ease', fontFamily: 'inherit',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '14px' }} />)}
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '12px', color: '#991b1b', border: '1px solid #fecaca', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
            {filter === 'all' ? 'No appointments yet.' : `No ${filter} appointments found.`}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((apt, idx) => {
          const cfg = statusConfig[apt.status] || statusConfig.pending;
          return (
            <div key={apt._id} className={`animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`} style={{
              background: 'white', borderRadius: '14px', padding: '18px 20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '12px', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Avatar */}
                <div style={{
                  width: '46px', height: '46px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#3b82f6', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0
                }}>
                  {(apt.doctor?.name || 'D').charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, color: '#1e293b', margin: 0, fontSize: '0.95rem' }}>
                    Dr. {apt.doctor?.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {apt.timeSlot}
                    </span>
                    {apt.clinic?.name && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M9 8h1M9 12h1M14 8h1M14 12h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/></svg>
                        {apt.clinic.name}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span className={`badge ${cfg.cls}`}>{cfg.icon} {cfg.label}</span>
                {(apt.status === 'pending' || apt.status === 'confirmed') && (
                  <Button
                    variant="danger"
                    isLoading={cancellingId === apt._id}
                    onClick={() => handleCancel(apt._id)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentHistory;
