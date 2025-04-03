import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../redux/slices/authSlice';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  // Get user data from redux store; fallback to localStorage if needed
  const storedUser = useSelector((state) => state.auth.user);
  const localUserId = localStorage.getItem("userId");

  // Local state to store fetched user info from API (/users/{userId})
  const [userInfo, setUserInfo] = useState(null);

  // Fetch current user's data if userId is available
  useEffect(() => {
    const userId = storedUser?.id || localUserId;
    if (userId) {
      axios
        .get(`http://localhost:8000/users/${userId}`)
        .then((response) => {
          setUserInfo(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error);
        });
    }
  }, [storedUser, localUserId]);

  // onLogout function as provided
  const onLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    dispatch(logout());
  };

  // Define new navigation options based on your app's routing
  const navItems = [
    { 
      name: 'Startup', 
      path: '/startup', 
      icon: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z'
    },
    { 
      name: 'Profile', 
      path: `/user/${localUserId}`, 
      icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z'
    },
    { 
      name: 'Posts', 
      path: '/posts', 
      icon: 'M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5zM15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z'
    }
  ];

  // If current user has a currentStartup, add it as a navigation option
  if (userInfo && userInfo.currentStartup) {
    navItems.push({
      name: userInfo.currentStartup,
      path: '/startup',
      icon: 'M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17z'
    });
  }

  // Handle the role display: if role is an object, show its 'name' property
  const roleDisplay =
    userInfo && userInfo.role
      ? typeof userInfo.role === 'object'
        ? userInfo.role.name
        : userInfo.role
      : "Administrator";

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-60 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 md:translate-x-0 md:w-60 md:block ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-4 space-y-6">
        {/* Sidebar Header */}
        <h1 className="font-bold text-2xl text-center md:text-xl">
          FoundersNexus<span className="text-indigo-600">.</span>
        </h1>

        {/* Profile Section */}
        <div className="space-y-2 text-center">
          <img
            src={(userInfo && userInfo.profilePicture) || "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80"}
            alt="User Avatar"
            className="w-12 md:w-16 rounded-full mx-auto"
          />
          <h2 className="font-medium text-md text-indigo-500">
            {(userInfo && userInfo.fullName) || "Eduard Pantazi"}
          </h2>
          <p className="text-xs text-gray-500">
            {roleDisplay}
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex border-2 border-gray-200 rounded-md focus-within:ring-2 ring-indigo-500">
          <input
            type="text"
            className="w-full rounded-l-md px-2 py-2 text-sm text-gray-600 focus:outline-none"
            placeholder="Search"
          />
          <button className="rounded-r-md px-2 py-2 bg-gray-100">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center space-x-2 py-3 px-4 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white rounded-2xl transition duration-150 ease-in-out"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d={item.icon} />
              </svg>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="flex items-center w-full py-3 px-4 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white rounded-2xl transition duration-150 ease-in-out"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h6a1 1 0 010 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4z" />
              <path d="M13 7l3 3-3 3m0-6l-3 3 3 3" />
            </svg>
            Logout
          </button>
        </div>

        {/* Close Button (Mobile Only) */}
        {isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-2 md:hidden"
            aria-label="Close Sidebar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
