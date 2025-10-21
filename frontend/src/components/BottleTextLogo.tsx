export default function BottleTextLogo() {
  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      margin: '0 auto'
    }}>
      <svg
        width="450"
        height="180"
        viewBox="0 0 450 180"
        style={{
          filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.4))'
        }}
      >
        <defs>
          {/* Gradient for bottle outline */}
          <linearGradient id="bottleOutline" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.9)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(200,230,255,0.7)' }} />
          </linearGradient>
          
          {/* Gradient for liquid background */}
          <linearGradient id="liquidBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 0.3 }} />
            <stop offset="50%" style={{ stopColor: '#4ECDC4', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: '#45B7D1', stopOpacity: 0.4 }} />
          </linearGradient>
          
          {/* Bubble effect filter */}
          <filter id="bubble">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 1" />
            </feComponentTransfer>
          </filter>
        </defs>
        
        {/* Bottle shape outline */}
        <path
          d="M 150 10 L 150 25 C 150 25 130 35 130 50 L 130 150 C 130 160 135 170 160 170 L 290 170 C 315 170 320 160 320 150 L 320 50 C 320 35 300 25 300 25 L 300 10 C 300 5 295 2 290 2 L 160 2 C 155 2 150 5 150 10 Z"
          fill="url(#liquidBg)"
          stroke="url(#bottleOutline)"
          strokeWidth="4"
          opacity="0.9"
        />
        
        {/* Bottle cap */}
        <rect x="180" y="0" width="90" height="8" rx="3" fill="#E74C3C" opacity="0.9" />
        
        {/* Text "BOTTLE" in bubble style - top part */}
        <text
          x="225"
          y="60"
          fontFamily="Arial Black, sans-serif"
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
          fill="white"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1"
          filter="url(#bubble)"
          style={{
            textShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}
        >
          <tspan>BOTTLE</tspan>
          
          {/* Bubble circles on letters */}
          <animate
            attributeName="opacity"
            values="1;0.8;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </text>
        
        {/* Small decorative bubbles around "BOTTLE" */}
        <circle cx="165" cy="45" r="4" fill="rgba(255,255,255,0.7)">
          <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="285" cy="48" r="5" fill="rgba(255,255,255,0.6)">
          <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="65" r="3" fill="rgba(255,255,255,0.8)">
          <animate attributeName="r" values="3;5;3" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="300" cy="62" r="4" fill="rgba(255,255,255,0.7)">
          <animate attributeName="r" values="4;6;4" dur="2.2s" repeatCount="indefinite" />
        </circle>
        
        {/* Text "FOR" in bubble style - middle part */}
        <text
          x="225"
          y="100"
          fontFamily="Arial Black, sans-serif"
          fontSize="28"
          fontWeight="bold"
          textAnchor="middle"
          fill="white"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1"
          filter="url(#bubble)"
        >
          <tspan>FOR</tspan>
          <animate
            attributeName="opacity"
            values="1;0.85;1"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </text>
        
        {/* Bubbles around "FOR" */}
        <circle cx="180" cy="90" r="3" fill="rgba(255,255,255,0.7)">
          <animate attributeName="cy" values="90;70;90" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0;0.7" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="270" cy="95" r="4" fill="rgba(255,255,255,0.6)">
          <animate attributeName="cy" values="95;75;95" dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="3.5s" repeatCount="indefinite" />
        </circle>
        
        {/* Text "MAS" in bubble style - bottom part */}
        <text
          x="225"
          y="140"
          fontFamily="Arial Black, sans-serif"
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
          fill="white"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1"
          filter="url(#bubble)"
        >
          <tspan>MAS</tspan>
          <animate
            attributeName="opacity"
            values="1;0.8;1"
            dur="2.8s"
            repeatCount="indefinite"
          />
        </text>
        
        {/* Bubbles around "MAS" */}
        <circle cx="170" cy="125" r="5" fill="rgba(255,255,255,0.8)">
          <animate attributeName="r" values="5;7;5" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="280" cy="130" r="4" fill="rgba(255,255,255,0.7)">
          <animate attributeName="r" values="4;6;4" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="155" cy="145" r="3" fill="rgba(255,255,255,0.6)">
          <animate attributeName="r" values="3;5;3" dur="1.9s" repeatCount="indefinite" />
        </circle>
        <circle cx="295" cy="142" r="4" fill="rgba(255,255,255,0.75)">
          <animate attributeName="r" values="4;6;4" dur="2.3s" repeatCount="indefinite" />
        </circle>
        
        {/* Floating bubbles rising from bottom */}
        <circle cx="160" cy="160" r="3" fill="rgba(255,255,255,0.5)">
          <animate attributeName="cy" values="160;50;160" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" values="3;5;3" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="165" r="4" fill="rgba(255,255,255,0.5)">
          <animate attributeName="cy" values="165;40;165" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0" dur="5s" repeatCount="indefinite" />
          <animate attributeName="r" values="4;6;4" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="160" r="3" fill="rgba(255,255,255,0.5)">
          <animate attributeName="cy" values="160;45;160" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="290" cy="165" r="4" fill="rgba(255,255,255,0.5)">
          <animate attributeName="cy" values="165;35;165" dur="5.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur="5.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="4;7;4" dur="5.5s" repeatCount="indefinite" />
        </circle>
        
        {/* Glass shine effect */}
        <ellipse cx="175" cy="60" rx="15" ry="30" fill="rgba(255,255,255,0.2)" />
        <ellipse cx="275" cy="80" rx="12" ry="25" fill="rgba(255,255,255,0.15)" />
      </svg>
    </div>
  );
}
