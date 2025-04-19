import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiSearch } from 'react-icons/hi';
import { FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BriefcaseIcon,
  GlobeAltIcon,
  UserGroupIcon,
  PresentationChartBarIcon,
  ChevronDoubleRightIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

/**
 * Reusable card component for displaying startup info
 */
export const StartupCard = ({
  id,
  logoUrl,
  name,
  industry,
  marketSize,
  founders = [],
  description,
  iconBg = "bg-blue-500"
}) => {
  // Add a check to prevent error when name is undefined
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
    >
      {/* Card Header with Logo */}
      <div className="p-5 flex items-center border-b border-gray-100">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBg} overflow-hidden mr-4`}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${name || 'Startup'} logo`}
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-2xl font-bold text-white">{initial}</span>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{name || 'Unnamed Startup'}</h3>
          <div className="flex items-center mt-1">
            <BriefcaseIcon className="h-4 w-4 text-gray-500 mr-1" />
            <p className="text-sm text-gray-600">{industry || 'Technology'}</p>
          </div>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-5">
        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm h-10">
          {description || 'No description available'}
        </p>
        
        {/* Market Size & Founders */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-700 font-medium mb-1 flex items-center">
              <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
              Market Size
            </p>
            <p className="font-bold text-gray-900">{marketSize || 'N/A'}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-xs text-purple-700 font-medium mb-1 flex items-center">
              <UserGroupIcon className="h-3 w-3 mr-1" />
              Team Size
            </p>
            <p className="font-bold text-gray-900">{founders?.length || 0} founders</p>
          </div>
        </div>
        
        {/* Founder Avatars */}
        {founders && founders.length > 0 && (
          <div className="mb-5">
            <div className="flex -space-x-2">
              {founders.slice(0, 4).map((founder, idx) => (
                <div key={idx} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                  {founder.profilePicture ? (
                    <img 
                      src={founder.profilePicture} 
                      alt={founder.fullName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-800 text-xs font-bold">
                      {founder.fullName?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
              ))}
              {founders.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">+{founders.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        )}
      
        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link 
            to={`/startup/${id}`}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition flex items-center justify-center"
          >
            <EyeIcon className="h-4 w-4 mr-1" /> View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// Import the necessary icon
const EyeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

// Export as a named export to match the import in App.jsx
export const StartUps = () => {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStartups, setFilteredStartups] = useState([]);
  const [industryFilter, setIndustryFilter] = useState('');
  const [fundingStageFilter, setFundingStageFilter] = useState('');

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/startups');
        console.log("API response:", response.data);
        setStartups(response.data);
        setFilteredStartups(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching startups:', error);
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  useEffect(() => {
    const results = startups.filter(startup => {
      // Safety check for name property (checking both potential name fields)
      const startupName = (startup.startup_name || "").toLowerCase();
      const startupDesc = (startup.description || "").toLowerCase();
      const startupIndustry = (startup.industry || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      
      let matchesFilter = true;
      
      // Apply text search filter
      if (query) {
        matchesFilter = startupName.includes(query) || 
                       startupDesc.includes(query) || 
                       startupIndustry.includes(query);
      }
      
      // Apply industry filter if selected
      if (industryFilter && matchesFilter) {
        matchesFilter = startupIndustry === industryFilter.toLowerCase();
      }
      
      return matchesFilter;
    });
    
    setFilteredStartups(results);
  }, [searchQuery, industryFilter, startups]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const applyFilters = () => {
    // This function could be expanded to handle more complex filtering
    console.log("Applying filters:", { industryFilter, fundingStageFilter });
  };
  
  // Get unique industries for the filter dropdown
  const uniqueIndustries = [...new Set(startups.map(startup => startup.industry).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 text-transparent bg-clip-text">Founders Nexus</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Explore Startups</h2>
          <p className="text-gray-600 max-w-2xl">
            Discover innovative startups across different industries. Connect with founders and explore investment opportunities.
          </p>
        </motion.div>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative grow md:grow-0 md:w-64">
            <input
              type="text"
              placeholder="Search startups..."
              className="w-full px-4 py-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={handleSearch}
            />
            <HiSearch className="absolute right-3 top-3.5 text-gray-400" size={20} />
          </div>
          
          <div className="relative grow md:grow-0">
            <select
              className="w-full appearance-none border rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white shadow-sm"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="">All Industries</option>
              {uniqueIndustries.map((industry, index) => (
                <option key={index} value={industry}>{industry}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-3.5 text-gray-400" />
          </div>
          
          <div className="relative grow md:grow-0">
            <select
              className="w-full appearance-none border rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white shadow-sm"
              value={fundingStageFilter}
              onChange={(e) => setFundingStageFilter(e.target.value)}
            >
              <option value="">All Funding Stages</option>
              <option value="pre-seed">Pre-Seed</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
              <option value="series-b">Series B</option>
            </select>
            <FiChevronDown className="absolute right-3 top-3.5 text-gray-400" />
          </div>
          
          <button 
            onClick={applyFilters}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition shadow-md flex items-center space-x-2"
          >
            <span>Apply Filters</span>
            <ChevronDoubleRightIcon className="h-4 w-4" />
          </button>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-600">Loading startups...</p>
          </div>
        ) : filteredStartups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <StartupCard 
                key={startup._id}
                id={startup._id}
                name={startup.startup_name}
                logoUrl={startup.logo_url}
                industry={startup.industry}
                marketSize={startup.market_size}
                founders={startup.founders}
                description={startup.description}
                iconBg={`bg-${getRandomColor()}-${getRandomShade()}`}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl p-12 shadow-lg text-center"
          >
            <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <PresentationChartBarIcon className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Startups Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any startups matching your search criteria. Try adjusting your filters or search term.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Helper functions for random colors
function getRandomColor() {
  const colors = ['blue', 'indigo', 'purple', 'pink', 'red', 'orange', 'amber', 'green', 'teal', 'cyan'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomShade() {
  const shades = ['100', '200', '300', '400', '500'];
  return shades[Math.floor(Math.random() * shades.length)];
}
