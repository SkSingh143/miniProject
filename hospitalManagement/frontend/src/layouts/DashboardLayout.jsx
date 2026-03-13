import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Define navigation based on roles
  const roleNavItems = {
    super_admin: [
      { name: 'Dashboard', path: '/admin/dashboard' },
      { name: 'Manage Clinics', path: '/admin/clinics' },
      { name: 'System Stats', path: '/admin/stats' },
    ],
    clinic_admin: [
      { name: 'Dashboard', path: '/clinic_admin/dashboard' },
      { name: 'Doctors', path: '/clinic_admin/doctors' },
      { name: 'Walk-In Booking', path: '/clinic_admin/book-walk-in' },
      { name: 'Patient History', path: '/clinic_admin/patients' },
    ],
    doctor: [
      { name: 'Dashboard', path: '/doctor/dashboard' },
      { name: 'My Schedule', path: '/doctor/schedule' },
      { name: 'Appointments', path: '/doctor/appointments' },
      { name: 'Create Prescription', path: '/doctor/prescription' },
    ],
    patient: [
      { name: 'Home', path: '/patient/dashboard' },
      { name: 'Book Appointment', path: '/patient/book' },
      { name: 'My History', path: '/patient/history' },
      { name: 'Compare Prices', path: '/patient/compare-medicine' },
    ],
  };

  const navItems = user ? roleNavItems[user.role] || [] : [];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Reusing the Navbar from Phase 2 */}
      <Navbar user={user} logout={logout} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 hidden md:block`}
        >
          <div className="p-4">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="mb-6 text-gray-500 hover:text-blue-600 focus:outline-none"
             >
               {isSidebarOpen ? '<< Collapse' : '>>'}
             </button>
            
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 rounded-md transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {isSidebarOpen ? item.name : item.name.charAt(0)}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;