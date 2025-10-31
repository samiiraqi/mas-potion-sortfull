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
  const BOTTLE_BOTTOM = 150;

  const strokeColor = isSelected ? '#FFD700' : isFull ? '#00FF00' : '#00BCD4';
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
          {/* Beautiful glass gradient */}
          <linearGradient id={`lab-glass-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="30%" stopColor="rgba(200,240,255,0.3)" />
            <stop offset="70%" stopColor="rgba(150,220,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
          </linearGradient>

          {/* Shine gradient */}
          <linearGradient id={`lab-shine-${position.x}-${position.y}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="50%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
          </linearGradient>

          {/* Clip path - elegant Erlenmeyer flask */}
          <clipPath id={`lab-clip-${position.x}-${position.y}`}>
            <path d={`
              M ${BOTTLE_WIDTH * 0.38} 10
              L ${BOTTLE_WIDTH * 0.38} ${BOTTLE_HEIGHT * 0.25}
              Q ${BOTTLE_WIDTH * 0.36} ${BOTTLE_HEIGHT * 0.3} ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.4}
              Q ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.5} ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.65}
              L ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.88}
              Q ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.93} ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.93}
              L ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.93}
              Q ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.93} ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.88}
              L ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.65}
              Q ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.5} ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.4}
              Q ${BOTTLE_WIDTH * 0.64} ${BOTTLE_HEIGHT * 0.3} ${BOTTLE_WIDTH * 0.62} ${BOTTLE_HEIGHT * 0.25}
              L ${BOTTLE_WIDTH * 0.62} 10
              Q ${BOTTLE_WIDTH * 0.62} 6 ${BOTTLE_WIDTH * 0.5} 6
              Q ${BOTTLE_WIDTH * 0.38} 6 ${BOTTLE_WIDTH * 0.38} 10 Z
            `} />
          </clipPath>

          {/* Shadow/depth filter */}
          <filter id={`lab-shadow-${position.x}-${position.y}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
            <feOffset dx="1" dy="1.5" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.25"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g filter={`url(#lab-shadow-${position.x}-${position.y})`}>
          {/* Glass background layer */}
          <path
            d={`
              M ${BOTTLE_WIDTH * 0.38} 10
              L ${BOTTLE_WIDTH * 0.38} ${BOTTLE_HEIGHT * 0.25}
              Q ${BOTTLE_WIDTH * 0.36} ${BOTTLE_HEIGHT * 0.3} ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.4}
              Q ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.5} ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.65}
              L ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.88}
              Q ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.93} ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.93}
              L ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.93}
              Q ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.93} ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.88}
              L ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.65}
              Q ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.5} ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.4}
              Q ${BOTTLE_WIDTH * 0.64} ${BOTTLE_HEIGHT * 0.3} ${BOTTLE_WIDTH * 0.62} ${BOTTLE_HEIGHT * 0.25}
              L ${BOTTLE_WIDTH * 0.62} 10
              Q ${BOTTLE_WIDTH * 0.62} 6 ${BOTTLE_WIDTH * 0.5} 6
              Q ${BOTTLE_WIDTH * 0.38} 6 ${BOTTLE_WIDTH * 0.38} 10 Z
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
                    x={BOTTLE_WIDTH * 0.12}
                    y={yStart}
                    width={BOTTLE_WIDTH * 0.76}
                    height={LAYER_HEIGHT}
                    fill={color}
                  />
                  {idx < colors.length - 1 && (
                    <rect
                      x={BOTTLE_WIDTH * 0.12}
                      y={yStart - 1}
                      width={BOTTLE_WIDTH * 0.76}
                      height={2}
                      fill="#000000"
                      opacity={0.12}
                    />
                  )}
                </g>
              );
            })}
          </g>

          {/* Main flask outline */}
          <path
            d={`
              M ${BOTTLE_WIDTH * 0.38} 10
              L ${BOTTLE_WIDTH * 0.38} ${BOTTLE_HEIGHT * 0.25}
              Q ${BOTTLE_WIDTH * 0.36} ${BOTTLE_HEIGHT * 0.3} ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.4}
              Q ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.5} ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.65}
              L ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.88}
              Q ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.93} ${BOTTLE_WIDTH * 0.18} ${BOTTLE_HEIGHT * 0.93}
              L ${BOTTLE_WIDTH * 0.82} ${BOTTLE_HEIGHT * 0.93}
              Q ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.93} ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.88}
              L ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.65}
              Q ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.5} ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.4}
              Q ${BOTTLE_WIDTH * 0.64} ${BOTTLE_HEIGHT * 0.3} ${BOTTLE_WIDTH * 0.62} ${BOTTLE_HEIGHT * 0.25}
              L ${BOTTLE_WIDTH * 0.62} 10
              Q ${BOTTLE_WIDTH * 0.62} 6 ${BOTTLE_WIDTH * 0.5} 6
              Q ${BOTTLE_WIDTH * 0.38} 6 ${BOTTLE_WIDTH * 0.38} 10 Z
            `}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Beautiful shine highlight - left side */}
          <ellipse
            cx={BOTTLE_WIDTH * 0.25}
            cy={BOTTLE_HEIGHT * 0.55}
            rx={BOTTLE_WIDTH * 0.08}
            ry={BOTTLE_HEIGHT * 0.22}
            fill={`url(#lab-shine-${position.x}-${position.y})`}
          />

          {/* Volume measurement lines - right side */}
          <g opacity="0.5" stroke={strokeColor} strokeWidth="1.2" strokeLinecap="round">
            <line x1={BOTTLE_WIDTH * 0.82} y1={BOTTLE_HEIGHT * 0.55} x2={BOTTLE_WIDTH * 0.76} y2={BOTTLE_HEIGHT * 0.55} />
            <line x1={BOTTLE_WIDTH * 0.82} y1={BOTTLE_HEIGHT * 0.65} x2={BOTTLE_WIDTH * 0.78} y2={BOTTLE_HEIGHT * 0.65} />
            <line x1={BOTTLE_WIDTH * 0.82} y1={BOTTLE_HEIGHT * 0.75} x2={BOTTLE_WIDTH * 0.76} y2={BOTTLE_HEIGHT * 0.75} />
            <line x1={BOTTLE_WIDTH * 0.82} y1={BOTTLE_HEIGHT * 0.85} x2={BOTTLE_WIDTH * 0.78} y2={BOTTLE_HEIGHT * 0.85} />
          </g>

          {/* Neck ring detail */}
          <path
            d={`M ${BOTTLE_WIDTH * 0.38} ${BOTTLE_HEIGHT * 0.25} Q ${BOTTLE_WIDTH * 0.5} ${BOTTLE_HEIGHT * 0.26} ${BOTTLE_WIDTH * 0.62} ${BOTTLE_HEIGHT * 0.25}`}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
            opacity="0.4"
          />

          {/* Beautiful glass stopper */}
          <g>
            {/* Stopper base - gradient blue glass */}
            <defs>
              <linearGradient id={`stopper-grad-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            
            {/* Main stopper body */}
            <ellipse
              cx={BOTTLE_WIDTH * 0.5}
              cy={6}
              rx={BOTTLE_WIDTH * 0.13}
              ry={4.5}
              fill={`url(#stopper-grad-${position.x}-${position.y})`}
              stroke="#1E40AF"
              strokeWidth="1"
            />
            
            {/* Stopper top knob */}
            <ellipse
              cx={BOTTLE_WIDTH * 0.5}
              cy={3}
              rx={BOTTLE_WIDTH * 0.07}
              ry={3}
              fill="#60A5FA"
              stroke="#1E40AF"
              strokeWidth="0.8"
            />
            
            {/* Glass shine on stopper */}
            <ellipse
              cx={BOTTLE_WIDTH * 0.47}
              cy={5}
              rx={BOTTLE_WIDTH * 0.05}
              ry={2}
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
