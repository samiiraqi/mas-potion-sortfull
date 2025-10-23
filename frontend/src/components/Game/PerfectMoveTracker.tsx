interface PerfectMoveTrackerProps {
  currentMoves: number;
  optimalMoves: number;
  level: number;
}

export default function PerfectMoveTracker({ currentMoves, optimalMoves, level }: PerfectMoveTrackerProps) {
  const isPerfect = currentMoves <= optimalMoves;
  const difference = currentMoves - optimalMoves;

  return (
    <div style={{
      position: 'fixed',
      top: '60px',
      right: '20px',
      background: isPerfect 
        ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
        : 'rgba(0,0,0,0.5)',
      padding: '12px 20px',
      borderRadius: '15px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '0.9rem',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      zIndex: 100,
      border: isPerfect ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.2)',
      animation: isPerfect ? 'glow 1s ease-in-out infinite' : 'none'
    }}>
      <div style={{ fontSize: '1.1rem', marginBottom: '5px' }}>
        {isPerfect ? '⭐ PERFECT!' : '🎯 Challenge'}
      </div>
      <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
        Moves: {currentMoves} / {optimalMoves}
        {difference > 0 && ` (+${difference})`}
      </div>
      {isPerfect && (
        <div style={{ fontSize: '0.75rem', marginTop: '5px', opacity: 0.9 }}>
          🏆 You're on track for a gold medal!
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
