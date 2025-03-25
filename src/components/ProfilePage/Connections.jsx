import React from 'react';

function ConnectionCard({ imageUrl, name, role }) {
    return (
      <a href="#" className="flex flex-col items-center justify-center text-gray-800 hover:text-blue-600" title="View Profile">
        <img src={imageUrl} className="w-16 rounded-full" alt={name} />
        <p className="text-center font-bold text-sm mt-1">{name}</p>
        <p className="text-xs text-gray-500 text-center">{role}</p>
      </a>
    );
  }
  
  function Connections({ connections }) {
    return (
      <>
        <div className="flex items-center justify-between">
          <h4 className="text-xl text-gray-900 font-bold">Connections ({connections.length})</h4>
          <a href="#" title="View All">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-8 mt-8">
          {connections.map((connection, index) => (
            <ConnectionCard key={index} imageUrl={connection.imageUrl} name={connection.name} role={connection.role} />
          ))}
        </div>
      </>
    );
  }
  
  export default Connections;