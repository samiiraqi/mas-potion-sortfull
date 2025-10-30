interface AnimatedBackgroundProps {
  theme: string;
}

export default function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  const particleCount = 15;

  // 🔥 ACTUAL THEME BACKGROUNDS
  const backgrounds: { [key: string]: string } = {
    galaxy: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    sunset: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    cherry: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    ocean: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    mountain: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    night: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
  };

  const currentBg = backgrounds[theme] || backgrounds.galaxy;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      background: currentBg, // 🔥 USE THE THEME
      overflow: 'hidden',
      transition: 'background 0.8s ease' // 🔥 SMOOTH TRANSITION
    }}>
      {[...Array(particleCount)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${10 + Math.random() * 20}px`,
            height: `${10 + Math.random() * 20}px`,
            background: `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`,
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${10 + Math.random() * 10}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, -20px); }
          50% { transform: translate(-20px, 20px); }
          75% { transform: translate(20px, 20px); }
        }
      `}</style>
    </div>
  );
}