import { useState } from 'react';
import Settings from './Settings';
import About from './About';
import Privacy from './Privacy';
import QRGenerator from './QRGenerator';
import LevelSelect from './LevelSelect';

interface HomeProps {
  onStartGame: (level?: number) => void;
}

export default function Home({ onStartGame }: HomeProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  if (showSettings) return <Settings onClose={() => setShowSettings(false)} />;
  if (showAbout) return <About onBack={() => setShowAbout(false)} />;
  if (showPrivacy) return <Privacy onBack={() => setShowPrivacy(false)} />;
  if (showQR) return <QRGenerator onBack={() => setShowQR(false)} />;
  if (showLevelSelect) return <LevelSelect onSelectLevel={(level) => { setShowLevelSelect(false); onStartGame(level); }} onBack={() => setShowLevelSelect(false)} currentLevel={1} />;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden'
      }}>
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              background: 'white',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      <h1 style={{
        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
        color: 'white',
        margin: '0 0 20px 0',
        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        fontWeight: 'bold',
        position: 'relative',
        zIndex: 1
      }}>
        🧪 POTION SORT
      </h1>

      <p style={{
        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '40px',
        maxWidth: '600px',
        position: 'relative',
        zIndex: 1
      }}>
        Sort the magical potions! Match colors to complete each level.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 1
      }}>
        <button onClick={() => onStartGame()} style={{
          padding: '20px 40px',
          fontSize: '1.5rem',
          background: 'linear-gradient(135deg, #11998e, #38ef7d)',
          border: 'none',
          borderRadius: '15px',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(17, 153, 142, 0.4)',
          transition: 'all 0.3s'
        }}>
          ▶️ START GAME
        </button>

        <button 
          onClick={() => window.location.href = '/daily-challenge.html'} 
          style={{
            padding: '20px 40px',
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #1a0d2e 0%, #2d1b4e 100%)',
            border: '3px solid rgba(102, 126, 234, 0.6)',
            borderRadius: '15px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(102, 126, 234, 0.6), 0 8px 30px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          ⭐ DAILY CHALLENGE ⭐
        </button>

        <button onClick={() => window.location.href = '/candle-challenge.html?difficulty=medium'} style={{
          padding: '18px 35px',
          fontSize: '1.3rem',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: 'none',
          borderRadius: '15px',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(240, 147, 251, 0.5)',
          transition: 'all 0.3s'
        }}>
          🕯️ CANDLE CHALLENGE
        </button>

        <button onClick={() => setShowLevelSelect(true)} style={{
          padding: '15px 30px',
          fontSize: '1.2rem',
          background: 'rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '12px',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}>
          📊 SELECT LEVEL
        </button>

        <button onClick={() => setShowSettings(true)} style={{
          padding: '15px 30px',
          fontSize: '1.2rem',
          background: 'rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '12px',
          color: 'white',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}>
          ⚙️ SETTINGS
        </button>

        <button onClick={() => setShowAbout(true)} style={{
          padding: '10px 20px',
          fontSize: '1rem',
          background: 'transparent',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '10px',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}>
          ℹ️ About
        </button>

        <button onClick={() => setShowPrivacy(true)} style={{
          padding: '10px 20px',
          fontSize: '0.9rem',
          background: 'transparent',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '10px',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}>
          🔒 Privacy
        </button>

        <button onClick={() => setShowQR(true)} style={{
          padding: '10px 20px',
          fontSize: '0.9rem',
          background: 'transparent',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: '10px',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}>
          📱 QR Code
        </button>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        button:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        button:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>
    </div>
  );
}
