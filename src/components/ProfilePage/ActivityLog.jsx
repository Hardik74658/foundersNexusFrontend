import React from 'react';

function TimelineItem({ description, timestamp }) {
    return (
      <div className="flex items-center w-full my-6 -ml-1.5">
        <div className="w-1/12 z-10">
          <div className="w-3.5 h-3.5 bg-blue-600 rounded-full"></div>
        </div>
        <div className="w-11/12">
          <p className="text-sm" dangerouslySetInnerHTML={{ __html: description }} />
          <p className="text-xs text-gray-500">{timestamp}</p>
        </div>
      </div>
    );
  }
  
  function ActivityLog({ activities }) {
    return (
      <>
        <h4 className="text-xl text-gray-900 font-bold">Activity Log</h4>
        <div className="relative px-4">
          <div className="absolute h-full border border-dashed border-opacity-20 border-secondary"></div>
          {activities.map((activity, index) => (
            <TimelineItem key={index} description={activity.description} timestamp={activity.timestamp} />
          ))}
        </div>
      </>
    );
  }
  
  export default ActivityLog;