import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // SLOWER loading - 1% every 50ms = 5 seconds total
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadComplete(), 800); // Wait 800ms to enjoy the view!
          return 100;
        }
        return prev + 1; // Slower increment
      });
    }, 50); // Slower interval

    return () => clearInterval(interval);
  }, [onLoadComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden',
      animation: 'backgroundShift 8s ease infinite'
    }}>
      {/* Animated gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 50%, rgba(255,107,157,0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(67,233,123,0.3), transparent 50%), radial-gradient(circle at 40% 20%, rgba(79,172,254,0.3), transparent 50%)',
        animation: 'gradientMove 10s ease infinite',
        opacity: 0.8
      }} />

      {/* Colorful floating bubbles - MORE and SLOWER */}
      {[...Array(30)].map((_, i) => {
        const colors = [
          'rgba(255,107,157,0.7)', // Pink
          'rgba(79,172,254,0.7)',  // Blue
          'rgba(67,233,123,0.7)',  // Green
          'rgba(254,193,99,0.7)',  // Orange
          'rgba(168,85,247,0.7)',  // Purple
          'rgba(236,72,153,0.7)',  // Hot pink
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '-150px',
              left: `${Math.random() * 100}%`,
              width: `${40 + Math.random() * 100}px`,
              height: `${40 + Math.random() * 100}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, 
                rgba(255,255,255,0.9), 
                ${randomColor} 50%, 
                ${randomColor.replace('0.7', '0.4')})`,
              border: '3px solid rgba(255,255,255,0.5)',
              animation: `floatUp ${12 + Math.random() * 12}s ease-in ${Math.random() * 8}s infinite`,
              boxShadow: `inset -15px -15px 30px rgba(255,255,255,0.3), 
                          0 8px 30px ${randomColor}`
            }}
          />
        );
      })}

      {/* Spinning bottles - SLOWER animation */}
      <div style={{
        position: 'relative',
        marginBottom: '50px',
        animation: 'bounce 3s ease-in-out infinite', // Slower bounce
        zIndex: 10
      }}>
        <svg width="180" height="200" viewBox="0 0 180 200">
          <defs>
            <linearGradient id="bottle1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF6B9D', stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: '#FF1744', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="bottle2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4FACFE', stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: '#00F2FE', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="bottle3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FFA726', stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: '#FF6F00', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Three bottles - SLOWER rotation */}
          <g transform="translate(30, 10)">
            <path
              d="M 15 20 L 15 30 C 15 30 10 35 10 45 L 10 150 C 10 155 12 160 20 160 L 40 160 C 48 160 50 155 50 150 L 50 45 C 50 35 45 30 45 30 L 45 20 C 45 18 43 15 40 15 L 20 15 C 17 15 15 18 15 20 Z"
              fill="url(#bottle1)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
              filter="url(#glow)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 30 90"
                to="360 30 90"
                dur="5s"
                repeatCount="indefinite"
              />
            </path>
            <rect x="18" y="13" width="24" height="6" rx="2" fill="#E74C3C" />
          </g>

          <g transform="translate(70, 20)">
            <path
              d="M 15 20 L 15 30 C 15 30 10 35 10 45 L 10 150 C 10 155 12 160 20 160 L 40 160 C 48 160 50 155 50 150 L 50 45 C 50 35 45 30 45 30 L 45 20 C 45 18 43 15 40 15 L 20 15 C 17 15 15 18 15 20 Z"
              fill="url(#bottle2)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
              filter="url(#glow)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 30 90"
                to="360 30 90"
                dur="6s"
                repeatCount="indefinite"
              />
            </path>
            <rect x="18" y="13" width="24" height="6" rx="2" fill="#2196F3" />
          </g>

          <g transform="translate(110, 30)">
            <path
              d="M 15 20 L 15 30 C 15 30 10 35 10 45 L 10 150 C 10 155 12 160 20 160 L 40 160 C 48 160 50 155 50 150 L 50 45 C 50 35 45 30 45 30 L 45 20 C 45 18 43 15 40 15 L 20 15 C 17 15 15 18 15 20 Z"
              fill="url(#bottle3)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2"
              filter="url(#glow)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 30 90"
                to="360 30 90"
                dur="7s"
                repeatCount="indefinite"
              />
            </path>
            <rect x="18" y="13" width="24" height="6" rx="2" fill="#FF9800" />
          </g>
        </svg>
      </div>

      {/* "Loading" text with rainbow glow */}
      <h1 style={{
        fontSize: 'clamp(2.5rem, 7vw, 3.5rem)',
        fontWeight: 'bold',
        background: 'linear-gradient(90deg, #FF6B9D, #4FACFE, #43E97B, #FFA726, #A855F7, #FF6B9D)',
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '25px',
        textShadow: '0 0 30px rgba(255,255,255,0.5)',
        animation: 'rainbowText 4s ease infinite, pulse 2s ease-in-out infinite',
        zIndex: 10,
        position: 'relative'
      }}>
        Loading...
      </h1>

      {/* Progress bar with rainbow gradient */}
      <div style={{
        width: '85%',
        maxWidth: '450px',
        height: '35px',
        background: 'rgba(255,255,255,0.25)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '3px solid rgba(255,255,255,0.4)',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
        {/* Progress fill with rainbow gradient */}
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #FF6B9D 0%, #4FACFE 25%, #43E97B 50%, #FFA726 75%, #A855F7 100%)',
          backgroundSize: '200% 100%',
          borderRadius: '20px',
          transition: 'width 0.5s ease',
          boxShadow: '0 0 30px rgba(79, 172, 254, 0.8)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'rainbowMove 3s linear infinite'
        }}>
          {/* Animated shine */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            animation: 'shine 3s infinite'
          }} />
        </div>

        {/* Colorful mini bubbles inside bar - SLOWER */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: '8px',
              left: `${progress > (i * 12.5) ? Math.random() * progress : 0}%`,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: ['#FF6B9D', '#4FACFE', '#43E97B', '#FFA726'][i % 4],
              boxShadow: '0 0 10px currentColor',
              animation: `bubbleInBar ${2 + Math.random()}s ease-in-out infinite`
            }}
          />
        ))}
      </div>

      {/* Progress percentage with glow */}
      <p style={{
        marginTop: '20px',
        fontSize: '1.5rem',
        color: 'white',
        fontWeight: 'bold',
        textShadow: '0 0 20px rgba(255,255,255,0.8), 0 4px 15px rgba(0,0,0,0.3)',
        zIndex: 10,
        position: 'relative'
      }}>
        {progress}%
      </p>

      {/* Colorful sparkles */}
      {[...Array(15)].map((_, i) => {
        const colors = ['#FF6B9D', '#4FACFE', '#43E97B', '#FFA726', '#A855F7'];
        return (
          <div
            key={`sparkle-${i}`}
            style={{
              position: 'absolute',
              top: `${15 + Math.random() * 70}%`,
              left: `${5 + Math.random() * 90}%`,
              width: '6px',
              height: '6px',
              background: colors[i % colors.length],
              borderRadius: '50%',
              boxShadow: `0 0 15px ${colors[i % colors.length]}`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`
            }}
          />
        );
      })}

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          85% {
            opacity: 0.9;
          }
          100% {
            transform: translateY(-130vh) scale(1.8);
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(5deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.08);
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
            transform: translateY(-8px) scale(1.3);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(2);
          }
        }

        @keyframes backgroundShift {
          0%, 100% {
            filter: hue-rotate(0deg);
          }
          50% {
            filter: hue-rotate(30deg);
          }
        }

        @keyframes gradientMove {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(50px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-50px, 50px) scale(0.9);
          }
        }

        @keyframes rainbowText {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes rainbowMove {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
    </div>
  );
}
