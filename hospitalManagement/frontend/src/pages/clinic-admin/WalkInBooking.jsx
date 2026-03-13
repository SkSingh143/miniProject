import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';
import { ToastContext } from '../../context/ToastContext';

const WalkInBooking = () => {
  const { addToast } = React.useContext(ToastContext);
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    doctorId: '',
    date: '',
    timeSlot: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post(API_ENDPOINTS.APPOINTMENTS.WALK_IN, formData);
      addToast('Walk-in appointment booked successfully', 'success');
      setFormData({ patientName: '', patientPhone: '', doctorId: '', date: '', timeSlot: '' });
    } catch (error) {
      addToast(error.response?.data?.message || 'Booking failed', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Book Walk-In Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Patient Name" name="patientName" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} required />
        <InputField label="Phone Number" name="patientPhone" value={formData.patientPhone} onChange={(e) => setFormData({...formData, patientPhone: e.target.value})} required />
        
        {/* In a real app, Doctor ID would be a select dropdown fetched from API */}
        <InputField label="Doctor ID" name="doctorId" value={formData.doctorId} onChange={(e) => setFormData({...formData, doctorId: e.target.value})} required />
        
        <div className="grid grid-cols-2 gap-4">
            <InputField label="Date" type="date" name="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            <InputField label="Time Slot (e.g. 10:00 AM)" name="timeSlot" value={formData.timeSlot} onChange={(e) => setFormData({...formData, timeSlot: e.target.value})} required />
        </div>

        <Button type="submit" className="w-full">Confirm Booking</Button>
      </form>
    </div>
  );
};

export default WalkInBooking;