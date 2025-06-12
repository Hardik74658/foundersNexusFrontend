import React, { useCallback, useEffect, useState } from 'react';
import Talk from 'talkjs';
import { Session, Chatbox, useUnreads } from '@talkjs/react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, ChatBubbleBottomCenterTextIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Loader from './layout/Loader.jsx';
import Toast from './layout/Toast.jsx';

function Chat() {
  const { otherUserId } = useParams();
  const navigate = useNavigate();
  const currentUserRedux = useSelector((state) => state.auth.user);
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [userList, setUserList] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);

  // Unread info for selector page
  let UnreadInfo = null;
  if (!otherUserId && currentUser && (currentUser._id || currentUser.id)) {
    const talkUser = new Talk.User({
      id: currentUser._id || currentUser.id,
      name: currentUser.fullName || currentUser.name || 'User',
      email: currentUser.email ? [currentUser.email] : null,
      photoUrl: currentUser.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(currentUser.fullName || currentUser.name || 'User'),
      welcomeMessage: currentUser.bio || 'Hi!',
      role: typeof currentUser.role === 'string' ? currentUser.role : undefined,
    });
    UnreadInfo = (
      <Session appId="tPZa3YK4" syncUser={() => talkUser}>
        <UnreadCountDisplay />
      </Session>
    );
  }

  // Fetch current user
  useEffect(() => {
    let isMounted = true;
    async function fetchCurrentUser() {
      try {
        if (currentUserRedux && (currentUserRedux._id || currentUserRedux.id)) {
          setCurrentUser(currentUserRedux);
        } else {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const res = await axios.get(`htttp://13.232.209.194/users/${userId}`);
            if (isMounted) setCurrentUser(res.data);
          } else {
            setError('No current user found.');
          }
        }
      } catch {
        setError('Failed to load current user.');
      } finally {
        setLoading(false);
      }
    }
    fetchCurrentUser();
    return () => { isMounted = false; };
  }, [currentUserRedux]);

  // Fetch other user
  useEffect(() => {
    let isMounted = true;
    async function fetchOtherUser() {
      if (!otherUserId) {
        setOtherUser(null);
        return;
      }
      try {
        const res = await axios.get(`htttp://13.232.209.194/users/${otherUserId}`);
        if (isMounted) setOtherUser(res.data);
      } catch {
        setError('Failed to load other user.');
      } finally {
        setLoading(false);
      }
    }
    fetchOtherUser();
    return () => { isMounted = false; };
  }, [otherUserId]);

  // Set loading state
  useEffect(() => {
    if ((currentUser && (otherUserId ? otherUser : true)) || error) {
      setLoading(false);
    }
  }, [currentUser, otherUser, otherUserId, error]);

  // Fetch user list for selector
  useEffect(() => {
    if (!otherUserId && currentUser) {
      axios.get('htttp://13.232.209.194/users/')
        .then(res => {
          const filtered = (res.data.results || res.data || []).filter(u => u._id !== (currentUser._id || currentUser.id));
          setUserList(filtered);
        })
        .catch(() => setError('Failed to load users.'));
    }
  }, [otherUserId, currentUser]);

  // --- TalkJS mapping ---
  const mapToTalkUser = useCallback((user) => ({
    id: user._id || user.id,
    name: user.fullName || user.name || 'User',
    email: user.email ? [user.email] : null,
    photoUrl: user.profilePicture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.fullName || user.name || 'User'),
    welcomeMessage: user.bio || 'Hi!',
    role: typeof user.role === 'string' ? user.role : undefined,
  }), []);

  const syncUser = useCallback(
    () => new Talk.User(mapToTalkUser(currentUser)),
    [currentUser, mapToTalkUser]
  );

  const syncConversation = useCallback(
    (session) => {
      const conversationId = [currentUser._id || currentUser.id, otherUser._id || otherUser.id].sort().join('_');
      const conversation = session.getOrCreateConversation(conversationId);
      conversation.setParticipant(new Talk.User(mapToTalkUser(currentUser)));
      conversation.setParticipant(new Talk.User(mapToTalkUser(otherUser)));
      return conversation;
    },
    [currentUser, otherUser, mapToTalkUser]
  );

  // Calculate a random last message time for demo purposes
  const getRandomTimeAgo = () => {
    const times = ["10:00 AM", "Yesterday", "2d ago", "1w ago"];
    return times[Math.floor(Math.random() * times.length)];
  };
  
  // Generate placeholder last message for demo purposes
  const getPlaceholderLastMessage = (name) => {
    const messages = [
      "Let's connect soon!",
      "Thanks for your help!",
      "Great to chat with you",
      "Looking forward to collaborating"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // --- UI ---
  if (!otherUserId) {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
      );
    }
    
    if (error) {
      return (
        <div>
          <Toast
            message={error}
            show={true}
            onClose={() => setError('')}
          />
        </div>
      );
    }
    
    if (userList.length === 0) return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-50">
        <div className="max-w-6xl mx-auto p-4">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center">
                <button 
                  onClick={handleGoBack}
                  className="flex items-center text-gray-500 hover:text-indigo-600 mr-4"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">ConnectPro</h1>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium text-indigo-600">
                  {UnreadInfo}
                </div>
              </div>
            </div>
            
            {/* Chat Layout */}
            <div className="flex h-[600px]">
              {/* Sidebar - User List */}
              <div className="w-full border-r border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Chats</h2>
                  <p className="text-sm text-gray-500">Select a user to start chatting</p>
                </div>
                
                <div className="overflow-y-auto h-[520px]">
                  {userList.map(user => {
                    const isActive = activeUserId === user._id;
                    const randomTime = getRandomTimeAgo();
                    const placeholderMessage = getPlaceholderLastMessage(user.fullName || user.name);
                    
                    return (
                      <div 
                        key={user._id}
                        className={`flex items-center p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                          isActive ? 'bg-indigo-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => {
                          setActiveUserId(user._id);
                          navigate(`/chat/${user._id}`);
                        }}
                      >
                        <div className="relative">
                          <img
                            src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.name || 'User')}&background=random`}
                            alt={user.fullName || user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white"></div>
                        </div>
                        
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {user.fullName || user.name}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {randomTime}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 truncate mt-1">
                            {placeholderMessage}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
          
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <Toast
          message={error}
          show={true}
          onClose={() => setError('')}
        />
      </div>
    );
  }
  
  if (!currentUser || !otherUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md w-full text-center">
          <div className="bg-yellow-100 mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <UserCircleIcon className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">User not found</h3>
          <p className="text-gray-600 mb-6">We couldn't find the user you're looking for.</p>
          <button 
            onClick={() => navigate('/chat')}
            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-all"
          >
            Return to chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center">
              <button 
                onClick={handleGoBack}
                className="flex items-center text-gray-500 hover:text-indigo-600 mr-4"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={otherUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.fullName || otherUser.name || 'User')}&background=random`}
                    alt={otherUser.fullName || otherUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white"></div>
                </div>
                <div className="ml-3">
                  <h1 className="font-bold text-gray-800">{otherUser.fullName || otherUser.name}</h1>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Container */}
          <div className="h-[600px]">
            <Session appId="tPZa3YK4" syncUser={syncUser}>
              <Chatbox
                syncConversation={syncConversation}
                style={{
                  width: '100%',
                  height: '600px',
                  borderRadius: '0',
                  boxShadow: 'none',
                  border: 'none',
                }}
              />
            </Session>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component to show unread count inside <Session>
function UnreadCountDisplay() {
  const unreads = useUnreads();
  if (!unreads || unreads.length === 0) return null;
  
  return (
    <div className="flex items-center">
      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs mr-2">
        {unreads.length}
      </div>
      <span className="text-indigo-600 font-medium">
        Unread message{unreads.length > 1 ? 's' : ''}
      </span>
    </div>
  );
}

export default Chat;
