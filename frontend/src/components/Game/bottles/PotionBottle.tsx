import { memo } from 'react';
import FlaskFace from '../FlaskFace';

interface PotionBottleProps {
  colors: string[];
  position: { x: number; y: number };
  onSelect: () => void;
  isSelected: boolean;
  isEmpty: boolean;
  isFull: boolean;
  isPouring?: boolean;
}

const PotionBottle = memo(function PotionBottle({
  colors,
  position,
  onSelect,
  isSelected,
  isEmpty,
  isFull,
  isPouring = false
}: PotionBottleProps) {
  const BOTTLE_HEIGHT = 160;
  const BOTTLE_WIDTH = 60;
  const LAYER_HEIGHT = 28;
  const BOTTLE_BOTTOM = 145;

  const strokeColor = isSelected ? '#FFD700' : isFull ? '#00FF00' : '#9370DB';
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

      <svg width={BOTTLE_WIDTH} height={BOTTLE_HEIGHT} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`potion-shine-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopOpacity={0.3} stopColor="#FFD700" />
            <stop offset="50%" stopOpacity={0.6} stopColor="#FF69B4" />
            <stop offset="100%" stopOpacity={0.3} stopColor="#9370DB" />
          </linearGradient>

          <clipPath id={`potion-clip-${position.x}-${position.y}`}>
            <path d={`
              M ${BOTTLE_WIDTH * 0.4} 15
              L ${BOTTLE_WIDTH * 0.4} 25
              Q ${BOTTLE_WIDTH * 0.38} 30 ${BOTTLE_WIDTH * 0.35} 35
              Q ${BOTTLE_WIDTH * 0.25} 45 ${BOTTLE_WIDTH * 0.2} 60
              Q ${BOTTLE_WIDTH * 0.15} 75 ${BOTTLE_WIDTH * 0.18} 90
              L ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.85}
              Q ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.9} ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.9}
              L ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.9}
              Q ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.9} ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.85}
              L ${BOTTLE_WIDTH * 0.82} 90
              Q ${BOTTLE_WIDTH * 0.85} 75 ${BOTTLE_WIDTH * 0.8} 60
              Q ${BOTTLE_WIDTH * 0.75} 45 ${BOTTLE_WIDTH * 0.65} 35
              Q ${BOTTLE_WIDTH * 0.62} 30 ${BOTTLE_WIDTH * 0.6} 25
              L ${BOTTLE_WIDTH * 0.6} 15
              Q ${BOTTLE_WIDTH * 0.6} 10 ${BOTTLE_WIDTH * 0.5} 10
              Q ${BOTTLE_WIDTH * 0.4} 10 ${BOTTLE_WIDTH * 0.4} 15 Z
            `} />
          </clipPath>

          <filter id={`potion-glow-${position.x}-${position.y}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g clipPath={`url(#potion-clip-${position.x}-${position.y})`}>
          {colors.map((color, idx) => {
            const yStart = BOTTLE_BOTTOM - ((idx + 1) * LAYER_HEIGHT);
            return (
              <g key={idx}>
                <rect
                  x={BOTTLE_WIDTH * 0.18}
                  y={yStart}
                  width={BOTTLE_WIDTH * 0.64}
                  height={LAYER_HEIGHT}
                  fill={color}
                  filter={`url(#potion-glow-${position.x}-${position.y})`}
                />
                {idx < colors.length - 1 && (
                  <rect
                    x={BOTTLE_WIDTH * 0.18}
                    y={yStart - 2}
                    width={BOTTLE_WIDTH * 0.64}
                    height={4}
                    fill="#000000"
                    opacity={0.15}
                  />
                )}
              </g>
            );
          })}
        </g>

        <path
          d={`
            M ${BOTTLE_WIDTH * 0.4} 15
            L ${BOTTLE_WIDTH * 0.4} 25
            Q ${BOTTLE_WIDTH * 0.38} 30 ${BOTTLE_WIDTH * 0.35} 35
            Q ${BOTTLE_WIDTH * 0.25} 45 ${BOTTLE_WIDTH * 0.2} 60
            Q ${BOTTLE_WIDTH * 0.15} 75 ${BOTTLE_WIDTH * 0.18} 90
            L ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.85}
            Q ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.9} ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.9}
            L ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.9}
            Q ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.9} ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.85}
            L ${BOTTLE_WIDTH * 0.82} 90
            Q ${BOTTLE_WIDTH * 0.85} 75 ${BOTTLE_WIDTH * 0.8} 60
            Q ${BOTTLE_WIDTH * 0.75} 45 ${BOTTLE_WIDTH * 0.65} 35
            Q ${BOTTLE_WIDTH * 0.62} 30 ${BOTTLE_WIDTH * 0.6} 25
            L ${BOTTLE_WIDTH * 0.6} 15
            Q ${BOTTLE_WIDTH * 0.6} 10 ${BOTTLE_WIDTH * 0.5} 10
            Q ${BOTTLE_WIDTH * 0.4} 10 ${BOTTLE_WIDTH * 0.4} 15 Z
          `}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        <ellipse
          cx={BOTTLE_WIDTH * 0.3}
          cy={BOTTLE_HEIGHT * 0.5}
          rx={BOTTLE_WIDTH * 0.12}
          ry={BOTTLE_HEIGHT * 0.2}
          fill={`url(#potion-shine-${position.x}-${position.y})`}
        />

        <ellipse
          cx={BOTTLE_WIDTH * 0.5}
          cy={10}
          rx={BOTTLE_WIDTH * 0.11}
          ry={5}
          fill="#8B4513"
          stroke="#654321"
          strokeWidth={1}
        />

        <path
          d={`M ${BOTTLE_WIDTH * 0.25} 70 Q ${BOTTLE_WIDTH * 0.35} 65 ${BOTTLE_WIDTH * 0.3} 75`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1}
          opacity={0.4}
        />
        <path
          d={`M ${BOTTLE_WIDTH * 0.7} 80 Q ${BOTTLE_WIDTH * 0.6} 75 ${BOTTLE_WIDTH * 0.65} 85`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1}
          opacity={0.4}
        />
      </svg>
    </div>
  );
});

export default PotionBottle;
