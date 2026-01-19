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

  // Modals
  const [featureModal, setFeatureModal] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // History
  const [showHistory, setShowHistory] = useState(false);
  const [historyMessages, setHistoryMessages] = useState([]);

  const messagesEndRef = useRef(null);

  /* ================= SEND MESSAGE ================= */
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

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
      const response = await axios.post(
        `${API_BASE_URL}/api/analyze-message`,
        { message: messageText }
      );

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        result: response.data.data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorText =
        err.response?.data?.error ||
        err.message ||
        'Failed to analyze message';

      setError(errorText);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: 'error', text: errorText },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH HISTORY ================= */
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/messages`);
      setHistoryMessages(res.data.data?.messages || []);
      setShowHistory(true);
    } catch (err) {
      console.error('Failed to fetch history');
    }
  };

  /* ================= CLEAR CHAT ================= */
  const clearChat = () => {
    setMessages([]);
    setError(null);
    setShowClearConfirm(false);
  };

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* ================= FEATURES ================= */
  const featureData = {
    instant: {
      icon: '⚡',
      title: 'Instant Analysis',
      description:
        'AI analyzes suspicious messages in real time and flags scams instantly.',
    },
    detailed: {
      icon: '🎯',
      title: 'Detailed Explanation',
      description:
        'Clear explanation of phishing signs, malicious intent, and risk score.',
    },
    secure: {
      icon: '🔒',
      title: 'Secure & Private',
      description:
        'Your messages are processed securely and never stored permanently.',
    },
  };

  return (
    <div className="chatbot-container">

      {/* ================= HISTORY POPUP ================= */}
      {showHistory && (
        <div className="history-overlay">
          <div className="history-popup">
            <h2 className="history-title">Chat History</h2>

            <div className="history-content">
              {historyMessages.length === 0 && (
                <p className="empty-history">No history found</p>
              )}
              {historyMessages.map((m) => (
                <div key={m._id} className="history-item">
                  {m.message}
                </div>
              ))}
            </div>

            <button
              className="history-back-btn"
              onClick={() => setShowHistory(false)}
            >
              ← Back to Chat
            </button>
          </div>
        </div>
      )}

      {/* ================= FEATURE MODAL ================= */}
      {featureModal && (
        <div className="modal-overlay" onClick={() => setFeatureModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setFeatureModal(null)}>
              ×
            </button>
            <div className="modal-icon">
              {featureData[featureModal].icon}
            </div>
            <h3>{featureData[featureModal].title}</h3>
            <p>{featureData[featureModal].description}</p>
          </div>
        </div>
      )}

      {/* ================= CLEAR CONFIRM MODAL ================= */}
      {showClearConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Clear Chat History?</h3>
            <p>This will delete all messages from this chat.</p>
            <div className="confirm-buttons">
              <button onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
              <button className="delete-btn" onClick={clearChat}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="chatbot-header">
        <div className="header-content">

          <button className="history-btn-animated" onClick={fetchHistory}>
            History
          </button>

          <div className="logo">
            <div className="logo-icon">🛡️</div>
            <div className="logo-text">
              <h1>CyberGuard Bot</h1>
              <p>AI-Powered Scam Detection</p>
            </div>
          </div>

          {/* ✅ CLEAR HISTORY BUTTON */}
          {messages.length > 0 && (
            <button
              className="clear-btn"
              onClick={() => setShowClearConfirm(true)}
            >
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* ================= CHAT ================= */}
      <div className="chatbot-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h2>Welcome to CyberGuard Bot</h2>
            <p>Paste any suspicious SMS or email to analyze.</p>

            <div className="welcome-features">
              {Object.keys(featureData).map((key) => (
                <div
                  key={key}
                  className="feature"
                  onClick={() => setFeatureModal(key)}
                >
                  {featureData[key].icon} {featureData[key].title}
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id}>
            {message.type === 'user' && (
              <MessageDisplay text={message.text} type="user" />
            )}
            {message.type === 'bot' && (
              <ResultCard result={message.result} />
            )}
            {message.type === 'error' && (
              <div className="error-message">{message.text}</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="loading-message">Analyzing message...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default ChatBot;
