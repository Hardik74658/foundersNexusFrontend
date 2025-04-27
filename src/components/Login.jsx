import React, { useState } from 'react';
import signup from '../assets/signup.jpg';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { useDispatch } from 'react-redux';
import { login as sliceLogin } from '../redux/slices/authSlice';
import Toast from './layout/Toast.jsx';
import Loader from './layout/Loader.jsx';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  
  const onSubmit = async (data) => {
    setLoader(true);
    setError(''); // Clear previous errors
    try {
      console.log(data);
      
      const res = await login(data);
      if (res?.status === 200) {
        localStorage.setItem('userId', res.data.user._id);
        localStorage.setItem('role', res.data.user.role.name);
        dispatch(sliceLogin(res.data));
        setLoader(false);
        setToastMessage('Login successful!');
        navigate('/landing_page');
      } else {
        throw new Error(res?.data?.detail || 'Unexpected error occurred');
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.detail || error.message || 'Network error');
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {loader && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/30 z-50">
          <Loader />
        </div>
      )}
      {toastMessage && (
        <Toast
          message={toastMessage}
          show={true}
          onClose={() => setToastMessage(null)}
        />
      )}
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl w-full">
        {/* Left Side: Image with overlay text */}
        <div className="relative md:w-1/2 h-80 md:h-auto">
          <img
            src={signup}
            alt="Signup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-2">Achieve Your Dream</h1>
            <p className="text-white text-lg md:text-xl">Where startups meet investors</p>
          </div>
        </div>
        {/* Right Side: Form */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-indigo-600 mb-8 text-center">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="example@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full border border-gray-300 rounded-full py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Password Field */}
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="w-full border border-gray-300 rounded-full py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors"
            >
              {loader ? 'Logging In...' : 'Login'}
            </button>
            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}
          </form>
          <br />
          <Link to={"/forgotpwd"} className="text-blue-500 text-center cursor-pointer">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
