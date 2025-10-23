import { useEffect, useState } from 'react';

interface AnimatedLiquidProps {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
}

export default function AnimatedLiquid({ color, x, y, width, height, index }: AnimatedLiquidProps) {
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    // Generate random bubbles
    const newBubbles = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      x: x + Math.random() * width * 0.6 + width * 0.2,
      y: y + height * 0.3 + Math.random() * height * 0.4,
      size: 2 + Math.random() * 3
    }));
    setBubbles(newBubbles);

    // Regenerate bubbles every 2 seconds
    const interval = setInterval(() => {
      const moreBubbles = Array.from({ length: 3 }, (_, i) => ({
        id: Date.now() + i,
        x: x + Math.random() * width * 0.6 + width * 0.2,
        y: y + height * 0.3 + Math.random() * height * 0.4,
        size: 2 + Math.random() * 3
      }));
      setBubbles(moreBubbles);
    }, 2000);

    return () => clearInterval(interval);
  }, [x, y, width, height]);

  return (
    <>
      {/* Liquid layer with gentle wobble */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        opacity={0.9}
        style={{
          animation: `wobble-${index} 3s ease-in-out infinite`,
        }}
      />

      {/* Bubbles rising */}
      {bubbles.map((bubble) => (
        <circle
          key={bubble.id}
          cx={bubble.x}
          cy={bubble.y}
          r={bubble.size}
          fill="rgba(255,255,255,0.6)"
          style={{
            animation: `rise 2s ease-in infinite`,
          }}
        />
      ))}

      <style>{`
        @keyframes wobble-${index} {
          0%, 100% { transform: translateY(0px); }
          25% { transform: translateY(-1px); }
          50% { transform: translateY(0px); }
          75% { transform: translateY(1px); }
        }
        
        @keyframes rise {
          0% { opacity: 0.6; transform: translateY(0px); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
      `}</style>
    </>
  );
}
