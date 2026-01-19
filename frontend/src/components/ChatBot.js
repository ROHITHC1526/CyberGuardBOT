import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MessageInput from './MessageInput';
import MessageDisplay from './MessageDisplay';
import ResultCard from './ResultCard';
import './ChatBot.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [featureModal, setFeatureModal] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      type: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze-message`, {
        message: messageText,
      });

      const data = response.data;

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        result: data.data,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorText = err.response?.data?.error || err.message || 'Failed to analyze message';
      setError(errorText);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        text: errorText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Feature modal data
  const featureData = {
    instant: {
      icon: '⚡',
      title: 'Instant Analysis',
      description: 'Our AI-powered engine analyzes messages in real-time, providing immediate threat assessment and scam detection. Get results within seconds, not minutes.',
      color: '#FFA500'
    },
    detailed: {
      icon: '🎯',
      title: 'Detailed Explanations',
      description: 'Receive comprehensive breakdowns of why a message is flagged as suspicious. We highlight specific red flags, phishing indicators, and security concerns with clear explanations.',
      color: '#FF3B3B'
    },
    secure: {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your privacy matters. All messages are analyzed securely and never stored permanently. We use end-to-end encryption and follow strict data protection protocols.',
      color: '#FFD700'
    }
  };

  const handleFeatureClick = (featureKey) => {
    setFeatureModal(featureKey);
  };

  const closeFeatureModal = () => {
    setFeatureModal(null);
  };

  const handleBackClick = () => {
    if (messages.length > 0) {
      setMessages([]);
      setError(null);
    }
  };

  const handleClear = () => {
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    setMessages([]);
    setError(null);
    setShowClearConfirm(false);
  };

  const cancelClear = () => {
    setShowClearConfirm(false);
  };

  return (
    <div className="chatbot-container">
      {/* Feature Modal */}
      {featureModal && (
        <div className="modal-overlay" onClick={closeFeatureModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeFeatureModal}>×</button>
            <div className="modal-icon" style={{ color: featureData[featureModal].color }}>
              {featureData[featureModal].icon}
            </div>
            <h3 className="modal-title">{featureData[featureModal].title}</h3>
            <p className="modal-description">{featureData[featureModal].description}</p>
          </div>
        </div>
      )}

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="modal-overlay" onClick={cancelClear}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h3 className="confirm-title">Clear Chat History?</h3>
            <p className="confirm-message">This will permanently delete all messages and analysis results. This action cannot be undone.</p>
            <div className="confirm-buttons">
              <button className="confirm-btn cancel-btn" onClick={cancelClear}>Cancel</button>
              <button className="confirm-btn delete-btn" onClick={confirmClear}>Clear All</button>
            </div>
          </div>
        </div>
      )}

      <div className="chatbot-header">
        <div className="header-content">
          {/* Back Button */}
          {messages.length > 0 && (
            <button className="back-btn" onClick={handleBackClick} title="Back to welcome screen">
              <span className="back-icon">←</span>
            </button>
          )}
          
          <div className="logo">
            <div className="logo-icon">🛡️</div>
            <div className="logo-text">
              <h1>CyberGuard Bot</h1>
              <p>AI-Powered Scam Detection</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button className="clear-btn" onClick={handleClear}>
              Clear History
            </button>
          )}
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">🔍</div>
            <h2>Welcome to CyberGuard Bot</h2>
            <p>Paste any suspicious SMS or email message below to analyze it for scam indicators.</p>
            <div className="welcome-features">
              <div 
                className="feature" 
                onClick={() => handleFeatureClick('instant')}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleFeatureClick('instant')}
              >
                <span className="feature-icon">⚡</span>
                <span>Instant Analysis</span>
              </div>
              <div 
                className="feature" 
                onClick={() => handleFeatureClick('detailed')}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleFeatureClick('detailed')}
              >
                <span className="feature-icon">🎯</span>
                <span>Detailed Explanations</span>
              </div>
              <div 
                className="feature" 
                onClick={() => handleFeatureClick('secure')}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleFeatureClick('secure')}
              >
                <span className="feature-icon">🔒</span>
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message-wrapper ${message.type}`}>
            {message.type === 'user' && (
              <MessageDisplay text={message.text} type="user" />
            )}
            {message.type === 'bot' && message.result && (
              <ResultCard result={message.result} />
            )}
            {message.type === 'error' && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{message.text}</span>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="loading-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Analyzing message...</span>
          </div>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default ChatBot;
