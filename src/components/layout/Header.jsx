import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Navigation links with potential dropdowns
  const navItems = [
    { name: "Features", dropdown: ["For Startups", "For Investors", "Pitch Creation", "Analytics"] },
    { name: "Use cases", dropdown: ["Founders", "VCs", "Accelerators"] },
    { name: "Academy", dropdown: ["Tutorials", "Resources", "Blog"] },
    { name: "Pricing", dropdown: null },
  ];

  // Handle scroll effect for transparent to solid header transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.nav-dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  return (
    <header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm py-2" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FoundersNexus
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            {navItems.map((item) => (
              <div key={item.name} className="relative nav-dropdown-container">
                <button
                  className={`text-gray-600 group inline-flex items-center transition-all duration-200 font-medium hover:text-blue-600 ${
                    activeDropdown === item.name ? "text-blue-600" : ""
                  }`}
                  onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDownIcon
                      className={`ml-1 h-4 w-4 transition-transform duration-300 ease-in-out ${
                        activeDropdown === item.name ? "transform rotate-180 text-blue-600" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Enhanced Dropdown menu */}
                {item.dropdown && (
                  <div 
                    className={`absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2 transition-all duration-300 ease-in-out origin-top-center ${
                      activeDropdown === item.name 
                        ? "opacity-100 scale-100 translate-y-0" 
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="rounded-3xl shadow-lg ring-1 ring-black/5 overflow-hidden backdrop-blur-sm bg-white/95 border border-gray-100">
                      <div className="relative grid gap-3 bg-gradient-to-b from-white to-gray-50 px-5 py-4 sm:gap-6 sm:p-6">
                        {item.dropdown.map((dropdownItem, index) => (
                          <a
                            key={dropdownItem}
                            href="#"
                            className={`-m-2 p-3 flex items-start rounded-2xl hover:bg-blue-50/80 transition-all duration-200 ease-out transform hover:-translate-y-0.5 hover:shadow-sm`}
                            style={{ 
                              transitionDelay: `${index * 30}ms`,
                              animation: activeDropdown === item.name ? `fadeInUp 300ms ease-out forwards ${100 + index * 60}ms` : 'none',
                              opacity: activeDropdown === item.name ? 1 : 0
                            }}
                          >
                            <div className="ml-1">
                              <p className="text-base font-medium text-gray-900 group-hover:text-blue-600">{dropdownItem}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="whitespace-nowrap text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="whitespace-nowrap px-6 py-3 rounded-full bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-300 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
            >
              Get started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - enhance with similar styling */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"
      }`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map((item, idx) => (
            <a
              key={item.name}
              href="#"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg mx-2 transition-all duration-200"
              style={{ 
                transitionDelay: `${idx * 50}ms`,
                animation: mobileMenuOpen ? `fadeInRight 300ms ease-out forwards ${100 + idx * 60}ms` : 'none'
              }}
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center justify-between px-4">
            <Link
              to="/login"
              className="block text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="block px-4 py-2 rounded-full text-base font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
}
