export default function BottleTextLogo() {
  return (
    <div style={{
      position: 'relative',
      width: '400px',
      height: '500px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Alchemist Flask Bottle Shape */}
      <svg width="400" height="500" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="flaskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.3)', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.15)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.05)', stopOpacity: 1 }} />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Alchemist Flask Shape */}
        <path
          d="M 180 50 L 180 150 Q 180 180 160 220 Q 140 260 140 300 L 140 420 Q 140 450 170 450 L 230 450 Q 260 450 260 420 L 260 300 Q 260 260 240 220 Q 220 180 220 150 L 220 50 Q 220 30 200 30 Q 180 30 180 50 Z"
          fill="url(#flaskGradient)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="3"
          filter="url(#glow)"
        />
        
        {/* Cork/Stopper */}
        <ellipse cx="200" cy="35" rx="25" ry="10" fill="rgba(139,69,19,0.8)" stroke="rgba(101,67,33,0.9)" strokeWidth="2"/>
        
        {/* Shimmer effect */}
        <ellipse cx="170" cy="200" rx="15" ry="40" fill="rgba(255,255,255,0.2)" opacity="0.6"/>
      </svg>

      {/* Text "POTION SORT" inside bottle */}
      <div style={{
        position: 'absolute',
        zIndex: 10,
        textAlign: 'center',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px'
      }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 0 20px rgba(138,43,226,0.8), 0 0 40px rgba(138,43,226,0.5), 2px 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '3px',
          fontFamily: 'Arial, sans-serif',
          lineHeight: '1.2',
          WebkitTextStroke: '2px rgba(138,43,226,0.3)',
          animation: 'shimmer 3s infinite'
        }}>
          POTION
        </div>
        <div style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 0 20px rgba(138,43,226,0.8), 0 0 40px rgba(138,43,226,0.5), 2px 2px 4px rgba(0,0,0,0.5)',
          letterSpacing: '3px',
          fontFamily: 'Arial, sans-serif',
          marginTop: '-10px',
          WebkitTextStroke: '2px rgba(138,43,226,0.3)',
          animation: 'shimmer 3s infinite 0.5s'
        }}>
          SORT
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%, 100% { 
            filter: brightness(1) drop-shadow(0 0 10px rgba(138,43,226,0.5));
          }
          50% { 
            filter: brightness(1.2) drop-shadow(0 0 20px rgba(138,43,226,0.8));
          }
        }
      `}</style>
    </div>
  );
}
