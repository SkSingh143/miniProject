import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';
import { ToastContext } from '../../context/ToastContext';

const WalkInBooking = () => {
  const { addToast } = React.useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '', patientPhone: '', doctorId: '', date: '', timeSlot: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosClient.post(API_ENDPOINTS.APPOINTMENTS.WALK_IN, formData);
      addToast('Walk-in appointment booked successfully', 'success');
      setFormData({ patientName: '', patientPhone: '', doctorId: '', date: '', timeSlot: '' });
    } catch (error) {
      addToast(error.response?.data?.message || 'Booking failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="animate-fade-in-up" style={{
        background: 'white', borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(20,184,166,0.08))',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981, #14b8a6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Walk-In Booking</h1>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>Quick appointment for walk-in patients</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Patient Information</p>
            <InputField label="Patient Name" name="patientName" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} required
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            />
            <InputField label="Phone Number" name="patientPhone" value={formData.patientPhone} onChange={(e) => setFormData({...formData, patientPhone: e.target.value})} required
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>}
            />
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Appointment Details</p>
            <InputField label="Doctor ID" name="doctorId" value={formData.doctorId} onChange={(e) => setFormData({...formData, doctorId: e.target.value})} required />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <InputField label="Date" type="date" name="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
              <InputField label="Time Slot" name="timeSlot" placeholder="e.g. 10:00 AM" value={formData.timeSlot} onChange={(e) => setFormData({...formData, timeSlot: e.target.value})} required />
            </div>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full" style={{ width: '100%' }}>
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default WalkInBooking;