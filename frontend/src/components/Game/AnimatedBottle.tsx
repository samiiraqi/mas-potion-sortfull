import { useEffect, useState } from 'react';

interface AnimatedBottleProps {
  colors: string[];
  isSelected: boolean;
  isEmpty: boolean;
  isComplete: boolean;
  onClick: () => void;
}

export default function AnimatedBottle({ colors, isSelected, isEmpty, isComplete, onClick }: AnimatedBottleProps) {
  const [showCompletionEffect, setShowCompletionEffect] = useState(false);
  const [faceExpression, setFaceExpression] = useState('neutral');

  useEffect(() => {
    if (isComplete && !showCompletionEffect) {
      setShowCompletionEffect(true);
      setFaceExpression('happy');
      setTimeout(() => setShowCompletionEffect(false), 2000);
    } else if (isEmpty) {
      setFaceExpression('sleepy');
    } else if (colors.length === 1) {
      setFaceExpression('worried');
    } else if (colors.length === 3) {
      setFaceExpression('focused');
    } else {
      setFaceExpression('neutral');
    }
  }, [isComplete, isEmpty, colors.length]);

  const getFaceEmoji = () => {
    switch (faceExpression) {
      case 'happy': return '😊';
      case 'sleepy': return '😴';
      case 'worried': return '😟';
      case 'focused': return '🤔';
      default: return '😐';
    }
  };

  return (
    <div 
      onClick={onClick}
      style={{
        position: 'relative',
        width: '60px',
        height: '80px',
        background: 'linear-gradient(180deg, #e0e0e0 0%, #f5f5f5 100%)',
        borderRadius: '10px 10px 15px 15px',
        border: isSelected ? '3px solid #00ff00' : '2px solid #ccc',
        cursor: 'pointer',
        overflow: 'hidden',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.2s ease'
      }}
    >
      {/* Bottle face */}
      <div style={{
        position: 'absolute',
        top: '5px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '20px',
        transition: 'all 0.3s ease'
      }}>
        {getFaceEmoji()}
      </div>

      {/* Liquid contents */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '70px',
        display: 'flex',
        flexDirection: 'column-reverse'
      }}>
        {colors.map((color, index) => (
          <div
            key={index}
            style={{
              height: '17.5px',
              background: color,
              border: '1px solid rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Completion sparkle effect */}
      {showCompletionEffect && (
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)',
          animation: 'sparkle 2s ease-in-out',
          pointerEvents: 'none'
        }} />
      )}

      {/* Completion distillation effect */}
      {isComplete && showCompletionEffect && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '24px',
          animation: 'float 2s ease-in-out'
        }}>
          ✨💧✨
        </div>
      )}
    </div>
  );
}
