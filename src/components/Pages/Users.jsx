import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loader from '../layout/Loader'; // Import the Loader component

export default function Users() {
  const [selectedTab, setSelectedTab] = useState('founders');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // State to track loading
  const [displayTab, setDisplayTab] = useState('founders'); // New state for display

  const fetchUsers = async () => {
    setUsers(); // Clear the users list
    setDisplayTab(selectedTab);
    setLoading(true); // Start loading
    try {
      const endpoint = selectedTab === 'founders' ? '/users/founders/' : '/users/investors/';
      const response = await axios.get(endpoint);
      setUsers(response.data);
      // Update display tab after data is loaded
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
 
    fetchUsers();
  }, [selectedTab]);

  return (
    <div className="min-h-screen bg-white py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="relative flex bg-gray-100 p-1 rounded-full">
            <div
              className="absolute transition-all duration-300 bg-indigo-600 h-full top-0 rounded-full"
              style={{
                width: '50%',
                left: displayTab === 'founders' ? '0%' : '50%',
              }}
            />
            <button
              className={`px-6 py-2 rounded-full font-semibold z-10 transition-colors duration-300 relative w-32
                ${displayTab === 'founders' ? 'text-white' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('founders')}
            >
              Founders
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold z-10 transition-colors duration-300 relative w-32
                ${displayTab === 'investors' ? 'text-white' : 'text-gray-600'}`}
              onClick={() => setSelectedTab('investors')}
            >
              Investors
            </button>
          </div>
        </div>

        {/* Display header for current tab */}
        <h2 className="text-2xl font-bold text-center mb-6">
          {displayTab === 'founders' ? 'Founders' : 'Investors'}
        </h2>

        {/* Users List */}
        <div className="rounded-4xl border-1 border-gray-300 overflow-hidden">
          {loading ? (
            <Loader /> // Show loader while fetching
          ) : users.length > 0 ? (
            users.map((user, index) => (
              <div
                key={user._id}
                className={`flex items-center gap-4 border border-gray-200 p-4  hover:shadow-md transition
                  ${index === 0 ? 'border-b-0' : index === users.length - 1 ? '' : 'border-b-0'}
                `}
              >
                <Link
                  to={`/user/${user._id}`}
                  className="flex items-center gap-4 flex-1"
                >
                  <img
                    src={user.profilePicture || 'https://via.placeholder.com/80'}
                    alt={user.fullName || 'User'}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{user.fullName || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500">{user.bio || 'No bio available.'}</p>
                  </div>
                </Link>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-full text-sm hover:bg-indigo-50">
                    Message
                  </button>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700">
                    Follow
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
