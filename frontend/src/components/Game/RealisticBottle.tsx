import React from 'react';

interface RealisticBottleProps {
  colors: string[];
  position: { x: number; y: number };
  onSelect: () => void;
  isSelected: boolean;
  isEmpty: boolean;
  isFull: boolean;
}

const RealisticBottle: React.FC<RealisticBottleProps> = ({
  colors,
  position,
  onSelect,
  isSelected,
  isEmpty,
  isFull
}) => {
  const bottleWidth = 60;
  const bottleHeight = 120;
  const colorHeight = bottleHeight / 4;

  // Enhanced color mapping with gradients
  const colorMap: { [key: string]: { base: string; light: string; dark: string } } = {
    red: { base: '#FF3B3B', light: '#FF6B6B', dark: '#D32F2F' },
    blue: { base: '#3B82F6', light: '#60A5FA', dark: '#1E40AF' },
    green: { base: '#10B981', light: '#34D399', dark: '#059669' },
    yellow: { base: '#FBBF24', light: '#FCD34D', dark: '#F59E0B' },
    purple: { base: '#A855F7', light: '#C084FC', dark: '#7C3AED' },
    orange: { base: '#F97316', light: '#FB923C', dark: '#EA580C' },
    cyan: { base: '#06B6D4', light: '#22D3EE', dark: '#0891B2' },
    pink: { base: '#EC4899', light: '#F472B6', dark: '#DB2777' },
    lime: { base: '#84CC16', light: '#A3E635', dark: '#65A30D' },
    magenta: { base: '#D946EF', light: '#E879F9', dark: '#C026D3' },
    teal: { base: '#14B8A6', light: '#2DD4BF', dark: '#0F766E' },
    coral: { base: '#FB7185', light: '#FDA4AF', dark: '#F43F5E' }
  };

  const getColorShades = (color: string) => {
    return colorMap[color] || { base: color, light: color, dark: color };
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: 'pointer',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease',
      }}
      onClick={onSelect}
    >
      <svg
        width={bottleWidth}
        height={bottleHeight + 20}
        style={{
          filter: isSelected 
            ? 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))' 
            : isFull 
              ? 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.4))' 
              : 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))'
        }}
      >
        <defs>
          {/* Create gradients for each color */}
          {colors.map((color, index) => {
            const shades = getColorShades(color);
            return (
              <linearGradient key={`grad-${color}-${index}`} id={`gradient-${color}-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: shades.dark, stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: shades.base, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: shades.light, stopOpacity: 1 }} />
              </linearGradient>
            );
          })}

          {/* Glass reflection gradient */}
          <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.1)', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.4)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.1)', stopOpacity: 1 }} />
          </linearGradient>

          {/* Shimmer effect for completed bottles */}
          <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.6)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {/* Bottle body outline */}
        <path
          d={`M ${bottleWidth * 0.25} 15 
              L ${bottleWidth * 0.25} 20 
              C ${bottleWidth * 0.25} 20, ${bottleWidth * 0.15} 25, ${bottleWidth * 0.15} 30 
              L ${bottleWidth * 0.15} ${bottleHeight} 
              C ${bottleWidth * 0.15} ${bottleHeight + 5}, ${bottleWidth * 0.2} ${bottleHeight + 8}, ${bottleWidth * 0.3} ${bottleHeight + 8} 
              L ${bottleWidth * 0.7} ${bottleHeight + 8} 
              C ${bottleWidth * 0.8} ${bottleHeight + 8}, ${bottleWidth * 0.85} ${bottleHeight + 5}, ${bottleWidth * 0.85} ${bottleHeight} 
              L ${bottleWidth * 0.85} 30 
              C ${bottleWidth * 0.85} 25, ${bottleWidth * 0.75} 20, ${bottleWidth * 0.75} 20 
              L ${bottleWidth * 0.75} 15 
              C ${bottleWidth * 0.75} 12, ${bottleWidth * 0.7} 10, ${bottleWidth * 0.65} 10 
              L ${bottleWidth * 0.35} 10 
              C ${bottleWidth * 0.3} 10, ${bottleWidth * 0.25} 12, ${bottleWidth * 0.25} 15 Z`}
          fill="rgba(200, 220, 240, 0.3)"
          stroke="rgba(150, 170, 200, 0.6)"
          strokeWidth="2"
        />

        {/* Bottle cap */}
        <rect
          x={bottleWidth * 0.3}
          y={8}
          width={bottleWidth * 0.4}
          height={6}
          rx={2}
          fill="#E74C3C"
          opacity={0.9}
        />

        {/* Liquid layers with enhanced gradients */}
        {colors.map((color, index) => {
          const y = bottleHeight + 8 - (index + 1) * colorHeight;
          const shades = getColorShades(color);
          
          return (
            <g key={`layer-${index}`}>
              {/* Main liquid layer with gradient */}
              <rect
                x={bottleWidth * 0.18}
                y={y}
                width={bottleWidth * 0.64}
                height={colorHeight}
                fill={`url(#gradient-${color}-${index})`}
                opacity={0.95}
              />

              {/* Subtle bubbles inside liquid */}
              {[...Array(2)].map((_, bubbleIdx) => (
                <circle
                  key={`bubble-${index}-${bubbleIdx}`}
                  cx={bottleWidth * (0.3 + Math.random() * 0.4)}
                  cy={y + colorHeight * (0.3 + Math.random() * 0.4)}
                  r={1.5 + Math.random() * 1}
                  fill="rgba(255,255,255,0.4)"
                  opacity={0.6}
                >
                  <animate
                    attributeName="cy"
                    values={`${y + colorHeight * 0.8};${y + colorHeight * 0.2};${y + colorHeight * 0.8}`}
                    dur={`${3 + Math.random() * 2}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.6;0.9;0.6"
                    dur={`${2 + Math.random()}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}

              {/* Light reflection on top of liquid */}
              <ellipse
                cx={bottleWidth * 0.35}
                cy={y + 5}
                rx={8}
                ry={3}
                fill="rgba(255,255,255,0.3)"
                opacity={0.6}
              />
            </g>
          );
        })}

        {/* Glass shine effect */}
        <rect
          x={bottleWidth * 0.2}
          y={25}
          width={bottleWidth * 0.15}
          height={bottleHeight - 20}
          fill="url(#glassShine)"
          opacity={0.4}
        />

        {/* Shimmer effect for completed bottles */}
        {isFull && (
          <rect
            x={bottleWidth * 0.15}
            y={30}
            width={bottleWidth * 0.7}
            height={bottleHeight - 22}
            fill="url(#shimmer)"
            opacity={0.5}
          >
            <animate
              attributeName="x"
              values={`${bottleWidth * -0.5};${bottleWidth * 1.5}`}
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
        )}

        {/* Sparkle particles for completed bottles */}
        {isFull && [...Array(3)].map((_, i) => (
          <circle
            key={`sparkle-${i}`}
            cx={bottleWidth * (0.3 + Math.random() * 0.4)}
            cy={40 + Math.random() * 60}
            r={2}
            fill="white"
            opacity={0}
          >
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur={`${1 + Math.random()}s`}
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="2;3;2"
              dur={`${1 + Math.random()}s`}
              begin={`${i * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default RealisticBottle;
