interface AnimatedBackgroundProps {
  theme: string;
}

export default function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  const backgrounds = {
    sunset: {
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 30%, #FFA07A 60%, #FFB88C 100%)',
      particles: '☁️',
      color1: '#FF6B6B',
      color2: '#FFA07A'
    },
    galaxy: {
      gradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
      particles: '⭐',
      color1: '#667eea',
      color2: '#764ba2'
    },
    cherry: {
      gradient: 'linear-gradient(135deg, #FFE5E5 0%, #FFB3BA 50%, #FFCDD2 100%)',
      particles: '🌸',
      color1: '#FFB3BA',
      color2: '#FF8A95'
    },
    ocean: {
      gradient: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 50%, #006B8F 100%)',
      particles: '🐟',
      color1: '#00D4FF',
      color2: '#0099CC'
    },
    mountain: {
      gradient: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 30%, #80DEEA 70%, #4DD0E1 100%)',
      particles: '⛰️',
      color1: '#80DEEA',
      color2: '#26C6DA'
    },
    night: {
      gradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
      particles: '🌙',
      color1: '#667eea',
      color2: '#E94560'
    }
  };

  const bg = backgrounds[theme as keyof typeof backgrounds] || backgrounds.galaxy;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: bg.gradient,
      zIndex: -1,
      overflow: 'hidden'
    }}>
      {/* Animated gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle at 20% 50%, ${bg.color1}30, transparent 50%),
                     radial-gradient(circle at 80% 80%, ${bg.color2}30, transparent 50%)`,
        animation: 'gradientMove 15s ease infinite'
      }} />

      {/* Floating particles */}
      {[...Array(theme === 'ocean' ? 15 : 20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            fontSize: theme === 'ocean' ? '2rem' : '1.5rem',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: theme === 'ocean' 
              ? `swim ${8 + Math.random() * 8}s ease-in-out ${Math.random() * 5}s infinite`
              : `float ${10 + Math.random() * 10}s ease-in-out ${Math.random() * 5}s infinite`,
            opacity: 0.6,
            filter: 'blur(0.5px)'
          }}
        >
          {bg.particles}
        </div>
      ))}

      {/* Special effects per theme */}
      {theme === 'sunset' && (
        <>
          {/* Sun */}
          <div style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FFD700, #FF8C00)',
            boxShadow: '0 0 60px #FFD700',
            animation: 'pulse 4s ease infinite'
          }} />
        </>
      )}

      {theme === 'galaxy' && (
        <>
          {/* Stars */}
          {[...Array(50)].map((_, i) => (
            <div
              key={`star-${i}`}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: '2px',
                height: '2px',
                background: 'white',
                borderRadius: '50%',
                boxShadow: '0 0 3px white',
                animation: `twinkle ${2 + Math.random() * 3}s ease ${Math.random() * 3}s infinite`
              }}
            />
          ))}
        </>
      )}

      {theme === 'cherry' && (
        <>
          {/* Falling petals */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`petal-${i}`}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-20px',
                fontSize: '1.5rem',
                animation: `fall ${8 + Math.random() * 8}s linear ${Math.random() * 5}s infinite`,
                opacity: 0.8
              }}
            >
              🌸
            </div>
          ))}
        </>
      )}

      {theme === 'ocean' && (
        <>
          {/* Bubbles rising */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`bubble-${i}`}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                bottom: '-50px',
                width: `${10 + Math.random() * 20}px`,
                height: `${10 + Math.random() * 20}px`,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.3))',
                border: '2px solid rgba(255,255,255,0.4)',
                animation: `rise ${8 + Math.random() * 8}s ease-in ${Math.random() * 5}s infinite`
              }}
            />
          ))}
        </>
      )}

      {theme === 'mountain' && (
        <>
          {/* Drifting clouds */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`cloud-${i}`}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                fontSize: '3rem',
                animation: `drift ${20 + Math.random() * 15}s linear ${Math.random() * 10}s infinite`,
                opacity: 0.7
              }}
            >
              ☁️
            </div>
          ))}
        </>
      )}

      {theme === 'night' && (
        <>
          {/* Moon */}
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #F4F4F4, #D3D3D3)',
            boxShadow: '0 0 40px rgba(255,255,255,0.5)',
            animation: 'pulse 5s ease infinite'
          }} />
          {/* City lights at bottom */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`light-${i}`}
              style={{
                position: 'absolute',
                bottom: '0',
                left: `${i * 5}%`,
                width: '3px',
                height: `${30 + Math.random() * 80}px`,
                background: `linear-gradient(to top, ${['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7'][i % 4]}, transparent)`,
                animation: `blink ${2 + Math.random() * 2}s ease ${Math.random() * 2}s infinite`
              }}
            />
          ))}
        </>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -30px) rotate(5deg); }
          50% { transform: translate(-20px, -60px) rotate(-5deg); }
          75% { transform: translate(30px, -90px) rotate(3deg); }
        }

        @keyframes swim {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(50px, 30px); }
          50% { transform: translate(-30px, -20px); }
          75% { transform: translate(40px, -30px); }
        }

        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
        }

        @keyframes rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-120vh) scale(1.5); opacity: 0; }
        }

        @keyframes drift {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200vw); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes gradientMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-50px, 50px) scale(0.9); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
