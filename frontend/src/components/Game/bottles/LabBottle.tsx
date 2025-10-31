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
  const BOTTLE_BOTTOM = 148;

  const strokeColor = isSelected ? '#FFD700' : isFull ? '#00FF00' : '#00D4FF';
  const strokeWidth = isSelected ? 4 : 2.5;

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
          {/* Glass gradient for realistic look */}
          <linearGradient id={`lab-glass-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E0F7FA" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#B2EBF2" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#80DEEA" stopOpacity="0.3" />
          </linearGradient>

          {/* Shine effect */}
          <linearGradient id={`lab-shine-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="50%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
          </linearGradient>

          {/* Clip path for smooth Erlenmeyer flask shape */}
          <clipPath id={`lab-clip-${position.x}-${position.y}`}>
            <path d={`
              M ${BOTTLE_WIDTH * 0.35} 12
              L ${BOTTLE_WIDTH * 0.35} ${BOTTLE_HEIGHT * 0.28}
              L ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.42}
              L ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.87}
              Q ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.92} ${BOTTLE_WIDTH * 0.23} ${BOTTLE_HEIGHT * 0.92}
              L ${BOTTLE_WIDTH * 0.77} ${BOTTLE_HEIGHT * 0.92}
              Q ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.92} ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.87}
              L ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.42}
              L ${BOTTLE_WIDTH * 0.65} ${BOTTLE_HEIGHT * 0.28}
              L ${BOTTLE_WIDTH * 0.65} 12
              Q ${BOTTLE_WIDTH * 0.65} 8 ${BOTTLE_WIDTH * 0.5} 8
              Q ${BOTTLE_WIDTH * 0.35} 8 ${BOTTLE_WIDTH * 0.35} 12 Z
            `} />
          </clipPath>

          {/* Shadow filter */}
          <filter id={`lab-shadow-${position.x}-${position.y}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="1" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main flask body with glass effect */}
        <g filter={`url(#lab-shadow-${position.x}-${position.y})`}>
          {/* Background glass layer */}
          <path
            d={`
              M ${BOTTLE_WIDTH * 0.35} 12
              L ${BOTTLE_WIDTH * 0.35} ${BOTTLE_HEIGHT * 0.28}
              L ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.42}
              L ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.87}
              Q ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.92} ${BOTTLE_WIDTH * 0.23} ${BOTTLE_HEIGHT * 0.92}
              L ${BOTTLE_WIDTH * 0.77} ${BOTTLE_HEIGHT * 0.92}
              Q ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.92} ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.87}
              L ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.42}
              L ${BOTTLE_WIDTH * 0.65} ${BOTTLE_HEIGHT * 0.28}
              L ${BOTTLE_WIDTH * 0.65} 12
              Q ${BOTTLE_WIDTH * 0.65} 8 ${BOTTLE_WIDTH * 0.5} 8
              Q ${BOTTLE_WIDTH * 0.35} 8 ${BOTTLE_WIDTH * 0.35} 12 Z
            `}
            fill={`url(#lab-glass-${position.x}-${position.y})`}
          />

          {/* Liquid layers */}
          <g clipPath={`url(#lab-clip-${position.x}-${position.y})`}>
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
                  />
                  {idx < colors.length - 1 && (
                    <rect
                      x={BOTTLE_WIDTH * 0.18}
                      y={yStart - 1}
                      width={BOTTLE_WIDTH * 0.64}
                      height={2}
                      fill="#000000"
                      opacity={0.15}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Flask outline with thicker stroke */}
          <path
            d={`
              M ${BOTTLE_WIDTH * 0.35} 12
              L ${BOTTLE_WIDTH * 0.35} ${BOTTLE_HEIGHT * 0.28}
              L ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.42}
              L ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.87}
              Q ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.92} ${BOTTLE_WIDTH * 0.23} ${BOTTLE_HEIGHT * 0.92}
              L ${BOTTLE_WIDTH * 0.77} ${BOTTLE_HEIGHT * 0.92}
              Q ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.92} ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.87}
              L ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.42}
              L ${BOTTLE_WIDTH * 0.65} ${BOTTLE_HEIGHT * 0.28}
              L ${BOTTLE_WIDTH * 0.65} 12
              Q ${BOTTLE_WIDTH * 0.65} 8 ${BOTTLE_WIDTH * 0.5} 8
              Q ${BOTTLE_WIDTH * 0.35} 8 ${BOTTLE_WIDTH * 0.35} 12 Z
            `}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />

          {/* Shine highlight */}
          <ellipse
            cx={BOTTLE_WIDTH * 0.28}
            cy={BOTTLE_HEIGHT * 0.5}
            rx={BOTTLE_WIDTH * 0.08}
            ry={BOTTLE_HEIGHT * 0.18}
            fill={`url(#lab-shine-${position.x}-${position.y})`}
          />

          {/* Measurement lines - professional style */}
          <g opacity="0.6">
            <line 
              x1={BOTTLE_WIDTH * 0.2} y1={BOTTLE_HEIGHT * 0.55} 
              x2={BOTTLE_WIDTH * 0.26} y2={BOTTLE_HEIGHT * 0.55} 
              stroke={strokeColor} strokeWidth="1.5" 
            />
            <line 
              x1={BOTTLE_WIDTH * 0.2} y1={BOTTLE_HEIGHT * 0.65} 
              x2={BOTTLE_WIDTH * 0.26} y2={BOTTLE_HEIGHT * 0.65} 
              stroke={strokeColor} strokeWidth="1.5" 
            />
            <line 
              x1={BOTTLE_WIDTH * 0.2} y1={BOTTLE_HEIGHT * 0.75} 
              x2={BOTTLE_WIDTH * 0.26} y2={BOTTLE_HEIGHT * 0.75} 
              stroke={strokeColor} strokeWidth="1.5" 
            />
            <line 
              x1={BOTTLE_WIDTH * 0.2} y1={BOTTLE_HEIGHT * 0.85} 
              x2={BOTTLE_WIDTH * 0.26} y2={BOTTLE_HEIGHT * 0.85} 
              stroke={strokeColor} strokeWidth="1.5" 
            />
          </g>

          {/* Decorative neck ring */}
          <ellipse
            cx={BOTTLE_WIDTH * 0.5}
            cy={BOTTLE_HEIGHT * 0.28}
            rx={BOTTLE_WIDTH * 0.24}
            ry={2}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Glass stopper - more realistic */}
          <g>
            {/* Stopper base */}
            <ellipse
              cx={BOTTLE_WIDTH * 0.5}
              cy={8}
              rx={BOTTLE_WIDTH * 0.16}
              ry={4}
              fill="#4A90E2"
              stroke="#2E5C8A"
              strokeWidth="1"
            />
            {/* Stopper top knob */}
            <ellipse
              cx={BOTTLE_WIDTH * 0.5}
              cy={5}
              rx={BOTTLE_WIDTH * 0.08}
              ry={3}
              fill="#5BA3F5"
              stroke="#2E5C8A"
              strokeWidth="0.5"
            />
            {/* Stopper highlight */}
            <ellipse
              cx={BOTTLE_WIDTH * 0.48}
              cy={6}
              rx={BOTTLE_WIDTH * 0.04}
              ry={1.5}
              fill="white"
              opacity="0.6"
            />
          </g>
        </g>
      </svg>
    </div>
  );
});

export default LabBottle;
