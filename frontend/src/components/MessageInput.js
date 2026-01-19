import React, { useState } from 'react';
import './MessageInput.css';

const MessageInput = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      <form onSubmit={handleSubmit} className="message-input-form">
        <div className="input-wrapper">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Paste SMS or email message here..."
            className="message-textarea"
            rows="4"
            disabled={disabled}
          />
          <button
            type="submit"
            className={`send-button ${disabled ? 'loading' : ''}`}
            disabled={disabled || !message.trim()}
          >
            {disabled ? (
              <>
                <div className="button-spinner"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span className="send-icon">🔍</span>
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
        <div className="input-hint">
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
