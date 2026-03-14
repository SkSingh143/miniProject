import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import axiosClient from '../../api/axiosClient';
import { ToastContext } from '../../context/ToastContext';
import Button from '../../components/common/Button';

const statusConfig = {
  pending:   { label: 'Pending',   cls: 'badge-warning', icon: '⏳' },
  confirmed: { label: 'Confirmed', cls: 'badge-success', icon: '✅' },
  completed: { label: 'Completed', cls: 'badge-info',    icon: '🏁' },
  cancelled: { label: 'Cancelled', cls: 'badge-danger',  icon: '❌' },
};

const RescheduleModal = ({ appointment, onClose, onSaved }) => {
  const { addToast } = useContext(ToastContext);
  const [date, setDate] = useState(appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '');
  const [timeSlot, setTimeSlot] = useState(appointment.timeSlot || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!date || !timeSlot) { addToast('Please fill date and time slot', 'error'); return; }
    setSaving(true);
    try {
      await axiosClient.put(`/clinic/appointments/${appointment._id}`, { date, timeSlot });
      addToast('Appointment rescheduled!', 'success');
      onSaved();
      onClose();
    } catch (e) {
      addToast(e.response?.data?.message || 'Reschedule failed', 'error');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="animate-scale-in" style={{ background: 'white', borderRadius: '16px', padding: '28px', width: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <h3 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 20px', fontSize: '1.1rem' }}>🗓️ Reschedule Appointment</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>New Date</label>
            <input type="date" value={date} min={new Date().toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>New Time Slot</label>
            <input type="time" value={timeSlot} onChange={e => setTimeSlot(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={handleSave} isLoading={saving} style={{ flex: 1 }}>Reschedule</Button>
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

const ClinicAppointments = () => {
  const { addToast } = useContext(ToastContext);
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [refresh, setRefresh] = useState(0);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const url = selectedDate ? `/clinic/appointments?date=${selectedDate}` : '/clinic/appointments';
  const { data: appointments, loading, error } = useFetch(url, [selectedDate, refresh]);

  const filtered = appointments?.filter(a => filter === 'all' ? true : a.status === filter) || [];

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await axiosClient.put(`/clinic/appointments/${id}`, { status });
      addToast(`Appointment ${status}`, 'success');
      setRefresh(r => r + 1);
    } catch (e) {
      addToast(e.response?.data?.message || 'Update failed', 'error');
    } finally { setUpdatingId(null); }
  };

  const filterTabs = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {rescheduleTarget && (
        <RescheduleModal
          appointment={rescheduleTarget}
          onClose={() => setRescheduleTarget(null)}
          onSaved={() => setRefresh(r => r + 1)}
        />
      )}

      <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Appointments</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
            {filtered.length} appointment{filtered.length !== 1 ? 's' : ''} {selectedDate ? `on ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : '(all time)'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            placeholder="Filter by date"
            style={{ padding: '9px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
          {selectedDate && (
            <button onClick={() => setSelectedDate('')}
              style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '0.82rem', color: '#64748b', fontFamily: 'inherit' }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="animate-fade-in-up stagger-1" style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
        {filterTabs.map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            style={{
              padding: '6px 14px', borderRadius: '20px', border: '1.5px solid',
              borderColor: filter === tab ? '#2563eb' : '#e2e8f0',
              background: filter === tab ? '#2563eb' : 'white',
              color: filter === tab ? 'white' : '#64748b',
              fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
              transition: 'all 0.2s', fontFamily: 'inherit', textTransform: 'capitalize'
            }}>
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '90px', borderRadius: '12px' }} />)}
        </div>
      )}

      {error && <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px', color: '#991b1b', border: '1px solid #fecaca', fontSize: '0.9rem' }}>{error}</div>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📋</div>
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No appointments found.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((apt, idx) => {
          const cfg = statusConfig[apt.status] || statusConfig.pending;
          const canAct = !['completed', 'cancelled'].includes(apt.status);
          return (
            <div key={apt._id} className={`animate-fade-in-up stagger-${Math.min(idx + 1, 5)}`} style={{
              background: 'white', borderRadius: '13px', padding: '16px 20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexWrap: 'wrap', gap: '10px', transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
            >
              {/* Patient / Doctor info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                  {(apt.patient?.name || 'P').charAt(0)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h4 style={{ fontWeight: 700, color: '#1e293b', margin: 0, fontSize: '0.92rem' }}>{apt.patient?.name}</h4>
                    <span className={`badge ${cfg.cls}`} style={{ fontSize: '0.68rem' }}>{cfg.icon} {cfg.label}</span>
                  </div>
                  <p style={{ fontSize: '0.77rem', color: '#64748b', margin: '3px 0 0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span>👨‍⚕️ Dr. {apt.doctor?.name}</span>
                    <span>📅 {new Date(apt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span>🕐 {apt.timeSlot}</span>
                    <span style={{ textTransform: 'capitalize' }}>🏠 {apt.type}</span>
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {apt.patient?._id && (
                  <Link to={`/clinic-admin/patients/${apt.patient._id}/history`}>
                    <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', color: '#475569', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.color = '#8b5cf6'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}>
                      History
                    </button>
                  </Link>
                )}
                {canAct && (
                  <>
                    {apt.status !== 'confirmed' && (
                      <button onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                        disabled={updatingId === apt._id}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(5,150,105,0.25)', opacity: updatingId === apt._id ? 0.6 : 1 }}>
                        ✅ Confirm
                      </button>
                    )}
                    <button onClick={() => setRescheduleTarget(apt)}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(37,99,235,0.25)' }}>
                      🗓️ Reschedule
                    </button>
                    <button onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                      disabled={updatingId === apt._id}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #dc2626, #ef4444)', color: 'white', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(220,38,38,0.25)', opacity: updatingId === apt._id ? 0.6 : 1 }}>
                      ❌ Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClinicAppointments;
