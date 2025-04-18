import React, { useState, useEffect, useRef, Component } from 'react';
import { useSelector } from 'react-redux';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { 
  CometChatUI,
  CometChatConversations,
  CometChatUsers,
  CometChatUserList,
  CometChatMessageList,
  CometChatMessageComposer,
  CalendarObject,
  SelectionMode
} from '@cometchat/chat-uikit-react';
import { COMETCHAT_CONSTANTS } from '../cometchat-config';

// Add an error boundary component to catch React errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ChatPage Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen pt-16 items-center justify-center">
          <div className="text-center max-w-lg p-6 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Chat Component Error</h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || "Something went wrong with the chat component."}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ChatPage = () => {
  const [cometChatInitialized, setCometChatInitialized] = useState(false);
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeView, setActiveView] = useState('conversations'); // 'conversations', 'users', 'chat'
  const initializedRef = useRef(false); // Prevent double init/login

  // Get current user from Redux
  const currentUser = useSelector(state => state.auth.userData) || {
    _id: localStorage.getItem('userId'),
    fullName: 'Current User'
  };

  // Initialize CometChat
  useEffect(() => {
    const initializeCometChat = async () => {
      // Prevent double initialization in React strict mode
      if (initializedRef.current) {
        console.log("CometChat already initialized (ref), skipping.");
        return;
      }
      initializedRef.current = true;
      
      try {
        if (cometChatInitialized) {
          console.log("CometChat already initialized, skipping initialization");
          return;
        }

        // CometChat initialization settings
        const appSetting = new CometChat.AppSettingsBuilder()
          .subscribePresenceForAllUsers()
          .setRegion(COMETCHAT_CONSTANTS.REGION)
          .build();

        // Initialize CometChat
        await CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting);
        console.log("CometChat initialization completed successfully");
        
        setCometChatInitialized(true);
        
        // Login the current user with CometChat
        await loginToCometChat();
      } catch (error) {
        console.error("CometChat initialization failed:", error);
        let errorMessage = "Could not connect to chat service";
        if (error?.code === 'AUTH_ERR_INVALID_APPID') {
          errorMessage = "Invalid Chat App ID or Region configuration";
          console.error("Please check your CometChat App ID and Region in cometchat-config.js");
        }
        
        console.warn(`Chat service unavailable: ${errorMessage}.`);
        setError(errorMessage);
        setLoading(false);
      }
    };

    initializeCometChat();
  }, []); // Only run once per mount

  // Only login, do not create users from frontend
  const loginToCometChat = async () => {
    if (loginInProgress) return; // Prevent concurrent logins
    setLoginInProgress(true);
    try {
      const user = await CometChat.login(
        currentUser._id,
        COMETCHAT_CONSTANTS.AUTH_KEY
      );
      console.log("CometChat login successful:", user);
      setLoginInProgress(false);
      setLoading(false);
    } catch (loginError) {
      setLoginInProgress(false);
      let errorMessage = "Login to chat service failed";

      if (loginError?.code === 'AUTH_ERR_INVALID_APPID') {
        errorMessage = "Invalid Chat App ID or Region - please check configuration";
      } else if (loginError?.code === 'USER_NOT_LOGED_IN') {
        errorMessage = "User authentication failed";
      } else if (loginError?.code === 'ERR_UID_NOT_FOUND') {
        errorMessage = `CometChat user with UID ${currentUser._id} does not exist.`;
        console.warn(
          `[CometChat] ERR_UID_NOT_FOUND: The user with UID '${currentUser._id}' does not exist in CometChat. 
You must create this user from your backend using the CometChat Management API before login will work.`
        );
      } else if (loginError?.message?.includes("LOGIN_IN_PROGRESS")) {
        errorMessage = "Login already in progress, please wait";
      }

      console.error(`CometChat login failed: ${errorMessage}.`, loginError);

      setError(errorMessage);
      setLoading(false);
    }
  };

  // Handle when a user is selected from the list
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setActiveView('chat');
  };

  // Handle when a conversation is selected
  const handleConversationSelect = (conversation) => {
    const conversationWith = conversation.getConversationWith();
    if (conversation.getConversationType() === 'user') {
      setSelectedUser({
        uid: conversationWith.getUid(),
        name: conversationWith.getName(),
        avatar: conversationWith.getAvatar()
      });
      setActiveView('chat');
    }
  };

  // Handle back button to return to conversation list
  const handleBackToList = () => {
    setSelectedUser(null);
    setActiveView('conversations');
  };

  // Get date format for message timestamps
  const getDateFormat = () => {
    return new CalendarObject({
      today: `hh:mm A`,
      yesterday: `[yesterday]`,
      otherDays: `DD/MM/YYYY`
    });
  };

  // Handle errors from CometChat components
  const handleComponentError = (error) => {
    console.error("CometChat component error:", error);
    setError(`Component error: ${error.message}`);
  };

  // Show the full CometChat UI if fully initialized
  if (cometChatInitialized && !loading && !error) {
    return (
      <ErrorBoundary>
        <div className="flex h-screen pt-16">
          <div className="w-full h-full">
            {typeof CometChatUI === 'function' ? (
              <CometChatUI 
                onError={handleComponentError}
              />
            ) : (
              <div className="text-center p-6">
                <p className="text-red-500">CometChat UI component is not available.</p>
                <p className="text-gray-600 mt-2">Please check your CometChat package installation.</p>
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen pt-16 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing chat service...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen pt-16 items-center justify-center">
        <div className="text-center max-w-lg p-6 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Chat Service Unavailable</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            Please try again later or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Fallback UI - should generally not be used as CometChatUI is preferred
  return (
    <div className="flex h-screen pt-16">
      <div className="w-full h-full flex">
        <div className="w-1/3 border-r border-gray-300 bg-white overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveView('conversations')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeView === 'conversations' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Chats
                </button>
                <button
                  onClick={() => setActiveView('users')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeView === 'users' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Users
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {activeView === 'conversations' ? (
              <CometChatConversations 
                onItemClick={handleConversationSelect}
                onError={handleComponentError}
                lastMessageDateTimeFormat={getDateFormat()}
              />
            ) : (
              <CometChatUsers
                onItemClick={handleUserSelect}
                onError={handleComponentError}
                selectionMode={SelectionMode.none}
                searchPlaceholder="Search users..."
              />
            )}
          </div>
        </div>
        
        <div className="w-2/3 flex flex-col bg-gray-50">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gray-300 bg-white flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={handleBackToList}
                    className="mr-3 p-1 rounded-full hover:bg-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <img
                    src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}`}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{selectedUser.name}</h2>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1">
                  <CometChatMessageList
                    user={{ uid: selectedUser.uid }}
                    hideError={false}
                    separatorDateTimeFormat={getDateFormat()}
                  />
                </div>
                <div className="border-t border-gray-300">
                  <CometChatMessageComposer
                    user={{ uid: selectedUser.uid }}
                    disableTypingEvents={false}
                    placeholderText="Type your message here..."
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Select a conversation</h2>
              <p className="text-gray-500 max-w-md">
                Choose a contact from the list or start a new conversation by selecting a user.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
