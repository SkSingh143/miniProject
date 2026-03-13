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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient', // Default to patient
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

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    if (result.success) {
      addToast('Registration successful! Please login.', 'success');
      navigate('/login');
    } else {
      addToast(result.message, 'error');
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Create a new account
      </h2>
      <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <InputField
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <InputField
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Already have an account? Sign In
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;