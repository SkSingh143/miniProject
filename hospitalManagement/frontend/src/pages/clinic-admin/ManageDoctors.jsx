import React, { useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch';
import axiosClient from '../../api/axiosClient';
import { ToastContext } from '../../context/ToastContext';
import Button from '../../components/common/Button';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AvailabilityEditor = ({ profile, onClose, onSaved }) => {
  const { addToast } = useContext(ToastContext);
  const [saving, setSaving] = useState(false);
  const [slots, setSlots] = useState(() => {
    const existing = profile.availability || [];
    return DAYS.map(day => {
      const found = existing.find(e => e.day === day);
      return { day, startTime: found?.startTime || '09:00', endTime: found?.endTime || '17:00', active: !!found };
    });
  });

  const toggleDay = (idx) => setSlots(s => s.map((d, i) => i === idx ? { ...d, active: !d.active } : d));
  const setTime = (idx, field, val) => setSlots(s => s.map((d, i) => i === idx ? { ...d, [field]: val } : d));

  const handleSave = async () => {
    const availability = slots.filter(s => s.active).map(({ day, startTime, endTime }) => ({ day, startTime, endTime }));
    setSaving(true);
    try {
      await axiosClient.put(`/clinic/doctors/${profile._id}/availability`, { availability });
      addToast('Availability updated!', 'success');
      onSaved();
      onClose();
    } catch (e) {
      addToast(e.response?.data?.message || 'Update failed', 'error');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="animate-scale-in" style={{ background: 'white', borderRadius: '16px', padding: '28px', width: '480px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.22)', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 6px', fontSize: '1.1rem' }}>🗓️ Set Availability</h3>
        <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '0 0 20px' }}>Dr. {profile.user?.name}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {slots.map((slot, idx) => (
            <div key={slot.day} style={{
              padding: '10px 14px', borderRadius: '10px',
              background: slot.active ? 'linear-gradient(135deg, rgba(15,118,110,0.06), rgba(20,184,166,0.06))' : '#f8fafc',
              border: `1.5px solid ${slot.active ? '#99f6e4' : '#e2e8f0'}`,
              display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', transition: 'all 0.2s'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: '100px' }}>
                <div onClick={() => toggleDay(idx)} style={{
                  width: '36px', height: '20px', borderRadius: '10px',
                  background: slot.active ? 'linear-gradient(135deg, #0f766e, #14b8a6)' : '#cbd5e1',
                  position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0
                }}>
                  <div style={{
                    position: 'absolute', width: '16px', height: '16px', borderRadius: '50%', background: 'white',
                    top: '2px', left: slot.active ? '18px' : '2px', transition: 'left 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: slot.active ? '#0f766e' : '#94a3b8' }}>{slot.day}</span>
              </label>
              {slot.active && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                  <input type="time" value={slot.startTime} onChange={e => setTime(idx, 'startTime', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#0f766e'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>to</span>
                  <input type="time" value={slot.endTime} onChange={e => setTime(idx, 'endTime', e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#0f766e'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button onClick={handleSave} isLoading={saving} style={{ flex: 1 }}>Save Availability</Button>
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

const ManageDoctors = () => {
  const [refresh, setRefresh] = useState(0);
  const [editProfile, setEditProfile] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { addToast } = useContext(ToastContext);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', specialization: '', experience: '' });

  const { data: doctors, loading, error } = useFetch('/clinic/doctors', [refresh]);

  const handleAdd = async e => {
    e.preventDefault();
    setAdding(true);
    try {
      await axiosClient.post('/clinic/doctors', { ...form, experience: Number(form.experience) });
      addToast('Doctor added!', 'success');
      setShowAddForm(false);
      setForm({ name: '', email: '', password: '', specialization: '', experience: '' });
      setRefresh(r => r + 1);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add doctor', 'error');
    } finally { setAdding(false); }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {editProfile && (
        <AvailabilityEditor
          profile={editProfile}
          onClose={() => setEditProfile(null)}
          onSaved={() => setRefresh(r => r + 1)}
        />
      )}

      <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Manage Doctors</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>{doctors?.length || 0} doctors registered</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '✕ Cancel' : '+ Add Doctor'}
        </Button>
      </div>

      {/* Add Doctor Form */}
      {showAddForm && (
        <div className="animate-fade-in-up" style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
          <h3 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 16px', fontSize: '1rem' }}>➕ New Doctor</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Dr. John Smith' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'doctor@clinic.com' },
                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
                { label: 'Specialization', key: 'specialization', type: 'text', placeholder: 'Cardiology' },
                { label: 'Experience (years)', key: 'experience', type: 'number', placeholder: '5' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
                  <input required type={f.type} placeholder={f.placeholder} value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.88rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                </div>
              ))}
            </div>
            <Button type="submit" isLoading={adding}>{adding ? 'Adding...' : 'Add Doctor'}</Button>
          </form>
        </div>
      )}

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '160px', borderRadius: '14px' }} />)}
        </div>
      )}

      {error && <div style={{ padding: '14px', background: '#fef2f2', borderRadius: '10px', color: '#991b1b', border: '1px solid #fecaca', fontSize: '0.9rem' }}>{error}</div>}

      {!loading && doctors?.length === 0 && !showAddForm && (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>👨‍⚕️</div>
          <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No doctors registered yet. Add your first doctor!</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
        {doctors?.map((profile, idx) => (
          <div key={profile._id} className={`animate-fade-in-up stagger-${Math.min(idx + 1, 6)}`} style={{
            background: 'white', borderRadius: '14px', padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', transition: 'all 0.25s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}
          >
            {/* Accent strip */}
            <div style={{ height: '4px', borderRadius: '4px', background: 'linear-gradient(90deg, #2563eb, #14b8a6)', marginBottom: '16px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: 700, fontSize: '1.1rem' }}>
                {(profile.user?.name || 'D').charAt(0)}
              </div>
              <div>
                <h4 style={{ fontWeight: 700, color: '#1e293b', margin: 0, fontSize: '0.95rem' }}>Dr. {profile.user?.name}</h4>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '20px' }}>
                  {profile.specialization}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 10px' }}>
              🎓 {profile.experience} year{profile.experience !== 1 ? 's' : ''} experience
            </p>

            {/* Availability summary */}
            <div style={{ marginBottom: '14px' }}>
              {profile.availability?.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {profile.availability.map(slot => (
                    <span key={slot.day} style={{ padding: '2px 7px', borderRadius: '6px', background: '#f0fdfa', border: '1px solid #99f6e4', fontSize: '0.68rem', fontWeight: 600, color: '#0f766e' }}>
                      {slot.day.slice(0,3)} {slot.startTime}–{slot.endTime}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontStyle: 'italic', margin: 0 }}>No schedule set</p>
              )}
            </div>

            <button onClick={() => setEditProfile(profile)}
              style={{ width: '100%', padding: '9px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', color: 'white', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(37,99,235,0.25)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.25)'; }}>
              🗓️ Set Availability
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDoctors;