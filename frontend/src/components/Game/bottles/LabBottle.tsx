import { memo } from 'react';
import FlaskFace from '../FlaskFace';

interface LabBottleProps {
  colors: string[];
  position: { x: number; y: number };
  onSelect: () => void;
  isSelected: boolean;
  isEmpty: boolean;
  isFull: boolean;
  isPouring?: boolean;
}

const LabBottle = memo(function LabBottle({
  colors,
  position,
  onSelect,
  isSelected,
  isEmpty,
  isFull,
  isPouring = false
}: LabBottleProps) {
  const BOTTLE_HEIGHT = 160;
  const BOTTLE_WIDTH = 60;
  const LAYER_HEIGHT = 28;
  const BOTTLE_BOTTOM = 145;

  const strokeColor = isSelected ? '#FFD700' : isFull ? '#00FF00' : '#00CED1';
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
          <linearGradient id={`lab-shine-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopOpacity={0.4} stopColor="white" />
            <stop offset="50%" stopOpacity={0.7} stopColor="white" />
            <stop offset="100%" stopOpacity={0.3} stopColor="white" />
          </linearGradient>

          <clipPath id={`lab-clip-${position.x}-${position.y}`}>
            <path d={`
              M ${BOTTLE_WIDTH * 0.25} 15
              L ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.35}
              L ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.4}
              L ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.88}
              Q ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.92} ${BOTTLE_WIDTH * 0.2} ${BOTTLE_HEIGHT * 0.92}
              L ${BOTTLE_WIDTH * 0.8} ${BOTTLE_HEIGHT * 0.92}
              Q ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.92} ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.88}
              L ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.4}
              L ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.35}
              L ${BOTTLE_WIDTH * 0.75} 15
              Q ${BOTTLE_WIDTH * 0.75} 10 ${BOTTLE_WIDTH * 0.5} 10
              Q ${BOTTLE_WIDTH * 0.25} 10 ${BOTTLE_WIDTH * 0.25} 15 Z
            `} />
          </clipPath>
        </defs>

        <g clipPath={`url(#lab-clip-${position.x}-${position.y})`}>
          {colors.map((color, idx) => {
            const yStart = BOTTLE_BOTTOM - ((idx + 1) * LAYER_HEIGHT);
            return (
              <g key={idx}>
                <rect
                  x={BOTTLE_WIDTH * 0.15}
                  y={yStart}
                  width={BOTTLE_WIDTH * 0.7}
                  height={LAYER_HEIGHT}
                  fill={color}
                />
                {idx < colors.length - 1 && (
                  <rect
                    x={BOTTLE_WIDTH * 0.15}
                    y={yStart - 2}
                    width={BOTTLE_WIDTH * 0.7}
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
            M ${BOTTLE_WIDTH * 0.25} 15
            L ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.35}
            L ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.4}
            L ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.88}
            Q ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.92} ${BOTTLE_WIDTH * 0.2} ${BOTTLE_HEIGHT * 0.92}
            L ${BOTTLE_WIDTH * 0.8} ${BOTTLE_HEIGHT * 0.92}
            Q ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.92} ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.88}
            L ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.4}
            L ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.35}
            L ${BOTTLE_WIDTH * 0.75} 15
            Q ${BOTTLE_WIDTH * 0.75} 10 ${BOTTLE_WIDTH * 0.5} 10
            Q ${BOTTLE_WIDTH * 0.25} 10 ${BOTTLE_WIDTH * 0.25} 15 Z
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
          fill={`url(#lab-shine-${position.x}-${position.y})`}
        />

        <line x1={BOTTLE_WIDTH * 0.17} y1={BOTTLE_HEIGHT * 0.6} x2={BOTTLE_WIDTH * 0.22} y2={BOTTLE_HEIGHT * 0.6} stroke={strokeColor} strokeWidth="1" opacity="0.5" />
        <line x1={BOTTLE_WIDTH * 0.17} y1={BOTTLE_HEIGHT * 0.7} x2={BOTTLE_WIDTH * 0.22} y2={BOTTLE_HEIGHT * 0.7} stroke={strokeColor} strokeWidth="1" opacity="0.5" />
        <line x1={BOTTLE_WIDTH * 0.17} y1={BOTTLE_HEIGHT * 0.8} x2={BOTTLE_WIDTH * 0.22} y2={BOTTLE_HEIGHT * 0.8} stroke={strokeColor} strokeWidth="1" opacity="0.5" />

        <ellipse
          cx={BOTTLE_WIDTH * 0.5}
          cy={10}
          rx={BOTTLE_WIDTH * 0.13}
          ry={5}
          fill="#4169E1"
        />
      </svg>
    </div>
  );
});

export default LabBottle;
