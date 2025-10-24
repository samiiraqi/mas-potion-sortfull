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
          {/* Glass shine effect */}
          <linearGradient id={`shine-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.4)' }} />
            <stop offset="30%" style={{ stopColor: 'rgba(255,255,255,0.8)' }} />
            <stop offset="70%" style={{ stopColor: 'rgba(255,255,255,0.1)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.3)' }} />
          </linearGradient>

          {/* Liquid gradient for 3D effect */}
          <linearGradient id={`liquid-${position.x}-${position.y}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgba(0,0,0,0.2)' }} />
            <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.3)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(0,0,0,0.15)' }} />
          </linearGradient>

          {/* Clip path for bottle shape */}
          <clipPath id={`flaskClip-${position.x}-${position.y}`}>
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
              Q ${BOTTLE_WIDTH * 0.35} 4 ${BOTTLE_WIDTH * 0.35} 8
              Z
            `} />
          </clipPath>

          {/* Glow effect for selected/full bottles */}
          <filter id={`glow-${position.x}-${position.y}`}>
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Render liquid layers */}
        <g clipPath={`url(#flaskClip-${position.x}-${position.y})`}>
          {colors.map((color, idx) => {
            const yStart = BOTTLE_BOTTOM - ((idx + 1) * LAYER_HEIGHT);
            
            return (
              <g key={idx}>
                {/* Main color layer */}
                <rect
                  x={BOTTLE_WIDTH * 0.12}
                  y={yStart}
                  width={BOTTLE_WIDTH * 0.76}
                  height={LAYER_HEIGHT}
                  fill={color}
                />
                
                {/* 3D liquid shine effect */}
                <rect
                  x={BOTTLE_WIDTH * 0.12}
                  y={yStart}
                  width={BOTTLE_WIDTH * 0.76}
                  height={LAYER_HEIGHT}
                  fill={`url(#liquid-${position.x}-${position.y})`}
                  opacity={0.4}
                />
                
                {/* Separator line between layers */}
                {idx < colors.length - 1 && (
                  <>
                    <rect
                      x={BOTTLE_WIDTH * 0.12}
                      y={yStart - 3}
                      width={BOTTLE_WIDTH * 0.76}
                      height={6}
                      fill="#000000"
                      opacity={0.3}
                    />
                    <line
                      x1={BOTTLE_WIDTH * 0.12}
                      y1={yStart}
                      x2={BOTTLE_WIDTH * 0.88}
                      y2={yStart}
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="1"
                    />
                  </>
                )}
              </g>
            );
          })}
        </g>

        {/* Beautiful glass bottle outline */}
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
            Q ${BOTTLE_WIDTH * 0.35} 4 ${BOTTLE_WIDTH * 0.35} 8
            Z
          `}
          fill="none"
          stroke={isSelected ? '#FFD700' : isFull ? '#00FF00' : 'rgba(255,255,255,0.6)'}
          strokeWidth={isSelected ? 3 : 2.5}
          filter={isSelected || isFull ? `url(#glow-${position.x}-${position.y})` : undefined}
          style={{ 
            transition: 'all 0.3s ease',
            paintOrder: 'stroke fill'
          }}
        />

        {/* Glass shine overlay */}
        <ellipse
          cx={BOTTLE_WIDTH * 0.28}
          cy={BOTTLE_HEIGHT * 0.45}
          rx={BOTTLE_WIDTH * 0.12}
          ry={BOTTLE_HEIGHT * 0.2}
          fill="url(#shine-${position.x}-${position.y})"
          opacity={0.6}
        />

        {/* Beautiful cork/cap */}
        <g>
          {/* Cork body */}
          <ellipse
            cx={BOTTLE_WIDTH * 0.5}
            cy={6}
            rx={BOTTLE_WIDTH * 0.18}
            ry={5}
            fill="linear-gradient(180deg, #8B4513, #654321)"
            stroke="#5D3A1A"
            strokeWidth={1.5}
          />
          <rect
            x={BOTTLE_WIDTH * 0.32}
            y={3}
            width={BOTTLE_WIDTH * 0.36}
            height={6}
            fill="#8B4513"
            rx={2}
          />
          {/* Cork highlight */}
          <ellipse
            cx={BOTTLE_WIDTH * 0.5}
            cy={5}
            rx={BOTTLE_WIDTH * 0.12}
            ry={2.5}
            fill="rgba(139,69,19,0.8)"
          />
          <ellipse
            cx={BOTTLE_WIDTH * 0.5}
            cy={4}
            rx={BOTTLE_WIDTH * 0.08}
            ry={1.5}
            fill="rgba(205,133,63,0.6)"
          />
        </g>

        {/* Bottom shadow */}
        <ellipse
          cx={BOTTLE_WIDTH * 0.5}
          cy={BOTTLE_HEIGHT * 0.94}
          rx={BOTTLE_WIDTH * 0.35}
          ry={4}
          fill="rgba(0,0,0,0.3)"
          opacity={0.5}
        />
      </svg>
    </div>
  );
}
