import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import axiosClient from '../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import { ToastContext } from '../../context/ToastContext';

const ManageClinics = () => {
  const { data: clinics, loading, refetch } = useFetch(API_ENDPOINTS.ADMIN.CLINICS);
  const { addToast } = React.useContext(ToastContext);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', address: '', licenseNo: '', adminEmail: '', adminPassword: ''
  });

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axiosClient.put(API_ENDPOINTS.ADMIN.CLINIC_STATUS(id), { isActive: !currentStatus });
      addToast('Clinic status updated', 'success');
      refetch();
    } catch (error) {
      addToast('Failed to update status', 'error');
    }
  };

  const handleCreateClinic = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(API_ENDPOINTS.ADMIN.CLINICS, formData);
      addToast('Clinic created successfully', 'success');
      setModalOpen(false);
      setFormData({ name: '', address: '', licenseNo: '', adminEmail: '', adminPassword: '' });
      refetch();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to create clinic', 'error');
    }
  };

  return (
    <div>
      <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Manage Clinics</h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>
            {clinics?.length || 0} clinics registered
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          }
        >
          Add New Clinic
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => (<div key={i} className="skeleton" style={{ height: '90px', borderRadius: '14px' }} />))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {clinics?.map((clinic, idx) => (
            <div key={clinic._id} className={`animate-fade-in-up stagger-${idx + 1}`} style={{
              background: 'white', borderRadius: '14px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
              padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: clinic.isActive ? 'linear-gradient(135deg, #dcfce7, #d1fae5)' : 'linear-gradient(135deg, #fee2e2, #fecaca)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: clinic.isActive ? '#059669' : '#dc2626'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/>
                    <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{clinic.name}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '2px 0' }}>{clinic.address}</p>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>License: {clinic.licenseNo}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className={`badge ${clinic.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {clinic.isActive ? '● Active' : '● Inactive'}
                </span>
                <Button 
                  variant={clinic.isActive ? 'danger' : 'secondary'} 
                  onClick={() => handleToggleStatus(clinic._id, clinic.isActive)}
                >
                  {clinic.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Clinic">
        <form onSubmit={handleCreateClinic}>
          <InputField label="Clinic Name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <InputField label="Address" name="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
          <InputField label="License No" name="licenseNo" value={formData.licenseNo} onChange={(e) => setFormData({...formData, licenseNo: e.target.value})} required />
          <div style={{ marginTop: '16px', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>Clinic Admin Account</div>
          <InputField label="Admin Email" type="email" name="adminEmail" value={formData.adminEmail} onChange={(e) => setFormData({...formData, adminEmail: e.target.value})} required />
          <InputField label="Admin Password" type="password" name="adminPassword" value={formData.adminPassword} onChange={(e) => setFormData({...formData, adminPassword: e.target.value})} required />
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit">Create Clinic</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageClinics;