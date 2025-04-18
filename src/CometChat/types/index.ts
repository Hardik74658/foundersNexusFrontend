import { CometChat } from '@cometchat/chat-sdk-javascript';

// Extend Window interface to include CometChatLocalize
declare global {
  interface Window {
    CometChatLocalize?: {
      translations?: Record<string, Record<string, string>>;
      getLocalizedString?: (key: string) => string;
      setLanguage?: (lang: string) => void;
      currentLanguage?: string;
      calendarObject?: any;
    };
    uiKitSettingsInitialized?: boolean;
    __cometchat_uikit_initialized?: boolean;
  }
}

// Define common interface for action items
export interface ActionItem {
  id: string;
  name: string;
  icon: string;
  type?: 'scope' | 'alert';
  onClick?: () => void;
  isAllowed?: () => boolean;
}

// Chat component props interfaces
export interface TabContentProps {
  selectedTab: string;
}

export interface ThreadProps {
  message: CometChat.BaseMessage;
}

export interface CometChatHomeProps {
  defaultUser?: CometChat.User;
  defaultGroup?: CometChat.Group;
}

// Define chat settings interfaces
export interface LayoutFeatures {
  withSideBar?: boolean;
  tabs?: string[];
  chatType?: string;
}

export interface ChatFeatures {
  coreMessagingExperience?: {
    userAndFriendsPresence?: boolean;
  };
  groupManagement: {
    createGroup?: boolean;
    addMembersToGroups?: boolean;
    joinLeaveGroup?: boolean;
    deleteGroup?: boolean;
    viewGroupMembers?: boolean;
  };
  moderatorControls?: {
    kickUsers?: boolean;
    promoteDemoteMembers?: boolean;
    banUsers?: boolean;
  };
}

export interface StyleFeatures {
  theme?: string;
}

// Add CalendarObject interface for date formatting
export interface CalendarObject {
  yesterday: string;
  otherDays: string;
  today: string;
}
