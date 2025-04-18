import chatsIcon from '../../assets/chats.svg';
import callsIcon from '../../assets/calls.svg';
import usersIcon from '../../assets/users.svg';
import groupsIcon from '../../assets/groups.svg';
import '../../styles/CometChatSelector/CometChatTabs.css';
import React, { useState, useEffect } from 'react';
import { getLocalizedString, setupLocalization } from '../../utils/utils';
import { useBuilderSettingContext } from '../../context/BuilderSettingsContext';

// Fallback strings to use if localization fails
const FALLBACK_STRINGS = {
  conversation_chat_title: "Chats",
  call_logs_title: "Calls",
  user_title: "Users",
  group_title: "Groups"
};

// Helper function to safely get localized string with fallback
const safeGetLocalizedString = (key: string): string => {
  try {
    const result = getLocalizedString(key);
    return result === key ? FALLBACK_STRINGS[key] || key : result;
  } catch (e) {
    console.warn(`Error getting localized string for key "${key}":`, e);
    return FALLBACK_STRINGS[key] || key;
  }
};

export const CometChatTabs = (props: {
  onTabClicked?: (tabItem: { name: string; icon: string }) => void;
  activeTab?: string;
}) => {
  const { onTabClicked = () => {}, activeTab } = props;
  const [hoverTab, setHoverTab] = useState('');
  const { layoutFeatures } = useBuilderSettingContext();
  
  // Ensure localization is initialized when component mounts
  useEffect(() => {
    setupLocalization('en');
  }, []);

  const tabItems = [
    {
      id: 'chats',
      name: safeGetLocalizedString('conversation_chat_title'),
      icon: chatsIcon,
    },
    {
      id: 'calls',
      name: safeGetLocalizedString('call_logs_title'),
      icon: callsIcon,
    },
    {
      id: 'users',
      name: safeGetLocalizedString('user_title'),
      icon: usersIcon,
    },
    {
      id: 'groups',
      name: safeGetLocalizedString('group_title'),
      icon: groupsIcon,
    },
  ];

  const isTabActiveOrHovered = (name: string) => {
    const tabName = name.toLowerCase();
    return activeTab === tabName || hoverTab === tabName;
  };
  
  return (
    <div
      className="cometchat-tab-component"
      style={layoutFeatures?.tabs?.length > 1 ? { display: 'flex' } : { display: 'none' }}
    >
      {tabItems
        .filter(
          (tabItem) => layoutFeatures?.tabs?.includes(tabItem.id) // Keep only allowed tabs
        )
        .map((tabItem) => (
          <div key={tabItem.name} className="cometchat-tab-component__tab" onClick={() => onTabClicked(tabItem)}>
            <div
              className={`cometchat-tab-component__tab-icon cometchat-tab-component__tab-icon-${tabItem.id} ${
                isTabActiveOrHovered(tabItem.name) ? 'cometchat-tab-component__tab-icon-active' : ''
              }`}
              style={tabItem.icon ? { WebkitMask: `url(${tabItem.icon}), center, center, no-repeat` } : undefined}
              onMouseEnter={() => setHoverTab(tabItem.name.toLowerCase())}
              onMouseLeave={() => setHoverTab('')}
            />
            <div
              className={
                activeTab === tabItem.name.toLowerCase() || hoverTab === tabItem.name.toLowerCase()
                  ? 'cometchat-tab-component__tab-text cometchat-tab-component__tab-text-active'
                  : 'cometchat-tab-component__tab-text'
              }
              onMouseEnter={() => setHoverTab(tabItem.name.toLowerCase())}
              onMouseLeave={() => setHoverTab('')}
            >
              {tabItem.name}
            </div>
          </div>
        ))}
    </div>
  );
};
