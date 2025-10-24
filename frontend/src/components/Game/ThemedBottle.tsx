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

export default function ThemedBottle({
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

  // Function to get unique pattern for each color
  const getPatternId = (color: string, idx: number) => {
    return `pattern-${color.replace('#', '')}-${position.x}-${position.y}-${idx}`;
  };

  return (
    <div
      onClick={onSelect}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: 'pointer',
        userSelect: 'none'
      }}
    >
      <FlaskFace
        x={position.x}
        y={position.y}
        isSelected={isSelected}
        isEmpty={isEmpty}
        isFull={isFull}
        isPouring={isPouring}
      />

      <svg width={BOTTLE_WIDTH} height={BOTTLE_HEIGHT} style={{ overflow: 'visible' }}>
        <defs>
          {/* Create patterns for each unique color */}
          {colors.map((color, idx) => {
            const patternId = getPatternId(color, idx);
            
            // Different pattern based on color
            if (color === '#FF0000') {
              // Red: Horizontal stripes
              return (
                <pattern key={patternId} id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#FF0000"/>
                  <line x1="0" y1="5" x2="10" y2="5" stroke="#FFFFFF" strokeWidth="2"/>
                </pattern>
              );
            } else if (color === '#00FF00') {
              // Green: Dots
              return (
                <pattern key={patternId} id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#00FF00"/>
                  <circle cx="5" cy="5" r="2" fill="#FFFFFF"/>
                </pattern>
              );
            } else if (color === '#0000FF') {
              // Blue: Diagonal stripes
              return (
                <pattern key={patternId} id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill="#0000FF"/>
                  <line x1="0" y1="0" x2="10" y2="10" stroke="#FFFFFF" strokeWidth="2"/>
                </pattern>
              );
            } else if (color === '#FFFF00') {
              // Yellow: Checkered
              return (
                <pattern key={patternId} id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="5" height="5" fill="#FFFF00"/>
                  <rect x="5" y="5" width="5" height="5" fill="#FFFF00"/>
                  <rect x="5" y="0" width="5" height="5" fill="#FFA500"/>
                  <rect x="0" y="5" width="5" height="5" fill="#FFA500"/>
                </pattern>
              );
            } else if (color === '#FF1493' || color === '#FF00FF') {
              // Pink/Magenta: Vertical stripes
              return (
                <pattern key={patternId} id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill={color}/>
                  <line x1="5" y1="0" x2="5" y2="10" stroke="#FFFFFF" strokeWidth="2"/>
                </pattern>
              );
            } else if (color === '#00FFFF') {
              // Cyan: Waves
              return (
                <pattern key={patternId} id={patternId} width="20" height="10" patternUnits="userSpaceOnUse">
                  <rect width="20" height="10" fill="#00FFFF"/>
                  <path d="M0,5 Q5,2 10,5 T20,5" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
                </pattern>
              );
            } else {
              // Others: Solid color with border
              return (
                <pattern key={patternId} id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
                  <rect width="10" height="10" fill={color}/>
                </pattern>
              );
            }
          })}

          <linearGradient id={`flaskGradient-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.2)' }} />
            <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.05)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.15)' }} />
          </linearGradient>

          <clipPath id={`flaskClip-${position.x}-${position.y}`}>
            <path d={`
              M ${BOTTLE_WIDTH * 0.4} 10
              L ${BOTTLE_WIDTH * 0.4} ${BOTTLE_HEIGHT * 0.25}
              Q ${BOTTLE_WIDTH * 0.35} ${BOTTLE_HEIGHT * 0.35} ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.45}
              Q ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.6} ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.75}
              L ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.9}
              Q ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.95} ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.95}
              L ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.95}
              Q ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.95} ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.9}
              L ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.75}
              Q ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.6} ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.45}
              Q ${BOTTLE_WIDTH * 0.65} ${BOTTLE_HEIGHT * 0.35} ${BOTTLE_WIDTH * 0.6} ${BOTTLE_HEIGHT * 0.25}
              L ${BOTTLE_WIDTH * 0.6} 10
              Q ${BOTTLE_WIDTH * 0.6} 5 ${BOTTLE_WIDTH * 0.5} 5
              Q ${BOTTLE_WIDTH * 0.4} 5 ${BOTTLE_WIDTH * 0.4} 10
              Z
            `} />
          </clipPath>
        </defs>

        <g clipPath={`url(#flaskClip-${position.x}-${position.y})`}>
          {colors.map((color, idx) => {
            const yStart = BOTTLE_BOTTOM - ((idx + 1) * LAYER_HEIGHT);
            const patternId = getPatternId(color, idx);
            
            return (
              <g key={idx}>
                {/* Use pattern fill instead of solid color */}
                <rect
                  x={BOTTLE_WIDTH * 0.15}
                  y={yStart}
                  width={BOTTLE_WIDTH * 0.7}
                  height={LAYER_HEIGHT}
                  fill={`url(#${patternId})`}
                />
                
                {/* THICK BLACK border */}
                {idx < colors.length - 1 && (
                  <rect
                    x={BOTTLE_WIDTH * 0.15}
                    y={yStart - 2}
                    width={BOTTLE_WIDTH * 0.7}
                    height={4}
                    fill="#000000"
                  />
                )}
              </g>
            );
          })}
        </g>

        <path
          d={`
            M ${BOTTLE_WIDTH * 0.4} 10
            L ${BOTTLE_WIDTH * 0.4} ${BOTTLE_HEIGHT * 0.25}
            Q ${BOTTLE_WIDTH * 0.35} ${BOTTLE_HEIGHT * 0.35} ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.45}
            Q ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.6} ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.75}
            L ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.9}
            Q ${BOTTLE_WIDTH * 0.15} ${BOTTLE_HEIGHT * 0.95} ${BOTTLE_WIDTH * 0.25} ${BOTTLE_HEIGHT * 0.95}
            L ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.95}
            Q ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.95} ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.9}
            L ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.75}
            Q ${BOTTLE_WIDTH * 0.85} ${BOTTLE_HEIGHT * 0.6} ${BOTTLE_WIDTH * 0.75} ${BOTTLE_HEIGHT * 0.45}
            Q ${BOTTLE_WIDTH * 0.65} ${BOTTLE_HEIGHT * 0.35} ${BOTTLE_WIDTH * 0.6} ${BOTTLE_HEIGHT * 0.25}
            L ${BOTTLE_WIDTH * 0.6} 10
            Q ${BOTTLE_WIDTH * 0.6} 5 ${BOTTLE_WIDTH * 0.5} 5
            Q ${BOTTLE_WIDTH * 0.4} 5 ${BOTTLE_WIDTH * 0.4} 10
            Z
          `}
          fill={`url(#flaskGradient-${position.x}-${position.y})`}
          stroke={isSelected ? '#FFD700' : isFull ? '#32CD32' : 'rgba(255,255,255,0.5)'}
          strokeWidth={isSelected ? 3 : 2}
          style={{ transition: 'all 0.3s ease' }}
        />

        <ellipse
          cx={BOTTLE_WIDTH * 0.5}
          cy={7}
          rx={BOTTLE_WIDTH * 0.15}
          ry={4}
          fill="rgba(139,69,19,0.8)"
          stroke="rgba(101,67,33,0.9)"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
