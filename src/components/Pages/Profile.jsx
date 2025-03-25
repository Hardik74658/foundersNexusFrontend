import React from 'react'
import ProfilePage from '../ProfilePage/ProfilePage';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import OwnProfile from '../ProfilePage/ownProfile/OwnProfile';
export const Profile = () => {
    const profileData = {
        backgroundImage: 'https://vojislavd.com/ta-template-demo/assets/img/profile-background.jpg',
        profilePicture: 'https://vojislavd.com/ta-template-demo/assets/img/profile.jpg',
        fullName: 'Amanda Ross',
        isVerified: true,
        title: 'Senior Software Engineer at Tailwind CSS',
        location: 'New York, USA',
        personalInfo: [
          { label: 'Full name', value: 'Amanda S. Ross' },
          { label: 'Birthday', value: '24 Jul, 1991' },
          { label: 'Joined', value: '10 Jan 2022 (25 days ago)' },
          { label: 'Mobile', value: '(123) 123-1234' },
          { label: 'Email', value: 'amandaross@example.com' },
          { label: 'Location', value: 'New York, US' },
          { label: 'Languages', value: 'English, Spanish' },
        ],
        socialLinks: [
          { name: 'Facebook', url: '#', icon: <FaFacebook className="w-5 h-5 text-blue-600" /> },
          { name: 'Twitter', url: '#', icon: <FaTwitter className="w-5 h-5 text-blue-400" /> },
          { name: 'LinkedIn', url: '#', icon: <FaLinkedin className="w-5 h-5 text-blue-700" /> },
          { name: 'Github', url: '#', icon: <FaGithub className="w-5 h-5 text-gray-800" /> },
        ],
        activityLog: [
          { description: 'Profile informations changed.', timestamp: '3 min ago' },
          { description: 'Connected with <a href="#" class="text-blue-600 font-bold">Colby Covington</a>.', timestamp: '15 min ago' },
          { description: 'Invoice <a href="#" class="text-blue-600 font-bold">#4563</a> was created.', timestamp: '57 min ago' },
          { description: 'Message received from <a href="#" class="text-blue-600 font-bold">Cecilia Hendric</a>.', timestamp: '1 hour ago' },
          { description: 'New order received <a href="#" class="text-blue-600 font-bold">#OR9653</a>.', timestamp: '2 hours ago' },
          { description: 'Message received from <a href="#" class="text-blue-600 font-bold">Jane Stillman</a>.', timestamp: '2 hours ago' },
        ],
        about: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt voluptates obcaecati numquam error et ut fugiat asperiores...',
        statistics: {
          revenue: { value: '$8,141', percentage: '3%' },
          orders: { value: '217', percentage: '5%' },
          connections: { value: '54', percentage: '7%' },
          chartData: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
              {
                label: 'Revenue',
                data: [68.106, 26.762, 94.255, 72.021, 74.082, 64.923, 85.565, 32.432, 54.664, 87.654, 43.013, 91.443],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
              },
            ],
          },
        },
        connections: [
          { imageUrl: 'https://vojislavd.com/ta-template-demo/assets/img/connections/connection1.jpg', name: 'Diane Aguilar', role: 'UI/UX Design at Upwork' },
          { imageUrl: 'https://vojislavd.com/ta-template-demo/assets/img/connections/connection2.jpg', name: 'Frances Mather', role: 'Software Engineer at Facebook' },
          // Add more connections as needed...
        ],
      };
    return (
        // <ProfilePage profileData={profileData}/>
        <OwnProfile/>
  )
}

