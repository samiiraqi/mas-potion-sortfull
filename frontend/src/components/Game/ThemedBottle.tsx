import { memo } from 'react';
import FlaskFace from './FlaskFace';

interface ThemedBottleProps {
  colors: string[];
  position: { x: number; y: number };
  onSelect: () => void;
  isSelected: boolean;
  isEmpty: boolean;
  isFull: boolean;
  theme?: string;
  isPouring?: boolean;
}

const ThemedBottle = memo(function ThemedBottle({
  colors,
  position,
  onSelect,
  isSelected,
  isEmpty,
  isFull,
  theme = 'classic',
  isPouring = false
}: ThemedBottleProps) {
  const BOTTLE_HEIGHT = 160;
  const BOTTLE_WIDTH = 60;
  const LAYER_HEIGHT = 28;
  const BOTTLE_BOTTOM = 152;

  // 🔥 DIFFERENT BOTTLE STYLES BASED ON THEME
  const getBottleStyle = () => {
    switch (theme) {
      case 'lab':
        return {
          strokeColor: isSelected ? '#FFD700' : isFull ? '#00FF00' : '#00FFFF',
          strokeWidth: isSelected ? 3 : 2,
          capColor: '#2196F3' // Blue lab cap
        };
      case 'coffee':
        return {
          strokeColor: isSelected ? '#FFD700' : isFull ? '#00FF00' : '#8B4513',
          strokeWidth: isSelected ? 3 : 2.5,
          capColor: '#6F4E37' // Coffee brown cap
        };
      case 'juice':
        return {
          strokeColor: isSelected ? '#FFD700' : isFull ? '#00FF00' : '#FFA500',
          strokeWidth: isSelected ? 3 : 2,
          capColor: '#FF6347' // Tomato red cap
        };
      case 'potion':
        return {
          strokeColor: isSelected ? '#FFD700' : isFull ? '#00FF00' : '#9370DB',
          strokeWidth: isSelected ? 3.5 : 2.5,
          capColor: '#8B008B' // Dark magenta cap
        };
      default: // classic
        return {
          strokeColor: isSelected ? '#FFD700' : isFull ? '#00FF00' : 'rgba(255,255,255,0.5)',
          strokeWidth: isSelected ? 2.5 : 2,
          capColor: '#8B4513' // Brown cork
        };
    }
  };

  const style = getBottleStyle();

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
          <linearGradient id={`shine-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopOpacity={0.3} stopColor="white" />
            <stop offset="50%" stopOpacity={0.6} stopColor="white" />
            <stop offset="100%" stopOpacity={0.2} stopColor="white" />
          </linearGradient>

          <clipPath id={`clip-${position.x}-${position.y}`}>
            <path d={`
              M ${BOTTLE_WIDTH * 0.35} 8
              L ${BOTTLE_WIDTH * 0.35} ${BOTTLE_HEIGHT * 0.22}
              Q ${BOTTLE_WIDTH * 0.3} ${BOTTLE_HEIGHT * 0.3} ${BOTTLE_WIDTH * 0.2} ${BOTTLE_HEIGHT * 0.4}
              Q ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.55} ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.7}
              L ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.88}
              Q ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.94} ${BOTTLE_WIDTH * 0.2} ${BOTTLE_HEIGHT * 0.94}
              L ${BOTTLE_WIDTH * 0.8} ${BOTTLE_HEIGHT * 0.94}
              Q ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.94} ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.88}
              L ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.7}
              Q ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.55} ${BOTTLE_WIDTH * 0.8} ${BOTTLE_HEIGHT * 0.4}
              Q ${BOTTLE_WIDTH * 0.7} ${BOTTLE_HEIGHT * 0.3} ${BOTTLE_WIDTH * 0.65} ${BOTTLE_HEIGHT * 0.22}
              L ${BOTTLE_WIDTH * 0.65} 8
              Q ${BOTTLE_WIDTH * 0.65} 4 ${BOTTLE_WIDTH * 0.5} 4
              Q ${BOTTLE_WIDTH * 0.35} 4 ${BOTTLE_WIDTH * 0.35} 8 Z
            `} />
          </clipPath>
        </defs>

        <g clipPath={`url(#clip-${position.x}-${position.y})`}>
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
                    y={yStart - 2}
                    width={BOTTLE_WIDTH * 0.76}
                    height={4}
                    fill="#000000"
                    opacity={0.25}
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* 🔥 BOTTLE OUTLINE WITH THEME COLOR */}
        <path
          d={`
            M ${BOTTLE_WIDTH * 0.35} 8
            L ${BOTTLE_WIDTH * 0.35} ${BOTTLE_HEIGHT * 0.22}
            Q ${BOTTLE_WIDTH * 0.3} ${BOTTLE_HEIGHT * 0.3} ${BOTTLE_WIDTH * 0.2} ${BOTTLE_HEIGHT * 0.4}
            Q ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.55} ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.7}
            L ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.88}
            Q ${BOTTLE_WIDTH * 0.12} ${BOTTLE_HEIGHT * 0.94} ${BOTTLE_WIDTH * 0.2} ${BOTTLE_HEIGHT * 0.94}
            L ${BOTTLE_WIDTH * 0.8} ${BOTTLE_HEIGHT * 0.94}
            Q ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.94} ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.88}
            L ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.7}
            Q ${BOTTLE_WIDTH * 0.88} ${BOTTLE_HEIGHT * 0.55} ${BOTTLE_WIDTH * 0.8} ${BOTTLE_HEIGHT * 0.4}
            Q ${BOTTLE_WIDTH * 0.7} ${BOTTLE_HEIGHT * 0.3} ${BOTTLE_WIDTH * 0.65} ${BOTTLE_HEIGHT * 0.22}
            L ${BOTTLE_WIDTH * 0.65} 8
            Q ${BOTTLE_WIDTH * 0.65} 4 ${BOTTLE_WIDTH * 0.5} 4
            Q ${BOTTLE_WIDTH * 0.35} 4 ${BOTTLE_WIDTH * 0.35} 8 Z
          `}
          fill="none"
          stroke={style.strokeColor}
          strokeWidth={style.strokeWidth}
        />

        <ellipse
          cx={BOTTLE_WIDTH * 0.28}
          cy={BOTTLE_HEIGHT * 0.45}
          rx={BOTTLE_WIDTH * 0.1}
          ry={BOTTLE_HEIGHT * 0.15}
          fill={`url(#shine-${position.x}-${position.y})`}
        />

        {/* 🔥 BOTTLE CAP WITH THEME COLOR */}
        <ellipse
          cx={BOTTLE_WIDTH * 0.5}
          cy={6}
          rx={BOTTLE_WIDTH * 0.16}
          ry={4}
          fill={style.capColor}
        />
      </svg>
    </div>
  );
});

export default ThemedBottle;