import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../layout/Loader'; // Adjust the path as needed
import Toast from '../layout/Toast'; // Import Toast component

const EditProfile = () => {
  const navigate = useNavigate();
  const userFromRedux = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [imageHover, setImageHover] = useState({ cover: false, profile: false });
  const [originalUserDetails, setOriginalUserDetails] = useState(null);
  const [originalRoleDetails, setOriginalRoleDetails] = useState(null);
  const [hasUserDetailsChanged, setHasUserDetailsChanged] = useState(false);
  const [hasRoleDetailsChanged, setHasRoleDetailsChanged] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Common headers for API requests
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // Fallback images
  const fallbackCover = "https://pagedone.io/asset/uploads/1705473378.png";
  const fallbackAvatar = "https://static.vecteezy.com/system/resources/previews/034/324/147/large_2x/front-view-of-an-animated-boy-standing-wearing-tshirt-character-design-free-photo.jpeg";

  // Fetch complete user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch basic user data
        const response = await axios.get(
          `/api/users/${userFromRedux.id}`,
          { headers }
        );
        const userData = response.data;
        console.log('Basic user data:', userData);

        // Determine role and fetch additional details
        const role = userData.role?.name?.toLowerCase();
        let additionalDetails = {};

        if (role === 'founder') {
          try {
            const founderResponse = await axios.get(
              `/api/users/entrepreneurs/${userData._id}`,
              { headers }
            );
            additionalDetails = { entrepreneurDetails: founderResponse.data };
          } catch (err) {
            console.log('No founder details found:', err);
            additionalDetails = { entrepreneurDetails: {} }; // Default empty object if no data
          }
        } else if (role === 'investor') {
          try {
            const investorResponse = await axios.get(
              `/api/users/investors/${userData._id}`,
              { headers }
            );
            additionalDetails = { investorDetails: investorResponse.data };
          } catch (err) {
            console.log('No investor details found:', err);
            additionalDetails = { investorDetails: {} }; // Default empty object if no data
          }
        }

        setUser({ ...userData, ...additionalDetails });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    if (userFromRedux?.id) {
      fetchUserData();
    }
  }, [userFromRedux]);

  // Initialize formData with user data
  useEffect(() => {
    if (user) {
      const role = user.role?.name?.toLowerCase() || '';
      const newFormData = {
        ...user,
        role,
        fullName: user.fullName || '',
        email: user.email || '',
        age: user.age || '',
        bio: user.bio || '',
        location: user.location || '',
        profilePicture: user.profilePicture || '',
        coverImage: user.coverImage || '',
      };

      if (role === 'founder') {
        newFormData.founderDetails = {
          educationalBackground: user.entrepreneurDetails?.educationalBackground || [],
          skills: user.entrepreneurDetails?.skills || [],
          workExperience: user.entrepreneurDetails?.workExperience || [],
          certifications: user.entrepreneurDetails?.certifications || [],
          portfolioLinks: user.entrepreneurDetails?.portfolioLinks || [],
        };
      } else if (role === 'investor') {
        newFormData.investorDetails = {
          investor_type: user.investorDetails?.investor_type || '',
          funds_available: user.investorDetails?.funds_available || '',
          investment_interests: user.investorDetails?.investment_interests || [],
          previous_investments: user.investorDetails?.previous_investments || [],
        };
      }

      console.log('Setting formData:', newFormData);
      setFormData(newFormData);
    }
  }, [user]);

  // Set original user and role details for change detection
  useEffect(() => {
    if (user) {
      const userDetails = {
        fullName: user.fullName || '',
        email: user.email || '',
        age: user.age || '',
        bio: user.bio || '',
        location: user.location || '',
        profilePicture: user.profilePicture || '',
        coverImage: user.coverImage || '',
      };
      setOriginalUserDetails(JSON.stringify(userDetails));

      let roleDetails;
      if (user.role?.name?.toLowerCase() === 'founder') {
        roleDetails = {
          educationalBackground: user.entrepreneurDetails?.educationalBackground || [],
          skills: user.entrepreneurDetails?.skills || [],
          workExperience: user.entrepreneurDetails?.workExperience || [],
          certifications: user.entrepreneurDetails?.certifications || [],
          portfolioLinks: user.entrepreneurDetails?.portfolioLinks || [],
        };
      } else if (user.role?.name?.toLowerCase() === 'investor') {
        roleDetails = {
          investor_type: user.investorDetails?.investor_type || '',
          funds_available: user.investorDetails?.funds_available || '',
          investment_interests: user.investorDetails?.investment_interests || [],
          previous_investments: user.investorDetails?.previous_investments || [],
        };
      }
      setOriginalRoleDetails(JSON.stringify(roleDetails));
    }
  }, [user]);

  // Detect changes in user details
  useEffect(() => {
    if (formData && originalUserDetails) {
      const currentUserDetails = {
        fullName: formData.fullName,
        email: formData.email,
        age: formData.age,
        bio: formData.bio,
        location: formData.location,
        profilePicture: formData.profilePicture,
        coverImage: formData.coverImage,
      };
      setHasUserDetailsChanged(JSON.stringify(currentUserDetails) !== originalUserDetails);
    }
  }, [formData, originalUserDetails]);

  // Detect changes in role-specific details
  useEffect(() => {
    if (formData && originalRoleDetails) {
      const currentRoleDetails = formData.role === 'founder'
        ? formData.founderDetails
        : formData.investorDetails;
      setHasRoleDetailsChanged(JSON.stringify(currentRoleDetails) !== originalRoleDetails);
    }
  }, [formData, originalRoleDetails]);

  // Input handlers
  const handleInputChange = (e, field, nestedField = null) => {
    if (nestedField) {
      setFormData({
        ...formData,
        [nestedField]: {
          ...formData[nestedField],
          [field]: e.target.value,
        },
      });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleBlur = () => {
    setEditingField(null);
  };

  const handleDoubleClick = (field) => {
    setEditingField(field);
  };

  // List item handlers
  const emptyEducation = { degree: '', institution: '', year: '' };
  const emptyWorkExperience = { company: '', role: '', duration: '', description: '' };

  const addListItem = (field, nestedField = null) => {
    if (nestedField) {
      let newItem = '';
      if (field === 'educationalBackground') {
        newItem = { ...emptyEducation };
      } else if (field === 'workExperience') {
        newItem = { ...emptyWorkExperience };
      } else {
        newItem = '';
      }
      setFormData({
        ...formData,
        [nestedField]: {
          ...formData[nestedField],
          [field]: [...formData[nestedField][field], newItem],
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...formData[field], ''],
      });
    }
  };

  const removeListItem = (field, index, nestedField = null) => {
    if (nestedField) {
      const updatedList = formData[nestedField][field].filter((_, i) => i !== index);
      setFormData({
        ...formData,
        [nestedField]: {
          ...formData[nestedField],
          [field]: updatedList,
        },
      });
    } else {
      const updatedList = formData[field].filter((_, i) => i !== index);
      setFormData({
        ...formData,
        [field]: updatedList,
      });
    }
  };

  const updateListItem = (field, index, value, nestedField = null) => {
    if (nestedField) {
      const updatedList = formData[nestedField][field].map((item, i) =>
        i === index ? (typeof item === 'object' ? { ...item, ...value } : value) : item
      );
      setFormData({
        ...formData,
        [nestedField]: {
          ...formData[nestedField],
          [field]: updatedList,
        },
      });
    } else {
      const updatedList = formData[field].map((item, i) => (i === index ? value : item));
      setFormData({
        ...formData,
        [field]: updatedList,
      });
    }
  };

  // Image upload handler
  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          [type === 'cover' ? 'coverImage' : 'profilePicture']: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save handler
  const handleSave = async () => {
    try {
      setIsSaving(true);
      let isSuccess = false;

      if (hasUserDetailsChanged) {
        try {
          const userDetails = {
            fullName: formData.fullName,
            email: formData.email,
            age: formData.age,
            bio: formData.bio,
            location: formData.location,
            profilePicture: formData.profilePicture,
            coverImage: formData.coverImage,
          };

          await axios.put(
            `/api/users/${user._id}`,
            userDetails,
            { headers }
          );
          setOriginalUserDetails(JSON.stringify(userDetails));
          isSuccess = true;
          console.log('User details updated successfully');
        } catch (error) {
          console.error('Error updating user details:', error);
          setToast({ show: true, message: 'Failed to update user details', type: 'error' });
          throw new Error('Failed to update user details');
        }
      }

      if (hasRoleDetailsChanged) {
        try {
          if (formData.role === 'founder') {
            const updatedFounderDetails = {
              educationalBackground: formData.founderDetails.educationalBackground,
              skills: formData.founderDetails.skills,
              workExperience: formData.founderDetails.workExperience,
              certifications: formData.founderDetails.certifications,
              portfolioLinks: formData.founderDetails.portfolioLinks,
            };

            await axios.put(
              `/api/users/entrepreneurs/${user._id}`,
              updatedFounderDetails,
              { headers }
            );
            setOriginalRoleDetails(JSON.stringify(updatedFounderDetails));
            console.log('Founder details updated successfully');
            isSuccess = true;
          } else if (formData.role === 'investor') {
            const updatedInvestorDetails = {
              investor_type: formData.investorDetails.investor_type,
              funds_available: formData.investorDetails.funds_available,
              investment_interests: formData.investorDetails.investment_interests,
              previous_investments: formData.investorDetails.previous_investments,
            };

            await axios.put(
              `/api/users/investors/${user._id}`,
              updatedInvestorDetails,
              { headers }
            );
            setOriginalRoleDetails(JSON.stringify(updatedInvestorDetails));
            console.log('Investor details updated successfully');
            isSuccess = true;
          }
        } catch (error) {
          console.error('Error updating role details:', error);
          setToast({ show: true, message: 'Failed to update role details', type: 'error' });
          throw new Error('Failed to update role details');
        }
      }

      if (isSuccess) {
        setToast({ show: true, message: 'Profile updated successfully!', type: 'success' });
        setTimeout(() => {
          navigate(`/user/${user._id}`);
        }, 1200);
      } else {
        setToast({ show: true, message: 'No changes to save', type: 'info' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({ show: true, message: `Failed to update profile: ${error.message}`, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Loading and error states
  if (loading || isSaving) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!user || !formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">No user data available</div>
      </div>
    );
  }

  return (
    <>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        position="top-right"
        onClose={() => setToast({ ...toast, show: false })}
      />
      <section className="relative pt-24 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-gray-50">
        {/* Cover Image */}
        <div
          className="w-full absolute top-0 left-0 z-0 h-48 sm:h-56 lg:h-60 cursor-pointer group"
          onMouseEnter={() => setImageHover((prev) => ({ ...prev, cover: true }))}
          onMouseLeave={() => setImageHover((prev) => ({ ...prev, cover: false }))}
        >
          <img
            src={formData.coverImage || fallbackCover}
            alt="cover"
            className="w-full h-full object-cover"
          />
          <label
            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
              imageHover.cover ? 'bg-opacity-50' : 'bg-opacity-0'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'cover')}
              className="hidden"
            />
            <span
              className={`text-white font-medium transition-opacity duration-300 ${
                imageHover.cover ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Click to Upload Cover Image
            </span>
          </label>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Profile Header */}
          <div className="rounded-xl pb-8 m-12">
            {/* Profile Picture */}
            <div className="flex items-center justify-center mb-4 sm:mb-6 -mt-16">
              <div
                className="relative cursor-pointer group"
                onMouseEnter={() => setImageHover((prev) => ({ ...prev, profile: true }))}
                onMouseLeave={() => setImageHover((prev) => ({ ...prev, profile: false }))}
              >
                <img
                  src={formData.profilePicture || fallbackAvatar}
                  alt="profile"
                  className="border-4 border-solid w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 border-white rounded-full object-cover"
                />
                <label
                  className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-full transition-opacity duration-300 ${
                    imageHover.profile ? 'bg-opacity-50' : 'bg-opacity-0'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'profile')}
                    className="hidden"
                  />
                  <span
                    className={`text-white text-sm text-center font-medium transition-opacity duration-300 ${
                      imageHover.profile ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    Update Profile Picture
                  </span>
                </label>
              </div>
            </div>

            {/* Name and Bio */}
            <div className="text-center mb-6 px-4">
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange(e, 'fullName')}
                className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-600 focus:outline-none"
                placeholder="Your Name"
              />
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange(e, 'bio')}
                className="mt-2 w-full text-sm sm:text-base lg:text-base text-gray-500 text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-600 focus:outline-none resize-none"
                placeholder="Write something about yourself..."
                rows="2"
              />
            </div>
          </div>

          {/* Role-Specific Details */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {formData.role === 'founder' ? 'Founder Details' : 'Investor Details'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.role === 'founder' ? (
                <div className="space-y-6 col-span-2">
                  {/* Educational Background */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Educational Background</label>
                    {formData.founderDetails.educationalBackground.map((edu, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            updateListItem('educationalBackground', index, { ...edu, degree: e.target.value }, 'founderDetails')
                          }
                          className="p-2 border rounded"
                          placeholder="Degree"
                        />
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) =>
                            updateListItem('educationalBackground', index, { ...edu, institution: e.target.value }, 'founderDetails')
                          }
                          className="p-2 border rounded"
                          placeholder="Institution"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) =>
                              updateListItem('educationalBackground', index, { ...edu, year: e.target.value }, 'founderDetails')
                            }
                            className="flex-1 p-2 border rounded"
                            placeholder="Year"
                          />
                          <button
                            onClick={() => removeListItem('educationalBackground', index, 'founderDetails')}
                            className="px-3 py-1 text-red-500"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('educationalBackground', 'founderDetails')}
                      className="mt-2 text-indigo-600"
                    >
                      + Add Education
                    </button>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Skills</label>
                    {formData.founderDetails.skills.map((skill, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateListItem('skills', index, e.target.value, 'founderDetails')}
                          className="flex-1 p-2 border rounded"
                          placeholder="Enter skill"
                        />
                        <button
                          onClick={() => removeListItem('skills', index, 'founderDetails')}
                          className="px-3 py-1 text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('skills', 'founderDetails')}
                      className="mt-2 text-indigo-600"
                    >
                      + Add Skill
                    </button>
                  </div>

                  {/* Work Experience */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Work Experience</label>
                    {formData.founderDetails.workExperience.map((exp, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            updateListItem('workExperience', index, { ...exp, company: e.target.value }, 'founderDetails')
                          }
                          className="p-2 border rounded"
                          placeholder="Company"
                        />
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) =>
                            updateListItem('workExperience', index, { ...exp, role: e.target.value }, 'founderDetails')
                          }
                          className="p-2 border rounded"
                          placeholder="Role"
                        />
                        <input
                          type="text"
                          value={exp.duration}
                          onChange={(e) =>
                            updateListItem('workExperience', index, { ...exp, duration: e.target.value }, 'founderDetails')
                          }
                          className="p-2 border rounded"
                          placeholder="Duration"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={exp.description}
                            onChange={(e) =>
                              updateListItem('workExperience', index, { ...exp, description: e.target.value }, 'founderDetails')
                            }
                            className="flex-1 p-2 border rounded"
                            placeholder="Description"
                          />
                          <button
                            onClick={() => removeListItem('workExperience', index, 'founderDetails')}
                            className="px-3 py-1 text-red-500"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('workExperience', 'founderDetails')}
                      className="mt-2 text-indigo-600"
                    >
                      + Add Experience
                    </button>
                  </div>

                  {/* Certifications */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Certifications</label>
                    {formData.founderDetails.certifications.map((cert, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={cert}
                          onChange={(e) => updateListItem('certifications', index, e.target.value, 'founderDetails')}
                          className="flex-1 p-2 border rounded"
                          placeholder="Enter certification"
                        />
                        <button
                          onClick={() => removeListItem('certifications', index, 'founderDetails')}
                          className="px-3 py-1 text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('certifications', 'founderDetails')}
                      className="mt-2 text-indigo-600"
                    >
                      + Add Certification
                    </button>
                  </div>

                  {/* Portfolio Links */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Portfolio Links</label>
                    {formData.founderDetails.portfolioLinks.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="url"
                          value={link}
                          onChange={(e) => updateListItem('portfolioLinks', index, e.target.value, 'founderDetails')}
                          className="flex-1 p-2 border rounded"
                          placeholder="Enter portfolio link"
                        />
                        <button
                          onClick={() => removeListItem('portfolioLinks', index, 'founderDetails')}
                          className="px-3 py-1 text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('portfolioLinks', 'founderDetails')}
                      className="mt-2 text-indigo-600"
                    >
                      + Add Portfolio Link
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 col-span-2">
                  {/* Investor Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Investor Type</label>
                    <select
                      value={formData.investorDetails.investor_type}
                      onChange={(e) => handleInputChange(e, 'investor_type', 'investorDetails')}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select Type</option>
                      <option value="Angel">Angel</option>
                      <option value="VC">VC</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Government">Government</option>
                    </select>
                  </div>

                  {/* Funds Available */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Funds Available</label>
                    <input
                      type="number"
                      value={formData.investorDetails.funds_available}
                      onChange={(e) => handleInputChange(e, 'funds_available', 'investorDetails')}
                      className="w-full p-2 border rounded"
                      placeholder="Enter available funds"
                    />
                  </div>

                  {/* Investment Interests */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Investment Interests</label>
                    {formData.investorDetails.investment_interests.map((interest, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={interest}
                          onChange={(e) => updateListItem('investment_interests', index, e.target.value, 'investorDetails')}
                          className="flex-1 p-2 border rounded"
                          placeholder="Enter investment interest"
                        />
                        <button
                          onClick={() => removeListItem('investment_interests', index, 'investorDetails')}
                          className="px-3 py-1 text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('investment_interests', 'investorDetails')}
                      className="mt-2 text-indigo-600"
                    >
                      + Add Interest
                    </button>
                  </div>

                  {/* Previous Investments */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Previous Investments</label>
                    {formData.investorDetails.previous_investments.map((investment, index) => (
                      <div key={index} className="grid grid-cols-3 gap-2 mt-2">
                        <input
                          type="text"
                          value={investment.startupName || ''}
                          onChange={(e) =>
                            updateListItem('previous_investments', index, { ...investment, startupName: e.target.value }, 'investorDetails')
                          }
                          className="p-2 border rounded"
                          placeholder="Startup Name"
                        />
                        <input
                          type="number"
                          value={investment.amount || ''}
                          onChange={(e) =>
                            updateListItem('previous_investments', index, { ...investment, amount: e.target.value }, 'investorDetails')
                          }
                          className="p-2 border rounded"
                          placeholder="Amount"
                        />
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={investment.date || ''}
                            onChange={(e) =>
                              updateListItem('previous_investments', index, { ...investment, date: e.target.value }, 'investorDetails')
                            }
                            className="flex-1 p-2 border rounded"
                          />
                          <button
                            onClick={() => removeListItem('previous_investments', index, 'investorDetails')}
                            className="px-3 py-1 text-red-500"
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('previous_investments', 'investorDetails')}
                      className="mt-2 text-indigo-600"
                    >
                      + Add Investment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={(!hasUserDetailsChanged && !hasRoleDetailsChanged) || isSaving}
              className={`rounded-full border border-solid border-indigo-600 bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow transition-all duration-500 ${
                (!hasUserDetailsChanged && !hasRoleDetailsChanged) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default EditProfile;