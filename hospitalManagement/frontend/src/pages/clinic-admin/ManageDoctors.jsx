import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import axiosClient from '../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import DoctorCard from '../../components/cards/DoctorCard';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import InputField from '../../components/forms/InputField';
import { ToastContext } from '../../context/ToastContext';

const ManageDoctors = () => {
  const { data: doctors, loading, refetch } = useFetch(API_ENDPOINTS.CLINIC.DOCTORS);
  const { addToast } = React.useContext(ToastContext);
  const [isModalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    availability: '' // simplified for demo (e.g., "Mon-Fri")
  });

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      // Split availability string into array if backend expects array
      const payload = { ...formData, availability: formData.availability.split(',') };
      
      await axiosClient.post(API_ENDPOINTS.CLINIC.DOCTORS, payload);
      addToast('Doctor added successfully', 'success');
      setModalOpen(false);
      refetch();
    } catch (error) {
      addToast('Failed to add doctor', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Doctors</h1>
        <Button onClick={() => setModalOpen(true)}>+ Add Doctor</Button>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors?.map((doctor) => (
            <DoctorCard 
              key={doctor._id} 
              doctor={doctor} 
              actionLabel="View Details"
              onAction={() => alert(`View details for ${doctor.name}`)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Add New Doctor">
        <form onSubmit={handleAddDoctor}>
          <InputField label="Name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <InputField label="Email" type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <InputField label="Specialization" name="specialization" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} required />
          <InputField label="Experience (Years)" type="number" name="experience" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} required />
          <InputField label="Availability (comma separated, e.g. Mon,Tue)" name="availability" value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} required />
          
          <div className="mt-4 flex justify-end">
            <Button type="submit">Add Doctor</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageDoctors;