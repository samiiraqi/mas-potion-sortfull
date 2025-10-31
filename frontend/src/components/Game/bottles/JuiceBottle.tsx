import { memo } from 'react';
import FlaskFace from '../FlaskFace';

interface JuiceBottleProps {
  colors: string[];
  position: { x: number; y: number };
  onSelect: () => void;
  isSelected: boolean;
  isEmpty: boolean;
  isFull: boolean;
  isPouring?: boolean;
}

const JuiceBottle = memo(function JuiceBottle({
  colors,
  position,
  onSelect,
  isSelected,
  isEmpty,
  isFull,
  isPouring = false
}: JuiceBottleProps) {
  const BOTTLE_HEIGHT = 160;
  const BOTTLE_WIDTH = 55;
  const LAYER_HEIGHT = 28;
  const BOTTLE_BOTTOM = 140;

  const strokeColor = isSelected ? '#FFD700' : isFull ? '#00FF00' : '#FF6347';
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
        x={5}
        y={0}
        isSelected={isSelected}
        isEmpty={isEmpty}
        isFull={isFull}
        isPouring={isPouring}
      />

      <svg width={BOTTLE_WIDTH} height={BOTTLE_HEIGHT} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`juice-shine-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopOpacity={0.4} stopColor="white" />
            <stop offset="50%" stopOpacity={0.7} stopColor="white" />
            <stop offset="100%" stopOpacity={0.3} stopColor="white" />
          </linearGradient>

          <clipPath id={`juice-clip-${position.x}-${position.y}`}>
            <rect
              x={BOTTLE_WIDTH * 0.15}
              y={25}
              width={BOTTLE_WIDTH * 0.7}
              height={BOTTLE_HEIGHT * 0.75}
              rx={3}
            />
          </clipPath>
        </defs>

        <g clipPath={`url(#juice-clip-${position.x}-${position.y})`}>
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

        <rect
          x={BOTTLE_WIDTH * 0.15}
          y={25}
          width={BOTTLE_WIDTH * 0.7}
          height={BOTTLE_HEIGHT * 0.75}
          rx={3}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        <line
          x1={BOTTLE_WIDTH * 0.15}
          y1={35}
          x2={BOTTLE_WIDTH * 0.85}
          y2={35}
          stroke={strokeColor}
          strokeWidth={1.5}
          opacity={0.6}
        />
        <line
          x1={BOTTLE_WIDTH * 0.5}
          y1={25}
          x2={BOTTLE_WIDTH * 0.5}
          y2={45}
          stroke={strokeColor}
          strokeWidth={1.5}
          opacity={0.6}
        />

        <rect
          x={BOTTLE_WIDTH * 0.7}
          y={5}
          width={3}
          height={30}
          fill="#FF1493"
          stroke="#C71585"
          strokeWidth={1}
          rx={1.5}
        />

        <rect
          x={BOTTLE_WIDTH * 0.685}
          y={15}
          width={6}
          height={8}
          fill="#FF1493"
          stroke="#C71585"
          strokeWidth={1}
          rx={1}
        />

        <rect
          x={BOTTLE_WIDTH * 0.22}
          y={BOTTLE_HEIGHT * 0.35}
          width={BOTTLE_WIDTH * 0.15}
          height={BOTTLE_HEIGHT * 0.25}
          fill={`url(#juice-shine-${position.x}-${position.y})`}
          rx={2}
        />

        <line
          x1={BOTTLE_WIDTH * 0.15}
          y1={BOTTLE_HEIGHT * 0.95}
          x2={BOTTLE_WIDTH * 0.85}
          y2={BOTTLE_HEIGHT * 0.95}
          stroke={strokeColor}
          strokeWidth={1}
          opacity={0.5}
        />
      </svg>
    </div>
  );
});

export default JuiceBottle;
