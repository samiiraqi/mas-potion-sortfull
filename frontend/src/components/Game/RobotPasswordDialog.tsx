import { useState } from 'react';

interface RobotPasswordDialogProps {
  onClose: () => void;
  onCorrectPassword: () => void;
  levelNumber: number;
}

export default function RobotPasswordDialog({ onClose, onCorrectPassword, levelNumber }: RobotPasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isMobile = window.innerWidth < 768;

  const correctPassword = 'POTION2025'; // Simple password

  const handleSubmit = () => {
    if (password.toUpperCase() === correctPassword) {
      onCorrectPassword();
      onClose();
    } else {
      setError('❌ Wrong password! Contact us on Instagram to get it.');
    }
  };

  const openInstagram = () => {
    window.open('https://instagram.com/orouk.sami', '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: isMobile ? '30px 20px' : '50px 40px',
        borderRadius: '25px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🤖</div>
        
        <h2 style={{ 
          fontSize: isMobile ? '1.5rem' : '2rem', 
          marginBottom: '15px',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Robot Solver
        </h2>

        <p style={{ 
          fontSize: isMobile ? '0.9rem' : '1.1rem', 
          marginBottom: '25px',
          opacity: 0.9
        }}>
          Stuck on Level {levelNumber}? 😰<br/>
          The robot can solve it for you!
        </p>

        <div style={{
          background: 'rgba(255,255,255,0.15)',
          padding: '25px',
          borderRadius: '15px',
          marginBottom: '25px',
          border: '2px solid rgba(255,255,255,0.3)'
        }}>
          <p style={{ 
            fontSize: '1rem', 
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            🔒 Enter Secret Password:
          </p>

          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Password..."
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '1.1rem',
              borderRadius: '10px',
              border: '2px solid rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.9)',
              textAlign: 'center',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}
          />

          {error && (
            <p style={{ color: '#FFD700', fontSize: '0.9rem', marginTop: '10px' }}>
              {error}
            </p>
          )}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '25px'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '15px', fontWeight: 'bold' }}>
            📱 Don't have the password?
          </p>
          
          <button
            onClick={openInstagram}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              boxShadow: '0 5px 20px rgba(188,24,136,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>📷</span>
            Follow & Message on Instagram
          </button>

          <p style={{ 
            fontSize: '0.9rem', 
            marginTop: '10px',
            opacity: 0.8
          }}>
            @orouk.sami
          </p>

          <p style={{ 
            fontSize: '0.85rem', 
            marginTop: '15px',
            opacity: 0.7,
            fontStyle: 'italic'
          }}>
            Message: "Need robot password for Level {levelNumber}!"
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              padding: '15px',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✓ Unlock
          </button>

          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '15px',
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✕ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
