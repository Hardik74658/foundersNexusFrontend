import React from 'react';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white text-gray-800 p-4 z-20 md:hidden">
      <div className="flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="p-2 focus:outline-none hover:bg-gray-700 rounded"
          aria-label="Toggle Sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Dashwind</h1>
      </div>
    </header>
  );
};

export default Navbar;