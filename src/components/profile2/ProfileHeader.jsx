import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../layout/Toast.jsx';
import Loader from '../layout/Loader.jsx';

const ProfileHeader = ({ user, openPostModal }) => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(user.followers ? user.followers.length : 0);
  const [followingCount, setFollowingCount] = useState(user.following ? user.following.length : 0);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalList, setModalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const fallbackCover = "https://pagedone.io/asset/uploads/1705473378.png";
  const fallbackAvatar = "https://static.vecteezy.com/system/resources/previews/034/324/147/large_2x/front-view-of-an-animated-boy-standing-wearing-tshirt-character-design-free-photo.jpeg";

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setCurrentUserId(id);
    setIsCurrentUser(user._id === id);
    if (id && user.followers) {
      setIsFollowing(user.followers.includes(id));
    }
    setFollowersCount(user.followers ? user.followers.length : 0);
    setFollowingCount(user.following ? user.following.length : 0);
  }, [user]);

  const handleFollowToggle = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/users/${user._id}/${currentUserId}`, {
        headers: { accept: 'application/json' }
      });
      const message = response.data.message;
      if (message.includes("Added")) {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
        setToastMessage("You are now following this user.");
      } else if (message.includes("Removed")) {
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
        setToastMessage("You have unfollowed this user.");
      }
    } catch (error) {
      setToastMessage("Error toggling follow status.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/users/${user._id}`);
      const userString = JSON.stringify(res.data);
      navigate("/user/editProfile", { state: { user: userString } });
    } catch (error) {
      setToastMessage("Error fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = async (type) => {
    setModalType(type);
    setShowModal(true);
    setLoading(true);
    try {
      let endpoint = "";
      if (type === "followers") {
        endpoint = `http://127.0.0.1:8000/users/${user._id}/followers`;
      } else {
        endpoint = `http://127.0.0.1:8000/users/${user._id}/following`;
      }
      const res = await axios.get(endpoint, { headers: { accept: 'application/json' } });
      setModalList(res.data[type]);
    } catch (error) {
      setToastMessage("Error fetching modal list.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalList([]);
  };

  return (
    <section className="relative pt-24 sm:pt-28 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 bg-white shadow">
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/30 z-50">
          <Loader />
        </div>
      )}
      {toastMessage && (
        <Toast
          message={toastMessage}
          show={true}
          onClose={() => setToastMessage(null)}
        />
      )}
      {/* Cover Image */}
      <img
        src={user.coverImage || fallbackCover}
        alt="cover-image"
        className="w-full absolute top-0 left-0 z-0 h-48 sm:h-56 lg:h-60 object-cover"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Avatar Section */}
        <div className="flex items-center justify-center mb-4 sm:mb-6">
          <img
            src={user.profilePicture || fallbackAvatar}
            alt="user-avatar-image"
            onClick={() => navigate(`/user/${user._id}`)}
            className="border-4 border-solid w-1/2 sm:w-1/3 lg:w-1/5 border-white rounded-full object-cover cursor-pointer hover:opacity-90 transition"
          />
        </div>

        {/* Navigation & Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6">
          <ul className="flex items-center gap-3 sm:gap-5">
            <li>
              <a href="javascript:;" className="flex items-center gap-1 sm:gap-2 cursor-pointer group">
                <svg xmlns="http://www.w3.org/2000/svg" width="5" height="20" viewBox="0 0 5 20" fill="none">
                  <path d="M4.12567 1.13672L1 18.8633" stroke="#E5E7EB" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.5 14.0902L7.5 14.0902M2.5 9.09545V14.0902C2.5 15.6976 2.5 16.5013 2.98816 17.0006C3.47631 17.5 4.26198 17.5 5.83333 17.5H14.1667C15.738 17.5 16.5237 17.5 17.0118 17.0006C17.5 16.5013 17.5 15.6976 17.5 14.0902V10.9203C17.5 9.1337 17.5 8.24039 17.1056 7.48651C16.7112 6.73262 15.9846 6.2371 14.5313 5.24606L11.849 3.41681C10.9528 2.8056 10.5046 2.5 10 2.5C9.49537 2.5 9.04725 2.80561 8.151 3.41681L3.98433 6.25832C3.25772 6.75384 2.89442 7.0016 2.69721 7.37854C2.5 7.75548 2.5 8.20214 2.5 9.09545Z"
                    stroke="black" strokeWidth="1.6" strokeLinecap="round"
                  />
                </svg>
                <span className="font-medium text-base sm:text-lg leading-7 text-gray-900">Profile</span>
                <span className="rounded-full py-1 px-2 bg-indigo-100 flex items-center justify-center font-medium text-xs sm:text-sm text-indigo-600">
                  New
                </span>
              </a>
            </li>
          </ul>
          <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-0">
            {isCurrentUser ? (
              <>
                <button
                  onClick={handleEditProfile}
                  className="rounded-full border border-solid border-gray-300 bg-gray-50 py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base font-semibold text-gray-900 shadow transition-all duration-500 hover:shadow-gray-50 hover:bg-gray-100 hover:border-gray-300"
                >
                  Edit Profile
                </button>
                <button
                  onClick={openPostModal}
                  className="rounded-full border border-solid border-indigo-600 bg-indigo-600 py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base font-semibold text-white whitespace-nowrap shadow transition-all duration-500 hover:shadow-gray-200 hover:bg-indigo-700 hover:border-indigo-700"
                >
                  Create New Post
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => console.log('Message clicked')}
                  className="rounded-full border border-solid border-gray-300 bg-gray-50 py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base font-semibold text-gray-900 shadow transition-all duration-500 hover:shadow-gray-50 hover:bg-gray-100 hover:border-gray-300"
                >
                  Message
                </button>
                <button
                  onClick={handleFollowToggle}
                  className={
                    isFollowing
                      ? "rounded-full border border-solid border-gray-300 bg-gray-50 py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base font-semibold text-gray-900 whitespace-nowrap shadow transition-all duration-500 hover:shadow-gray-50 hover:bg-gray-100 hover:border-gray-300"
                      : "rounded-full border border-solid border-indigo-600 bg-indigo-600 py-2 px-3 sm:py-3 sm:px-4 text-sm sm:text-base font-semibold text-white whitespace-nowrap shadow transition-all duration-500 hover:shadow-gray-200 hover:bg-indigo-700 hover:border-indigo-700"
                  }
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              </>
            )}
          </div>
        </div>

        <h3 className="text-center font-manrope font-bold text-2xl sm:text-3xl lg:text-3xl leading-tight text-gray-900 mb-2 sm:mb-3">
          {user.fullName || "Jenny Wilson"}
        </h3>
        <p className="font-normal text-sm sm:text-base lg:text-base leading-relaxed text-gray-500 text-center mb-6">
          {user.bio || "A social media influencer and singer"}
        </p>

        {/* Status Cards for Followers and Following */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 my-6">
          <div 
            onClick={() => openModal("followers")} 
            className="px-4 py-3 bg-indigo-100 rounded-2xl cursor-pointer text-center"
          >
            <p className="text-lg sm:text-xl font-semibold text-indigo-800">Followers</p>
            <p className="text-base sm:text-lg text-indigo-800">{followersCount}</p>
          </div>
          <div 
            onClick={() => openModal("following")} 
            className="px-4 py-3 bg-indigo-100 rounded-2xl cursor-pointer text-center"
          >
            <p className="text-lg sm:text-xl font-semibold text-indigo-800">Following</p>
            <p className="text-base sm:text-lg text-indigo-800">{followingCount}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <a href="javascript:;" className="p-3 rounded-full border border-solid border-gray-300 group bg-gray-50 transition-all duration-500 hover:bg-indigo-700 hover:border-indigo-700">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1115_412)">
                <path className="fill-blue-400 transition-all duration-500 group-hover:fill-white"
                  d="M20 10.2391C20 9.56523 19.9333 8.86958 19.8222 8.21741H10.2V12.0652H15.7111C15.4889 13.3044 14.7556 14.3913 13.6667 15.087L16.9556 17.587C18.8889 15.8261 20 13.2609 20 10.2391Z"
                />
                <path className="fill-green-400 transition-all duration-500 group-hover:fill-white"
                  d="M10.2 19.9783C12.9556 19.9783 15.2667 19.087 16.9556 17.5652L13.6667 15.087C12.7556 15.6957 11.5778 16.0435 10.2 16.0435C7.53337 16.0435 5.28893 14.2826 4.46671 11.9348L1.08893 14.4783C2.82226 17.8479 6.33337 19.9783 10.2 19.9783Z"
                />
                <path className="fill-yellow-400 transition-all duration-500 group-hover:fill-white"
                  d="M4.46673 11.913C4.0445 10.6739 4.0445 9.32608 4.46673 8.08695L1.08895 5.52173C-0.355496 8.34782 -0.355496 11.6739 1.08895 14.4783L4.46673 11.913Z"
                />
                <path className="fill-red-400 transition-all duration-500 group-hover:fill-white"
                  d="M10.2 3.97827C11.6445 3.95653 13.0667 4.5 14.1112 5.47827L17.0223 2.6087C15.1778 0.913046 12.7334 2.58834e-06 10.2 0.0217417C6.33337 0.0217417 2.82226 2.15218 1.08893 5.52174L4.46671 8.08696C5.28893 5.7174 7.53337 3.97827 10.2 3.97827Z"
                />
              </g>
              <defs>
                <clipPath id="clip0_1115_412">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a>
          <a href="javascript:;" className="p-3 rounded-full border border-solid border-gray-300 bg-gray-50 group transition-all duration-500 hover:bg-indigo-700 hover:border-indigo-700">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1115_52)">
                <path className="fill-indigo-600 transition-all duration-500 group-hover:fill-white"
                  d="M10.0001 20C15.523 20 20.0001 15.5228 20.0001 10C20.0001 4.47715 15.523 0 10.0001 0C4.47727 0 0.00012207 4.47715 0.00012207 10C0.00012207 15.5228 4.47727 20 10.0001 20Z"
                />
                <path className="fill-white transition-all duration-500 group-hover:fill-indigo-700"
                  d="M13.2516 3.06946H11.0364C9.72179 3.06946 8.25958 3.62236 8.25958 5.52793C8.266 6.1919 8.25958 6.82779 8.25958 7.54345H6.73877V9.96352H8.30665V16.9305H11.1877V9.91754H13.0893L13.2613 7.53666H11.1381C11.1381 7.53666 11.1428 6.47754 11.1381 6.16997C11.1381 5.41693 11.9216 5.46005 11.9688 5.46005C12.3416 5.46005 13.0666 5.46114 13.2527 5.46005V3.06946H13.2516V3.06946Z"
                />
              </g>
              <defs>
                <clipPath id="clip0_1115_52">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </a>
          <a href="javascript:;" className="p-3 rounded-full border border-solid border-gray-300 bg-gray-50 group transition-all duration-500 hover:bg-indigo-700 hover:border-indigo-700">
            <svg className="stroke-red-600 transition-all duration-500 group-hover:stroke-white" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.1667 5.83333V5.875M9.16673 17.5H10.8334C13.9761 17.5 15.5474 17.5 16.5237 16.5237C17.5001 15.5474 17.5001 13.976 17.5001 10.8333V9.16667C17.5001 6.02397 17.5001 4.45262 16.5237 3.47631C15.5474 2.5 13.9761 2.5 10.8334 2.5H9.16673C6.02403 2.5 4.45268 2.5 3.47637 3.47631C2.50006 4.45262 2.50006 6.02397 2.50006 9.16667V10.8333C2.50006 13.976 2.50006 15.5474 3.47637 16.5237C4.45268 17.5 6.02403 17.5 9.16673 17.5ZM13.3334 10C13.3334 11.8409 11.841 13.3333 10.0001 13.3333C8.15911 13.3333 6.66673 11.8409 6.66673 10C6.66673 8.15905 8.15911 6.66667 10.0001 6.66667C11.841 6.66667 13.3334 8.15905 13.3334 10Z"
                stroke="" strokeWidth="1.6" strokeLinecap="round" 
              />
          </svg>
          </a>
          <a href="javascript:;" className="p-3 rounded-full border border-solid border-gray-300 bg-gray-50 group transition-all duration-500 hover:bg-indigo-700 hover:border-indigo-700">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-red-600 transition-all duration-500 group-hover:fill-white"
                d="M1.40288 6.21319C1.48321 4.97646 2.47753 4.00723 3.71535 3.9459C5.5078 3.8571 8.06973 3.75 10.0001 3.75C11.9304 3.75 14.4923 3.8571 16.2848 3.9459C17.5226 4.00723 18.5169 4.97646 18.5972 6.21319C18.6742 7.39808 18.7501 8.85604 18.7501 10C18.7501 11.144 18.6742 12.6019 18.5972 13.7868C18.5169 15.0235 17.5226 15.9928 16.2848 16.0541C14.4923 16.1429 11.9304 16.25 10.0001 16.25C8.06973 16.25 5.5078 16.1429 3.71535 16.0541C2.47753 15.9928 1.48321 15.0235 1.40288 13.7868C1.32591 12.6019 1.25006 11.144 1.25006 10C1.25006 8.85604 1.32591 7.39808 1.40288 6.21319Z"
                fill="#FC0D1B"
              />
              <path className="fill-white transition-all duration-500 group-hover:fill-indigo-700" d="M8.12506 7.5V12.5L13.1251 10L8.12506 7.5Z" fill="white" />
            </svg>
          </a>
        </div>
      </div>

      {/* Modal for Followers/Following List */}
      {showModal && (
  <div
    className="fixed inset-0 z-50 bg-black/30"
    onClick={closeModal}
  >
    <div
      className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center md:left-[250px] md:right-0"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-2xl py-4 px-5 max-h-[500px] overflow-y-auto sm:max-w-lg sm:w-full m-3 sm:mx-auto shadow-lg">
        {/* Divider */}
        <div className="w-full grid gap-8 my-4">
          <div className="flex w-full items-center rounded-full">
            <div className="flex-1 border-b border-indigo-600"></div>
            <span className="text-indigo-600 text-2xl font-semibold leading-8 px-8 py-3">
              {modalType === "followers" ? "Followers" : "Following"}
            </span>
            <div className="flex-1 border-b border-indigo-600"></div>
          </div>
        </div>
        <div className="overflow-y-auto py-4">
          {modalList.length > 0 ? (
            <ul className="space-y-4">
              {modalList.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <img
                    src={item.profilePicture || fallbackAvatar}
                    alt={item.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <p className="font-medium text-gray-800 text-sm md:text-base">
                      {item.fullName}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {item.email}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 text-sm md:text-base">
              No {modalType} found.
            </p>
          )}
        </div>
        <div className="flex items-center justify-end pt-4 border-t border-gray-200 space-x-4">
          <button
            type="button"
            onClick={closeModal}
            className="py-2.5 px-5 text-xs bg-indigo-50 text-indigo-500 rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}




    </section>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.object.isRequired,
  openPostModal: PropTypes.func.isRequired,
};

export default ProfileHeader;
