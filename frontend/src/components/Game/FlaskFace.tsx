import { useEffect, useState } from 'react';

interface FlaskFaceProps {
  x: number;
  y: number;
  isSelected: boolean;
  isEmpty: boolean;
  isFull: boolean;
  isPouring: boolean;
}

export default function FlaskFace({ x, y, isSelected, isEmpty, isFull, isPouring }: FlaskFaceProps) {
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (isFull) {
      // Create beautiful bubbles when bottle is full!
      const newBubbles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: 15 + Math.random() * 30,
        delay: Math.random() * 0.5
      }));
      setBubbles(newBubbles);

      // Clear bubbles after animation
      const timer = setTimeout(() => setBubbles([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [isFull]);

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y,
      pointerEvents: 'none',
      zIndex: 1000
    }}>
      {/* Cute face on bottle */}
      {!isEmpty && (
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '15px',
          fontSize: '1.5rem',
          animation: isSelected ? 'bounce 0.5s ease' : 'none'
        }}>
          {isSelected ? '😊' : isFull ? '🌟' : '😌'}
        </div>
      )}

      {/* Beautiful bubbles when full */}
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          style={{
            position: 'absolute',
            bottom: '60px',
            left: `${bubble.x}px`,
            width: '8px',
            height: '8px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(100,200,255,0.4))',
            borderRadius: '50%',
            animation: `bubbleRise 2s ease-out ${bubble.delay}s`,
            boxShadow: '0 0 10px rgba(255,255,255,0.6)',
            pointerEvents: 'none'
          }}
        />
      ))}

      <style>{`
        @keyframes bubbleRise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-150px) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
