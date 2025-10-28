import React from 'react';
import './Privacy.css';

const Privacy = ({ onBack }: { onBack?: () => void }) => {
  return (
    <div className="privacy-container">
      {onBack && (
        <button 
          onClick={onBack} 
          style={{ 
            marginBottom: '20px', 
            padding: '10px 20px', 
            background: '#667eea', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          ← Back to Game
        </button>
      )}
      <div className="privacy-header">
        <div className="logo">🧪</div>
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: October 28, 2025</p>
      </div>

      <div className="highlight-box">
        <strong>Simple Summary:</strong> We do not collect any personal information. 
        You can play completely anonymously!
      </div>

      <section className="section">
        <h2>1. Introduction</h2>
        <p>
          Welcome to Potion Sort! We are committed to protecting your privacy.
        </p>
        <p>Game Developer: Sami Orouk (@orouk.sami)</p>
      </section>

      <section className="section">
        <h2>2. Information We Collect</h2>
        <h3>Personal Information</h3>
        <p>We do NOT collect any personal information.</p>
        <ul>
          <li>No names</li>
          <li>No email addresses</li>
          <li>No phone numbers</li>
          <li>No payment information</li>
        </ul>

        <h3>Game Progress Data</h3>
        <p>
          Game progress is stored locally on your device only using browser localStorage.
        </p>
      </section>

      <section className="section">
        <h2>3. Cookies and Tracking</h2>
        <p>We do NOT use cookies or tracking.</p>
      </section>

      <section className="section">
        <h2>4. Data Sharing</h2>
        <p>We do NOT share any data because we do not collect it!</p>
      </section>

      <div className="contact-box">
        <h3>Questions?</h3>
        <p>Instagram: @orouk.sami</p>
      </div>

      <div className="copyright">
        <p><strong>2025 Potion Sort by Sami Orouk. All Rights Reserved.</strong></p>
      </div>
    </div>
  );
};

export default Privacy;