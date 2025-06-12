import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProfileHeader from './ProfileHeader';
import PostCard from '../Posts/PostCard.jsx';
import CreatePostModal from '../Posts/CreatePostModal';
import { useSelector } from 'react-redux';
import Loader from '../layout/Loader.jsx';
import Toast from '../layout/Toast.jsx';

const ProfilePage = () => {
  const { userId } = useParams();
  const currentUser = useSelector((state) => state.auth.userData) || {
    _id: localStorage.getItem('userId'),
    fullName: 'Current User',
    profilePicture: 'https://via.placeholder.com/150',
  };
  const loggedInUserRole = useSelector((state) => state.auth.user?.role?.toLowerCase());

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [entrepreneurDetails, setEntrepreneurDetails] = useState(null);
  const [investorDetails, setInvestorDetails] = useState(null);

  // Fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`htttp://http://13.232.209.194/users/${userId}`);
        setProfile(response.data);

        // Fetch entrepreneur/founder details if applicable
        if (
          response.data &&
          (
            (response.data.role && (
              response.data.role.name?.toLowerCase() === 'founder' ||
              response.data.role.name?.toLowerCase() === 'entrepreneur'
            )) ||
            response.data.entrepreneurDetails
          )
        ) {
          try {
            if (!response.data.entrepreneurDetails) {
              const entRes = await axios.get(
                `htttp://http://13.232.209.194/users/entrepreneurs/${userId}`
              );
              setEntrepreneurDetails(entRes.data);
            } else {
              setEntrepreneurDetails(response.data.entrepreneurDetails);
            }
          } catch (err) {
            setEntrepreneurDetails(null);
          }
        }

        // Fetch investor details if applicable
        if (
          response.data &&
          (
            (response.data.role && response.data.role.name?.toLowerCase() === 'investor') ||
            response.data.investor_type ||
            response.data.investment_interests
          )
        ) {
          try {
            if (!response.data.investorDetails) {
              const invRes = await axios.get(
                `htttp://http://13.232.209.194/users/investors/${userId}`
              );
              console.log('Investor Details API Response:', invRes.data);
              
              // Make sure we're using the full investor details from the API response
              // The top-level object contains fields like investor_type, funds_available, etc.
              setInvestorDetails(invRes.data);
            } else {
              setInvestorDetails(response.data.investorDetails);
            }
          } catch (err) {
            console.error('Error fetching investor details:', err);
            setInvestorDetails(null);
          }
        }
      } catch (err) {
        setError('Failed to fetch profile');
      } finally {
        setLoadingProfile(false);
      }
    };

    if (userId) {
      fetchProfile();
    } else {
      setError('No user ID provided');
      setLoadingProfile(false);
    }
  }, [userId]);

  // Fetch posts by user
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`htttp://http://13.232.209.194/posts/user/${userId}`);
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (userId) {
      fetchPosts();
    }
  }, [userId]);

  const handleToggleLike = async (postId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post._id === postId) {
          const currentLikes = post.likes || [];
          let updatedLikes;
          if (currentLikes.includes(userId)) {
            updatedLikes = currentLikes.filter((id) => id !== userId);
          } else {
            updatedLikes = [...currentLikes, userId];
          }
          return { ...post, likes: updatedLikes };
        }
        return post;
      })
    );

    try {
      const response = await axios.post(`htttp://http://13.232.209.194/posts/${postId}/like/${userId}`);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const openPostModal = () => {
    setIsPostModalOpen(true);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  const handlePostCreated = () => {
    setIsPostModalOpen(false);
    setLoadingPosts(true);
    axios.get(`htttp://http://13.232.209.194/posts/user/${userId}`).then((response) => {
      setPosts(response.data);
      setLoadingPosts(false);
    });
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Toast message={error} type="error" position="top-right" />
      </div>
    );
  }

  // Check if the profile is an investor
  const isInvestor = profile && (
    (profile.role && profile.role.name?.toLowerCase() === 'investor') ||
    profile.investor_type ||
    profile.investment_interests ||
    investorDetails
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Profile Header */}
      {profile && <ProfileHeader user={profile} openPostModal={openPostModal} />}

      {/* Entrepreneur/Founder Details Section */}
      {entrepreneurDetails && (
        <section className="py-6">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {profile.role?.name?.toLowerCase() === 'entrepreneur' || profile.role?.name?.toLowerCase() === 'founder' ? 'Founder Details' : 'Entrepreneur Details'}
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-md divide-y divide-gray-100">
              {/* Educational Background */}
              {Array.isArray(entrepreneurDetails.educationalBackground) && entrepreneurDetails.educationalBackground.length > 0 && (
                <div className="py-4 first:pt-0">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                    Education
                  </h3>
                  <div className="space-y-3">
                    {entrepreneurDetails.educationalBackground.map((edu, idx) => (
                      <div key={idx} className="pl-2 border-l-2 border-blue-200 bg-blue-50/50 rounded p-2">
                        {edu.degree && <div className="font-medium text-gray-800">{edu.degree}</div>}
                        <div className="text-sm text-gray-600">
                          {edu.institution} {edu.year && <span className="text-gray-500">• {edu.year}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Skills */}
              {Array.isArray(entrepreneurDetails.skills) && entrepreneurDetails.skills.length > 0 && (
                <div className="py-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {entrepreneurDetails.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-100 hover:bg-green-100 transition-colors duration-200">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Work Experience */}
              {Array.isArray(entrepreneurDetails.workExperience) && entrepreneurDetails.workExperience.length > 0 && (
                <div className="py-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    Work Experience
                  </h3>
                  <div className="space-y-4">
                    {entrepreneurDetails.workExperience.map((exp, idx) => (
                      <div key={idx} className="pl-2 border-l-2 border-amber-200 bg-amber-50/50 rounded p-2">
                        <div className="font-medium text-gray-800">{exp.role}</div>
                        <div className="text-sm text-gray-600">{exp.company} {exp.duration && <span className="text-gray-500">• {exp.duration}</span>}</div>
                        {exp.description && <div className="mt-1 text-sm text-gray-600">{exp.description}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Certifications */}
              {Array.isArray(entrepreneurDetails.certifications) && entrepreneurDetails.certifications.length > 0 && (
                <div className="py-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Certifications
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {entrepreneurDetails.certifications.map((cert, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Portfolio Links */}
              {Array.isArray(entrepreneurDetails.portfolioLinks) && entrepreneurDetails.portfolioLinks.length > 0 && (
                <div className="py-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    Portfolio Links
                  </h3>
                  <div className="space-y-2">
                    {entrepreneurDetails.portfolioLinks.map((link, idx) => (
                      <a 
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 bg-teal-50 rounded-md text-teal-600 hover:bg-teal-100 transition-colors duration-200 overflow-hidden text-ellipsis border border-teal-100"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Investor Details Section - Show if profile is investor */}
      {isInvestor && (
        <section className="py-6">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Investor Details</h2>
            <div className="bg-white p-6 rounded-xl shadow-md divide-y divide-gray-100">
              {/* Investor Type */}
              {(investorDetails?.investor_type || profile.investor_type) && (
                <div className="py-4 first:pt-0">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Investor Type
                  </h3>
                  <div className="pl-2 border-l-2 border-indigo-200 bg-indigo-50/50 rounded p-2">
                    <div className="font-medium text-gray-800">{investorDetails?.investor_type || profile.investor_type}</div>
                  </div>
                </div>
              )}
              
              {/* Contact Details */}
              {(investorDetails?.contact_details || profile.contact_details) && (
                <div className="py-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Contact Details
                  </h3>
                  <div className="pl-2 border-l-2 border-blue-200 bg-blue-50/50 rounded p-2">
                    <div className="font-medium text-gray-800">{investorDetails?.contact_details || profile.contact_details}</div>
                  </div>
                </div>
              )}
              
              {/* Investment Interests */}
              {(Array.isArray(investorDetails?.investment_interests) && investorDetails.investment_interests.length > 0) || 
               (Array.isArray(profile.investment_interests) && profile.investment_interests.length > 0) && (
                <div className="py-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    Investment Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(investorDetails?.investment_interests || profile.investment_interests).map((interest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm border border-rose-100 hover:bg-rose-100 transition-colors duration-200">{interest}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Previous Investments - Handle both object and array cases */}
              {((investorDetails?.previous_investments || profile.previous_investments) && (
                Array.isArray(investorDetails?.previous_investments || profile.previous_investments) || 
                typeof (investorDetails?.previous_investments || profile.previous_investments) === 'object'
              )) && (
                <div className="py-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                    Previous Investments
                  </h3>
                  <div className="space-y-4">
                    {Array.isArray(investorDetails?.previous_investments || profile.previous_investments) ? (
                      // Handle array of investments
                      (investorDetails?.previous_investments || profile.previous_investments).map((investment, idx) => (
                        <div key={idx} className="pl-2 border-l-2 border-cyan-200 bg-cyan-50/50 rounded p-2">
                          <div className="font-medium text-gray-800">{investment.startup_name || 'Unnamed Startup'}</div>
                          {investment.investment_amount && (
                            <div className="text-sm text-gray-600">
                              ${typeof investment.investment_amount === 'object' ? 
                                Number(investment.investment_amount.$numberDecimal || 0).toLocaleString() : 
                                Number(investment.investment_amount || 0).toLocaleString()} 
                              {investment.date && <span className="text-gray-500"> • {new Date(investment.date.$date || investment.date).toLocaleDateString()}</span>}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      // Handle single investment object
                      <div className="pl-2 border-l-2 border-cyan-200 bg-cyan-50/50 rounded p-2">
                        <div className="font-medium text-gray-800">
                          {(investorDetails?.previous_investments || profile.previous_investments).startup_name || 'Unnamed Startup'}
                        </div>
                        {(investorDetails?.previous_investments || profile.previous_investments).investment_amount && (
                          <div className="text-sm text-gray-600">
                            ${typeof (investorDetails?.previous_investments || profile.previous_investments).investment_amount === 'object' ? 
                              Number((investorDetails?.previous_investments || profile.previous_investments).investment_amount.$numberDecimal || 0).toLocaleString() : 
                              Number((investorDetails?.previous_investments || profile.previous_investments).investment_amount || 0).toLocaleString()} 
                            {(investorDetails?.previous_investments || profile.previous_investments).date && (
                              <span className="text-gray-500"> • {new Date(
                                (investorDetails?.previous_investments || profile.previous_investments).date.$date || 
                                (investorDetails?.previous_investments || profile.previous_investments).date
                              ).toLocaleDateString()}</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Funds Available */}
              {investorDetails?.funds_available && (
                <div className="py-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                    Funds Available
                  </h3>
                  <div className="pl-2 border-l-2 border-green-200 bg-green-50/50 rounded p-2">
                    <div className="font-medium text-gray-800">
                      ${typeof investorDetails.funds_available === 'object' ? 
                        Number(investorDetails.funds_available.$numberDecimal || 0).toLocaleString() : 
                        Number(investorDetails.funds_available || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        userId={currentUser._id}
        isOpen={isPostModalOpen}
        onClose={closePostModal}
        onPostCreated={handlePostCreated}
      />

      {/* Optional: Current Startup Section */}
      {profile && profile.currentStartup && (
        <section className="py-10">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Current Startup</h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-lg text-gray-700">{profile.currentStartup}</p>
            </div>
          </div>
        </section>
      )}

      {/* Posts Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Posts</h2>
          {loadingPosts ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onToggleLike={handleToggleLike}
                  variant="profile"
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No posts available.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
