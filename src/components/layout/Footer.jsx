import React from 'react';
import ProfilePic from "../../assets/ProfilePic.png"

const Footer = () => {
  return (
    <footer className="text-gray-800 py-8">
      <div className="container mx-auto flex flex-col items-center">
        {/* Founder Info */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src={ProfilePic}
            alt="Founder" 
            className="w-20 h-20 rounded-3xl mb-4" 
          />
          <p className="text-xl font-semibold">Hardik Songara</p>
          <p className="text-md text-brand">Founder & CEO</p>
        </div>

        {/* Sitemap */}
        <div className="flex flex-col items-center mb-8">
          <h3 className="text-lg font-semibold mb-4">Sitemap</h3>
          <ul className="flex flex-row items-center gap-4">
            <li>
              <a href="#" className="hover:text-blue-600 transition duration-300">Home</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition duration-300">About</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition duration-300">Services</a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition duration-300">Contact</a>
            </li>
          </ul>
        </div>

        {/* Copyright */}
        <p className="text-sm text-center">
          © 2025 FoundersNexus. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;