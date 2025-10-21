import { useEffect, useState } from 'react';

interface LiquidPourAnimationProps {
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
  color: string;
  onComplete: () => void;
}

export default function LiquidPourAnimation({ fromPos, toPos, color, onComplete }: LiquidPourAnimationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval);
          setTimeout(onComplete, 100);
          return 1;
        }
        return prev + 0.05; // 20 frames = ~0.4 seconds
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Calculate arc path (parabola)
  const midX = (fromPos.x + toPos.x) / 2;
  const midY = Math.min(fromPos.y, toPos.y) - 40; // Arc height
  
  // Current position along arc
  const t = progress;
  const currentX = (1 - t) * (1 - t) * fromPos.x + 2 * (1 - t) * t * midX + t * t * toPos.x;
  const currentY = (1 - t) * (1 - t) * fromPos.y + 2 * (1 - t) * t * midY + t * t * toPos.y;

  const colorMap: { [key: string]: string } = {
    red: '#FF3B3B', blue: '#3B82F6', green: '#10B981', yellow: '#FBBF24',
    purple: '#A855F7', orange: '#F97316', cyan: '#06B6D4', pink: '#EC4899',
    lime: '#84CC16', magenta: '#D946EF', teal: '#14B8A6', coral: '#FB7185'
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
      {/* Liquid stream with trail effect */}
      {[...Array(5)].map((_, i) => {
        const trailProgress = Math.max(0, progress - i * 0.15);
        if (trailProgress <= 0) return null;
        
        const trailT = trailProgress;
        const trailX = (1 - trailT) * (1 - trailT) * fromPos.x + 2 * (1 - trailT) * trailT * midX + trailT * trailT * toPos.x;
        const trailY = (1 - trailT) * (1 - trailT) * fromPos.y + 2 * (1 - trailT) * trailT * midY + trailT * trailT * toPos.y;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: trailX,
              top: trailY,
              width: '8px',
              height: '15px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colorMap[color] || color}, ${colorMap[color] || color}AA)`,
              opacity: 0.8 - i * 0.15,
              boxShadow: `0 0 10px ${colorMap[color] || color}`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        );
      })}

      {/* Splash effect at destination */}
      {progress > 0.8 && (
        <>
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const distance = (progress - 0.8) * 30;
            return (
              <div
                key={`splash-${i}`}
                style={{
                  position: 'absolute',
                  left: toPos.x + Math.cos(angle) * distance,
                  top: toPos.y + Math.sin(angle) * distance,
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: colorMap[color] || color,
                  opacity: 1 - (progress - 0.8) * 5,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
