import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch';
import { API_ENDPOINTS } from '../../api/endpoints';
import Button from '../../components/common/Button';

const MyAppointments = () => {
  // Defaults to today's date
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // Fetch appointments for the selected date
  const { data: appointments, loading, error } = useFetch(
    `${API_ENDPOINTS.DOCTOR.APPOINTMENTS}?date=${selectedDate}`
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {loading && <p>Loading schedule...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && appointments?.length === 0 && (
        <p className="text-gray-500">No appointments found for this date.</p>
      )}

      <div className="space-y-4">
        {appointments?.map((apt) => (
          <div key={apt._id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500 flex justify-between items-center">
            <div>
              <p className="font-bold text-lg">{apt.patientName}</p>
              <p className="text-sm text-gray-600">Time: {apt.timeSlot}</p>
              <p className="text-sm text-gray-500">Status: {apt.status}</p>
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => window.location.href=`/doctor/patient/${apt.patientId}`}>
                View Patient
              </Button>
              <Button onClick={() => window.location.href=`/doctor/prescription?aptId=${apt._id}&patientId=${apt.patientId}`}>
                Prescribe
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;