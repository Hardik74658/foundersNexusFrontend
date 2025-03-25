import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import React from 'react';

function PersonalInfo({ info, socialLinks }) {
  return (
    <>
      <h4 className="text-xl text-gray-900 font-bold">Personal Info</h4>
      <ul className="mt-2 text-gray-700">
        {info.map((item, index) => (
          <li key={index} className="flex border-y py-2">
            <span className="font-bold w-24">{item.label}:</span>
            <span className="text-gray-700">{item.value}</span>
          </li>
        ))}
        <li className="flex items-center border-b py-2 space-x-2">
          <span className="font-bold w-24">Elsewhere:</span>
          {socialLinks.map((link, index) => (
            <a key={index} href={link.url} title={link.name} className="text-gray-700 hover:text-blue-600">
              {link.icon}
            </a>
          ))}
        </li>
      </ul>
    </>
  );
}

export default PersonalInfo;