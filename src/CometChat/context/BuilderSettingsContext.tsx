import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatFeatures, LayoutFeatures, StyleFeatures } from '../types';

interface BuilderSettingContextProps {
  chatFeatures: ChatFeatures;
  callFeatures: any;
  layoutFeatures: LayoutFeatures;
  styleFeatures: StyleFeatures;
}

// Create a default context value
const defaultContext: BuilderSettingContextProps = {
  chatFeatures: {
    coreMessagingExperience: {
      userAndFriendsPresence: true,
    },
    groupManagement: {
      createGroup: true,
      addMembersToGroups: true,
      joinLeaveGroup: true,
      deleteGroup: true,
      viewGroupMembers: true,
    },
    moderatorControls: {
      kickUsers: true,
      promoteDemoteMembers: true,
      banUsers: true,
    },
  },
  callFeatures: {
    voiceAndVideoCalling: {
      oneOnOneVoiceCalling: true,
      oneOnOneVideoCalling: true,
      groupVideoConference: true,
      groupVoiceConference: true
    }
  },
  layoutFeatures: {
    withSideBar: true,
    tabs: ['chats', 'calls', 'users', 'groups'],
    chatType: 'user'
  },
  styleFeatures: {
    theme: 'system',
  }
};

const BuilderSettingContext = createContext<BuilderSettingContextProps>(defaultContext);

export const BuilderSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BuilderSettingContextProps>(defaultContext);

  useEffect(() => {
    // In browser environments, require is not available.
    // Always use defaultContext or fetch from API if needed.
    setSettings(defaultContext);
  }, []);

  return (
    <BuilderSettingContext.Provider value={settings}>
      {children}
    </BuilderSettingContext.Provider>
  );
};

export const useBuilderSettingContext = () => useContext(BuilderSettingContext);

export interface BuilderSettingType {
  chatFeatures: {
    coreMessagingExperience: {
      typingIndicator: boolean;
      threadConversationAndReplies: boolean;
      photosSharing: boolean;
      videoSharing: boolean;
      audioSharing: boolean;
      fileSharing: boolean;
      editMessage: boolean;
      deleteMessage: boolean;
      messageDeliveryAndReadReceipts: boolean;
      userAndFriendsPresence: boolean;
    };
    deeperUserEngagement: {
      mentions: boolean;
      reactions: boolean;
      messageTranslation: boolean;
      polls: boolean;
      collaborativeWhiteboard: boolean;
      collaborativeDocument: boolean;
      voiceNotes: boolean;
      emojis: boolean;
      stickers: boolean;
      userInfo: boolean;
      groupInfo: boolean;
    };
    aiUserCopilot: {
      conversationStarter: boolean;
      conversationSummary: boolean;
      smartReply: boolean;
    };

    groupManagement: {
      createGroup: boolean;
      addMembersToGroups: boolean;
      joinLeaveGroup: boolean;
      deleteGroup: boolean;
      viewGroupMembers: boolean;
    };
    moderatorControls: {
      kickUsers: boolean;
      banUsers: boolean;
      promoteDemoteMembers: boolean;
    };
    privateMessagingWithinGroups: {
      sendPrivateMessageToGroupMembers: boolean;
    };
  };
  callFeatures: {
    voiceAndVideoCalling: {
      oneOnOneVoiceCalling: boolean;
      oneOnOneVideoCalling: boolean;
      groupVideoConference: boolean;
      groupVoiceConference: boolean;
    };
  };
  layout: {
    withSideBar: boolean;
    tabs: string[];
    chatType: string;
  };
  style: {
    theme: string;
    color: {
      brandColor: string;
      primaryTextLight: string;
      primaryTextDark: string;
      secondaryTextLight: string;
      secondaryTextDark: string;
    };
    typography: {
      font: string;
      size: string;
    };
  };
}

// THIS IS FOR THE USER & PRODUCT IDENTIFICATION FOR RUNNABLE APP, DO NOT DELETE

interface CometChatVisualBuilderReact {
  name: string;
  version: string;
}

declare global {
  interface Window {
    CometChatVisualBuilderReact: CometChatVisualBuilderReact;
  }
}

if (typeof window !== 'undefined') {
  window.CometChatVisualBuilderReact = {
    name: 'cometchat-visual-builder-react',
    version: '1.0.1',
  };
}
