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
    name: '',
    address: '',
    licenseNo: '',
    adminEmail: '',
    adminPassword: ''
  });

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axiosClient.put(API_ENDPOINTS.ADMIN.CLINIC_STATUS(id), { 
        isActive: !currentStatus 
      });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Clinics</h1>
        <Button onClick={() => setModalOpen(true)}>+ Add New Clinic</Button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {clinics?.map((clinic) => (
              <li key={clinic._id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{clinic.name}</h3>
                  <p className="text-sm text-gray-500">{clinic.address}</p>
                  <p className="text-xs text-gray-400">License: {clinic.licenseNo}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${clinic.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {clinic.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <Button 
                    variant={clinic.isActive ? 'danger' : 'secondary'} 
                    onClick={() => handleToggleStatus(clinic._id, clinic.isActive)}
                    className="text-xs"
                  >
                    {clinic.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Clinic">
        <form onSubmit={handleCreateClinic}>
          <InputField label="Clinic Name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <InputField label="Address" name="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
          <InputField label="License No" name="licenseNo" value={formData.licenseNo} onChange={(e) => setFormData({...formData, licenseNo: e.target.value})} required />
          <h4 className="font-medium mt-4 mb-2">Clinic Admin Account</h4>
          <InputField label="Admin Email" type="email" name="adminEmail" value={formData.adminEmail} onChange={(e) => setFormData({...formData, adminEmail: e.target.value})} required />
          <InputField label="Admin Password" type="password" name="adminPassword" value={formData.adminPassword} onChange={(e) => setFormData({...formData, adminPassword: e.target.value})} required />
          <div className="mt-4 flex justify-end">
            <Button type="submit">Create Clinic</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageClinics;