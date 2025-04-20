import React, { useCallback, useEffect, useState } from 'react';
import Talk from 'talkjs';
import { Session, Chatbox, useUnreads } from '@talkjs/react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Minimal, modern, rounded, psychology-friendly UI ---
// - Soft backgrounds, rounded corners, subtle shadows
// - Clear call-to-action, focus on one thing at a time
// - Uses your app's indigo/brand color for accents

function Chat() {
  const { otherUserId } = useParams();
  const navigate = useNavigate();
  const currentUserRedux = useSelector((state) => state.auth.user);
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userList, setUserList] = useState([]);

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
            const res = await axios.get(`http://localhost:8000/users/${userId}`);
            if (isMounted) setCurrentUser(res.data);
          } else {
            setError('No current user found.');
          }
        }
      } catch {
        setError('Failed to load current user.');
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
        const res = await axios.get(`http://localhost:8000/users/${otherUserId}`);
        if (isMounted) setOtherUser(res.data);
      } catch {
        setError('Failed to load other user.');
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
      axios.get('http://localhost:8000/users/')
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

  // --- UI ---
  if (!otherUserId) {
    if (!currentUser) return <div className="flex items-center justify-center min-h-[60vh] text-gray-500">Loading...</div>;
    if (error) return <div className="flex items-center justify-center min-h-[60vh] text-red-500">{error}</div>;
    if (userList.length === 0) return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">No other users found.</div>;
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-indigo-50 to-white">
        <div className="w-full max-w-md rounded-2xl shadow-xl bg-white p-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center">Start a Conversation</h2>
          <p className="text-gray-500 text-center mb-6">Select a user to chat with privately.</p>
          <div className="mb-4 text-sm text-gray-600 text-center">{UnreadInfo}</div>
          <ul className="space-y-3">
            {userList.map(user => (
              <li key={user._id}>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow transition-all duration-200 focus:outline-none"
                  onClick={() => navigate(`/chat/${user._id}`)}
                  style={{ transition: 'box-shadow 0.2s' }}
                >
                  <img
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.name || 'User')}`}
                    alt={user.fullName || user.name || user.email}
                    className="w-8 h-8 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <span className="truncate">{user.fullName || user.name || user.email}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-500">Loading chat...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-[60vh] text-red-500">{error}</div>;
  }
  if (!currentUser || !otherUser) {
    return <div className="flex items-center justify-center min-h-[60vh] text-red-500">User data not found.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-indigo-50 to-white">
      <div className="w-full max-w-lg rounded-2xl shadow-2xl bg-white p-2">
        <Session appId="tPZa3YK4" syncUser={syncUser}>
          <Chatbox
            syncConversation={syncConversation}
            style={{
              width: '100%',
              height: '520px',
              borderRadius: '1.25rem',
              boxShadow: '0 6px 32px 0 rgba(60,72,88,0.14)',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
              background: '#f9fafb'
            }}
          />
        </Session>
      </div>
    </div>
  );
}

// Helper component to show unread count inside <Session>
function UnreadCountDisplay() {
  const unreads = useUnreads();
  if (!unreads) return null;
  if (unreads.length === 0) return null;
  return (
    <span>
      You have {unreads.length} unread conversation{unreads.length > 1 ? 's' : ''}.
    </span>
  );
}

export default Chat;

/* 
  --- UI/UX rationale ---
  - Minimal, rounded, soft backgrounds, clear call-to-action.
  - Only one main action per screen (choose user, or chat).
  - Uses indigo as accent, white for calm, rounded corners for safety/approachability.
  - Subtle shadow for focus, avatars for human connection.
  - All TalkJS chat UI theming should be done in the TalkJS dashboard for WhatsApp-like look.
*/
