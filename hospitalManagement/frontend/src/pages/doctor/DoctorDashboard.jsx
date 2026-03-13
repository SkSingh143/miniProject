import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import { API_ENDPOINTS } from '../../api/endpoints';
import Button from '../../components/common/Button';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  // Fetch today's appointments
  const { data: appointments, loading } = useFetch(
    `${API_ENDPOINTS.DOCTOR.APPOINTMENTS}?date=${today}`
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, Dr. {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Here's an overview of your day.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-2">My Appointments</h3>
          <p className="text-sm text-gray-600 mb-4">View and manage your patient appointments.</p>
          <Link to="/doctor/appointments">
            <Button variant="primary" className="w-full">View Appointments</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Create Prescription</h3>
          <p className="text-sm text-gray-600 mb-4">Write and send prescriptions for your patients.</p>
          <Link to="/doctor/prescription">
            <Button variant="outline" className="w-full">New Prescription</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-2">My Schedule</h3>
          <p className="text-sm text-gray-600 mb-4">Manage your weekly availability and working hours.</p>
          <Link to="/doctor/schedule">
            <Button variant="secondary" className="w-full">Manage Schedule</Button>
          </Link>
        </div>
      </div>

      {/* Today's Appointments Widget */}
      <div className="bg-white p-6 rounded shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Appointments</h2>

        {loading ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : appointments && appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id} className="flex justify-between items-center p-4 border rounded bg-gray-50">
                <div>
                  <h4 className="font-bold text-blue-700">{apt.patientName}</h4>
                  <p className="text-sm text-gray-600">Time: {apt.timeSlot}</p>
                  <p className="text-sm text-gray-500">Status: {apt.status}</p>
                </div>
                <div className="space-x-2">
                  <Link to={`/doctor/prescription?aptId=${apt._id}&patientId=${apt.patientId}`}>
                    <Button variant="primary">Prescribe</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No appointments scheduled for today.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
