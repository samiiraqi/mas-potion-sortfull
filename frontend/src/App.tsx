import { useState, useEffect } from 'react';
import Home from './components/Home';
import WaterSortCanvas from './components/Game/WaterSortCanvas';
import { progressManager } from './utils/progressManager';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Beautiful loading screen
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleStartGame = (level?: number) => {
    if (level) {
      // User selected a specific level
      setSelectedLevel(level);
      progressManager.saveProgress(level, 0);
    } else {
      // Start from last played level (or level 1)
      const lastLevel = progressManager.getLastLevel();
      setSelectedLevel(lastLevel > 0 ? lastLevel : 1);
    }
    setGameStarted(true);
  };

  const handleExitGame = () => {
    setGameStarted(false);
    setSelectedLevel(null);
  };

  // BEAUTIFUL LOADING SCREEN
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{
          fontSize: '5rem',
          marginBottom: '30px',
          animation: 'bounce 1s infinite'
        }}>
          🧪
        </div>
        
        <h1 style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          margin: '0 0 20px 0',
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          fontWeight: 'bold',
          animation: 'fadeIn 1s'
        }}>
          POTION SORT
        </h1>

        <p style={{
          fontSize: '1.2rem',
          opacity: 0.9,
          marginBottom: '40px',
          animation: 'fadeIn 1.5s'
        }}>
          Loading magical potions...
        </p>

        {/* Loading bar */}
        <div style={{
          width: '300px',
          height: '8px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #11998e, #38ef7d)',
            animation: 'loading 2s ease-in-out'
          }} />
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes loading {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return gameStarted ? (
    <WaterSortCanvas onExit={handleExitGame} />
  ) : (
    <Home onStartGame={handleStartGame} />
  );
}
