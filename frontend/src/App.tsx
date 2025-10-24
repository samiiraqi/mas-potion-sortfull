import { useState, useEffect } from 'react';
import Home from './components/Home';
import WaterSortCanvas from './components/Game/WaterSortCanvas';
import { progressManager } from './utils/progressManager';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const handleStartGame = (level?: number) => {
    if (level) {
      setSelectedLevel(level);
      progressManager.saveProgress(level, 0);
    } else {
      const lastLevel = progressManager.getLastLevel();
      setSelectedLevel(lastLevel > 0 ? lastLevel : 1);
    }
    setGameStarted(true);
  };

  const handleExitGame = () => {
    setGameStarted(false);
    setSelectedLevel(null);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated bubbles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
              background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`,
              borderRadius: '50%',
              animation: `float ${3 + Math.random() * 4}s ease-in infinite`,
              animationDelay: `${Math.random() * 3}s`,
              boxShadow: '0 0 20px rgba(255,255,255,0.3)'
            }}
          />
        ))}

        {/* Main potion icon */}
        <div style={{
          fontSize: '6rem',
          marginBottom: '30px',
          animation: 'bounce 1.5s ease-in-out infinite',
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'
        }}>
          🧪
        </div>
        
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 5rem)',
          margin: '0 0 20px 0',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF69B4, #4ECDC4)',
          backgroundSize: '300% 300%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradient 3s ease infinite'
        }}>
          POTION SORT
        </h1>

        <p style={{
          fontSize: '1.3rem',
          opacity: 0.9,
          marginBottom: '50px',
          animation: 'fadeIn 1.5s ease-in'
        }}>
          Loading magical potions...
        </p>

        {/* Animated loading bar */}
        <div style={{
          width: '350px',
          height: '12px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #11998e, #38ef7d, #FFD700)',
            animation: 'loading 3s ease-in-out',
            borderRadius: '20px',
            boxShadow: '0 0 20px rgba(56, 239, 125, 0.6)'
          }} />
        </div>

        {/* Rotating circles */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.1,
          animation: 'spin 10s linear infinite'
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            border: '3px solid white',
            borderRadius: '50%'
          }} />
          <div style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            top: '10%',
            left: '10%',
            border: '3px solid white',
            borderRadius: '50%'
          }} />
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-30px) scale(1.1); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes loading {
            from { width: 0%; }
            to { width: 100%; }
          }

          @keyframes float {
            0% { 
              transform: translateY(0) translateX(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% { 
              transform: translateY(-100vh) translateX(50px);
              opacity: 0;
            }
          }

          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
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
