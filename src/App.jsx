import React, { useEffect } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loggedIn, logout } from './redux/slices/authSlice.js';
import { getCurrentUser } from './services/auth.js';
import AuthLayout from './components/layout/AuthLayout.jsx';
import  Login  from './components/Login';
import Reg from './components/Regestration/Reg.jsx';
import LandingPage from './components/LandingPage.jsx';
import StartupCreation from './components/Pages/StartupCreation.jsx';
import  Profile  from './components/profile2/Profile2.jsx';
import Posts from './components/Posts.jsx';
import PostDetails from './components/PostDetails.jsx';
import Signup from './components/Regestration/Signup.jsx';
import ProfilePage from './components/profile2/Profile2.jsx';
import EditProfile from './components/profile2/EditProfile.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import Users from './components/Pages/Users.jsx';
import StartupDetails from './components/Pages/StartupDetails.jsx';
import EditStartup from './components/Pages/EditStartup';
import ChatPage from './components/ChatPage.jsx';
import AdminDashboard from './components/Pages/AdminDashboard.jsx';
import Pitch from './components/Pages/Pitch.jsx';
import {StartUps} from './components/Pages/StartUps.jsx';

function App() {
  const dispatch = useDispatch();

  const  user1 = {
    "fullName": "Sheldon Lee Cooper",
    "email": "sheldon2@bazinga.com",
    "password": "$2b$12$naGEpkeQwT/htzycxVZPNuP/nk/QOnxbrt2sHttfbQheQ/QCpqi.G",
    "age": 22,
    "profilePicture": "",
    "bio": "Hey There, I am Physicist Sheldon.",
    "location": "texas, dallas",
    "roleId": "67c6779e4e8d102569b9813f",
    "followers": [],
    "following": [],
    "posts": [],
    "currentStartup": null,
    "isVerified": false,
    "isActive": true,
    "created_at": "2025-03-26T06:38:09.091000",
    "updated_at": "2025-03-26T06:38:09.091000",
    "_id": "67e3a0d18a1a4db84b341275",
    "role": {
        "_id": "67c6779e4e8d102569b9813f",
        "name": "Investor",
        "description": "Investing Role (Funds The Startups)"
    },
    "currentStartupData": null
}
  const currentUser=null;
  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        if (response && response.data) {
          console.log('User data fetched:', response.data);
          const serializableUserData = {
            id: response.data._id,
            name: response.data.fullName,
            email: response.data.email,
            currentStartup: response.data.currentStartup,
            profilePicture: response.data.profilePicture,
            role : response.data.role.name 
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
            <Signup />
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
        path="/startups"
        element={
          <AuthLayout authentication={true}>
            <StartUps />
          </AuthLayout>
        }
      />
      <Route
        path="/startup/:id"
        element={
          <AuthLayout authentication={true}>
            <StartupDetails />
          </AuthLayout>
        }
      />
      <Route
        path="/startup/edit/:id"
        element={
          <AuthLayout authentication={true}>
            <EditStartup />
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
      
      <Route
        path="/posts/:postId"
        element={
          <AuthLayout authentication={true}>
            <PostDetails />
          </AuthLayout>
        }
      />
      <Route
        path="/signup2"
        element={
          <AuthLayout authentication={true}>
            <Signup />
          </AuthLayout>
        }
      />
        <Route
          path="/user/editProfile"
          element={
            <AuthLayout authentication={true}>
              <EditProfile user={user1}/>
            </AuthLayout>
          }
        />
      <Route
        path="/user/:userId"
        element={
          <AuthLayout authentication={true}>
            <ProfilePage />
          </AuthLayout>
        }
      />
      <Route
        path="/forgotpwd"
        element={
          <AuthLayout authentication={false}>
            <ForgotPassword />
          </AuthLayout>
        }
      />
      <Route
        path="/resetpassword/:token"
        element={
          <AuthLayout authentication={false}>
            <ResetPassword />
          </AuthLayout>
        }
      />
      <Route
        path="/users"
        element={
          <AuthLayout authentication={true}>
            <Users />
          </AuthLayout>
        }
      />
      {/* Add Chat route */}
      <Route
        path="/chat"
        element={
          <AuthLayout authentication={true}>
            <ChatPage />
          </AuthLayout>
        }
      />
      <Route
        path="/chat/:otherUserId"
        element={
          <AuthLayout authentication={true}>
            <ChatPage />
          </AuthLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <AuthLayout authentication={true}>
            <AdminDashboard />
          </AuthLayout>
        }
      />
      <Route
        path="/pitch"
        element={
          <AuthLayout authentication={true}>
            <Pitch />
          </AuthLayout>
        }
      />
    </Routes>
  );
}

export default App;
