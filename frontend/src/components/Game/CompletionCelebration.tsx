import { useEffect, useState } from 'react';

interface CompletionCelebrationProps {
  bottleIndex: number;
  isComplete: boolean;
  position: { x: number; y: number };
}

export default function CompletionCelebration({ bottleIndex, isComplete, position }: CompletionCelebrationProps) {
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (isComplete) {
      setShowEffect(true);
      setTimeout(() => setShowEffect(false), 3000);
    }
  }, [isComplete]);

  if (!showEffect) return null;

  return (
    <div style={{
      position: 'fixed',
      left: position.x,
      top: position.y - 50,
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      {/* Happy face popping out */}
      <div style={{
        fontSize: '40px',
        animation: 'popOut 3s ease-out',
        textAlign: 'center'
      }}>
        😊
      </div>
      
      {/* Distillation effects */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '24px',
        animation: 'sparkle 3s ease-out'
      }}>
        ✨💧✨💫✨
      </div>
    </div>
  );
}
