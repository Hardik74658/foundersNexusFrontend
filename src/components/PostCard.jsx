import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

// Helper function to format date as "Jan 23, 2025"
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const PostCard = React.forwardRef(({ post, onToggleLike, variant = 'posts' }, ref) => {
  const navigate = useNavigate();
  const formattedDate = formatDate(post.created_at);
  const commentCount = post.commentsData ? post.commentsData.length : (post.comments || []).length;
  const userId = localStorage.getItem('userId');
  const isLiked = (post.likes || []).includes(userId);

  // Conditional classes based on variant
  const cardClasses =
    variant === 'posts'
      ? 'group w-full max-w-xl mx-auto border border-gray-300 rounded-2xl overflow-hidden mb-8 shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-300'
      : 'group w-full border border-gray-300 rounded-xl overflow-hidden mb-4 shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-300';
  const imageClasses = variant === 'posts' ? 'w-full h-60 object-cover' : 'w-full h-40 object-cover';
  const contentPadding = variant === 'posts' ? 'p-4 lg:p-6' : 'p-3';

  return (
    <div
      ref={ref}
      onClick={() => navigate(`/posts/${post._id}`)}
      className={cardClasses}
    >
      {post.image_url && post.image_url.trim() !== '' && (
        <img
          src={post.image_url}
          alt="Post banner"
          className={imageClasses}
        />
      )}
      <div className={`${contentPadding} bg-white group-hover:bg-gray-50 transition-colors duration-300`}>
        {/* Render user info only on the posts page */}
        {variant === 'posts' && (
          <div className="flex items-center mb-2">
            {post.user && post.user.profilePicture && post.user.profilePicture.trim() !== '' ? (
              <img
                src={post.user.profilePicture}
                alt={`${post.user.fullName}'s profile`}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
            )}
            <div>
              <p className="font-medium text-gray-900">
                {post.user ? post.user.fullName : 'Unknown User'}
              </p>
              <span className="text-indigo-600 text-xs font-medium">
                {formattedDate}
              </span>
            </div>
          </div>
        )}
        {/* Post title */}
        <h4 className="text-2xl text-gray-900 font-medium leading-8 mb-3 capitalize">
          {post.title}
        </h4>
        {/* Post content */}
        <p className="text-gray-500 text-base mb-4">{post.content}</p>
        {/* Post metadata */}
        <div className="flex items-center space-x-4 text-gray-500 text-sm">
          {/* Like icon and count */}
          <div
            className="flex items-center space-x-1"
            onClick={(e) => {
              // Prevent navigation when clicking the like button
              e.stopPropagation();
              onToggleLike(post._id);
            }}
          >
            <HeartIcon
              className={`w-5 h-5 ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
            />
            <span>{(post.likes || []).length}</span>
          </div>
          {/* Comments icon and count */}
          <div className="flex items-center space-x-1">
            <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-gray-400" />
            <span>{commentCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PostCard;
