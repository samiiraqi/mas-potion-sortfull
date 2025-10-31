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

function ThemedBottle({
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

  const getStrokeColor = () => {
    if (isSelected) return '#FFD700';
    if (isFull) return '#00FF00';
    
    switch (theme) {
      case 'lab': return '#00FFFF';
      case 'coffee': return '#8B4513';
      case 'juice': return '#FFA500';
      case 'potion': return '#9370DB';
      default: return 'rgba(255,255,255,0.5)';
    }
  };

  const getCapColor = () => {
    switch (theme) {
      case 'lab': return '#2196F3';
      case 'coffee': return '#6F4E37';
      case 'juice': return '#FF6347';
      case 'potion': return '#8B008B';
      default: return '#8B4513';
    }
  };

  const strokeWidth = isSelected ? 3 : 2;

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
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
        />

        <ellipse
          cx={BOTTLE_WIDTH * 0.28}
          cy={BOTTLE_HEIGHT * 0.45}
          rx={BOTTLE_WIDTH * 0.1}
          ry={BOTTLE_HEIGHT * 0.15}
          fill={`url(#shine-${position.x}-${position.y})`}
        />

        <ellipse
          cx={BOTTLE_WIDTH * 0.5}
          cy={6}
          rx={BOTTLE_WIDTH * 0.16}
          ry={4}
          fill={getCapColor()}
        />
      </svg>
    </div>
  );
}

export default ThemedBottle;
