import React from 'react';

function AboutSection({ about }) {
    return (
      <>
        <h4 className="text-xl text-gray-900 font-bold">About</h4>
        <p className="mt-2 text-gray-700">{about}</p>
      </>
    );
  }
  
  export default AboutSection;