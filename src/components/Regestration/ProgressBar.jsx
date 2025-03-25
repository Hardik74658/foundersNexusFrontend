import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ progressPercentage, steps }) => {
  return (
    <>
      {/* Progress Bar Section */}
      <div className="mt-4 px-32">
        <p className="text-base text-black">Migrating MySQL database...</p>
        <div className="relative mt-2">
          {/* Progress Bar */}
          <div
            className="bg-gray-200 rounded-full h-2 w-full"
            aria-label="Progress bar"
            role="progressbar"
            aria-valuenow={parseInt(progressPercentage)}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div
              className="bg-brand rounded-full h-2 transition-all duration-500 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {/* Progress Marker */}
          <div
            className="absolute top-1/2 h-4 w-px bg-gray-400 transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Stage Labels */}
        <div className="mt-2 relative w-full">
          <span
            className="absolute text-sm text-gray-600 transform -translate-x-1/2"
            style={{ left: '0%' }}
          >
            {steps[0]}
          </span>
          <span
            className="absolute text-sm text-gray-600 transform -translate-x-1/2"
            style={{ left: '50%' }}
          >
            {steps[1]}
          </span>
          <span
            className="absolute text-sm text-gray-600 transform -translate-x-1/2"
            style={{ left: '100%' }}
          >
            {steps[2]}
          </span>
        </div>
      </div>
    </>
  );
};

ProgressBar.propTypes = {
  progressPercentage: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProgressBar;