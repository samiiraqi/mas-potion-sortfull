import { memo } from 'react';
import FlaskFace from '../FlaskFace';

interface CoffeeBottleProps {
  colors: string[];
  position: { x: number; y: number };
  onSelect: () => void;
  isSelected: boolean;
  isEmpty: boolean;
  isFull: boolean;
  isPouring?: boolean;
}

const CoffeeBottle = memo(function CoffeeBottle({
  colors,
  position,
  onSelect,
  isSelected,
  isEmpty,
  isFull,
  isPouring = false
}: CoffeeBottleProps) {
  const BOTTLE_HEIGHT = 160;
  const BOTTLE_WIDTH = 60;
  const LAYER_HEIGHT = 28;
  const BOTTLE_BOTTOM = 140;

  const strokeColor = isSelected ? '#FFD700' : isFull ? '#00FF00' : '#8B4513';
  const strokeWidth = isSelected ? 4 : 3;

  return (
    <div
      onClick={onSelect}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: 'pointer',
        userSelect: 'none',
        willChange: 'transform'
      }}
    >
      <FlaskFace
        x={0}
        y={0}
        isSelected={isSelected}
        isEmpty={isEmpty}
        isFull={isFull}
        isPouring={isPouring}
      />

      <svg width={BOTTLE_WIDTH + 15} height={BOTTLE_HEIGHT} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`coffee-shine-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopOpacity={0.3} stopColor="white" />
            <stop offset="50%" stopOpacity={0.6} stopColor="white" />
            <stop offset="100%" stopOpacity={0.2} stopColor="white" />
          </linearGradient>

          <clipPath id={`coffee-clip-${position.x}-${position.y}`}>
            <path d={`
              M ${BOTTLE_WIDTH * 0.2} 30
              L ${BOTTLE_WIDTH * 0.2} ${BOTTLE_HEIGHT * 0.85}
              Q ${BOTTLE_WIDTH * 0.2} ${BOTTLE_HEIGHT * 0.9} ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.9}
              L ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.9}
              Q ${BOTTLE_WIDTH * 0.8} ${BOTTLE_HEIGHT * 0.9} ${BOTTLE_WIDTH * 0.8} ${BOTTLE_HEIGHT * 0.85}
              L ${BOTTLE_WIDTH * 0.8} 30
              Q ${BOTTLE_WIDTH * 0.8} 25 ${BOTTLE_WIDTH * 0.5} 25
              Q ${BOTTLE_WIDTH * 0.2} 25 ${BOTTLE_WIDTH * 0.2} 30 Z
            `} />
          </clipPath>
        </defs>

        <g clipPath={`url(#coffee-clip-${position.x}-${position.y})`}>
          {colors.map((color, idx) => {
            const yStart = BOTTLE_BOTTOM - ((idx + 1) * LAYER_HEIGHT);
            return (
              <g key={idx}>
                <rect
                  x={BOTTLE_WIDTH * 0.2}
                  y={yStart}
                  width={BOTTLE_WIDTH * 0.6}
                  height={LAYER_HEIGHT}
                  fill={color}
                />
                {idx < colors.length - 1 && (
                  <rect
                    x={BOTTLE_WIDTH * 0.2}
                    y={yStart - 2}
                    width={BOTTLE_WIDTH * 0.6}
                    height={4}
                    fill="#000000"
                    opacity={0.2}
                  />
                )}
              </g>
            );
          })}
        </g>

        <path
          d={`
            M ${BOTTLE_WIDTH * 0.2} 30
            L ${BOTTLE_WIDTH * 0.2} ${BOTTLE_HEIGHT * 0.85}
            Q ${BOTTLE_WIDTH * 0.2} ${BOTTLE_HEIGHT * 0.9} ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.9}
            L ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.9}
            Q ${BOTTLE_WIDTH * 0.8} ${BOTTLE_HEIGHT * 0.9} ${BOTTLE_WIDTH * 0.8} ${BOTTLE_HEIGHT * 0.85}
            L ${BOTTLE_WIDTH * 0.8} 30
            Q ${BOTTLE_WIDTH * 0.8} 25 ${BOTTLE_WIDTH * 0.5} 25
            Q ${BOTTLE_WIDTH * 0.2} 25 ${BOTTLE_WIDTH * 0.2} 30 Z
          `}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        <path
          d={`
            M ${BOTTLE_WIDTH * 0.8} 50
            Q ${BOTTLE_WIDTH * 1.1} 50 ${BOTTLE_WIDTH * 1.15} 70
            Q ${BOTTLE_WIDTH * 1.15} 90 ${BOTTLE_WIDTH * 0.95} 100
            Q ${BOTTLE_WIDTH * 0.85} 105 ${BOTTLE_WIDTH * 0.8} 100
          `}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        <path
          d={`
            M ${BOTTLE_WIDTH * 0.8} 55
            Q ${BOTTLE_WIDTH * 1.0} 55 ${BOTTLE_WIDTH * 1.05} 70
            Q ${BOTTLE_WIDTH * 1.05} 85 ${BOTTLE_WIDTH * 0.9} 95
          `}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          opacity={0.6}
        />

        <ellipse
          cx={BOTTLE_WIDTH * 0.35}
          cy={BOTTLE_HEIGHT * 0.45}
          rx={BOTTLE_WIDTH * 0.1}
          ry={BOTTLE_HEIGHT * 0.15}
          fill={`url(#coffee-shine-${position.x}-${position.y})`}
        />

        <ellipse
          cx={BOTTLE_WIDTH * 0.5}
          cy={27}
          rx={BOTTLE_WIDTH * 0.28}
          ry={3}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1}
          opacity={0.4}
        />
      </svg>
    </div>
  );
});

export default CoffeeBottle;
