import React, { useState } from 'react';
import signup from '../assets/signup.jpg';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { login } from '../services/auth';
import { useDispatch } from 'react-redux';
import { login as sliceLogin } from '../redux/slices/authSlice';
import Toast from './layout/Toast'; // import the Toast component

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const token = useParams().token;
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const onSubmit = async (data) => {
    setLoader(true);
    try {
        const resetData = {
            password:data.password,
            token:token
        }
        const res = await axios.post("/resetpassword", resetData);
        if (res.status === 200) {
            setLoader(false);
            // Show toast instead of alert
            setToast({ show: true, message: 'Your Password has been updated succesfully!!' });
            // Optionally auto-close the toast after a delay and navigate
            setTimeout(() => {
            setToast({ show: false, message: '' });
            navigate('/login');
            }, 3000);
        }
    } catch (error) {
      console.error("Reset Password error:", error);
      setError(error);
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      {/* Toast Positioning */}
      <div className="fixed top-5 right-5 z-50">
        <Toast
          show={toast.show}
          message={toast.message}
          onUndo={() => {
            // You can add any undo functionality here
          }}
          onClose={() => setToast({ show: false, message: '' })}
        />
      </div>

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
          <h2 className="text-4xl font-bold text-indigo-600 mb-8 text-center">Reset Password</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Password Field */}
            <div>
              <label className="block text-gray-700 mb-2">Enter New Password</label>
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
              {loader ? 'Updating Pwd...' : 'Reset Password'}
            </button>
            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center mt-2">{error.message}</div>
            )}
          </form>
          <br />
         
        </div>

      
      </div>
    </div>
  );
};

export default ResetPassword;
