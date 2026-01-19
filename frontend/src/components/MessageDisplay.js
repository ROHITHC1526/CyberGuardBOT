import React from 'react';
import './MessageDisplay.css';

const MessageDisplay = ({ text, type }) => {
  return (
    <div className={`message-display ${type}`}>
      <div className="message-content">
        {text}
      </div>
    </div>
  );
};

export default MessageDisplay;
