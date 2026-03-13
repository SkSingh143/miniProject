import React, { useState, useContext } from 'react';
import useFetch from '../../hooks/useFetch';
import axiosClient from '../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints';
import DoctorCard from '../../components/cards/DoctorCard';
import Button from '../../components/common/Button';
import { ToastContext } from '../../context/ToastContext';

const BookAppointment = () => {
  const { addToast } = useContext(ToastContext);
  
  // Step 1: Fetch Clinics (Assuming we have an endpoint for patients to list clinics)
  // For simplicity in this generated code, we'll fetch doctors directly or assume a clinic is selected.
  // Let's implement fetching all doctors for now.
  const { data: doctors, loading: doctorsLoading } = useFetch(API_ENDPOINTS.CLINIC.DOCTORS); 

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  const fetchSlots = async (doctorId, date) => {
    if (!date) return;
    try {
      // NOTE: endpoint requires clinicId, doctorId, date. 
      // Assuming doctor object has clinicId.
      const response = await axiosClient.get(`${API_ENDPOINTS.APPOINTMENTS.SLOTS}?clinicId=${selectedDoctor.clinicId}&doctorId=${doctorId}&date=${date}`);
      setAvailableSlots(response.data.slots);
    } catch (error) {
      console.error("Error fetching slots", error);
      setAvailableSlots([]);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (selectedDoctor) {
      fetchSlots(selectedDoctor._id, date);
    }
  };

  const handleBook = async () => {
    try {
      await axiosClient.post(API_ENDPOINTS.APPOINTMENTS.BOOK, {
        clinicId: selectedDoctor.clinicId,
        doctorId: selectedDoctor._id,
        date: selectedDate,
        timeSlot: selectedSlot
      });
      addToast('Appointment booked successfully!', 'success');
      // Reset state
      setSelectedDoctor(null);
      setSelectedDate('');
      setAvailableSlots([]);
    } catch (error) {
      addToast(error.response?.data?.message || 'Booking failed', 'error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>

      {/* Step 1: Select Doctor */}
      {!selectedDoctor && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select a Doctor</h2>
          {doctorsLoading ? <p>Loading doctors...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors?.map((doc) => (
                <DoctorCard 
                  key={doc._id} 
                  doctor={doc} 
                  actionLabel="Select Date"
                  onAction={() => setSelectedDoctor(doc)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select Date & Slot */}
      {selectedDoctor && (
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold">Booking with {selectedDoctor.name}</h2>
              <p className="text-gray-600">{selectedDoctor.specialization}</p>
            </div>
            <Button variant="secondary" onClick={() => setSelectedDoctor(null)}>Change Doctor</Button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input 
              type="date" 
              className="border p-2 rounded w-full md:w-1/3"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {selectedDate && (
            <div>
               <h3 className="font-medium mb-3">Available Time Slots</h3>
               {availableSlots.length > 0 ? (
                 <div className="grid grid-cols-3 gap-3">
                   {availableSlots.map((slot) => (
                     <button
                       key={slot}
                       onClick={() => setSelectedSlot(slot)}
                       className={`p-2 border rounded text-center transition-colors ${
                         selectedSlot === slot 
                           ? 'bg-blue-600 text-white border-blue-600' 
                           : 'hover:bg-blue-50 border-gray-300'
                       }`}
                     >
                       {slot}
                     </button>
                   ))}
                 </div>
               ) : (
                 <p className="text-gray-500">No slots available for this date.</p>
               )}
            </div>
          )}

          <div className="mt-8">
            <Button 
              disabled={!selectedSlot} 
              onClick={handleBook}
              className="w-full md:w-auto"
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;