import { storage } from '../../utils/storage';
import { soundManager } from '../../utils/sounds';

interface LevelSelectProps {
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
  currentTheme: string;
}

export default function LevelSelect({ onSelectLevel, onClose, currentTheme }: LevelSelectProps) {
  const totalStars = storage.getTotalStars();
  const maxStars = 150;

  const getDifficultyColor = (levelId: number) => {
    if (levelId <= 10) return '#10B981';
    if (levelId <= 25) return '#F59E0B';
    if (levelId <= 35) return '#EF4444';
    return '#8B5CF6';
  };

  const getDifficultyLabel = (levelId: number) => {
    if (levelId <= 10) return '🟢 EASY';
    if (levelId <= 25) return '🟡 MEDIUM';
    if (levelId <= 35) return '🔴 HARD';
    return '🟣 EXPERT';
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 10000,
      overflowY: 'auto',
      padding: '20px'
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(255,0,0,0.8)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: 'white',
          zIndex: 10001
        }}
      >
        ✕
      </button>

      <h1 style={{
        color: 'white',
        fontSize: '2.5rem',
        margin: '20px 0',
        textAlign: 'center',
        background: 'linear-gradient(to right, #FFD700, #FFA500)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🎯 SELECT LEVEL
      </h1>

      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '20px',
        borderRadius: '20px',
        marginBottom: '30px',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>
          ⭐ TOTAL STARS: <strong style={{ color: '#FFD700' }}>{totalStars} / {maxStars}</strong>
        </div>
        <div style={{
          width: '300px',
          height: '20px',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '10px',
          overflow: 'hidden',
          margin: '10px auto'
        }}>
          <div style={{
            width: `${(totalStars / maxStars) * 100}%`,
            height: '100%',
            background: 'linear-gradient(to right, #FFD700, #FFA500)',
            transition: 'width 0.3s'
          }} />
        </div>
        <div style={{ color: '#FFD700', fontSize: '0.9rem' }}>
          {Math.round((totalStars / maxStars) * 100)}% Complete
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '15px',
        maxWidth: '1000px',
        width: '100%'
      }}>
        {Array.from({ length: 50 }, (_, i) => i + 1).map(levelId => {
          const stats = storage.getLevelStats(levelId);
          const diffColor = getDifficultyColor(levelId);
          
          return (
            <button
              key={levelId}
              onClick={() => {
                soundManager.play('click');
                onSelectLevel(levelId);
              }}
              style={{
                background: stats.completed 
                  ? `linear-gradient(135deg, ${diffColor}, ${diffColor}dd)` 
                  : 'rgba(100,100,100,0.3)',
                border: stats.completed ? `3px solid ${diffColor}` : '3px solid rgba(255,255,255,0.2)',
                borderRadius: '15px',
                padding: '20px 10px',
                cursor: 'pointer',
                color: 'white',
                position: 'relative',
                transition: 'all 0.2s',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ fontSize: '0.7rem', marginBottom: '5px', opacity: 0.8 }}>
                {getDifficultyLabel(levelId)}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>
                {levelId}
              </div>
              
              {stats.completed && (
                <>
                  <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>
                    {'⭐'.repeat(stats.stars)}
                  </div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                    Best: {stats.bestMoves} moves
                  </div>
                  {stats.stars === 3 && (
                    <div style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: '#FFD700',
                      color: '#000',
                      borderRadius: '50%',
                      width: '25px',
                      height: '25px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </div>
                  )}
                </>
              )}
              
              {!stats.completed && (
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '5px' }}>
                  Not Completed
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '15px',
        maxWidth: '600px',
        backdropFilter: 'blur(10px)'
      }}>
        <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '15px' }}>
          ⭐ STAR RATINGS
        </h3>
        <div style={{ color: 'white', fontSize: '0.95rem', lineHeight: '1.8' }}>
          <div>⭐ <strong>1 Star:</strong> Complete the level</div>
          <div>⭐⭐ <strong>2 Stars:</strong> Complete within +5 moves of optimal</div>
          <div>⭐⭐⭐ <strong>3 Stars:</strong> Complete in optimal moves!</div>
        </div>
      </div>
    </div>
  );
}
