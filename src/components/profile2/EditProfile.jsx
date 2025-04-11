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

  const [imageHover, setImageHover] = useState({
    cover: false,
    profile: false
  });

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Implement your image upload logic here
      // For now, we'll just create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [type === 'cover' ? 'coverImage' : 'profilePicture']: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative pt-24 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-gray-50">
      {/* Cover Image with overlay */}
      <div 
        className="w-full absolute top-0 left-0 z-0 h-48 sm:h-56 lg:h-60 cursor-pointer group"
        onMouseEnter={() => setImageHover(prev => ({ ...prev, cover: true }))}
        onMouseLeave={() => setImageHover(prev => ({ ...prev, cover: false }))}
      >
        <img
          src={formData.coverImage || fallbackCover}
          alt="cover"
          className="w-full h-full object-cover"
        />
        <label className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${imageHover.cover ? 'bg-opacity-50' : 'bg-opacity-0'}`}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, 'cover')}
            className="hidden"
          />
          <span className={`text-white font-medium transition-opacity duration-300 ${imageHover.cover ? 'opacity-100' : 'opacity-0'}`}>
            Click to Upload Cover Image
          </span>
        </label>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Profile Header Card with Shadow */}
        <div className="rounded-xl pb-8 m-12">
          {/* Profile Picture */}
          <div className="flex items-center justify-center mb-4 sm:mb-6 -mt-16">
            <div 
              className="relative cursor-pointer group"
              onMouseEnter={() => setImageHover(prev => ({ ...prev, profile: true }))}
              onMouseLeave={() => setImageHover(prev => ({ ...prev, profile: false }))}
            >
              <img
                src={formData.profilePicture || fallbackAvatar}
                alt="profile"
                className="border-4 border-solid w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 border-white rounded-full object-cover"
              />
              <label className={`absolute inset-0 flex items-center justify-center bg-black/40 rounded-full transition-opacity duration-300 ${imageHover.profile ? 'bg-opacity-50' : 'bg-opacity-0'}`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                  className="hidden"
                />
                <span className={`text-white text-sm text-center font-medium transition-opacity duration-300 ${imageHover.profile ? 'opacity-100' : 'opacity-0'}`}>
                  Update Profile Picture
                </span>
              </label>
            </div>
          </div>

          {/* Name and Bio - Inline Editable */}
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

        {/* Role-Specific Details Section with Different Background */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {user.role === 'founder' ? 'Founder Details' : 'Investor Details'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.role === 'founder' ? (
              // Founder Details
              <div className="space-y-6 col-span-2">
                {/* Education Background */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Educational Background</label>
                  {formData.founderDetails.educationalBackground.map((edu, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={edu}
                        onChange={(e) => updateListItem('educationalBackground', index, e.target.value, 'founderDetails')}
                        className="flex-1 p-2 border rounded hover:border-gray-300 focus:border-indigo-600 focus:outline-none"
                        placeholder="Enter education details"
                      />
                      <button
                        onClick={() => removeListItem('educationalBackground', index, 'founderDetails')}
                        className="px-3 py-1 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem('educationalBackground', 'founderDetails')}
                    className="mt-2 text-indigo-600 hover:text-indigo-700"
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
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={exp}
                        onChange={(e) => updateListItem('workExperience', index, e.target.value, 'founderDetails')}
                        className="flex-1 p-2 border rounded"
                        placeholder="Enter work experience"
                      />
                      <button
                        onClick={() => removeListItem('workExperience', index, 'founderDetails')}
                        className="px-3 py-1 text-red-500"
                      >
                        Remove
                      </button>
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
              // Investor Details
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
                        value={investment.startupName}
                        onChange={(e) => updateListItem('previous_investments', index, 
                          { ...investment, startupName: e.target.value }, 'investorDetails')}
                        className="p-2 border rounded"
                        placeholder="Startup Name"
                      />
                      <input
                        type="number"
                        value={investment.amount}
                        onChange={(e) => updateListItem('previous_investments', index,
                          { ...investment, amount: e.target.value }, 'investorDetails')}
                        className="p-2 border rounded"
                        placeholder="Amount"
                      />
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={investment.date}
                          onChange={(e) => updateListItem('previous_investments', index,
                            { ...investment, date: e.target.value }, 'investorDetails')}
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