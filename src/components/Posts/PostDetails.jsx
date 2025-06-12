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
  UserCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';
import Toast from '../layout/Toast.jsx'
import Confirmation from '../layout/Confirmation';

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
  const [showConfirm, setShowConfirm] = useState(false);

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
      const response = await axios.get(`htttp://13.232.209.194/posts/${postId}`);
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

  const hasUserLiked = post?.likes?.includes(currentUserData?.id);

  const handleLike = async () => {
    const userId = currentUserData?.id;
    if (!userId) {
      setToastMessage('Please log in to like posts');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

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
      await axios.post(`htttp://13.232.209.194/posts/${postId}/like/${userId}`);
      
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

  const handleSharePost = async () => {
    const postUrl = window.location.href;
    const title = post?.title || 'Check out this post';
    const text = 'Check out this interesting post from FoundersNexus!';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: postUrl,
        });
        
        setToastMessage('Post shared successfully');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
          handleFallbackShare();
        }
      }
    } else {
      handleFallbackShare();
    }
  };
  
  const handleFallbackShare = () => {
    const postUrl = window.location.href;
    
    navigator.clipboard.writeText(postUrl).then(
      () => {
        setToastMessage('Link copied to clipboard');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        setToastMessage('Failed to copy link');
        setToastType('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    );
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
        `htttp://13.232.209.194/posts/${postId}/comments`,
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

  const handleDeletePost = async () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    try {
      await axios.delete(`htttp://13.232.209.194/posts/${postId}`);
      setToastMessage('Post deleted successfully');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate(-1);
      }, 1500);
    } catch (error) {
      setToastMessage('Failed to delete post');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-indigo-200 mb-3"></div>
          <div className="h-2 w-24 bg-indigo-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 text-center">
        <div className="rounded-full bg-red-50 p-6 mb-6">
          <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6 max-w-md">{error}</p>
        <button 
          onClick={handleGoBack}
          className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-all"
        >
          <span className="flex items-center">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Go Back
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Toast Message */}
      {showToast && <Toast message={toastMessage} type={toastType} />}
      {/* Confirmation Dialog */}
      {showConfirm && (
        <Confirmation
          message="Are you sure you want to delete this post?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="w-full lg:w-2/3">
          {/* Back Button */}
          <button 
            onClick={handleGoBack}
            className="flex items-center text-gray-700 hover:text-indigo-600 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </button>
          
          {/* Post Content Card */}
          <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm mb-8 relative">
            {/* Hero Image with better scaling */}
            {post.image_url && (
              <div className="relative h-[400px] overflow-hidden">
                <img 
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8">
              {/* Post Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                {post.title}
              </h1>
              
              {/* Author Info */}
              <div className="flex items-center mb-8">
                <img
                  src={post.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.fullName)}&background=random`}
                  alt={post.user.fullName}
                  onClick={() => goToUserProfile(post.user._id)}
                  className="w-12 h-12 rounded-full object-cover cursor-pointer"
                />
                <div className="ml-3">
                  <p className="font-medium text-gray-900 hover:text-indigo-600 cursor-pointer" onClick={() => goToUserProfile(post.user._id)}>
                    {post.user.fullName}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              
              {/* Post Content */}
              <div className="prose max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
              
              {/* Engagement Metrics */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 ${animateLike ? 'scale-110' : 'scale-100'} transition-all`}
                  >
                    {hasUserLiked ? (
                      <HeartIconSolid className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIconOutline className="w-5 h-5 text-gray-500 hover:text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${hasUserLiked ? 'text-red-500' : 'text-gray-700'}`}>
                      {post.likes?.length || 0}
                    </span>
                  </button>
                  
                  <button 
                    className="flex items-center gap-2"
                    onClick={() => document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' })}
                  >
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">{post.commentsData?.length || 0}</span>
                  </button>
                </div>
                
                <div className="flex gap-3">
                  <button className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors">
                    <BookmarkIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  <button 
                    className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                    onClick={handleSharePost}
                  >
                    <ShareIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

            
            </div>
          </div>
          
          {/* Comments Section */}
          <div id="comments-section" className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ChatBubbleBottomCenterTextIcon className="h-5 w-5 mr-2 text-indigo-500" />
              Comments ({post.commentsData?.length || 0})
            </h2>
            
            {/* New Comment Form */}
            <div className="mb-8 border-b border-gray-100 pb-8">
              <div className="flex items-start gap-3 mb-4">
                {currentUserData && currentUserData.profilePicture ? (
                  <img
                    src={currentUserData.profilePicture}
                    alt={currentUserData.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserCircleIcon className="w-6 h-6 text-indigo-400" />
                  </div>
                )}
                
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 focus:outline-none transition-all text-gray-700 text-sm"
                    placeholder="Add a comment..."
                    rows="3"
                    disabled={isSubmitting}
                  ></textarea>
                  
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handlePostComment}
                      disabled={!commentText.trim() || isSubmitting}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                        !commentText.trim() || isSubmitting
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {isSubmitting ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comments List */}
            {post.commentsData && post.commentsData.length > 0 ? (
              <div className="space-y-6">
                {post.commentsData.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    {/* User Avatar */}
                    <img
                      src={comment.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.fullName)}&background=random`}
                      alt={comment.user.fullName}
                      onClick={() => goToUserProfile(comment.user._id)}
                      className="w-10 h-10 rounded-full object-cover cursor-pointer flex-shrink-0"
                    />
                    
                    {/* Comment Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <button
                          onClick={() => goToUserProfile(comment.user._id)}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {comment.user.fullName}
                        </button>
                        <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                      
                      {/* Comment Actions */}
                      <div className="mt-2 flex items-center gap-4">
                        <button className="text-xs text-gray-500 hover:text-indigo-600">Reply</button>
                        <button className="text-xs text-gray-500 hover:text-indigo-600">Like</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ChatBubbleBottomCenterTextIcon className="h-8 w-8 text-indigo-200 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-800 mb-1">No comments yet</h3>
                <p className="text-gray-500 text-sm mb-4">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar - Related Content */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Unlock your learning journey now!</h3>
              <p className="text-gray-600 text-sm mb-6">Provide innovative designs that align with user expectations and business goals.</p>
              
              <div className="text-3xl font-bold text-gray-900 mb-4">$99</div>
              
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl font-medium mb-3 flex items-center justify-center transition-colors">
                <BookmarkIcon className="w-5 h-5 mr-2" />
                Save Post
              </button>
              
              <button 
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
                onClick={handleSharePost}
              >
                <ShareIcon className="w-5 h-5 mr-2" />
                Share Post
              </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Post Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <ChatBubbleBottomCenterTextIcon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Comments</p>
                    <p className="text-xs text-gray-500">{post.commentsData?.length || 0} discussions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`${hasUserLiked ? 'bg-red-100' : 'bg-indigo-100'} p-2 rounded-full mr-3`}>
                    {hasUserLiked ? (
                      <HeartIconSolid className="h-4 w-4 text-red-500" />
                    ) : (
                      <HeartIconOutline className="h-4 w-4 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Likes</p>
                    <p className="text-xs text-gray-500">{post.likes?.length || 0} appreciations</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Posted</p>
                    <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>

                </div>
              </div>
            </div>
             {/* Delete Button at the end of the post, only for post owner */}
             {post && currentUserData && post.user && post.user._id === currentUserData.id && (
                <div className="flex justify-end mt-12">
                  <button
                    onClick={handleDeletePost}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-red-600 font-light hover:font-medium bg-white hover:bg-red-50 hover:text-red-600 hover:shadow-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-200 group outline-1 outline-red-400 "
                    title="Delete Post"
                    aria-label="Delete Post"
                  >
                    <TrashIcon className="w-5 h-5 group-hover:text-red-600 transition-colors duration-150" />
                    <span className="tracking-wide text-sm ">Delete</span>
                  </button>
                </div>
              )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default PostDetails;
