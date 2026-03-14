import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const PublicLayout = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="gradient-bg-animated" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '40px 16px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative floating orbs */}
        <div style={{
          position: 'absolute', width: '400px', height: '400px',
          borderRadius: '50%', background: 'rgba(20,184,166,0.08)',
          top: '-100px', right: '-100px', filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: '300px', height: '300px',
          borderRadius: '50%', background: 'rgba(99,102,241,0.08)',
          bottom: '-50px', left: '-50px', filter: 'blur(50px)',
          animation: 'float 8s ease-in-out infinite', animationDelay: '2s'
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '480px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;