import ProfileHeader from './ProfileHeader';
import PersonalInfo from './PersonalInfo';
import ActivityLog from './ActivityLog';
import AboutSection from './AboutSection';
import Statistics from './Statistics';
import Connections from './Connections';
import React from 'react';
function ProfilePage({ profileData }) {
  return (
    <div className="h-full bg-gray-200 p-8">
      <ProfileHeader
        backgroundImage={profileData.backgroundImage}
        profilePicture={profileData.profilePicture}
        fullName={profileData.fullName}
        isVerified={profileData.isVerified}
        title={profileData.title}
        location={profileData.location}
        onConnect={() => console.log('Connect clicked')}
        onMessage={() => console.log('Message clicked')}
      />
      <div className="my-4 flex flex-col 2xl:flex-row space-y-4 2xl:space-y-0 2xl:space-x-4">
        <div className="w-full flex flex-col 2xl:w-1/3">
          <div className="flex-1 bg-white rounded-lg shadow-xl p-8">
            <PersonalInfo info={profileData.personalInfo} socialLinks={profileData.socialLinks} />
          </div>
          <div className="flex-1 bg-white rounded-lg shadow-xl mt-4 p-8">
            <ActivityLog activities={profileData.activityLog} />
          </div>
        </div>
        <div className="flex flex-col w-full 2xl:w-2/3">
          <div className="flex-1 bg-white rounded-lg shadow-xl p-8">
            <AboutSection about={profileData.about} />
          </div>
          <div className="flex-1 bg-white rounded-lg shadow-xl mt-4 p-8">
            <Statistics statistics={profileData.statistics} />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-xl p-8">
        <Connections connections={profileData.connections} />
      </div>
    </div>
  );
}

export default ProfilePage;