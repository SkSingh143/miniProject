import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import { API_ENDPOINTS } from '../../api/endpoints';
import Button from '../../components/common/Button';

const PatientHome = () => {
  const { user } = useAuth();
  
  // Fetch upcoming appointments (assuming the endpoint supports a query param like ?status=upcoming)
  const { data: upcomingAppointments, loading } = useFetch(`${API_ENDPOINTS.APPOINTMENTS.HISTORY}?status=upcoming`);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Manage your health, appointments, and prescriptions from your dashboard.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Book Appointment</h3>
          <p className="text-sm text-gray-600 mb-4">Find a doctor and book a slot that works for you.</p>
          <Link to="/patient/book">
            <Button variant="primary" className="w-full">Book Now</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Compare Medicines</h3>
          <p className="text-sm text-gray-600 mb-4">Search for medicines and find the best prices across pharmacies.</p>
          <Link to="/patient/compare-medicine">
            <Button variant="outline" className="w-full">Compare Prices</Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-bold text-gray-800 mb-2">My History</h3>
          <p className="text-sm text-gray-600 mb-4">View past appointments, prescriptions, and medical records.</p>
          <Link to="/patient/history">
            <Button variant="secondary" className="w-full">View History</Button>
          </Link>
        </div>
      </div>

      {/* Upcoming Appointments Widget */}
      <div className="bg-white p-6 rounded shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : upcomingAppointments && upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((apt) => (
              <div key={apt._id} className="flex justify-between items-center p-4 border rounded bg-gray-50">
                <div>
                  <h4 className="font-bold text-blue-700">Dr. {apt.doctorName}</h4>
                  <p className="text-sm text-gray-600">{apt.specialization}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{apt.timeSlot}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">You have no upcoming appointments.</p>
        )}
      </div>
    </div>
  );
};

export default PatientHome;