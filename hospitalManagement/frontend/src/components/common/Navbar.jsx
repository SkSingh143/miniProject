import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    const labels = {
      super_admin: 'Super Admin',
      clinic_admin: 'Clinic Admin',
      doctor: 'Doctor',
      patient: 'Patient'
    };
    return labels[role] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      super_admin: 'badge-purple',
      clinic_admin: 'badge-info',
      doctor: 'badge-success',
      patient: 'badge-warning'
    };
    return colors[role] || 'badge-info';
  };

  return (
    <>
      <nav style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f766e 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>

            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 15px rgba(20,184,166,0.4)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M2 12h20" />
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                </svg>
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em' }}>
                Medi<span style={{ color: '#5eead4' }}>Care</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="mobile-hide" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {user ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #14b8a6, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '0.9rem',
                      border: '2px solid rgba(255,255,255,0.3)'
                    }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.2 }}>{user.name}</p>
                      <span className={`badge ${getRoleBadgeColor(user.role)}`} style={{ fontSize: '0.65rem', padding: '1px 8px' }}>
                        {getRoleLabel(user.role)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(239,68,68,0.15)', color: '#fca5a5', fontSize: '0.8rem',
                      fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.3)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to="/login" style={{
                    padding: '8px 20px', borderRadius: '8px', textDecoration: 'none',
                    color: 'white', fontSize: '0.85rem', fontWeight: 600,
                    border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s ease'
                  }}>Login</Link>
                  <Link to="/register" style={{
                    padding: '8px 20px', borderRadius: '8px', textDecoration: 'none',
                    background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
                    color: 'white', fontSize: '0.85rem', fontWeight: 600,
                    transition: 'all 0.2s ease', boxShadow: '0 2px 10px rgba(20,184,166,0.3)'
                  }}>Register</Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="desktop-hide"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                {mobileOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                ) : (
                  <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="desktop-hide animate-fade-in-down" style={{
              paddingBottom: '16px', borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px' }}>
                  <div style={{ color: 'white', padding: '8px 0', fontSize: '0.9rem' }}>
                    👋 {user.name} <span className={`badge ${getRoleBadgeColor(user.role)}`} style={{ marginLeft: '8px' }}>{getRoleLabel(user.role)}</span>
                  </div>
                  <button onClick={handleLogout} style={{
                    padding: '10px', borderRadius: '8px', border: 'none',
                    background: 'rgba(239,68,68,0.2)', color: '#fca5a5',
                    cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
                  }}>Logout</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px' }}>
                  <Link to="/login" onClick={() => setMobileOpen(false)} style={{
                    padding: '10px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center',
                    color: 'white', border: '1px solid rgba(255,255,255,0.2)'
                  }}>Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} style={{
                    padding: '10px', borderRadius: '8px', textDecoration: 'none', textAlign: 'center',
                    background: 'linear-gradient(135deg, #14b8a6, #06b6d4)', color: 'white'
                  }}>Register</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <div style={{ height: '64px' }} />
    </>
  );
};

export default Navbar;