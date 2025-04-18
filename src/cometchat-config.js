// CometChat configuration constants
export const COMETCHAT_CONSTANTS = {
  APP_ID:  "272738e1c3d1b4aa",
  REGION:  "in",
  AUTH_KEY: "2ebaf2523ac52b1af8108fbe6b266e59d750ecab",
};

// Mock data for fallback when CometChat is unavailable
export const MOCK_USERS = [
  {
    uid: "user1",
    name: "John Doe",
    avatar: "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
  },
  {
    uid: "user2",
    name: "Jane Smith",
    avatar: "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
  }
];

export const MOCK_CONVERSATIONS = [
  {
    conversationId: "conv1",
    conversationType: "user",
    conversationWith: {
      uid: "user1",
      name: "John Doe",
      avatar: "https://data-us.cometchat.io/assets/images/avatars/spiderman.png",
    },
    lastMessage: {
      text: "Hello there!",
      sentAt: new Date().getTime(),
    }
  },
  {
    conversationId: "conv2",
    conversationType: "user",
    conversationWith: {
      uid: "user2",
      name: "Jane Smith",
      avatar: "https://data-us.cometchat.io/assets/images/avatars/ironman.png",
    },
    lastMessage: {
      text: "How are you doing?",
      sentAt: new Date().getTime() - 3600000,
    }
  }
];

/**
 * Helper function to generate payload for creating a CometChat user via Management API
 * IMPORTANT: This should only be used in backend code, NEVER in frontend!
 */
export const generateUserCreationPayload = (user) => {
  if (!user || !user._id || !user.fullName) {
    return null;
  }
  
  return {
    uid: user._id,
    name: user.fullName,
    avatar: user.profilePicture || undefined,
    metadata: {
      role: user.role || "user",
      email: user.email || "",
    }
  };
};
