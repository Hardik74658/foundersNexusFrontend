import React from 'react';
import '../../styles/CometChatAlertPopup/CometChatAlertPopup.css';
import { getLocalizedString } from '../../utils/utils';

interface AlertPopupProps {
  title: string;
  description: string;
  onConfirmClick: () => void;
}

export const CometChatAlertPopup: React.FC<AlertPopupProps> = ({ title, description, onConfirmClick }) => {
  return (
    <div className="cometchat-alert-popup__backdrop">
      <div className="cometchat-alert-popup">
        <div className="cometchat-alert-popup__title">{title}</div>
        <div className="cometchat-alert-popup__description">{description}</div>
        <div className="cometchat-alert-popup__actions">
          <button className="cometchat-alert-popup__confirm-button" onClick={onConfirmClick}>
            {getLocalizedString('understood')}
          </button>
        </div>
      </div>
    </div>
  );
};
