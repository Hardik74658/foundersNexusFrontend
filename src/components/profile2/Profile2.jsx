import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProfileHeader from './ProfileHeader';
import PostCard from '../PostCard.jsx';
import CreatePostModal from '../Posts/CreatePostModal';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const { userId } = useParams();
  const currentUser = useSelector((state) => state.auth.userData) || {
    _id: localStorage.getItem('userId'),
    fullName: 'Current User',
    profilePicture: 'https://via.placeholder.com/150',
  };

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users/${userId}`);
        setProfile(response.data);
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
        const response = await axios.get(`http://localhost:8000/posts/user/${userId}`);
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
      const response = await axios.post(`http://localhost:8000/posts/${postId}/like/${userId}`);
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
    // Optionally, refresh posts after creating a new one
    setLoadingPosts(true);
    axios.get(`http://localhost:8000/posts/user/${userId}`).then((response) => {
      setPosts(response.data);
      setLoadingPosts(false);
    });
  };

  if (loadingProfile) {
    return <div className="text-center py-10">Loading profile...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Profile Header */}
      {profile && <ProfileHeader user={profile} openPostModal={openPostModal} />}

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
            <div className="text-center py-10">Loading posts...</div>
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
