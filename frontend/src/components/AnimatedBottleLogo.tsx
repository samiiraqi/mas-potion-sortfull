export default function AnimatedBottleLogo() {
  return (
    <div style={{
      display: 'inline-block',
      position: 'relative',
      width: '80px',
      height: '100px',
      marginRight: '15px',
      verticalAlign: 'middle'
    }}>
      {/* Bottle SVG */}
      <svg
        width="80"
        height="100"
        viewBox="0 0 80 100"
        style={{
          filter: 'drop-shadow(0 4px 20px rgba(255,255,255,0.3))'
        }}
      >
        {/* Bottle body */}
        <defs>
          <linearGradient id="bottleGlass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.9)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(200,220,255,0.8)', stopOpacity: 1 }} />
          </linearGradient>
          
          <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 0.9 }} />
            <stop offset="50%" style={{ stopColor: '#4ECDC4', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: '#45B7D1', stopOpacity: 0.9 }} />
          </linearGradient>
        </defs>
        
        {/* Bottle outline */}
        <path
          d="M 25 10 L 25 20 C 25 20 20 25 20 35 L 20 85 C 20 90 22 95 30 95 L 50 95 C 58 95 60 90 60 85 L 60 35 C 60 25 55 20 55 20 L 55 10 C 55 8 53 5 50 5 L 30 5 C 27 5 25 8 25 10 Z"
          fill="url(#bottleGlass)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
        />
        
        {/* Liquid inside bottle */}
        <path
          d="M 22 50 L 22 85 C 22 88 24 92 30 92 L 50 92 C 56 92 58 88 58 85 L 58 50 Z"
          fill="url(#liquidGradient)"
          opacity="0.85"
        >
          {/* Liquid animation - slowly filling up and down */}
          <animate
            attributeName="d"
            values="
              M 22 70 L 22 85 C 22 88 24 92 30 92 L 50 92 C 56 92 58 88 58 85 L 58 70 Z;
              M 22 45 L 22 85 C 22 88 24 92 30 92 L 50 92 C 56 92 58 88 58 85 L 58 45 Z;
              M 22 70 L 22 85 C 22 88 24 92 30 92 L 50 92 C 56 92 58 88 58 85 L 58 70 Z
            "
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        
        {/* Bottle cap */}
        <rect x="28" y="3" width="24" height="5" rx="2" fill="#E74C3C" />
        
        {/* Shine effect */}
        <ellipse cx="32" cy="30" rx="8" ry="15" fill="rgba(255,255,255,0.4)" />
      </svg>
      
      {/* Animated bubbles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: `${20 + Math.random() * 40}%`,
            left: `${30 + Math.random() * 40}%`,
            width: `${4 + Math.random() * 6}px`,
            height: `${4 + Math.random() * 6}px`,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            animation: `bubbleFloat ${2 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
            boxShadow: '0 0 10px rgba(255,255,255,0.8)'
          }}
        />
      ))}
      
      <style>{`
        @keyframes bubbleFloat {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
