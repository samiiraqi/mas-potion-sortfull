import { useState } from 'react';
import MultiplayerLobby from './Multiplayer/MultiplayerLobby';

interface HomeProps {
  onStartSinglePlayer: () => void;
  onStartMultiplayer: (data: any) => void;
}

export default function Home({ onStartSinglePlayer, onStartMultiplayer }: HomeProps) {
  const [showMultiplayer, setShowMultiplayer] = useState(false);

  if (showMultiplayer) {
    return (
      <MultiplayerLobby 
        onGameStart={onStartMultiplayer}
        onBack={() => setShowMultiplayer(false)}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4rem)',
          marginBottom: '1rem',
          fontWeight: 'bold',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          🍾 Bottle For Mas
        </h1>
        
        <p style={{
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          marginBottom: '3rem',
          opacity: 0.95
        }}>
          Sort the colorful liquids! 120 challenging levels await you!
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center'
        }}>
          <button
            onClick={onStartSinglePlayer}
            style={{
              padding: '20px 50px',
              fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(17, 153, 142, 0.4)',
              transition: 'all 0.3s',
              width: '100%',
              maxWidth: '400px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(17, 153, 142, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(17, 153, 142, 0.4)';
            }}
          >
            🎮 Play Solo
          </button>

          <button
            onClick={() => setShowMultiplayer(true)}
            style={{
              padding: '20px 50px',
              fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(240, 147, 251, 0.4)',
              transition: 'all 0.3s',
              width: '100%',
              maxWidth: '400px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(240, 147, 251, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(240, 147, 251, 0.4)';
            }}
          >
            👥 Play with Friend
          </button>
        </div>

        <div style={{
          marginTop: '3rem',
          padding: '20px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>
            ⭐ 120 Levels • 🎨 Colorful Design • 🧠 Brain Teaser
          </p>
        </div>
      </div>
    </div>
  );
}
