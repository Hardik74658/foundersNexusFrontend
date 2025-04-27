import React, { useState } from 'react';
import signup from '../assets/signup.jpg';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { useDispatch } from 'react-redux';
import { login as sliceLogin } from '../redux/slices/authSlice';

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
        alert('Login successful!');
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-purple-100 to-blue-100 relative overflow-hidden p-6">
      {/* Animated SVG Backgrounds */}
      <svg className="absolute top-0 left-0 w-80 h-80 opacity-30 animate-spin-slow pointer-events-none" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="#fbbf24" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-96 h-96 opacity-20 animate-pulse pointer-events-none" viewBox="0 0 200 200">
        <rect x="20" y="20" width="160" height="160" rx="40" fill="#a78bfa" />
      </svg>
      <svg className="absolute top-1/2 left-1/2 w-72 h-72 opacity-10 -translate-x-1/2 -translate-y-1/2 animate-bounce-slow pointer-events-none" viewBox="0 0 200 200">
        <ellipse cx="100" cy="100" rx="90" ry="60" fill="#38bdf8" />
      </svg>
      {/* Main Card */}
      <div className="flex flex-col md:flex-row bg-white/90 rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full z-10 backdrop-blur-md border border-gray-200">
        {/* Left Side: Image with overlay text and animated badge */}
        <div className="relative md:w-1/2 h-80 md:h-auto  flex flex-col justify-center items-center bg-gradient-to-br from-yellow-200 via-purple-200 to-blue-200">
          <img
            src={signup}
            alt="Signup"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col bg-black/60  items-center justify-center text-center px-4">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg animate-fade-in-down">Achieve Your Dream</h1>
            <p className="text-white text-lg md:text-xl font-medium animate-fade-in-up">Where startups meet investors</p>
   
          </div>
        </div>
        {/* Right Side: Form */}
        <div className="md:w-1/2 p-10 flex flex-col justify-center relative">
          {/* Decorative SVG */}
          <svg className="absolute -top-10 -right-10 w-32 h-32 opacity-20 pointer-events-none" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="#fbbf24" />
          </svg>
          <h2 className="text-4xl font-extrabold text-yellow-400 mb-8 text-center tracking-tight animate-fade-in-down">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in-up">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Email Address</label>
              <input
                type="email"
                placeholder="example@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full border border-gray-300 rounded-full py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm hover:shadow-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Password Field */}
            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Password</label>
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
                className="w-full border border-gray-300 rounded-full py-3 px-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm hover:shadow-lg"
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
              className="w-full py-3 bg-purple-600 text-white rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200"
            >
              {loader ? 'Logging In...' : 'Login'}
            </button>
            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center mt-2 animate-shake">{error}</div>
            )}
          </form>
          <div className="flex flex-col items-center mt-6 gap-2">
            <Link to={"/forgotpwd"} className="text-purple-500 text-center cursor-pointer hover:underline font-medium">Forgot Password?</Link>
            <span className="text-gray-500 text-sm">New user?</span>
            <Link to={"/signup"} className="text-purple-500  hover:underline transition-colors">Create your account</Link>
          </div>
        </div>
      </div>
      {/* Custom Animations */}
      <style>{`
        .animate-spin-slow { animation: spin 18s linear infinite; }
        .animate-pulse { animation: pulse 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce 6s infinite alternate; }
        .animate-fade-in-down { animation: fadeInDown 1s both; }
        .animate-fade-in-up { animation: fadeInUp 1.2s both; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-shake { animation: shake 0.4s; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.5; } }
        @keyframes bounce { 0% { transform: translateY(0); } 100% { transform: translateY(-20px); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
      `}</style>
    </div>
  );
};

export default Login;
