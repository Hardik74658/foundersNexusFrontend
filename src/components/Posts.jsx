// Posts.jsx
import React from 'react';
import Sidebar from './Sidebar';

const defaultPosts = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      handle: '@johndoe',
      avatar: 'https://via.placeholder.com/40',
      verified: true,
    },
    content: 'This is a sample post to demonstrate the modernized design. Loving the new look!',
    image: 'https://via.placeholder.com/500x300',
    timestamp: 'Mar 24, 2025',
    comments: '1.2K',
    retweets: '3.4K',
    likes: '5.6K',
  },
  {
    id: 2,
    user: {
      name: 'Jane Smith',
      handle: '@janesmith',
      avatar: 'https://via.placeholder.com/40',
      verified: false,
    },
    content: 'Another post here! What do you think about this new feature?',
    timestamp: 'Mar 23, 2025',
    comments: '800',
    retweets: '2.1K',
    likes: '4.3K',
  },
];

const PostCard = ({ post }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 mb-4 shadow-lg hover:shadow-xl transition duration-300 border border-gray-700">
      <div className="flex items-start space-x-4">
        <img src={post.user.avatar} alt={post.user.name} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="text-white font-semibold">{post.user.name}</p>
            {post.user.verified && (
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            )}
            <p className="text-gray-400 text-sm">{post.user.handle}</p>
            <span className="text-gray-400 text-sm">· {post.timestamp}</span>
          </div>
          <p className="text-white mt-2">{post.content}</p>
          {post.image && (
            <img src={post.image} alt="Post" className="mt-4 rounded-xl w-full object-cover" />
          )}
          <div className="flex items-center justify-between mt-4 text-gray-400">
            <div className="flex items-center space-x-2 hover:text-blue-400 transition duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comments}</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-green-400 transition duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{post.retweets}</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-red-400 transition duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-blue-400 transition duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Posts = ({ posts = defaultPosts }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <div className="flex-1 max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-t-2xl p-4 sticky top-0 z-10 border-b border-gray-700">
          <h2 className="text-white text-xl font-bold">Home</h2>
        </div>

        {/* Posts */}
        <div className="mt-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;