import { useState, useEffect } from 'react';
import Home from './components/Home';
import WaterSortCanvas from './components/Game/WaterSortCanvas';
import { progressManager } from './utils/progressManager';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  const handleStartGame = (level?: number) => {
    if (level) {
      setSelectedLevel(level);
      progressManager.setCurrentLevel(level);
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {[...Array(25)].map((_, i) => {
          const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: '-150px',
                left: `${Math.random() * 100}%`,
                width: `${30 + Math.random() * 80}px`,
                height: `${30 + Math.random() * 80}px`,
                background: colors[Math.floor(Math.random() * colors.length)],
                borderRadius: '50%',
                animation: `float ${5 + Math.random() * 8}s ease-in infinite`,
                animationDelay: `${Math.random() * 5}s`,
                boxShadow: `0 0 30px ${colors[Math.floor(Math.random() * colors.length)]}`,
                opacity: 0.7
              }}
            />
          );
        })}

        {[...Array(40)].map((_, i) => (
          <div
            key={`star-${i}`}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: 'white',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${1.5 + Math.random() * 2.5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              boxShadow: '0 0 15px white'
            }}
          />
        ))}

        <div style={{
          zIndex: 10,
          textAlign: 'center',
          animation: 'fadeInUp 1s ease-out'
        }}>
          <div style={{
            display: 'flex',
            gap: '25px',
            marginBottom: '50px',
            justifyContent: 'center'
          }}>
            {['🧪', '⚗️', '🧴'].map((emoji, i) => (
              <div
                key={i}
                style={{
                  fontSize: '5rem',
                  animation: `bounce ${1.2 + i * 0.2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.4))',
                  transform: 'scale(1)'
                }}
              >
                {emoji}
              </div>
            ))}
          </div>
          
          <h1 style={{
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            margin: '0 0 30px 0',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #FFD700, #FFA500, #FF1493, #00CED1, #32CD32, #FFD700)',
            backgroundSize: '400% 400%',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientShift 4s ease infinite',
            textShadow: '0 0 80px rgba(255,255,255,0.5)',
            letterSpacing: '3px'
          }}>
            POTION SORT
          </h1>

          <div style={{
            fontSize: '1.6rem',
            marginBottom: '60px',
            opacity: 0.95,
            animation: 'pulse 2s ease-in-out infinite',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            ✨ Mixing magical potions... ✨
          </div>

          <div style={{
            width: '450px',
            maxWidth: '90vw',
            margin: '0 auto'
          }}>
            <div style={{
              height: '20px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)',
              position: 'relative'
            }}>
              <div style={{
                height: '100%',
                width: `${loadingProgress}%`,
                background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #45B7D1, #FFA07A, #FFD700)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s ease-in-out infinite',
                borderRadius: '30px',
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.8), inset 0 0 20px rgba(255,255,255,0.5)',
                transition: 'width 0.3s ease'
              }} />
            </div>

            <div style={{
              marginTop: '25px',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              animation: 'fadeIn 1s ease-in'
            }}>
              {loadingProgress}%
            </div>
          </div>

          <div style={{
            marginTop: '30px',
            fontSize: '1.2rem',
            animation: 'fadeIn 2s ease-in',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            {loadingProgress < 30 && '🎨 Preparing colorful potions...'}
            {loadingProgress >= 30 && loadingProgress < 60 && '✨ Mixing magical ingredients...'}
            {loadingProgress >= 60 && loadingProgress < 90 && '🧪 Adding sparkles...'}
            {loadingProgress >= 90 && '🎉 Almost ready!'}
          </div>
        </div>

        <div style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.08,
          animation: 'spin 25s linear infinite'
        }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${100 - i * 20}%`,
                height: `${100 - i * 20}%`,
                top: `${i * 10}%`,
                left: `${i * 10}%`,
                border: '4px solid white',
                borderRadius: '50%',
                animation: `spin ${20 - i * 5}s linear infinite`
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-40px) scale(1.2); }
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes float {
            0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
            10% { opacity: 0.8; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-120vh) translateX(50px) scale(1.5); opacity: 0; }
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes shimmer {
            0% { background-position: 0% 0%; }
            100% { background-position: 200% 0%; }
          }

          @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1.8); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.95; }
            50% { opacity: 1; }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
