import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import PostCard from './PostCard';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); 
  const observer = useRef();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/posts/?page=${page}`);
      const newPosts = response.data;
      
      if (Array.isArray(newPosts)) {
        setPosts((prevPosts) => {
          const uniquePosts = newPosts.filter(
            post => !prevPosts.some(p => p._id === post._id)
          );
          if (uniquePosts.length === 0) {
            setHasMore(false);
          }
          return [...prevPosts, ...uniquePosts];
        });
      } else {
        console.error('Response data is not an array:', newPosts);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleToggleLike = async (postId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    // Optimistic update for likes
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
      const response = await axios.post(`http://127.0.0.1:8000/posts/${postId}/like/${userId}`);
      console.log(response.data.message);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Optionally revert the optimistic update here if necessary
    }
  };

  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-bold text-4xl text-gray-900 text-center mb-12">
          Our Latest Posts
        </h2>
        {posts.length === 0 && !loading && (
          <div className="text-center text-gray-500">No posts available.</div>
        )}
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <PostCard
                key={post._id}
                post={post}
                onToggleLike={handleToggleLike}
                ref={lastPostRef}
                variant="posts"
              />
            );
          } else {
            return (
              <PostCard
                key={post._id}
                post={post}
                onToggleLike={handleToggleLike}
                variant="posts"
              />
            );
          }
        })}
        {loading && (
          <div className="text-center mt-4 text-gray-600">Loading...</div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="text-center mt-4 text-gray-600">No more posts.</div>
        )}
      </div>
    </div>
  );
};

export default Posts;
