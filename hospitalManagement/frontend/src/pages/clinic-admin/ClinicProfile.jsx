import React, { useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch';
import axiosClient from '../../api/axiosClient';
import { ToastContext } from '../../context/ToastContext';
import Button from '../../components/common/Button';

const ClinicProfile = () => {
  const { addToast } = useContext(ToastContext);
  const { data: clinic, loading, error, refetch } = useFetch('/clinic/profile');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  const startEdit = () => {
    setForm({
      name: clinic.name || '',
      address: clinic.address || '',
      contactInfo: clinic.contactInfo || '',
      workingHours: clinic.workingHours || '09:00-17:00',
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosClient.put('/clinic/profile', form);
      addToast('Clinic profile updated!', 'success');
      setEditing(false);
      refetch();
    } catch (e) {
      addToast(e.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '12px', marginBottom: '12px' }} />)}
    </div>
  );

  if (error) return <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '12px', color: '#991b1b' }}>{error}</div>;

  // Guard against null data after loading
  if (!clinic) return <div style={{ padding: '16px', background: '#fffbeb', borderRadius: '12px', color: '#92400e' }}>No clinic data found. Please ensure your account is linked to a clinic.</div>;

  const fields = editing ? [
    { label: 'Clinic Name', key: 'name', type: 'text' },
    { label: 'Address', key: 'address', type: 'text' },
    { label: 'Contact Info', key: 'contactInfo', type: 'text' },
    { label: 'Working Hours (e.g. 09:00-17:00)', key: 'workingHours', type: 'text' },
  ] : null;

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Clinic Profile</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Manage your clinic's public information</p>
        </div>
        {!editing && <Button onClick={startEdit}>✏️ Edit Profile</Button>}
      </div>

      <div className="animate-fade-in-up stagger-1" style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        {/* Header Banner */}
        <div style={{ padding: '28px 28px 20px', background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(14,165,233,0.06))', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #2563eb, #14b8a6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.5rem', boxShadow: '0 4px 14px rgba(37,99,235,0.3)' }}>
            🏥
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e293b', margin: 0 }}>{clinic.name}</h2>
            <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '4px 0 0' }}>License: {clinic.licenseNo}</p>
          </div>
          <span className={`badge ${clinic.isActive ? 'badge-success' : 'badge-danger'}`} style={{ marginLeft: 'auto' }}>
            {clinic.isActive ? '✅ Active' : '❌ Inactive'}
          </span>
        </div>

        {/* Display / Edit Mode */}
        {!editing ? (
          <div style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {[
              { label: 'Address', value: clinic.address, icon: '📍' },
              { label: 'Contact Info', value: clinic.contactInfo || 'Not set', icon: '📞' },
              { label: 'Working Hours', value: clinic.workingHours || 'Not set', icon: '🕘' },
              { label: 'Admin Email', value: clinic.adminEmail, icon: '📧' },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>{item.icon} {item.label}</p>
                <p style={{ fontWeight: 600, color: '#1e293b', margin: 0, fontSize: '0.9rem' }}>{item.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#3b82f6'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button onClick={handleSave} isLoading={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicProfile;
