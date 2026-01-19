import React from 'react';
import './ResultCard.css';

const ResultCard = ({ result }) => {
  const { prediction, probability, explanations } = result;
  const isScam = prediction === 'Scam';

  // Calculate probability bar width and color
  const barWidth = Math.max(probability, 5); // Minimum 5% for visibility
  const barColor = isScam
    ? `linear-gradient(90deg, #ff3b3b 0%, #ff6b6b 100%)`
    : `linear-gradient(90deg, #00ff88 0%, #00cc70 100%)`;

  return (
    <div className={`result-card ${isScam ? 'scam' : 'legit'}`}>
      <div className="result-header">
        <div className="result-badge">
          <span className="badge-icon">{isScam ? '⚠️' : '✅'}</span>
          <span className="badge-text">{prediction}</span>
        </div>
        <div className="result-probability">
          <span className="probability-value">{probability.toFixed(1)}%</span>
          <span className="probability-label">confidence</span>
        </div>
      </div>

      <div className="probability-bar-container">
        <div
          className="probability-bar"
          style={{
            width: `${barWidth}%`,
            background: barColor,
            boxShadow: `0 0 20px ${isScam ? 'rgba(255, 59, 59, 0.5)' : 'rgba(0, 255, 136, 0.5)'}`,
          }}
        >
          <div className="probability-bar-glow"></div>
        </div>
      </div>

      {explanations && explanations.length > 0 && (
        <div className="explanations-section">
          <h3 className="explanations-title">
            {isScam ? '⚠️ Why this appears to be a scam:' : '✅ Why this appears legitimate:'}
          </h3>
          <ul className="explanations-list">
            {explanations.map((explanation, index) => (
              <li key={index} className="explanation-item">
                <span className="explanation-bullet">{isScam ? '🔴' : '🟢'}</span>
                <span className="explanation-text">{explanation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="result-footer">
        <span className="footer-icon">🛡️</span>
        <span className="footer-text">Analyzed by CyberGuard AI</span>
      </div>
    </div>
  );
};

export default ResultCard;
