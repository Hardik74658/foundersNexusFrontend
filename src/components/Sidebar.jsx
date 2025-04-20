import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../redux/slices/authSlice';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const storedUser = useSelector((state) => state.auth.user);
  const localUserId = localStorage.getItem("userId");
  const [userInfo, setUserInfo] = useState(null);
  const [currentStartup, setCurrentStartup] = useState(null);

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

  useEffect(() => {
    if (userInfo?.currentStartup) {
      axios
        .get(`http://localhost:8000/startups/${userInfo.currentStartup}`)
        .then((response) => {
          setCurrentStartup(response.data);
          console.log('Current startup details:', response.data);
        })
        .catch((error) => {
          console.error('Error fetching current startup details:', error);
        });
    }
  }, [userInfo]);

  const onLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    dispatch(logout());
  };

  const navItems = [
    { 
      name: 'Startup', 
      path: '/startup', 
      icon: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z'
    },
    { 
      name: 'Startups', 
      path: '/startups', 
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
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
    },
    { 
      name: 'Users', 
      path: '/users', 
      icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z'
    },
    { 
      name: 'Chat',
      path: '/chat',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
    }
  ];

  if (currentStartup) {
    const startupNavIndex = navItems.findIndex(item => item.name === 'Startup');
    if (startupNavIndex !== -1) {
      navItems[startupNavIndex] = {
        name: currentStartup.startup_name,
        path: `/startup/${currentStartup._id}`,
        icon: currentStartup.logo_url || 'M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17z'
      };
    }
  }

  const roleDisplay =
    userInfo && userInfo.role
      ? typeof userInfo.role === 'object'
        ? userInfo.role.name
        : userInfo.role
      : "Administrator";

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-60 bg-white shadow-xl  rounded-r-3xl
        transform transition-all duration-500 ease-[cubic-bezier(.77,0,.18,1)]
        z-30 md:translate-x-0 md:w-60 md:block text-3xl
        ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}
      `}
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)' }}
    >
      <div className="p-4 h-full flex flex-col justify-between space-y-0">
        <div className="space-y-6">
          {/* Sidebar Header */}
          <div className="flex flex-col items-center space-y-1.5">
            <span className="inline-block animate-spin-slow">
              <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" stroke="#6366F1" strokeWidth="3" opacity="0.15"/>
                <circle cx="18" cy="18" r="10" stroke="#6366F1" strokeWidth="3" strokeDasharray="60 40" />
              </svg>
            </span>
            <h1 className="font-bold text-lg text-center md:text-base tracking-tight select-none">
              FoundersNexus<span className="text-indigo-600">.</span>
            </h1>
          </div>

          {/* Profile Section */}
          <div className="space-y-1.5 text-center transition-opacity duration-500 animate-fadein">
            <img
              src={(userInfo && userInfo.profilePicture) || "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=880&q=80"}
              alt="User Avatar"
              className="w-14 h-14 rounded-full mx-auto shadow-md border-2 border-indigo-50 object-cover transition-transform duration-300 hover:scale-105"
              style={{ transition: 'box-shadow 0.3s' }}
            />
            <h2 className="font-medium text-sm text-indigo-500">{(userInfo && userInfo.fullName) || "Eduard Pantazi"}</h2>
            <p className="text-xs text-gray-400">{roleDisplay}</p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-1.5"></div>

          {/* Search Bar */}
          <div className="flex border border-gray-100 rounded-xl focus-within:ring-2 ring-indigo-100 bg-gray-50 transition-shadow duration-300">
            <input
              type="text"
              className="w-full rounded-l-xl px-2.5 py-1.5 text-base text-gray-600 bg-transparent focus:outline-none"
              placeholder="Search"
            />
            <button className="rounded-r-xl px-2.5 py-1.5 bg-white hover:bg-indigo-50 transition-colors duration-200">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                <circle cx="9" cy="9" r="7" />
                <line x1="16" y1="16" x2="13" y2="13" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-1.5"></div>

          {/* Navigation Menu */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="
                  flex items-center space-x-2.5 py-2.5 px-4 text-base text-gray-700 rounded-2xl
                  transition-all duration-200 ease-in-out
                  hover:bg-indigo-50 hover:text-indigo-600 group
                  focus:outline-none focus:ring-2 focus:ring-indigo-200
                "
                style={{ minHeight: '40px' }}
              >
                {item.icon.startsWith('M') ? (
                  <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 group-hover:text-indigo-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d={item.icon} />
                  </svg>
                ) : (
                  <img
                    src={item.icon}
                    alt="Startup Icon"
                    className="w-4 h-4 rounded-full transition-transform duration-200 group-hover:scale-110"
                  />
                )}
                <span className="transition-colors duration-200 group-hover:text-indigo-600">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-gray-100 my-1.5"></div>
        </div>
        {/* Logout Button */}
        <div className="pt-1.5">
          <button
            onClick={onLogout}
            className="
              flex items-center w-full py-2.5 px-4 text-base text-gray-500 rounded-2xl
              hover:bg-red-50 hover:text-red-600 transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-red-200
            "
          >
            <svg className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12a9 9 0 0118 0 9 9 0 01-18 0z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
        {/* Close Button (Mobile Only) */}
        {isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="
              absolute top-4 right-4 p-2 rounded-full bg-white shadow-md border border-gray-100
              hover:bg-indigo-50 transition-all duration-200 md:hidden
              focus:outline-none focus:ring-2 focus:ring-indigo-200
            "
            aria-label="Close Sidebar"
          >
            <svg className="w-6 h-6 text-gray-400 hover:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <style>
        {`
          @keyframes spin-slow {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          .animate-spin-slow {
            animation: spin-slow 6s linear infinite;
          }
          @keyframes fadein {
            from { opacity: 0; transform: translateY(8px);}
            to { opacity: 1; transform: none;}
          }
          .animate-fadein {
            animation: fadein 0.8s cubic-bezier(.77,0,.18,1) 0.1s both;
          }
        `}
      </style>
    </aside>
  );
};

export default Sidebar;
