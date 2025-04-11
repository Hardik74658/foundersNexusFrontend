import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HeartIcon } from '@heroicons/react/24/solid';
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  // Retrieve current user data from Redux (fallback to localStorage if needed)
  const currentUserData = useSelector((state) => state.auth.userData) || {
    _id: localStorage.getItem('userId') || 'currentUserId',
    fullName: 'Your Name',
    profilePicture: 'https://via.placeholder.com/150',
  };

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local state for likes, comments, and new comment text.
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/posts/${postId}`);
        setPost(response.data);
        setLikes(response.data.likes || []);
        setComments(response.data.commentsData || []);
      } catch (err) {
        console.error('Error fetching post:', err.response?.data || err.message);
        setError(err.response?.data?.detail || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    } else {
      setError('No post ID provided');
      setLoading(false);
    }
  }, [postId]);

  const handleLike = async () => {
    const userId = currentUserData._id;
    if (!userId) return;

    // Optimistic update for likes
    setPost((prevPost) => {
      const currentLikes = prevPost.likes || [];
      let updatedLikes;
      if (currentLikes.includes(userId)) {
        updatedLikes = currentLikes.filter((id) => id !== userId);
      } else {
        updatedLikes = [...currentLikes, userId];
      }
      return { ...prevPost, likes: updatedLikes };
    });

    try {
      const response = await axios.post(`http://127.0.0.1:8000/posts/${postId}/like/${userId}`);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Optionally revert the optimistic update here if necessary
      setPost((prevPost) => {
        const currentLikes = prevPost.likes || [];
        let revertedLikes;
        if (currentLikes.includes(userId)) {
          revertedLikes = currentLikes.filter((id) => id !== userId);
        } else {
          revertedLikes = [...currentLikes, userId];
        }
        return { ...prevPost, likes: revertedLikes };
      });
    }
  };

  const handlePostComment = () => {
    if (commentText.trim() === '') return;
    const newComment = {
      _id: Date.now().toString(),
      content: commentText,
      user: currentUserData,
    };
    setComments([...comments, newComment]);
    setCommentText('');
    // Optionally call API to post comment
  };

  const goToUserProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Post Card */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        {/* Cover Image with Overlapping Title */}
        <div className="relative">
          <img
            src={post.image_url}
            alt="Cover"
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <h3 className="absolute bottom-4 left-6 text-white text-3xl font-bold">
            {post.title}
          </h3>
        </div>
        <div className="p-6">
          {/* Post Author Section */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={post.user.profilePicture}
              alt={post.user.fullName}
              onClick={() => goToUserProfile(post.user._id)}
              className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
            />
            <button
              onClick={() => goToUserProfile(post.user._id)}
              className="text-xl font-bold text-gray-900 hover:underline cursor-pointer"
            >
              {post.user.fullName}
            </button>
          </div>
          {/* Post Content */}
          <p className="text-gray-700 text-lg mb-4">{post.content}</p>
          {/* Like & Comment Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
            >
              <HeartIcon className="w-5 h-5" />
              <span>{(post?.likes || []).length}</span>
            </button>
            <button className="flex items-center gap-1 border border-gray-300 text-gray-600 px-4 py-2 rounded-full">
              <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
              <span>{comments.length}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div>
        <h4 className="text-2xl font-semibold text-gray-800 mb-6">Comments</h4>
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <img
                src={comment.user.profilePicture}
                alt={comment.user.fullName}
                onClick={() => goToUserProfile(comment.user._id)}
                className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
              />
              <div>
                <button
                  onClick={() => goToUserProfile(comment.user._id)}
                  className="text-xl font-bold text-gray-900 hover:underline cursor-pointer"
                >
                  {comment.user.fullName}
                </button>
                <p className="text-gray-700 text-lg">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Form Card */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h5 className="text-2xl font-semibold text-gray-800 mb-4">Leave a Comment</h5>
        <div className="flex items-center gap-4 mb-4">
          <img
            src={currentUserData.profilePicture}
            alt={currentUserData.fullName}
            onClick={() => goToUserProfile(currentUserData._id)}
            className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
          />
          <span className="text-xl font-bold text-gray-900">{currentUserData.fullName}</span>
        </div>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your comment here..."
        ></textarea>
        <button
          onClick={handlePostComment}
          className="mt-4 w-full py-3 bg-indigo-600 text-white text-lg font-semibold rounded-full transition-all duration-300 hover:bg-indigo-700"
        >
          Post Comment
        </button>
      </div>
    </div>
  );
};

export default PostDetails;
