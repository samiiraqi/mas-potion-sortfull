import { progressManager } from '../utils/progressManager';

interface LevelSelectProps {
  onSelectLevel: (level: number) => void;
  onBack: () => void;
}

export default function LevelSelect({ onSelectLevel, onBack }: LevelSelectProps) {
  const completedLevels = progressManager.getCompletedCount();
  const lastLevel = progressManager.getLastLevel();
  const isMobile = window.innerWidth < 768;

  // Show 20 levels per page
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
        maxWidth: '800px',
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
            ← Back
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

        {/* Level Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(8, 1fr)',
          gap: '10px'
        }}>
          {levels.map(level => {
            const unlocked = isLevelUnlocked(level);
            const completed = isLevelCompleted(level);

            return (
              <button
                key={level}
                onClick={() => unlocked && onSelectLevel(level)}
                disabled={!unlocked}
                style={{
                  padding: isMobile ? '15px 10px' : '20px',
                  background: completed
                    ? 'linear-gradient(135deg, #11998e, #38ef7d)'
                    : unlocked
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(0,0,0,0.3)',
                  border: completed
                    ? '3px solid #38ef7d'
                    : '2px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  color: unlocked ? 'white' : 'rgba(255,255,255,0.3)',
                  fontSize: isMobile ? '1rem' : '1.2rem',
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
                {!unlocked && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '1.5rem'
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
