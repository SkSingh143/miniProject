import React from 'react';
import useFetch from '../../hooks/useFetch';
import { API_ENDPOINTS } from '../../api/endpoints';

const SuperAdminDashboard = () => {
  const { data: stats, loading, error } = useFetch(API_ENDPOINTS.ADMIN.STATS);

  if (loading) return <div className="p-4">Loading system statistics...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Super Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Clinics Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Clinics</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalClinics || 0}</p>
        </div>

        {/* Total Appointments Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Appointments</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalAppointments || 0}</p>
        </div>

        {/* Active Users Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Patients</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.totalPatients || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;