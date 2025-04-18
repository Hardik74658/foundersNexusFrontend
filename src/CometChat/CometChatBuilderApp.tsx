import React from 'react';
import './styles/CometChatBuilderApp.css';
import { useSelector } from 'react-redux';
import { CometChatHome } from './components/CometChatHome/CometChatHome';

function CometChatBuilderApp() {
  const reduxUser = useSelector((state: any) => state.auth.user);

  if (!reduxUser) {
    return <LoginPlaceholder />;
  }

  return (
    <div id="cometchat-container">
      <CometChatHome />
    </div>
  );
}

const LoginPlaceholder = () => (
  <div className="login-placeholder">
    <div className="cometchat-logo" />
    <h3>Please log in to access the chat.</h3>
  </div>
);

export default CometChatBuilderApp;
