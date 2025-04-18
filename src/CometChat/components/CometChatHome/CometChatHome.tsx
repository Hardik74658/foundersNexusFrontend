import React from "react";
import { CometChat } from "@cometchat/chat-sdk-javascript";

// Import the component directly as a default import - this is critical
import CometChatUIKit from "@cometchat/chat-uikit-react";
import "../../styles/CometChatHome/CometChatHome.css";

export interface CometChatHomeProps {
  defaultUser?: CometChat.User;
  defaultGroup?: CometChat.Group;
}

export const CometChatHome: React.FC<CometChatHomeProps> = () => {
  return (
    <div className="cometchat-home" data-theme="light">
      <div className="cometchat-root" data-theme="light">
        {/* Use the default import for proper initialization */}
        <CometChatUIKit />
      </div>
    </div>
  );
};

export default CometChatHome;
