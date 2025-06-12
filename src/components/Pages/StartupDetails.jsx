// StartupDetails.jsx
import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../layout/Loader';
import Toast from '../layout/Toast';
// Fix the image import
import teamMeeting from '../../assets/team-meeting.png';
import axios from 'axios';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  PresentationChartBarIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = '/api';

const StartupDetails = () => {
  const { id } = useParams(); // Get startup ID from URL
  const navigate = useNavigate(); // Add navigation hook
  const [startupData, setStartupData] = useState(null);
  const [activePitchDeck, setActivePitchDeck] = useState(null);
  const [isPitchLoading, setIsPitchLoading] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [hoveredPerson, setHoveredPerson] = useState(null); // Track hovered person
  const [toast, setToast] = useState({ show: false, message: '', onUndo: null });
  const currentUser = useSelector((state) => state.auth.user); // Get current user from Redux store

  useEffect(() => {
    axios
      .get(`${API_URL}/startups/${id}`)
      .then((response) => {
        setStartupData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching startup data:', error);
        setToast({ show: true, message: 'Error fetching startup data', onUndo: null });
      });
      
    // Fetch the active pitch deck for this startup
    fetchActivePitchDeck(id);
  }, [id]);
  
  const fetchActivePitchDeck = async (startupId) => {
    try {
      setIsPitchLoading(true);
      const response = await axios.get(`${API_URL}/pitchdecks/active/${startupId}`);
      
      if (response.data) {
        const deck = response.data;
        setActivePitchDeck({
          id: deck._id,
          title: deck.title,
          description: deck.description || 'No description provided',
          raiseUntil: deck.raise_until
            ? new Date(deck.raise_until).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'N/A',
          target: deck.target_amount || 'TBD',
          round: deck.round || 'Pre-Seed',
          previewImage: deck.thumbnail_url || null,
          fileUrl: deck.file_url || null,
          dateUploaded: deck.created_at
            ? new Date(deck.created_at).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            : 'N/A',
          slides: deck.slides_count || 0
        });
      }
    } catch (error) {
      console.error('Error fetching active pitch deck:', error);
      setToast({ show: true, message: 'Error fetching active pitch deck', onUndo: null });
      // No active pitch deck - this is an expected case, not an error
      setActivePitchDeck(null);
    } finally {
      setIsPitchLoading(false);
    }
  };

  if (!startupData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60 z-50">
        <Loader />
      </div>
    );
  }

  // Setup data for the Pie chart based on the equity split
  const equityData = {
    labels: startupData.equity_split.map((entry) => entry.name),
    datasets: [
      {
        data: startupData.equity_split.map((entry) => entry.equity_percentage),
        backgroundColor: [
          '#EF4444', // red-500
          '#3B82F6', // blue-500
          '#EC4899', // pink-500
          '#10B981', // emerald-500
          '#8B5CF6', // violet-500
          '#F59E0B', // amber-500
          '#06B6D4', // cyan-500
          '#6366F1', // indigo-500
          '#F97316', // orange-500
          '#14B8A6', // teal-500
          '#D946EF', // fuchsia-500
          '#84CC16'  // lime-500
        ].slice(0, startupData.equity_split.length),
        hoverBackgroundColor: [
          '#DC2626', // red-600
          '#2563EB', // blue-600
          '#DB2777', // pink-600
          '#059669', // emerald-600
          '#7C3AED', // violet-600
          '#D97706', // amber-600
          '#0891B2', // cyan-600
          '#4F46E5', // indigo-600
          '#EA580C', // orange-600
          '#0D9488', // teal-600
          '#C026D3', // fuchsia-600
          '#65A30D'  // lime-600
        ].slice(0, startupData.equity_split.length),
        hoverBorderWidth: 4,
        hoverBorderColor: '#fff',
        borderWidth: hoveredPerson !== null ? 2 : 0,
        borderColor: startupData.equity_split.map((entry, idx) => 
          hoveredPerson === entry.name ? '#fff' : 'transparent'
        ),
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    cutout: '55%', // Increased cutout for more spacious look
    hover: {
      mode: 'single'
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#fff',
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true
    }
  };

  // Function to handle hover states
  const handlePersonHover = (name) => {
    setHoveredPerson(name);
  };

  // Sample founder roles if they don't exist in the data
  const founderRoles = [
    "CEO", "CTO", "CFO", "COO"
  ];

  // Custom tooltip animation style
  const tooltipStyle = {
    animation: 'tooltipBounce 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)'
  };

  // Function to check if current user is a founder of this startup
  const isUserFounder = () => {
    if (!startupData || !currentUser) return false;
    
    // Check if user is in founders list
    const founderId = startupData.founders?.find(founder => {
      if (typeof founder === 'object') {
        return founder._id === currentUser.id;
      }
      return founder === currentUser.id;
    });
    
    return !!founderId;
  };

  return (
    <>
      {/* Toast Positioning */}
      <div className="fixed top-5 right-5 z-50">
        <Toast
          message={toast.message}
          show={toast.show}
          onUndo={toast.onUndo}
          onClose={() => setToast({ ...toast, show: false })}
        />
      </div>
      <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              {isUserFounder() && (
                <button
                  onClick={() => navigate(`/startup/edit/${id}`)}
                  className="rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none"
                >
                  Edit Startup
                </button>
              )}
            </div>
            <div className="flex space-x-6 text-gray-600">
              <Link to="/pitch" className="hover:text-gray-900">Pitch</Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              {/* Logo and Name */}
              <div className="flex flex-col items-center mb-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {startupData.logo_url ? (
                    <img
                      src={startupData.logo_url}
                      alt="Startup Logo"
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-10 h-10 text-orange-500 fill-current">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{startupData.startup_name}</h1>
                <div className="px-4 py-1 bg-gray-200 rounded-full text-gray-600 text-sm">
                  {startupData.industry || "Dude"}
                </div>
              </div>

              {/* Market Size and Revenue Model */}
              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-2">Market Size</p>
                  <p className="text-2xl font-bold">{startupData.market_size || "10B$"}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-2">Revenue Model</p>
                  <p className="text-2xl font-bold">{startupData.revenue_model || "Something"}</p>
                </div>
              </div>

              {/* Active Pitch Deck Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white mr-2">
                    <PresentationChartBarIcon className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold">Active Pitch Deck</h2>
                </div>
                
                {isPitchLoading ? (
                  <Loader />
                ) : activePitchDeck ? (
                  <div className="relative rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg bg-white border border-gray-100">
                    <div className="h-48 bg-gradient-to-br from-gray-900 to-gray-700 relative overflow-hidden">
                      {activePitchDeck.previewImage ? (
                        <img 
                          src={activePitchDeck.previewImage} 
                          alt={`${activePitchDeck.title} preview`} 
                          className="w-full h-full object-cover opacity-90" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <PresentationChartBarIcon className="h-20 w-20 text-gray-500" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>

                      <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs flex items-center">
                        <DocumentTextIcon className="h-3 w-3 mr-1" />
                        {activePitchDeck.slides} slides
                      </div>

                      <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                        Uploaded: {activePitchDeck.dateUploaded}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{activePitchDeck.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{activePitchDeck.description}</p>

                      <div className="grid grid-cols-3 gap-3 mb-5">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-600 mb-1 flex items-center font-medium">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Raise Until
                          </span>
                          <span className="text-sm font-medium">{activePitchDeck.raiseUntil}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-600 mb-1 flex items-center font-medium">
                            <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                            Target
                          </span>
                          <span className="text-sm font-medium">{activePitchDeck.target}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-600 mb-1 flex items-center font-medium">
                            <ChartPieIcon className="h-3 w-3 mr-1" />
                            Round
                          </span>
                          <span className="text-sm font-medium">{activePitchDeck.round}</span>
                        </div>
                      </div>

                      {activePitchDeck.fileUrl ? (
                        <div className="flex gap-2">
                          <a
                            href={activePitchDeck.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                          >
                            <EyeIcon className="h-4 w-4" />
                            View
                          </a>
                          <a
                            href={activePitchDeck.fileUrl}
                            download
                            className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Download
                          </a>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-sm text-gray-500">
                          No downloadable file available
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200">
                    <PresentationChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-gray-600 font-medium mb-1">No Active Pitch Deck</h3>
                    <p className="text-gray-500 text-sm">
                      This startup does not have an active pitch deck yet.
                    </p>
                    {isUserFounder() && (
                      <button
                        onClick={() => navigate('/pitch')}
                        className="mt-3 text-indigo-600 text-sm font-medium hover:text-indigo-800"
                      >
                        + Add a Pitch Deck
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Equity Split */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zm5 2a2 2 0 11-4 0 2 2 0 014 0zm-8 8a2 2 0 100-4 2 2 0 000 4zm0 2a3 3 0 100-6 3 3 0 000 6zm-8-6a2 2 0 100-4 2 2 0 000 4zm0 2a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold">Equity Split</h2>
                </div>
                <div className="flex justify-center mb-6">
                  <div className="w-56 h-56 relative p-3"> {/* Increased size */}
                    <Pie data={equityData} options={pieOptions} />
                    {hoveredPerson && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white bg-opacity-75 px-3 py-1 rounded-full shadow-sm">
                          <span className="font-medium">{hoveredPerson}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-center mb-5 gap-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-1 rounded-full bg-purple-500"></div>
                    <span className="text-sm">Founders</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-1 rounded-full bg-cyan-500"></div>
                    <span className="text-sm">Investors</span>
                  </div>
                </div>
                
                {/* Founders Equity */}
                <div className="mb-8">
                  <h3 className="text-md font-semibold mb-3 text-purple-600 border-b border-purple-200 pb-1">Founders Equity</h3>
                  {startupData.equity_split
                    .filter(person => person.type === 'Founder')
                    .map((person, index) => {
                      const dataIndex = startupData.equity_split.findIndex(p => p.name === person.name);
                      const isHighlighted = hoveredPerson === person.name || hoveredPerson === null;
                      return (
                        <div 
                          key={index} 
                          className={`mb-3 p-2 rounded-lg transition-all duration-200 ${isHighlighted ? 'bg-white' : 'bg-gray-50 opacity-60'}`}
                          onMouseEnter={() => handlePersonHover(person.name)}
                          onMouseLeave={() => handlePersonHover(null)}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <p className="font-medium">{person.name}</p>
                              <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                {person.type}
                              </span>
                            </div>
                            <p className="text-gray-600 font-semibold">{person.equity_percentage}%</p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-300 ${isHighlighted ? 'shadow-sm' : ''}`}
                              style={{ 
                                width: `${person.equity_percentage}%`, 
                                backgroundColor: equityData.datasets[0].backgroundColor[dataIndex],
                                filter: isHighlighted ? 'brightness(1.1)' : 'brightness(0.9)'
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                {/* Investors Equity */}
                <div className="mb-2">
                  <h3 className="text-md font-semibold mb-3 text-indigo-600 border-b border-indigo-200 pb-1">Investors Equity</h3>
                  {startupData.equity_split
                    .filter(person => person.type === 'Investor')
                    .map((person, index) => {
                      const dataIndex = startupData.equity_split.findIndex(p => p.name === person.name);
                      const isHighlighted = hoveredPerson === person.name || hoveredPerson === null;
                      return (
                        <div 
                          key={index} 
                          className={`mb-3 p-2 rounded-lg transition-all duration-200 ${isHighlighted ? 'bg-white' : 'bg-gray-50 opacity-60'}`}
                          onMouseEnter={() => handlePersonHover(person.name)}
                          onMouseLeave={() => handlePersonHover(null)}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <p className="font-medium">{person.name}</p>
                              <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                                {person.type}
                              </span>
                            </div>
                            <p className="text-gray-600 font-semibold">{person.equity_percentage}%</p>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-300 ${isHighlighted ? 'shadow-sm' : ''}`}
                              style={{ 
                                width: `${person.equity_percentage}%`, 
                                backgroundColor: equityData.datasets[0].backgroundColor[dataIndex],
                                filter: isHighlighted ? 'brightness(1.1)' : 'brightness(0.9)'
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Meeting Illustration */}
              <div className="mb-12 flex justify-center">
                <img 
                  src={teamMeeting} 
                  alt="Team meeting" 
                  className="h-84 object-contain rounded-lg"
                />
              </div>

              {/* Description */}
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-gray-600">{startupData.description || "Dude"}</p>
              </div>

              {/* Founders */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-6">Founders</h2>
                <div className="grid grid-cols-4 gap-4">
                  {startupData.founders && startupData.founders.length > 0 ? 
                    startupData.founders.map((founder, index) => {
                      // Find equity data for this founder by name
                      const equityData = startupData.equity_split.find(e => 
                        e.type === 'Founder' && e.name === founder.fullName
                      );
                      const isHighlighted = hoveredPerson === (equityData?.name) || hoveredPerson === null;
                      
                      return (
                        <div 
                          key={index} 
                          className={`flex flex-col items-center relative cursor-pointer group transition-all duration-200 ${isHighlighted ? '' : 'opacity-70'}`}
                          onClick={() => window.location.href = `/user/${founder._id}`}
                          onMouseEnter={() => {
                            setActiveTooltip(index);
                            if (equityData) handlePersonHover(equityData.name);
                          }}
                          onMouseLeave={() => {
                            setActiveTooltip(null);
                            handlePersonHover(null);
                          }}
                        >
                          <img 
                            src={founder.profilePicture || "https://ui-avatars.com/api/?name=" + founder.fullName} 
                            alt={founder.fullName} 
                            className={`w-16 h-16 rounded-full object-cover mb-2 border-2 ${isHighlighted ? 'border-blue-500 shadow-md' : 'border-transparent'} transition-all`}
                          />
                          <p className="text-center font-medium text-sm">{founder.fullName}</p>
                          
                          {activeTooltip === index && (
                            <div 
                              style={{ animation: 'tooltipFloat 0.6s ease-out forwards' }}
                              className="tooltip absolute -top-24 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-5 py-3 rounded-xl z-10 shadow-lg backdrop-blur-sm min-w-[140px] text-center"
                            >
                              <p className="font-semibold mb-1">{founder.fullName}</p>
                              <p className="text-xs text-gray-300">{founder.role || founderRoles[index % founderRoles.length]}</p>
                              <div className="tooltip-arrow absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-black border-opacity-80"></div>
                            </div>
                          )}
                        </div>
                      );
                    }) :
                    [
                      { name: "Hardik Songara", role: "CEO" },
                      { name: "Tanvi Trivedi", role: "CTO" },
                      { name: "Tanvi Trivedi", role: "COO" },
                      { name: "Kavya Kothari", role: "CFO" }
                    ].map((founder, index) => (
                      <div 
                        key={index} 
                        className="flex flex-col items-center relative cursor-pointer group"
                        onClick={() => window.location.href = `/profile/${index}`}
                        onMouseEnter={() => setActiveTooltip(index)}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <img 
                          src={`https://ui-avatars.com/api/?name=${founder.name.replace(" ", "+")}`}
                          alt={founder.name} 
                          className="w-16 h-16 rounded-full object-cover mb-2 border-2 border-transparent group-hover:border-blue-500 transition-all"
                        />
                        <p className="text-center font-medium text-sm">{founder.name}</p>
                        
                        {activeTooltip === index && (
                          <div 
                            style={{ animation: 'tooltipFloat 0.6s ease-out forwards' }}
                            className="tooltip absolute -top-24 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-5 py-3 rounded-xl z-10 shadow-lg backdrop-blur-sm min-w-[140px] text-center"
                          >
                            <p className="font-semibold mb-1">{founder.name}</p>
                            <p className="text-xs text-gray-300">{founder.role}</p>
                            <div className="tooltip-arrow absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-black border-opacity-80"></div>
                          </div>
                        )}
                      </div>
                    ))
                  }
                </div>
              </div>
              
              {/* Investors Section */}
              <div>
                <h2 className="text-xl font-bold mb-6">Investors</h2>
                {startupData.previous_fundings && startupData.previous_fundings.length > 0 ? (
                  <div className="space-y-4">
                    {startupData.previous_fundings.map((funding, idx) => {
                      // Find all investors in this funding round who also have equity
                      const investorsWithEquity = funding.investors
                        .map(investor => {
                          return {
                            ...investor,
                            equityData: startupData.equity_split.find(e => 
                              e.type === 'Investor' && e.name === investor.investorName
                            )
                          };
                        });
                      
                      // Check if any investor in this round is currently hovered
                      const anyInvestorHighlighted = investorsWithEquity.some(
                        i => hoveredPerson === i.equityData?.name
                      );
                      
                      return (
                        <div 
                          key={idx} 
                          className={`border border-gray-200 rounded-lg p-4 transition-all ${
                            hoveredPerson !== null && !anyInvestorHighlighted ? 'opacity-70' : 'hover:shadow-lg'
                          }`}
                          onMouseEnter={() => {
                            // When hovering the card, highlight the first investor with equity
                            const firstWithEquity = investorsWithEquity.find(i => i.equityData);
                            if (firstWithEquity?.equityData) {
                              handlePersonHover(firstWithEquity.equityData.name);
                            }
                          }}
                          onMouseLeave={() => handlePersonHover(null)}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-medium text-lg">{funding.stage}</span>
                            <span className="text-indigo-600 font-bold">${Number(funding.amount).toLocaleString()}</span>
                          </div>
                          <div className="mb-2 text-sm text-gray-500">
                            <span>Funding Date: {new Date(funding.date).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium mb-2">Investors:</h3>
                            <div className="flex flex-wrap gap-2">
                              {funding.investors.map((investor, i) => {
                                // Find equity data for this investor by name
                                const equityData = startupData.equity_split.find(e => 
                                  e.type === 'Investor' && e.name === investor.investorName
                                );
                                
                                // Get the investor ID - prioritize equity data, fall back to funding data
                                const investorId = equityData?.userId || investor.investorId || 'unknown';
                                
                                const isHighlighted = hoveredPerson === (equityData?.name) || hoveredPerson === null;
                                
                                return (
                                  <div 
                                    key={i} 
                                    className={`flex items-center bg-indigo-50 px-3 py-1 rounded-full transition-all duration-200 ${
                                      isHighlighted ? 'bg-indigo-100 shadow-sm' : 'opacity-80'
                                    }`}
                                    onClick={() => window.location.href = `/user/${investorId}`}
                                    style={{cursor: 'pointer'}}
                                    onMouseEnter={() => {
                                      if (equityData) handlePersonHover(equityData.name);
                                    }}
                                    onMouseLeave={(e) => {
                                      // Only clear if we're not entering the parent card
                                      if (!e.relatedTarget?.closest('.investor-card')) {
                                        handlePersonHover(null);
                                      }
                                    }}
                                  >
                                    <div className={`w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center mr-2 ${
                                      isHighlighted ? 'shadow-sm' : ''
                                    }`}>
                                      <span className="text-indigo-700 text-xs font-bold">
                                        {investor.investorName.charAt(0)}
                                      </span>
                                    </div>
                                    <span className="text-sm font-medium">{investor.investorName}</span>
                                    {equityData && (
                                      <span className="ml-1 text-xs text-indigo-700 font-medium">
                                        ({equityData.equity_percentage}%)
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No investment rounds found.</p>
                )}
              </div>
            </div>
            
            {/* Custom animation style */}
            <style>{`
              @keyframes tooltipBounce {
                0%, 100% { transform: translateY(0) translateX(-50%); }
                20% { transform: translateY(-10px) translateX(-50%); }
                40% { transform: translateY(-5px) translateX(-50%); }
                60% { transform: translateY(-8px) translateX(-50%); }
                80% { transform: translateY(-3px) translateX(-50%); }
              }
              @keyframes tooltipFloat {
                0% { opacity: 0; transform: translateY(8px) translateX(-50%); }
                20% { opacity: 1; transform: translateY(-14px) translateX(-50%); }
                40% { transform: translateY(-10px) translateX(-50%); }
                70% { transform: translateY(-12px) translateX(-50%); }
                100% { transform: translateY(-12px) translateX(-50%); }
              }
            `}</style>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartupDetails;
