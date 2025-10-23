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
  const LIQUID_SECTION_HEIGHT = 35;

  const filledColors = [...colors];
  while (filledColors.length < 4) {
    filledColors.unshift('transparent');
  }

  const getFlaskPath = () => {
    const w = BOTTLE_WIDTH;
    const h = BOTTLE_HEIGHT;
    
    return `
      M ${w * 0.4} 10
      L ${w * 0.4} ${h * 0.25}
      Q ${w * 0.35} ${h * 0.35} ${w * 0.25} ${h * 0.45}
      Q ${w * 0.15} ${h * 0.6} ${w * 0.15} ${h * 0.75}
      L ${w * 0.15} ${h * 0.9}
      Q ${w * 0.15} ${h * 0.95} ${w * 0.25} ${h * 0.95}
      L ${w * 0.75} ${h * 0.95}
      Q ${w * 0.85} ${h * 0.95} ${w * 0.85} ${h * 0.9}
      L ${w * 0.85} ${h * 0.75}
      Q ${w * 0.85} ${h * 0.6} ${w * 0.75} ${h * 0.45}
      Q ${w * 0.65} ${h * 0.35} ${w * 0.6} ${h * 0.25}
      L ${w * 0.6} 10
      Q ${w * 0.6} 5 ${w * 0.5} 5
      Q ${w * 0.4} 5 ${w * 0.4} 10
      Z
    `;
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
      {/* Flask Face - KEEP THIS! */}
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
            <path d={getFlaskPath()} />
          </clipPath>

          <filter id={`glowEffect-${position.x}-${position.y}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Liquid layers inside flask */}
        <g clipPath={`url(#flaskClip-${position.x}-${position.y})`}>
          {filledColors.map((color, idx) => {
            if (color === 'transparent') return null;
            
            const yStart = BOTTLE_HEIGHT * 0.95 - (idx + 1) * LIQUID_SECTION_HEIGHT;
            
            return (
              <rect
                key={idx}
                x={BOTTLE_WIDTH * 0.15}
                y={yStart}
                width={BOTTLE_WIDTH * 0.7}
                height={LIQUID_SECTION_HEIGHT}
                fill={color}
                opacity={0.85}
                style={{
                  filter: isFull ? `url(#glowEffect-${position.x}-${position.y})` : 'none'
                }}
              />
            );
          })}
        </g>

        {/* Flask glass outline */}
        <path
          d={getFlaskPath()}
          fill={`url(#flaskGradient-${position.x}-${position.y})`}
          stroke={isSelected ? '#FFD700' : isFull ? '#32CD32' : 'rgba(255,255,255,0.6)'}
          strokeWidth={isSelected ? 3 : 2}
          filter={isFull ? `url(#glowEffect-${position.x}-${position.y})` : undefined}
          style={{
            transition: 'all 0.3s ease'
          }}
        />

        {/* Cork/Stopper at top */}
        <ellipse
          cx={BOTTLE_WIDTH * 0.5}
          cy={7}
          rx={BOTTLE_WIDTH * 0.15}
          ry={4}
          fill="rgba(139,69,19,0.8)"
          stroke="rgba(101,67,33,0.9)"
          strokeWidth={1}
        />

        {/* Shimmer effect on glass */}
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
