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
import SystemStats from './pages/super-admin/SystemStats';

// Clinic Admin Pages
import ClinicDashboard from './pages/clinic-admin/ClinicDashboard';
import ManageDoctors from './pages/clinic-admin/ManageDoctors';
import WalkInBooking from './pages/clinic-admin/WalkInBooking';
import ClinicProfile from './pages/clinic-admin/ClinicProfile';
import ClinicAppointments from './pages/clinic-admin/ClinicAppointments';
import ClinicPatientHistory from './pages/clinic-admin/ClinicPatientHistory';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import MyAppointments from './pages/doctor/MyAppointments';
import CreatePrescription from './pages/doctor/CreatePrescription';
import PatientDetails from './pages/doctor/PatientDetails';

// Patient Pages
import BookAppointment from './pages/patient/BookAppointment';

import PatientHome from './pages/patient/Home';
import SelectClinic from './pages/patient/SelectClinic';
import AppointmentHistory from './pages/patient/AppointmentHistory';
import PrescriptionHistory from './pages/patient/PrescriptionHistory';

// Landing Page
import LandingPage from './pages/LandingPage';
// Role-to-home path map (shared between PrivateRoute and Login)
const ROLE_HOME = {
  super_admin:  '/admin/dashboard',
  clinic_admin: '/clinic_admin/dashboard',
  doctor:       '/doctor/dashboard',
  patient:      '/patient/home',
};

// 1. Private Route Wrapper
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #e2e8f0', borderTopColor: '#14b8a6', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    return <Navigate to={ROLE_HOME[user.role] || '/login'} replace />;
  }

  return children;
};

// 404 Page
const NotFound = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: '#f1f5f9', gap: '16px' }}>
    <div style={{ fontSize: '5rem' }}>🏥</div>
    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>404 — Page Not Found</h1>
    <p style={{ color: '#64748b', margin: 0 }}>The page you're looking for doesn't exist.</p>
    <a href="/" style={{ padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg,#14b8a6,#06b6d4)', color: 'white', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>Go Home</a>
  </div>
);

const App = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

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
              <SystemStats /> 
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
        <Route
          path="/clinic-admin/profile"
          element={
            <PrivateRoute allowedRoles={[ROLES.CLINIC_ADMIN]}>
              <ClinicProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/clinic-admin/appointments"
          element={
            <PrivateRoute allowedRoles={[ROLES.CLINIC_ADMIN]}>
              <ClinicAppointments />
            </PrivateRoute>
          }
        />
        <Route
          path="/clinic-admin/patients/:patientId/history"
          element={
            <PrivateRoute allowedRoles={[ROLES.CLINIC_ADMIN]}>
              <ClinicPatientHistory />
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
        <Route
          path="/doctor/patient/:patientId"
          element={
            <PrivateRoute allowedRoles={[ROLES.DOCTOR]}>
              <PatientDetails />
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
          path="/patient/select-clinic"
          element={
            <PrivateRoute allowedRoles={[ROLES.PATIENT]}>
              <SelectClinic />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <PrivateRoute allowedRoles={[ROLES.PATIENT]}>
              <AppointmentHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/prescriptions"
          element={
            <PrivateRoute allowedRoles={[ROLES.PATIENT]}>
              <PrescriptionHistory />
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
        <Route 
          path="/patient/home" 
          element={
            <PrivateRoute allowedRoles={[ROLES.PATIENT]}>
              <PatientHome />
            </PrivateRoute>
          } 
        />

        {/* Default Redirects */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;