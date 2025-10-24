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
  const LAYER_HEIGHT = 28; // Fixed height per layer
  const BOTTLE_BOTTOM = 152; // Bottom of liquid area

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
          <linearGradient id={`flaskGradient-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.4)' }} />
            <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.1)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.3)' }} />
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

          <filter id={`glowEffect-${position.x}-${position.y}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Render liquid from BOTTOM UP */}
        <g clipPath={`url(#flaskClip-${position.x}-${position.y})`}>
          {colors.map((color, idx) => {
            // Start from BOTTOM: idx=0 is at bottom, idx=3 is at top
            // Calculate Y position from bottom
            const yStart = BOTTLE_BOTTOM - ((idx + 1) * LAYER_HEIGHT);
            
            return (
              <g key={idx}>
                <rect
                  x={BOTTLE_WIDTH * 0.15}
                  y={yStart}
                  width={BOTTLE_WIDTH * 0.7}
                  height={LAYER_HEIGHT}
                  fill={color}
                  opacity={0.9}
                />
                
                {/* Separator line between layers */}
                {idx < colors.length - 1 && (
                  <line
                    x1={BOTTLE_WIDTH * 0.15}
                    y1={yStart}
                    x2={BOTTLE_WIDTH * 0.85}
                    y2={yStart}
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Flask outline */}
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
          stroke={isSelected ? '#FFD700' : isFull ? '#32CD32' : 'rgba(255,255,255,0.6)'}
          strokeWidth={isSelected ? 3 : 2}
          filter={isFull ? `url(#glowEffect-${position.x}-${position.y})` : undefined}
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Cork */}
        <ellipse
          cx={BOTTLE_WIDTH * 0.5}
          cy={7}
          rx={BOTTLE_WIDTH * 0.15}
          ry={4}
          fill="rgba(139,69,19,0.8)"
          stroke="rgba(101,67,33,0.9)"
          strokeWidth={1}
        />

        {/* Shimmer */}
        <ellipse
          cx={BOTTLE_WIDTH * 0.35}
          cy={BOTTLE_HEIGHT * 0.5}
          rx={BOTTLE_WIDTH * 0.1}
          ry={BOTTLE_HEIGHT * 0.15}
          fill="rgba(255,255,255,0.3)"
          opacity={0.6}
        />
      </svg>
    </div>
  );
}
