import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading with smooth progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadComplete(), 500); // Wait 500ms then show game
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Floating background bubbles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: `${Math.random() * 100}%`,
            width: `${30 + Math.random() * 80}px`,
            height: `${30 + Math.random() * 80}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, 
              rgba(255,255,255,0.8), 
              rgba(255,255,255,0.3) 40%, 
              rgba(255,255,255,0.1))`,
            border: '2px solid rgba(255,255,255,0.4)',
            animation: `floatUp ${8 + Math.random() * 8}s ease-in ${Math.random() * 5}s infinite`,
            boxShadow: 'inset -10px -10px 20px rgba(255,255,255,0.2), 0 4px 20px rgba(0,0,0,0.2)'
          }}
        />
      ))}

      {/* Spinning bottles animation */}
      <div style={{
        position: 'relative',
        marginBottom: '40px',
        animation: 'bounce 2s ease-in-out infinite'
      }}>
        <svg width="150" height="180" viewBox="0 0 150 180">
          <defs>
            <linearGradient id="bottle1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#FF1744', stopOpacity: 0.9 }} />
            </linearGradient>
            <linearGradient id="bottle2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4ECDC4', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#00BCD4', stopOpacity: 0.9 }} />
            </linearGradient>
            <linearGradient id="bottle3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FFA726', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#FF6F00', stopOpacity: 0.9 }} />
            </linearGradient>
          </defs>

          {/* Three bottles spinning */}
          <g transform="translate(25, 0)">
            {/* Bottle 1 */}
            <path
              d="M 15 20 L 15 30 C 15 30 10 35 10 45 L 10 140 C 10 145 12 150 20 150 L 40 150 C 48 150 50 145 50 140 L 50 45 C 50 35 45 30 45 30 L 45 20 C 45 18 43 15 40 15 L 20 15 C 17 15 15 18 15 20 Z"
              fill="url(#bottle1)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              opacity="0.9"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 30 80"
                to="360 30 80"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <rect x="18" y="13" width="24" height="5" rx="2" fill="#E74C3C" />
          </g>

          <g transform="translate(65, 10)">
            {/* Bottle 2 */}
            <path
              d="M 15 20 L 15 30 C 15 30 10 35 10 45 L 10 140 C 10 145 12 150 20 150 L 40 150 C 48 150 50 145 50 140 L 50 45 C 50 35 45 30 45 30 L 45 20 C 45 18 43 15 40 15 L 20 15 C 17 15 15 18 15 20 Z"
              fill="url(#bottle2)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              opacity="0.9"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 30 80"
                to="360 30 80"
                dur="3.5s"
                repeatCount="indefinite"
              />
            </path>
            <rect x="18" y="13" width="24" height="5" rx="2" fill="#2196F3" />
          </g>

          <g transform="translate(105, 20)">
            {/* Bottle 3 */}
            <path
              d="M 15 20 L 15 30 C 15 30 10 35 10 45 L 10 140 C 10 145 12 150 20 150 L 40 150 C 48 150 50 145 50 140 L 50 45 C 50 35 45 30 45 30 L 45 20 C 45 18 43 15 40 15 L 20 15 C 17 15 15 18 15 20 Z"
              fill="url(#bottle3)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="2"
              opacity="0.9"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 30 80"
                to="360 30 80"
                dur="4s"
                repeatCount="indefinite"
              />
            </path>
            <rect x="18" y="13" width="24" height="5" rx="2" fill="#FF9800" />
          </g>
        </svg>
      </div>

      {/* "Loading" text with bubble effect */}
      <h1 style={{
        fontSize: 'clamp(2rem, 6vw, 3rem)',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '20px',
        textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}>
        Loading...
      </h1>

      {/* Progress bar with bubbles */}
      <div style={{
        width: '80%',
        maxWidth: '400px',
        height: '30px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '15px',
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.3)',
        position: 'relative'
      }}>
        {/* Progress fill */}
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%)',
          borderRadius: '15px',
          transition: 'width 0.3s ease',
          boxShadow: '0 0 20px rgba(79, 172, 254, 0.6)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated shine on progress bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
            animation: 'shine 2s infinite'
          }} />
        </div>

        {/* Mini bubbles inside progress bar */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '5px',
              left: `${progress > (i * 20) ? Math.random() * progress : 0}%`,
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.8)',
              animation: `bubbleInBar ${1 + Math.random()}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      {/* Progress percentage */}
      <p style={{
        marginTop: '15px',
        fontSize: '1.2rem',
        color: 'white',
        fontWeight: 'bold',
        textShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}>
        {progress}%
      </p>

      {/* Sparkles around */}
      {[...Array(8)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          style={{
            position: 'absolute',
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            width: '4px',
            height: '4px',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 0 10px white',
            animation: `twinkle ${1 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`
          }}
        />
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-120vh) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes bubbleInBar {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-5px) scale(1.2);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
      `}</style>
    </div>
  );
}
