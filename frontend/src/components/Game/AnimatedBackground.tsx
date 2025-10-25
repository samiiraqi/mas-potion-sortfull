interface AnimatedBackgroundProps {
  theme: string;
}

export default function AnimatedBackground({ theme }: AnimatedBackgroundProps) {
  // Reduced from 50 to 15 particles for better performance
  const particleCount = 15;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      overflow: 'hidden'
    }}>
      {/* Reduced particle count */}
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
