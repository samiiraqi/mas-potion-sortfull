import React from 'react';

interface ThemedBottleProps {
  colors: string[];
  position: { x: number; y: number };
  onSelect: () => void;
  isSelected: boolean;
  isEmpty: boolean;
  isFull: boolean;
  theme: string;
}

const ThemedBottle: React.FC<ThemedBottleProps> = ({
  colors,
  position,
  onSelect,
  isSelected,
  isEmpty,
  isFull,
  theme
}) => {
  const bottleWidth = 60;
  const bottleHeight = 120;
  
  const liquidLeft = bottleWidth * 0.18;
  const liquidRight = bottleWidth * 0.82;
  const liquidWidth = liquidRight - liquidLeft;
  const liquidBottom = bottleHeight + 3;
  const liquidTop = 32;
  const liquidHeight = liquidBottom - liquidTop;
  const layerHeight = liquidHeight / 4;

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

  // Different bottle shapes based on theme
  const getBottleShape = () => {
    switch(theme) {
      case 'lab':
        return `M ${bottleWidth * 0.3} 12 
                L ${bottleWidth * 0.3} 25
                L ${bottleWidth * 0.2} 30
                L ${bottleWidth * 0.2} ${bottleHeight}
                C ${bottleWidth * 0.2} ${bottleHeight + 5}, ${bottleWidth * 0.25} ${bottleHeight + 8}, ${bottleWidth * 0.35} ${bottleHeight + 8}
                L ${bottleWidth * 0.65} ${bottleHeight + 8}
                C ${bottleWidth * 0.75} ${bottleHeight + 8}, ${bottleWidth * 0.8} ${bottleHeight + 5}, ${bottleWidth * 0.8} ${bottleHeight}
                L ${bottleWidth * 0.8} 30
                L ${bottleWidth * 0.7} 25
                L ${bottleWidth * 0.7} 12
                C ${bottleWidth * 0.7} 10, ${bottleWidth * 0.65} 8, ${bottleWidth * 0.6} 8
                L ${bottleWidth * 0.4} 8
                C ${bottleWidth * 0.35} 8, ${bottleWidth * 0.3} 10, ${bottleWidth * 0.3} 12 Z`;
      
      case 'coffee':
        return `M ${bottleWidth * 0.2} 15
                L ${bottleWidth * 0.25} ${bottleHeight}
                C ${bottleWidth * 0.25} ${bottleHeight + 5}, ${bottleWidth * 0.3} ${bottleHeight + 8}, ${bottleWidth * 0.35} ${bottleHeight + 8}
                L ${bottleWidth * 0.65} ${bottleHeight + 8}
                C ${bottleWidth * 0.7} ${bottleHeight + 8}, ${bottleWidth * 0.75} ${bottleHeight + 5}, ${bottleWidth * 0.75} ${bottleHeight}
                L ${bottleWidth * 0.8} 15
                C ${bottleWidth * 0.8} 12, ${bottleWidth * 0.75} 10, ${bottleWidth * 0.7} 10
                L ${bottleWidth * 0.3} 10
                C ${bottleWidth * 0.25} 10, ${bottleWidth * 0.2} 12, ${bottleWidth * 0.2} 15 Z`;
      
      case 'juice':
        return `M ${bottleWidth * 0.28} 15
                L ${bottleWidth * 0.28} 25
                C ${bottleWidth * 0.28} 25, ${bottleWidth * 0.22} 28, ${bottleWidth * 0.22} 35
                L ${bottleWidth * 0.22} ${bottleHeight - 5}
                C ${bottleWidth * 0.22} ${bottleHeight}, ${bottleWidth * 0.25} ${bottleHeight + 5}, ${bottleWidth * 0.32} ${bottleHeight + 5}
                L ${bottleWidth * 0.68} ${bottleHeight + 5}
                C ${bottleWidth * 0.75} ${bottleHeight + 5}, ${bottleWidth * 0.78} ${bottleHeight}, ${bottleWidth * 0.78} ${bottleHeight - 5}
                L ${bottleWidth * 0.78} 35
                C ${bottleWidth * 0.78} 28, ${bottleWidth * 0.72} 25, ${bottleWidth * 0.72} 25
                L ${bottleWidth * 0.72} 15
                C ${bottleWidth * 0.72} 12, ${bottleWidth * 0.68} 10, ${bottleWidth * 0.63} 10
                L ${bottleWidth * 0.37} 10
                C ${bottleWidth * 0.32} 10, ${bottleWidth * 0.28} 12, ${bottleWidth * 0.28} 15 Z`;
      
      case 'potion':
        return `M ${bottleWidth * 0.25} 15
                L ${bottleWidth * 0.25} 22
                C ${bottleWidth * 0.25} 22, ${bottleWidth * 0.18} 28, ${bottleWidth * 0.18} 40
                L ${bottleWidth * 0.22} ${bottleHeight - 20}
                C ${bottleWidth * 0.25} ${bottleHeight - 10}, ${bottleWidth * 0.28} ${bottleHeight}, ${bottleWidth * 0.35} ${bottleHeight + 2}
                L ${bottleWidth * 0.65} ${bottleHeight + 2}
                C ${bottleWidth * 0.72} ${bottleHeight}, ${bottleWidth * 0.75} ${bottleHeight - 10}, ${bottleWidth * 0.78} ${bottleHeight - 20}
                L ${bottleWidth * 0.82} 40
                C ${bottleWidth * 0.82} 28, ${bottleWidth * 0.75} 22, ${bottleWidth * 0.75} 22
                L ${bottleWidth * 0.75} 15
                C ${bottleWidth * 0.75} 12, ${bottleWidth * 0.7} 10, ${bottleWidth * 0.65} 10
                L ${bottleWidth * 0.35} 10
                C ${bottleWidth * 0.3} 10, ${bottleWidth * 0.25} 12, ${bottleWidth * 0.25} 15 Z`;
      
      case 'paint':
        return `M ${bottleWidth * 0.3} 12
                L ${bottleWidth * 0.3} 25
                L ${bottleWidth * 0.25} 30
                L ${bottleWidth * 0.25} ${bottleHeight}
                L ${bottleWidth * 0.75} ${bottleHeight}
                L ${bottleWidth * 0.75} 30
                L ${bottleWidth * 0.7} 25
                L ${bottleWidth * 0.7} 12
                C ${bottleWidth * 0.7} 10, ${bottleWidth * 0.65} 8, ${bottleWidth * 0.6} 8
                L ${bottleWidth * 0.4} 8
                C ${bottleWidth * 0.35} 8, ${bottleWidth * 0.3} 10, ${bottleWidth * 0.3} 12 Z`;
      
      default: // classic
        return `M ${bottleWidth * 0.25} 15 
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
                C ${bottleWidth * 0.3} 10, ${bottleWidth * 0.25} 12, ${bottleWidth * 0.25} 15 Z`;
    }
  };

  const getCapColor = () => {
    switch(theme) {
      case 'lab': return '#2196F3';
      case 'coffee': return '#8D6E63';
      case 'juice': return '#4CAF50';
      case 'potion': return '#9C27B0';
      case 'paint': return '#FF5722';
      default: return '#E74C3C';
    }
  };

  const getGlassColor = () => {
    switch(theme) {
      case 'potion': return 'rgba(156, 39, 176, 0.2)';
      case 'lab': return 'rgba(33, 150, 243, 0.2)';
      default: return 'rgba(200, 220, 240, 0.3)';
    }
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
              ? `drop-shadow(0 0 10px ${getCapColor()}80)` 
              : 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))'
        }}
      >
        <defs>
          {colors.map((color, index) => {
            const shades = getColorShades(color);
            return (
              <linearGradient key={`grad-${color}-${index}`} id={`gradient-${color}-${index}-${theme}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: shades.dark, stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: shades.base, stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: shades.light, stopOpacity: 1 }} />
              </linearGradient>
            );
          })}

          <linearGradient id={`glassShine-${theme}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.1)', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.4)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.1)', stopOpacity: 1 }} />
          </linearGradient>

          <linearGradient id={`shimmer-${theme}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 0 }} />
            <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.6)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 0 }} />
          </linearGradient>

          <clipPath id={`bottleClip-${theme}`}>
            <path d={getBottleShape()} />
          </clipPath>
        </defs>

        {/* Bottle body */}
        <path
          d={getBottleShape()}
          fill={getGlassColor()}
          stroke={theme === 'potion' ? 'rgba(156, 39, 176, 0.6)' : 'rgba(150, 170, 200, 0.6)'}
          strokeWidth="2"
        />

        {/* Bottle cap */}
        <rect
          x={bottleWidth * 0.3}
          y={theme === 'lab' ? 6 : 8}
          width={bottleWidth * 0.4}
          height={theme === 'paint' ? 8 : 6}
          rx={2}
          fill={getCapColor()}
          opacity={0.9}
        />

        {/* Liquid layers */}
        <g clipPath={`url(#bottleClip-${theme})`}>
          {colors.map((color, index) => {
            const y = liquidBottom - (index + 1) * layerHeight;
            const shades = getColorShades(color);
            
            return (
              <g key={`layer-${index}`}>
                <rect
                  x={liquidLeft}
                  y={y}
                  width={liquidWidth}
                  height={layerHeight}
                  fill={`url(#gradient-${color}-${index}-${theme})`}
                  opacity={0.95}
                />

                {theme === 'potion' && (
                  <rect
                    x={liquidLeft}
                    y={y}
                    width={liquidWidth}
                    height={layerHeight}
                    fill={shades.base}
                    opacity={0.3}
                    style={{ 
                      filter: 'blur(3px)',
                      animation: 'glow 2s ease infinite'
                    }}
                  />
                )}

                {[...Array(2)].map((_, bubbleIdx) => (
                  <circle
                    key={`bubble-${index}-${bubbleIdx}`}
                    cx={liquidLeft + liquidWidth * (0.2 + Math.random() * 0.6)}
                    cy={y + layerHeight * (0.3 + Math.random() * 0.4)}
                    r={1.5 + Math.random() * 1}
                    fill="rgba(255,255,255,0.4)"
                    opacity={0.6}
                  >
                    <animate
                      attributeName="cy"
                      values={`${y + layerHeight * 0.8};${y + layerHeight * 0.2};${y + layerHeight * 0.8}`}
                      dur={`${3 + Math.random() * 2}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                ))}

                <ellipse
                  cx={liquidLeft + liquidWidth * 0.3}
                  cy={y + 5}
                  rx={8}
                  ry={3}
                  fill="rgba(255,255,255,0.3)"
                  opacity={0.6}
                />
              </g>
            );
          })}

          {isFull && (
            <rect
              x={liquidLeft}
              y={liquidTop}
              width={liquidWidth}
              height={liquidHeight}
              fill={`url(#shimmer-${theme})`}
              opacity={0.5}
            >
              <animate
                attributeName="x"
                values={`${liquidLeft - liquidWidth};${liquidLeft + liquidWidth * 2}`}
                dur="2s"
                repeatCount="indefinite"
              />
            </rect>
          )}
        </g>

        <rect
          x={bottleWidth * 0.2}
          y={25}
          width={bottleWidth * 0.15}
          height={bottleHeight - 20}
          fill={`url(#glassShine-${theme})`}
          opacity={0.4}
        />

        {theme === 'coffee' && (
          <text x={bottleWidth * 0.5} y={bottleHeight / 2} textAnchor="middle" fontSize="8" fill="rgba(141,110,99,0.3)" fontWeight="bold">☕</text>
        )}

        {isFull && [...Array(3)].map((_, i) => (
          <circle
            key={`sparkle-${i}`}
            cx={liquidLeft + liquidWidth * (0.3 + Math.random() * 0.4)}
            cy={liquidTop + liquidHeight * (0.2 + Math.random() * 0.6)}
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
          </circle>
        ))}
      </svg>

      <style>{`
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default ThemedBottle;
