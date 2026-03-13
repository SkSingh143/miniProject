import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;