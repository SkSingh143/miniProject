import React from 'react';
import useAuth from '../../hooks/useAuth';

const ClinicDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clinic Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold">Welcome, {user?.name}</h2>
        <p className="text-gray-600">Manage your doctors, appointments, and patients here.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="font-bold text-blue-800">Quick Actions</h3>
          <ul className="mt-2 space-y-2 list-disc list-inside text-blue-700">
            <li>Register a new Doctor</li>
            <li>Book a Walk-in Appointment</li>
            <li>View Today's Schedule</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClinicDashboard;