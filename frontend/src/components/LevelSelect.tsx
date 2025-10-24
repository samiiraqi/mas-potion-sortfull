import { progressManager } from '../utils/progressManager';

interface LevelSelectProps {
  onSelectLevel: (level: number) => void;
  onBack: () => void;
  currentLevel: number;
}

export default function LevelSelect({ onSelectLevel, onBack, currentLevel }: LevelSelectProps) {
  const completedLevels = progressManager.getCompletedCount();
  const lastLevel = progressManager.getLastLevel();
  const isMobile = window.innerWidth < 768;

  const levels = Array.from({ length: 120 }, (_, i) => i + 1);

  const isLevelUnlocked = (level: number) => {
    return level <= lastLevel;
  };

  const isLevelCompleted = (level: number) => {
    const progress = localStorage.getItem('bottleForMasProgress');
    if (!progress) return false;
    try {
      const data = JSON.parse(progress);
      return data.completedLevels && data.completedLevels[level];
    } catch {
      return false;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <button
            onClick={onBack}
            style={{
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ← Back to Game
          </button>

          <h1 style={{
            color: 'white',
            fontSize: isMobile ? '1.5rem' : '2rem',
            margin: 0
          }}>
            Select Level
          </h1>

          <div style={{
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: 'bold'
          }}>
            {completedLevels}/120
          </div>
        </div>

        {/* Current Level Indicator */}
        <div style={{
          background: 'rgba(255,215,0,0.2)',
          border: '2px solid rgba(255,215,0,0.5)',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center',
          color: 'white'
        }}>
          📍 Currently on Level {currentLevel}
        </div>

        {/* Level Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(5, 1fr)' : 'repeat(10, 1fr)',
          gap: '10px'
        }}>
          {levels.map(level => {
            const unlocked = isLevelUnlocked(level);
            const completed = isLevelCompleted(level);
            const isCurrent = level === currentLevel;

            return (
              <button
                key={level}
                onClick={() => unlocked && onSelectLevel(level)}
                disabled={!unlocked}
                style={{
                  padding: isMobile ? '15px 10px' : '20px',
                  background: isCurrent
                    ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                    : completed
                    ? 'linear-gradient(135deg, #11998e, #38ef7d)'
                    : unlocked
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(0,0,0,0.3)',
                  border: isCurrent
                    ? '3px solid #FFD700'
                    : completed
                    ? '3px solid #38ef7d'
                    : '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: unlocked ? 'white' : 'rgba(255,255,255,0.3)',
                  fontSize: isMobile ? '0.9rem' : '1.1rem',
                  fontWeight: 'bold',
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
                onMouseOver={(e) => {
                  if (unlocked) {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {level}
                {completed && (
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    fontSize: '0.8rem'
                  }}>
                    ✓
                  </div>
                )}
                {isCurrent && (
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    fontSize: '0.8rem'
                  }}>
                    📍
                  </div>
                )}
                {!unlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.2rem'
                  }}>
                    🔒
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
