interface PerfectMoveTrackerProps {
  currentMoves: number;
  optimalMoves: number;
  level: number;
}

export default function PerfectMoveTracker({ currentMoves, optimalMoves, level }: PerfectMoveTrackerProps) {
  const isPerfect = currentMoves <= optimalMoves;
  const difference = currentMoves - optimalMoves;
  const isMobile = window.innerWidth < 768;

  return (
    <div style={{
      position: 'fixed',
      top: isMobile ? '120px' : '80px',
      left: isMobile ? '50%' : 'auto',
      right: isMobile ? 'auto' : '20px',
      transform: isMobile ? 'translateX(-50%)' : 'none',
      background: isPerfect 
        ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
        : 'rgba(0,0,0,0.7)',
      padding: isMobile ? '8px 15px' : '12px 20px',
      borderRadius: '15px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: isMobile ? '0.75rem' : '0.9rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
      zIndex: 100,
      border: isPerfect ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.2)',
      animation: isPerfect ? 'glow 1s ease-in-out infinite' : 'none',
      backdropFilter: 'blur(10px)',
      maxWidth: isMobile ? '90%' : 'auto'
    }}>
      <div style={{ fontSize: isMobile ? '0.9rem' : '1.1rem', marginBottom: '3px' }}>
        {isPerfect ? '⭐ PERFECT!' : '🎯 Challenge'}
      </div>
      <div style={{ fontSize: isMobile ? '0.7rem' : '0.85rem', opacity: 0.9 }}>
        Moves: {currentMoves} / {optimalMoves}
        {difference > 0 && ` (+${difference})`}
      </div>
      {isPerfect && (
        <div style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', marginTop: '3px', opacity: 0.9 }}>
          🏆 Gold medal pace!
        </div>
      )}

      <style>{`
        @keyframes glow {
          0%, 100% { box-shadow: 0 4px 15px rgba(255,215,0,0.4); }
          50% { box-shadow: 0 4px 25px rgba(255,215,0,0.8), 0 0 15px rgba(255,215,0,0.6); }
        }
      `}</style>
    </div>
  );
}
