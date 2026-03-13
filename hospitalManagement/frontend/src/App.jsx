import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import { ROLES } from './utils/roleHelpers';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Super Admin Pages
import SuperAdminDashboard from './pages/super-admin/Dashboard';
import ManageClinics from './pages/super-admin/ManageClinics';

// Clinic Admin Pages
import ClinicDashboard from './pages/clinic-admin/ClinicDashboard';
import ManageDoctors from './pages/clinic-admin/ManageDoctors';
import WalkInBooking from './pages/clinic-admin/WalkInBooking';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import MyAppointments from './pages/doctor/MyAppointments';
import CreatePrescription from './pages/doctor/CreatePrescription';

// Patient Pages
import BookAppointment from './pages/patient/BookAppointment';
import CompareMedicine from './pages/patient/CompareMedicine';
import PatientHome from './pages/patient/Home';
// 1. Private Route Wrapper
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Or a spinner component

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their specific dashboard if they try to access unauthorized pages
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<DashboardLayout />}>
        
        {/* Super Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <SuperAdminDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/clinics" 
          element={
            <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <ManageClinics />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/admin/stats" 
          element={
            <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
              <SuperAdminDashboard /> 
            </PrivateRoute>
          } 
        />

        {/* Clinic Admin Routes */}
        <Route 
          path="/clinic_admin/dashboard" 
          element={
            <PrivateRoute allowedRoles={[ROLES.CLINIC_ADMIN]}>
              <ClinicDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/clinic_admin/doctors" 
          element={
            <PrivateRoute allowedRoles={[ROLES.CLINIC_ADMIN]}>
              <ManageDoctors />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/clinic_admin/book-walk-in" 
          element={
            <PrivateRoute allowedRoles={[ROLES.CLINIC_ADMIN]}>
              <WalkInBooking />
            </PrivateRoute>
          } 
        />

        {/* Doctor Routes */}
        <Route 
          path="/doctor/dashboard" 
          element={
            <PrivateRoute allowedRoles={[ROLES.DOCTOR]}>
              <DoctorDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/doctor/schedule" 
          element={
            <PrivateRoute allowedRoles={[ROLES.DOCTOR]}>
              <DoctorSchedule />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/doctor/appointments" 
          element={
            <PrivateRoute allowedRoles={[ROLES.DOCTOR]}>
              <MyAppointments />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/doctor/prescription" 
          element={
            <PrivateRoute allowedRoles={[ROLES.DOCTOR]}>
              <CreatePrescription />
            </PrivateRoute>
          } 
        />

        {/* Patient Routes */}
        <Route 
          path="/patient/book" 
          element={
            <PrivateRoute allowedRoles={[ROLES.PATIENT]}>
              <BookAppointment />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/patient/compare-medicine" 
          element={
            <PrivateRoute allowedRoles={[ROLES.PATIENT]}>
              <CompareMedicine />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/patient/dashboard" 
          element={
            <PrivateRoute allowedRoles={[ROLES.PATIENT]}>
              <PatientHome />
            </PrivateRoute>
          } 
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Route>
    </Routes>
  );
};

export default App;