import { useState } from 'react';
import Settings from './Settings';
import About from './About';
import Privacy from './Privacy';
import LevelSelect from './LevelSelect';

interface HomeProps {
  onStartGame: (level?: number) => void;
}

export default function Home({ onStartGame }: HomeProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  if (showSettings) return <Settings onClose={() => setShowSettings(false)} />;
  if (showAbout) return <About onBack={() => setShowAbout(false)} />;
  if (showPrivacy) return <Privacy onBack={() => setShowPrivacy(false)} />;
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
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
        color: 'white',
        margin: '0 0 20px 0',
        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        fontWeight: 'bold'
      }}>
        🧪 POTION SORT
      </h1>

      <p style={{
        fontSize: 'clamp(1rem, 3vw, 1.5rem)',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: '40px',
        maxWidth: '600px'
      }}>
        Sort the magical potions! Match colors to complete each level.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '100%',
        maxWidth: '400px'
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
      </div>
    </div>
  );
}
