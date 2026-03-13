import React, { useState, useContext } from "react";

import { useNavigate, Link } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";

import { ToastContext } from "../../context/ToastContext";

import InputField from "../../components/forms/InputField";

import Button from "../../components/common/Button";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const { addToast } = useContext(ToastContext);

  const [formData, setFormData] = useState({
    email: "",

    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData.email, formData.password);


    if (result.success) {
      addToast("Login successful!", "success");

      // Redirect based on role logic usually handled in a PrivateRoute or here

      // For now, we redirect to a dashboard landing, router will handle specifics

      navigate(`/${result.data.role}/dashboard`);
    } else {
      addToast(result.message, "error");
    }
  };

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>

      <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit}>
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

          <div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create a new Patient account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
