import React, { useEffect } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loggedIn, logout } from './redux/slices/authSlice.js';
import { getCurrentUser } from './services/auth.js';
import AuthLayout from './components/layout/AuthLayout.jsx';
import { Login } from './components/Login';
import Reg from './components/Regestration/Reg.jsx';
import LandingPage from './components/LandingPage.jsx';
import StartupCreation from './components/Pages/StartupCreation.jsx';
import { Profile } from './components/Pages/Profile.jsx';
import Posts from './components/Posts.jsx';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        if (response && response.data) {
          console.log('User data fetched:', response.data);
          const serializableUserData = {
            id: response.data._id,
            name: response.data.fullName,
            email: response.data.email,
          };
          dispatch(loggedIn(serializableUserData));
        } else {
          console.log('No user data found, logging out.');
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.error('Error fetching current user:', error);
        dispatch(logout());
      });
  }, [dispatch]);

  axios.defaults.baseURL = 'http://localhost:8000';

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/signup"
        element={
          <AuthLayout authentication={false}>
            <Reg />
          </AuthLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        }
      />
      {/* Landing page is public and accessible to both logged in and logged out users */}
      <Route
        path="/"
        element={
          <AuthLayout authentication={false}>
            <LandingPage />
          </AuthLayout>
        }
      />
      <Route
        path="/landing_page"
        element={
          <AuthLayout authentication={false}>
            <LandingPage />
          </AuthLayout>
        }
      />
      {/* Protected Routes */}
      <Route
        path="/startup"
        element={
          <AuthLayout authentication={true}>
            <StartupCreation />
          </AuthLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <AuthLayout authentication={true}>
            <Profile />
          </AuthLayout>
        }
      />
      <Route
        path="/posts"
        element={
          <AuthLayout authentication={true}>
            <Posts />
          </AuthLayout>
        }
      />
    </Routes>
  );
}

export default App;
