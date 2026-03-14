import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ToastContext } from "../../context/ToastContext";
import InputField from "../../components/forms/InputField";
import Button from "../../components/common/Button";

const roles = [
  {
    key: 'super_admin',
    label: 'Super Admin',
    emoji: '🛡️',
    color: '#8b5cf6',
    light: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.4)',
  },
  {
    key: 'clinic_admin',
    label: 'Clinic Admin',
    emoji: '🏥',
    color: '#3b82f6',
    light: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.4)',
  },
  {
    key: 'doctor',
    label: 'Doctor',
    emoji: '👨‍⚕️',
    color: '#0f766e',
    light: 'rgba(15,118,110,0.12)',
    border: 'rgba(15,118,110,0.4)',
  },
  {
    key: 'patient',
    label: 'Patient',
    emoji: '🙋',
    color: '#f59e0b',
    light: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.4)',
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const ROLE_DASHBOARD = {
    super_admin:  '/admin/dashboard',
    clinic_admin: '/clinic_admin/dashboard',
    doctor:       '/doctor/dashboard',
    patient:      '/patient/home',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(formData.email, formData.password);
    setIsLoading(false);

    if (result.success) {
      // Validate that logged-in role matches selected role
      if (result.data.role !== selectedRole) {
        addToast(`This account is not a ${roles.find(r => r.key === selectedRole)?.label}. Redirecting...`, "warning");
      } else {
        addToast("Login successful!", "success");
      }
      navigate(ROLE_DASHBOARD[result.data.role] || '/patient/home');
    } else {
      addToast(result.message, "error");
    }
  };

  const activeRole = roles.find(r => r.key === selectedRole);

  return (
    <div className="animate-fade-in-up">
      {/* Logo & Title */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(20,184,166,0.4)', marginBottom: '16px'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20"/><rect x="5" y="5" width="14" height="14" rx="2"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.02em' }}>
          Welcome Back
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '6px', fontSize: '0.9rem' }}>
          Sign in to your MediCare account
        </p>
      </div>

      {/* Login Card */}
      <div className="glass" style={{
        padding: '28px', borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>

        {/* Role Selector */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Login as
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {roles.map((role) => {
              const isActive = selectedRole === role.key;
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => setSelectedRole(role.key)}
                  style={{
                    padding: '10px 6px',
                    borderRadius: '10px',
                    border: `2px solid ${isActive ? role.border : '#e2e8f0'}`,
                    background: isActive ? role.light : 'white',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '4px',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                    boxShadow: isActive ? `0 2px 12px ${role.light}` : 'none'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = role.border; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{role.emoji}</span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    color: isActive ? role.color : '#94a3b8',
                    lineHeight: 1.2, textAlign: 'center'
                  }}>
                    {role.label}
                  </span>
                  {isActive && (
                    <div style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: role.color
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected role banner */}
          <div style={{
            marginTop: '10px', padding: '8px 12px', borderRadius: '8px',
            background: activeRole.light, border: `1px solid ${activeRole.border}`,
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <span style={{ fontSize: '1rem' }}>{activeRole.emoji}</span>
            <span style={{ fontSize: '0.8rem', color: activeRole.color, fontWeight: 600 }}>
              Logging in as <strong>{activeRole.label}</strong>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <InputField
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/>
              </svg>
            }
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            }
          />

          <div style={{ marginTop: '8px' }}>
            <Button type="submit" isLoading={isLoading} className="w-full" style={{ width: '100%' }}>
              {isLoading ? 'Signing in...' : `Sign In as ${activeRole.label}`}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500 }}>Or</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link
            to="/register"
            style={{
              color: '#0f766e', fontWeight: 600, fontSize: '0.9rem',
              textDecoration: 'none', transition: 'color 0.2s ease'
            }}
          >
            Create a new Patient account →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
