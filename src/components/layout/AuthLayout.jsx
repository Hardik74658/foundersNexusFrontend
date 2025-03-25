import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar'; // Assume these are your layout components
import Sidebar from '../Sidebar';

const AuthLayout = ({ children, authentication }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status); // True if logged in
  const isLoading = useSelector((state) => state.auth.isLoading); // True during initial load
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    // Only run redirect logic after auth status is determined
    if (!isLoading) {
      // For protected routes: if user is not logged in, redirect to /login.
      if (authentication && !authStatus) {
        navigate('/login');
      }
      // For public routes: if user is logged in and on login/signup page, redirect to landing page.
      else if (!authentication && authStatus) {
        if (location.pathname === '/login' || location.pathname === '/signup') {
          navigate('/');
        }
      }
    }
  }, [authentication, authStatus, isLoading, navigate, location.pathname]);

  // Show loading screen during initial auth check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Render protected layout with Sidebar and Navbar if route requires authentication and user is logged in.
  if (authentication && authStatus) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 flex flex-col md:ml-60">
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    );
  }

  // For public routes, simply render the children directly.
  return <div className="">{children}</div>;
};

export default AuthLayout;
