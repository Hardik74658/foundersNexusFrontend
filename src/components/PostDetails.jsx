import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { 
  HeartIcon as HeartIconOutline, 
  ChatBubbleBottomCenterTextIcon, 
  ArrowLeftIcon, 
  ShareIcon, 
  BookmarkIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import Toast from '../components/layout/Toast';

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  // Retrieve current user data from Redux (fallback to localStorage if needed)
  const currentUserData = useSelector((state) => state.auth.user) 

  console.log('Current User ID:', currentUserData);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [animateLike, setAnimateLike] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  };

  const fetchPost = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8000/posts/${postId}`);
      setPost(response.data);
    } catch (err) {
      console.error('Error fetching post:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) {
      fetchPost();
    } else {
      setError('No post ID provided');
      setLoading(false);
    }
  }, [postId, fetchPost]);

  const hasUserLiked = post?.likes?.includes(currentUserData.id);

  const handleLike = async () => {
    const userId = currentUserData.id;
    if (!userId) return;

    setAnimateLike(true);
    setTimeout(() => setAnimateLike(false), 500);

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
      const response = await axios.post(`http://localhost:8000/posts/${postId}/like/${userId}`);
      
      setToastMessage(hasUserLiked ? 'Post unliked' : 'Post liked');
      setToastType(hasUserLiked ? 'info' : 'success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error toggling like:', error);
      
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
      
      setToastMessage('Failed to update like');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handlePostComment = async () => {
    if (commentText.trim() === '') return;
    
    setIsSubmitting(true);
    
    try {
      const commentData = {
        content: commentText,
        userId: currentUserData.id,
        postId: postId
      };
      
      await axios.post(
        `http://localhost:8000/posts/${postId}/comments`,
        commentData
      );
      
      setCommentText('');
      fetchPost();
      
      setToastMessage('Your comment was posted successfully');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error posting comment:', error);
      setToastMessage('Failed to post comment');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToUserProfile = (userId) => {
    navigate(`/user/${userId}`);
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-50">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-md bg-indigo-300 opacity-50"></div>
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-500 border-t-transparent relative z-10"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-50 px-4 text-center">
        <div className="rounded-full bg-red-50 p-6 mb-6 shadow-inner">
          <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-8 max-w-md">{error}</p>
        <button 
          onClick={handleGoBack}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full shadow-md hover:bg-indigo-700 transition-all hover:shadow-lg flex items-center"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-50">
      {/* Toast Message */}
      {showToast && <Toast message={toastMessage} type={toastType} />}
      
      {/* Modern Header with cleaner design */}
      <header className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={handleGoBack}
              className="group flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <div className="bg-indigo-50 group-hover:bg-indigo-100 p-2 rounded-full mr-2 transition-colors">
                <ArrowLeftIcon className="h-5 w-5" />
              </div>
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex space-x-3">
              <button className="bg-indigo-50 hover:bg-indigo-100 p-3 rounded-full text-indigo-600 transition-colors">
                <BookmarkIcon className="h-5 w-5" />
              </button>
              <button className="bg-indigo-50 hover:bg-indigo-100 p-3 rounded-full text-indigo-600 transition-colors">
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Redesigned Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white shadow-sm rounded-3xl overflow-hidden mb-12 border border-gray-100">
          {/* Hero Image with better scaling */}
          {post.image_url && (
            <div className="relative h-[50vh] overflow-hidden rounded-t-3xl">
              <img 
                src={post.image_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8">
            {/* Post Title and Author Info */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center">
                <img
                  src={post.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.fullName)}&background=random`}
                  alt={post.user.fullName}
                  onClick={() => goToUserProfile(post.user._id)}
                  className="w-12 h-12 rounded-full object-cover cursor-pointer border-2 border-indigo-100"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={() => goToUserProfile(post.user._id)}>
                    {post.user.fullName}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
              </div>
            </div>
            
            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-10">
              <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
            
            {/* Engagement Metrics with updated styling */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <div className="flex items-center gap-8">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-all ${
                    animateLike ? 'scale-110' : 'scale-100'
                  }`}
                >
                  {hasUserLiked ? (
                    <HeartIconSolid className="w-6 h-6 text-indigo-600" />
                  ) : (
                    <HeartIconOutline className="w-6 h-6 text-gray-500 hover:text-indigo-600" />
                  )}
                  <span className="text-sm font-semibold">{post.likes?.length || 0} likes</span>
                </button>
                
                <button 
                  className="flex items-center gap-2"
                  onClick={() => document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' })}
                >
                  <ChatBubbleBottomCenterTextIcon className="w-6 h-6 text-gray-500 hover:text-indigo-600" />
                  <span className="text-sm font-semibold">{post.commentsData?.length || 0} comments</span>
                </button>
              </div>
              
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                Report
              </button>
            </div>
          </div>
        </div>
        
        {/* Redesigned Comments Section */}
        <div id="comments-section" className="mb-16 scroll-mt-20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 text-indigo-600 rounded-full p-2">
                <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Discussion ({post.commentsData?.length || 0})
              </h2>
            </div>
          </div>
          
          {/* New Comment Form - Updated Design */}
          <div className="bg-white shadow-sm rounded-3xl p-6 mb-10 border border-gray-100 transition-all duration-300 hover:border-indigo-100">
            <div className="flex items-start gap-4 mb-6">
              {currentUserData && currentUserData.profilePicture ? (
                <img
                  src={currentUserData.profilePicture}
                  alt={currentUserData.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserCircleIcon className="w-8 h-8 text-indigo-400" />
                </div>
              )}
              
              <div className="flex-1">
                <p className="font-medium text-gray-900 mb-1">{currentUserData?.name || 'Anonymous'}</p>
                <p className="text-xs text-indigo-600">Share your thoughts</p>
              </div>
            </div>
            
            <div className="relative mb-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-100 focus:outline-none focus:border-indigo-300 transition-all text-gray-700 placeholder-gray-400"
                placeholder="What are your thoughts on this post?"
                rows="3"
                disabled={isSubmitting}
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handlePostComment}
                disabled={!commentText.trim() || isSubmitting}
                className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                  !commentText.trim() || isSubmitting
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md"
                }`}
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
          
          {/* Comments List */}
          {post.commentsData && post.commentsData.length > 0 ? (
            <div className="space-y-4">
              {post.commentsData.map((comment) => (
                <div 
                  key={comment._id} 
                  className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:border-indigo-100 transition-all"
                >
                  <div className="flex">
                    {/* User Avatar */}
                    <img
                      src={comment.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.fullName)}&background=random`}
                      alt={comment.user.fullName}
                      onClick={() => goToUserProfile(comment.user._id)}
                      className="w-10 h-10 rounded-full object-cover cursor-pointer flex-shrink-0 border-2 border-indigo-50"
                    />
                    
                    {/* Comment Content */}
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <button
                          onClick={() => goToUserProfile(comment.user._id)}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                        >
                          {comment.user.fullName}
                        </button>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                      
                      {/* Comment Actions */}
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                        <button className="hover:text-indigo-600 transition-colors">Reply</button>
                        <button className="hover:text-indigo-600 transition-colors">Share</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100">
              <div className="inline-flex rounded-full bg-indigo-100 p-4 mb-4">
                <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Join the conversation</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-4 text-sm">Be the first to share your thoughts on this post!</p>
              <button
                onClick={() => document.querySelector('textarea').focus()}
                className="px-5 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors font-medium rounded-full text-sm"
              >
                Add a comment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
