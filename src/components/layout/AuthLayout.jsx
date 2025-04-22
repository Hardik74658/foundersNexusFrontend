import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const founderOnlyRoutes = ['/startup', '/startup/edit', '/pitch'];

const AuthLayout = ({ children, authentication }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authStatus = useSelector((state) => state.auth.status);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const user = useSelector((state) => state.auth.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Determine user role
  const role = user?.role || null;

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  useEffect(() => {
    if (!isLoading) {
      if (authentication && !authStatus) {
        navigate('/login');
      } else if (!authentication && authStatus) {
        if (
          location.pathname === '/login' ||
          location.pathname === '/signup' ||
          location.pathname === '/resetpassword/:token' ||
          location.pathname === '/forgotpwd'
        ) {
          navigate('/');
        }
      }
      // Redirect investors/admins from founder-only pages
      if (
        authentication &&
        authStatus &&
        (role === 'Investor' || role === 'Admin')
      ) {
        // Only block exact founder-only routes, NOT /startup/:id
        const isBlocked =
          founderOnlyRoutes.includes(location.pathname);

        if (isBlocked) {
          if (role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/startups');
          }
        }
      }
    }
  }, [authentication, authStatus, isLoading, navigate, location.pathname, role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Admin: render different layout (customize as needed)
  if (authentication && authStatus && role === 'Admin') {
    return (
      <div className="flex min-h-screen">
        {/* You can create a separate AdminSidebar/AdminNavbar if needed */}
        {/* <AdminSidebar /> */}
        <div className="flex-1 flex flex-col">
          {/* <AdminNavbar /> */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    );
  }

  // Regular users (founder/investor)
  if (authentication && authStatus) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} userRole={role} />
        <div className="flex-1 flex flex-col md:ml-60">
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    );
  }

  return <div className="">{children}</div>;
};

export default AuthLayout;
