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
  const BOTTLE_WIDTH = 70;  // WIDER for test tube look
  const LAYER_HEIGHT = 28;
  const BOTTLE_BOTTOM = 145;

  const strokeColor = isSelected ? '#FFD700' : isFull ? '#00FF00' : '#00E5FF';
  const strokeWidth = isSelected ? 4 : 3;

  return (
    <div
      onClick={onSelect}
      style={{
        position: 'absolute',
        left: position.x - 5,  // Center it
        top: position.y,
        cursor: 'pointer',
        userSelect: 'none',
        willChange: 'transform'
      }}
    >
      <FlaskFace
        x={5}
        y={10}
        isSelected={isSelected}
        isEmpty={isEmpty}
        isFull={isFull}
        isPouring={isPouring}
      />

      <svg width={BOTTLE_WIDTH} height={BOTTLE_HEIGHT} style={{ overflow: 'visible' }}>
        <defs>
          {/* Glass shine gradient */}
          <linearGradient id={`lab-shine-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="50%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0.3" />
          </linearGradient>

          {/* Cylinder clip path - STRAIGHT TEST TUBE */}
          <clipPath id={`lab-clip-${position.x}-${position.y}`}>
            <rect
              x={BOTTLE_WIDTH * 0.2}
              y={25}
              width={BOTTLE_WIDTH * 0.6}
              height={BOTTLE_HEIGHT * 0.75}
              rx={BOTTLE_WIDTH * 0.05}
            />
          </clipPath>

          {/* Glow effect */}
          <filter id={`lab-glow-${position.x}-${position.y}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* STRAIGHT CYLINDRICAL TEST TUBE BODY */}
        
        {/* Background glass effect */}
        <rect
          x={BOTTLE_WIDTH * 0.2}
          y={25}
          width={BOTTLE_WIDTH * 0.6}
          height={BOTTLE_HEIGHT * 0.75}
          rx={BOTTLE_WIDTH * 0.05}
          fill="rgba(200, 240, 255, 0.2)"
          stroke="none"
        />

        {/* Liquid layers */}
        <g clipPath={`url(#lab-clip-${position.x}-${position.y})`}>
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
                  <line
                    x1={BOTTLE_WIDTH * 0.2}
                    y1={yStart}
                    x2={BOTTLE_WIDTH * 0.8}
                    y2={yStart}
                    stroke="#000000"
                    strokeWidth="1"
                    opacity="0.15"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Main cylinder outline - THICK AND OBVIOUS */}
        <rect
          x={BOTTLE_WIDTH * 0.2}
          y={25}
          width={BOTTLE_WIDTH * 0.6}
          height={BOTTLE_HEIGHT * 0.75}
          rx={BOTTLE_WIDTH * 0.05}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          filter={`url(#lab-glow-${position.x}-${position.y})`}
        />

        {/* Glass shine highlight - VERY VISIBLE */}
        <rect
          x={BOTTLE_WIDTH * 0.25}
          y={50}
          width={BOTTLE_WIDTH * 0.12}
          height={BOTTLE_HEIGHT * 0.4}
          rx={BOTTLE_WIDTH * 0.06}
          fill={`url(#lab-shine-${position.x}-${position.y})`}
        />

        {/* MEASUREMENT LINES - VERY OBVIOUS */}
        <g stroke={strokeColor} strokeWidth="2" opacity="0.7">
          {/* Big measurement lines on RIGHT side */}
          <line x1={BOTTLE_WIDTH * 0.8} y1={BOTTLE_HEIGHT * 0.45} x2={BOTTLE_WIDTH * 0.88} y2={BOTTLE_HEIGHT * 0.45} />
          <text x={BOTTLE_WIDTH * 0.9} y={BOTTLE_HEIGHT * 0.47} fill={strokeColor} fontSize="8" opacity="0.6">100</text>
          
          <line x1={BOTTLE_WIDTH * 0.8} y1={BOTTLE_HEIGHT * 0.58} x2={BOTTLE_WIDTH * 0.86} y2={BOTTLE_HEIGHT * 0.58} />
          <text x={BOTTLE_WIDTH * 0.9} y={BOTTLE_HEIGHT * 0.6} fill={strokeColor} fontSize="7" opacity="0.6">75</text>
          
          <line x1={BOTTLE_WIDTH * 0.8} y1={BOTTLE_HEIGHT * 0.71} x2={BOTTLE_WIDTH * 0.88} y2={BOTTLE_HEIGHT * 0.71} />
          <text x={BOTTLE_WIDTH * 0.9} y={BOTTLE_HEIGHT * 0.73} fill={strokeColor} fontSize="7" opacity="0.6">50</text>
          
          <line x1={BOTTLE_WIDTH * 0.8} y1={BOTTLE_HEIGHT * 0.84} x2={BOTTLE_WIDTH * 0.86} y2={BOTTLE_HEIGHT * 0.84} />
          <text x={BOTTLE_WIDTH * 0.9} y={BOTTLE_HEIGHT * 0.86} fill={strokeColor} fontSize="7" opacity="0.6">25</text>
        </g>

        {/* TOP RIM - like test tube opening */}
        <ellipse
          cx={BOTTLE_WIDTH * 0.5}
          cy={25}
          rx={BOTTLE_WIDTH * 0.31}
          ry={4}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />

        {/* RUBBER STOPPER - BRIGHT RED */}
        <g>
          {/* Stopper body */}
          <ellipse
            cx={BOTTLE_WIDTH * 0.5}
            cy={18}
            rx={BOTTLE_WIDTH * 0.25}
            ry={8}
            fill="#FF1744"
            stroke="#C62828"
            strokeWidth="2"
          />
          
          {/* Stopper top knob */}
          <ellipse
            cx={BOTTLE_WIDTH * 0.5}
            cy={12}
            rx={BOTTLE_WIDTH * 0.12}
            ry={5}
            fill="#FF5252"
            stroke="#C62828"
            strokeWidth="1.5"
          />
          
          {/* Shine on stopper */}
          <ellipse
            cx={BOTTLE_WIDTH * 0.48}
            cy={15}
            rx={BOTTLE_WIDTH * 0.08}
            ry={3}
            fill="white"
            opacity="0.5"
          />
        </g>

        {/* BOTTOM BASE - rounded */}
        <ellipse
          cx={BOTTLE_WIDTH * 0.5}
          cy={BOTTLE_HEIGHT * 0.93}
          rx={BOTTLE_WIDTH * 0.31}
          ry={3}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2}
          opacity="0.6"
        />
      </svg>
    </div>
  );
});

export default LabBottle;
