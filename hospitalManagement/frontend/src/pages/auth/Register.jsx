import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import InputField from '../../components/forms/InputField';
import Button from '../../components/common/Button';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });
    setIsLoading(false);

    if (result.success) {
      addToast('Registration successful! Please login.', 'success');
      navigate('/login');
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Logo & Title */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'linear-gradient(135deg, #14b8a6, #06b6d4)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(20,184,166,0.4)', marginBottom: '16px'
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', margin: 0, letterSpacing: '-0.02em' }}>
          Create Account
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '6px', fontSize: '0.9rem' }}>
          Join MediCare as a patient
        </p>
      </div>

      {/* Register Card */}
      <div className="glass" style={{
        padding: '32px', borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <InputField
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            }
          />

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
            placeholder="Min 6 characters"
            required
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            }
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            required
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            }
          />

          <div style={{ marginTop: '8px' }}>
            <Button type="submit" isLoading={isLoading} className="w-full" style={{ width: '100%' }}>
              {isLoading ? 'Creating account...' : 'Register'}
            </Button>
          </div>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link
            to="/login"
            style={{ color: '#0f766e', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}
          >
            Already have an account? Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;