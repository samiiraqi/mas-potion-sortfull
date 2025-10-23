interface VictoryShareProps {
  level: number;
  moves: number;
  isPerfect: boolean;
  onShare: () => void;
  onClose: () => void;
}

export default function VictoryShare({ level, moves, isPerfect, onShare, onClose }: VictoryShareProps) {
  const shareToSocial = () => {
    const text = `🧪 I just completed Level ${level} in ${moves} moves${isPerfect ? ' with a PERFECT score!' : '!'} 🎉\n\nCan you beat my score?\n\nPlay Potion Sort now! ⚗️✨`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(text);
    
    // Try to share if available
    if (navigator.share) {
      navigator.share({
        title: 'Potion Sort Victory!',
        text: text,
        url: window.location.href
      }).catch(() => {
        alert('📋 Victory message copied to clipboard! Share it on social media!');
      });
    } else {
      alert('📋 Victory message copied to clipboard! Share it on social media!');
    }
    
    onShare();
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      padding: '20px 30px',
      borderRadius: '20px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      zIndex: 9999,
      animation: 'slideUp 0.5s ease-out'
    }}>
      <div style={{ textAlign: 'center', color: 'white', marginBottom: '15px' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
          {isPerfect ? '⭐ PERFECT SCORE! ⭐' : '🎉 LEVEL COMPLETE! 🎉'}
        </div>
        <div style={{ fontSize: '1rem', opacity: 0.9 }}>
          Level {level} • {moves} moves
        </div>
      </div>

      <button
        onClick={shareToSocial}
        style={{
          width: '100%',
          padding: '15px',
          background: 'linear-gradient(135deg, #11998e, #38ef7d)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginBottom: '10px',
          boxShadow: '0 4px 15px rgba(17,153,142,0.4)'
        }}
      >
        📱 Share Victory!
      </button>

      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: '12px',
          background: 'rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '12px',
          color: 'white',
          fontSize: '0.9rem',
          cursor: 'pointer'
        }}
      >
        Close
      </button>

      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
