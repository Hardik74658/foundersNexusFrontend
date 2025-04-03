import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const EditProfile = ({ user }) => {
  // State to hold editable user data
  const [formData, setFormData] = useState({
    ...user,
    founderDetails: user.founderDetails || {
      educationalBackground: [],
      skills: [],
      workExperience: [],
      certifications: [],
      portfolioLinks: [],
    },
    investorDetails: user.investorDetails || {
      investor_type: '',
      funds_available: '',
      investment_interests: [],
      previous_investments: [],
    },
  });
  // State to track which field is being edited
  const [editingField, setEditingField] = useState(null);

  // Fallback images
  const fallbackCover = "https://pagedone.io/asset/uploads/1705473378.png";
  const fallbackAvatar = "https://static.vecteezy.com/system/resources/previews/034/324/147/large_2x/front-view-of-an-animated-boy-standing-wearing-tshirt-character-design-free-photo.jpeg";

  // **Handlers for Text Field Editing**
  const handleDoubleClick = (field) => {
    setEditingField(field);
  };

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

  // **Handlers for List Fields**
  const addListItem = (field, nestedField = null) => {
    if (nestedField) {
      setFormData({
        ...formData,
        [nestedField]: {
          ...formData[nestedField],
          [field]: [...formData[nestedField][field], ''],
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
        i === index ? value : item
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

  // **Save Handler**
  const handleSave = async () => {
    try {
      // Update user details
      const userDetails = {
        fullName: formData.fullName,
        email: formData.email,
        age: formData.age,
        bio: formData.bio,
        location: formData.location,
        profilePicture: formData.profilePicture,
        coverImage: formData.coverImage,
      };
      await axios.put(`http://localhost:8000/users/${user._id}`, userDetails);

      // Update role-specific details
      if (user.role === 'founder') {
        await axios.put(
          `http://localhost:8000/users/entrepreneurs/${user.founderId || user._id}`,
          formData.founderDetails
        );
      } else if (user.role === 'investor') {
        await axios.put(
          `http://localhost:8000/users/investors/${user.investorId || user._id}`,
          formData.investorDetails
        );
      }

      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <section className="relative pt-24 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-white shadow">
      {/* Cover Image */}
      <img
        src={formData.coverImage || fallbackCover}
        alt="cover-image"
        className="w-full absolute top-0 left-0 z-0 h-48 sm:h-56 lg:h-60 object-cover"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Avatar Section */}
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <img
            src={formData.profilePicture || fallbackAvatar}
            alt="user-avatar-image"
            className="border-4 border-solid w-1/2 sm:w-1/3 lg:w-1/5 border-white rounded-full object-cover"
          />
        </div>

        {/* Navigation & Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
          <ul className="flex items-center gap-3 sm:gap-5">
            <li>
              <span className="flex items-center gap-1 sm:gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="5"
                  height="20"
                  viewBox="0 0 5 20"
                  fill="none"
                >
                  <path
                    d="M4.12567 1.13672L1 18.8633"
                    stroke="#E5E7EB"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 14.0902L7.5 14.0902M2.5 9.09545V14.0902C2.5 15.6976 2.5 16.5013 2.98816 17.0006C3.47631 17.5 4.26198 17.5 5.83333 17.5H14.1667C15.738 17.5 16.5237 17.5 17.0118 17.0006C17.5 16.5013 17.5 15.6976 17.5 14.0902V10.9203C17.5 9.1337 17.5 8.24039 17.1056 7.48651C16.7112 6glo.73262 15.9846 6.2371 14.5313 5.24606L11.849 3.41681C10.9528 2.8056 10.5046 2.5 10 2.5C9.49537 2.5 9.04725 2.80561 8.151 3.41681L3.98433 6.25832C3.25772 6.75384 2.89442 7.0016 2.69721 7.37854C2.5 7.75548 2.5 8.20214 2.5 9.09545Z"
                    stroke="black"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-medium text-base sm:text-lg leading-7 text-gray-900">
                  Edit Profile
                </span>
              </span>
            </li>
          </ul>
        </div>

        {/* Full Name */}
        <div className="text-center mb-2">
          {editingField === 'fullName' ? (
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange(e, 'fullName')}
              onBlur={handleBlur}
              autoFocus
              className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 w-full text-center border rounded"
            />
          ) : (
            <h3
              onDoubleClick={() => handleDoubleClick('fullName')}
              className="text-2xl sm:text-3xl lg:text-3xl font-bold text-gray-900 cursor-pointer"
            >
              {formData.fullName || 'Jenny Wilson'}
            </h3>
          )}
        </div>

        {/* Bio */}
        <div className="text-center mb-6">
          {editingField === 'bio' ? (
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange(e, 'bio')}
              onBlur={handleBlur}
              autoFocus
              className="text-sm sm:text-base lg:text-base text-gray-500 w-full text-center border rounded"
            />
          ) : (
            <p
              onDoubleClick={() => handleDoubleClick('bio')}
              className="text-sm sm:text-base lg:text-base text-gray-500 cursor-pointer"
            >
              {formData.bio || 'A social media influencer and singer'}
            </p>
          )}
        </div>

        {/* Followers and Following */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 my-6">
          <div className="px-4 py-3 bg-indigo-100 rounded-2xl text-center">
            <p className="text-lg sm:text-xl font-semibold text-indigo-800">Followers</p>
            <p className="text-base sm:text-lg text-indigo-800">
              {formData.followers ? formData.followers.length : 0}
            </p>
          </div>
          <div className="px-4 py-3 bg-indigo-100 rounded-2xl text-center">
            <p className="text-lg sm:text-xl font-semibold text-indigo-800">Following</p>
            <p className="text-base sm:text-lg text-indigo-800">
              {formData.following ? formData.following.length : 0}
            </p>
          </div>
        </div>

        {/* Additional User Details */}
        <div className="mt-8">
          <h4 className="text-xl font-semibold mb-4 text-gray-900">Personal Information</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {editingField === 'email' ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, 'email')}
                  onBlur={handleBlur}
                  autoFocus
                  className="mt-1 block w-full border rounded"
                />
              ) : (
                <p
                  onDoubleClick={() => handleDoubleClick('email')}
                  className="mt-1 text-sm text-gray-900 cursor-pointer"
                >
                  {formData.email || 'Not set'}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              {editingField === 'age' ? (
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange(e, 'age')}
                  onBlur={handleBlur}
                  autoFocus
                  className="mt-1 block w-full border rounded"
                />
              ) : (
                <p
                  onDoubleClick={() => handleDoubleClick('age')}
                  className="mt-1 text-sm text-gray-900 cursor-pointer"
                >
                  {formData.age || 'Not set'}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              {editingField === 'location' ? (
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange(e, 'location')}
                  onBlur={handleBlur}
                  autoFocus
                  className="mt-1 block w-full border rounded"
                />
              ) : (
                <p
                  onDoubleClick={() => handleDoubleClick('location')}
                  className="mt-1 text-sm text-gray-900 cursor-pointer"
                >
                  {formData.location || 'Not set'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Role-Specific Details */}
        {user.role === 'founder' && (
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4 text-gray-900">Founder Details</h4>
            {/* Educational Background */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Educational Background</label>
              {formData.founderDetails.educationalBackground.map((item, index) => (
                <div key={index} className="flex items-center mt-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      updateListItem('educationalBackground', index, e.target.value, 'founderDetails')
                    }
                    className="block w-full border rounded"
                  />
                  <button
                    onClick={() => removeListItem('educationalBackground', index, 'founderDetails')}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addListItem('educationalBackground', 'founderDetails')}
                className="mt-2 text-blue-500"
              >
                Add Education
              </button>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              {formData.founderDetails.skills.map((item, index) => (
                <div key={index} className="flex items-center mt-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem('skills', index, e.target.value, 'founderDetails')}
                    className="block w-full border rounded"
                  />
                  <button
                    onClick={() => removeListItem('skills', index, 'founderDetails')}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addListItem('skills', 'founderDetails')}
                className="mt-2 text-blue-500"
              >
                Add Skill
              </button>
            </div>

            {/* Add similar blocks for workExperience, certifications, portfolioLinks */}
          </div>
        )}

        {user.role === 'investor' && (
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4 text-gray-900">Investor Details</h4>
            {/* Investor Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Investor Type</label>
              {editingField === 'investor_type' ? (
                <input
                  type="text"
                  value={formData.investorDetails.investor_type}
                  onChange={(e) => handleInputChange(e, 'investor_type', 'investorDetails')}
                  onBlur={handleBlur}
                  autoFocus
                  className="mt-1 block w-full border rounded"
                />
              ) : (
                <p
                  onDoubleClick={() => handleDoubleClick('investor_type')}
                  className="mt-1 text-sm text-gray-900 cursor-pointer"
                >
                  {formData.investorDetails.investor_type || 'Not set'}
                </p>
              )}
            </div>

            {/* Funds Available */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Funds Available</label>
              {editingField === 'funds_available' ? (
                <input
                  type="number"
                  value={formData.investorDetails.funds_available}
                  onChange={(e) => handleInputChange(e, 'funds_available', 'investorDetails')}
                  onBlur={handleBlur}
                  autoFocus
                  className="mt-1 block w-full border rounded"
                />
              ) : (
                <p
                  onDoubleClick={() => handleDoubleClick('funds_available')}
                  className="mt-1 text-sm text-gray-900 cursor-pointer"
                >
                  {formData.investorDetails.funds_available || 'Not set'}
                </p>
              )}
            </div>

            {/* Investment Interests */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Investment Interests</label>
              {formData.investorDetails.investment_interests.map((item, index) => (
                <div key={index} className="flex items-center mt-1">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      updateListItem('investment_interests', index, e.target.value, 'investorDetails')
                    }
                    className="block w-full border rounded"
                  />
                  <button
                    onClick={() => removeListItem('investment_interests', index, 'investorDetails')}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addListItem('investment_interests', 'investorDetails')}
                className="mt-2 text-blue-500"
              >
                Add Interest
              </button>
            </div>

            {/* Add similar block for previous_investments */}
          </div>
        )}

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-full border border-solid border-indigo-600 bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow transition-all duration-500 hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </section>
  );
};

EditProfile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default EditProfile;