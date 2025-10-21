export default function BottleTextLogo() {
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      margin: '0 auto'
    }}>
      <svg
        width="100%"
        height="200"
        viewBox="0 0 500 200"
        preserveAspectRatio="xMidYMid meet"
        style={{
          maxWidth: '500px',
          filter: 'drop-shadow(0 8px 30px rgba(0,0,0,0.4))'
        }}
      >
        <defs>
          {/* Rainbow gradients for bubble letters */}
          <radialGradient id="bubbleGrad1" cx="30%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#FFE5E5', stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: '#FF6B9D', stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: '#FF1744', stopOpacity: 0.9 }} />
          </radialGradient>
          
          <radialGradient id="bubbleGrad2" cx="30%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#E3F9FF', stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: '#4FACFE', stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: '#0077FF', stopOpacity: 0.9 }} />
          </radialGradient>
          
          <radialGradient id="bubbleGrad3" cx="30%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#FFF9E5', stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: '#FEC163', stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: '#FF9500', stopOpacity: 0.9 }} />
          </radialGradient>
          
          <radialGradient id="bubbleGrad4" cx="30%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#F0FFE5', stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: '#43E97B', stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: '#00C853', stopOpacity: 0.9 }} />
          </radialGradient>
          
          <radialGradient id="bubbleGrad5" cx="30%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#F5E5FF', stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: '#A855F7', stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: '#7C3AED', stopOpacity: 0.9 }} />
          </radialGradient>
          
          <radialGradient id="bubbleGrad6" cx="30%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#FFE5F5', stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: '#EC4899', stopOpacity: 0.95 }} />
            <stop offset="100%" style={{ stopColor: '#DB2777', stopOpacity: 0.9 }} />
          </radialGradient>
          
          {/* Bottle outline */}
          <linearGradient id="bottleOutline" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.5)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(200,230,255,0.4)' }} />
          </linearGradient>
          
          <linearGradient id="liquidBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 0.2 }} />
          </linearGradient>
          
          {/* Bubble shine highlight */}
          <radialGradient id="bubbleShine">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,1)' }} />
            <stop offset="50%" style={{ stopColor: 'rgba(255,255,255,0.6)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)' }} />
          </radialGradient>
        </defs>
        
        {/* Bottle shape - WIDER to fit all letters */}
        <path
          d="M 170 15 L 170 30 C 170 30 155 40 155 55 L 155 170 C 155 178 160 185 180 185 L 320 185 C 340 185 345 178 345 170 L 345 55 C 345 40 330 30 330 30 L 330 15 C 330 10 325 5 320 5 L 180 5 C 175 5 170 10 170 15 Z"
          fill="url(#liquidBg)"
          stroke="url(#bottleOutline)"
          strokeWidth="3"
          opacity="0.6"
        />
        
        {/* Bottle cap */}
        <rect x="200" y="3" width="100" height="8" rx="3" fill="#E74C3C" opacity="0.8" />
        
        {/* "BOTTLE" - Each letter as bubble with FLOATING animation */}
        
        {/* B */}
        <g>
          <circle cx="180" cy="60" r="17" fill="url(#bubbleGrad1)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="60;58;60" dur="2s" repeatCount="indefinite" />
            <animate attributeName="r" values="17;18.5;17" dur="2s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="177" cy="55" rx="6" ry="8" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="180" y="67" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>B</tspan>
            <animate attributeName="y" values="67;65;67" dur="2s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* O */}
        <g>
          <circle cx="210" cy="58" r="18" fill="url(#bubbleGrad2)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="58;56;58" dur="2.3s" repeatCount="indefinite" />
            <animate attributeName="r" values="18;19.5;18" dur="2.3s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="207" cy="53" rx="6" ry="8" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="210" y="65" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>O</tspan>
            <animate attributeName="y" values="65;63;65" dur="2.3s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* T */}
        <g>
          <circle cx="240" cy="60" r="17" fill="url(#bubbleGrad3)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="60;58;60" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="r" values="17;18.5;17" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="237" cy="55" rx="6" ry="8" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="240" y="67" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>T</tspan>
            <animate attributeName="y" values="67;65;67" dur="2.6s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* T */}
        <g>
          <circle cx="268" cy="58" r="18" fill="url(#bubbleGrad4)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="58;56;58" dur="2.9s" repeatCount="indefinite" />
            <animate attributeName="r" values="18;19.5;18" dur="2.9s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="265" cy="53" rx="6" ry="8" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="268" y="65" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>T</tspan>
            <animate attributeName="y" values="65;63;65" dur="2.9s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* L */}
        <g>
          <circle cx="296" cy="60" r="17" fill="url(#bubbleGrad5)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="60;58;60" dur="3.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="17;18.5;17" dur="3.2s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="293" cy="55" rx="6" ry="8" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="296" y="67" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>L</tspan>
            <animate attributeName="y" values="67;65;67" dur="3.2s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* E - MOVED INSIDE! */}
        <g>
          <circle cx="322" cy="58" r="17" fill="url(#bubbleGrad6)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="58;56;58" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="17;18.5;17" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="319" cy="53" rx="6" ry="8" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="322" y="65" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>E</tspan>
            <animate attributeName="y" values="65;63;65" dur="3.5s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* "FOR" - Middle */}
        
        {/* F */}
        <g>
          <circle cx="220" cy="105" r="16" fill="url(#bubbleGrad2)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="105;103;105" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="r" values="16;17.5;16" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="217" cy="101" rx="5" ry="7" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="220" y="111" fontFamily="Arial Black" fontSize="18" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>F</tspan>
            <animate attributeName="y" values="111;109;111" dur="2.2s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* O */}
        <g>
          <circle cx="250" cy="103" r="17" fill="url(#bubbleGrad3)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="103;101;103" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="r" values="17;18.5;17" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="247" cy="99" rx="5" ry="7" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="250" y="110" fontFamily="Arial Black" fontSize="18" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>O</tspan>
            <animate attributeName="y" values="110;108;110" dur="2.5s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* R */}
        <g>
          <circle cx="280" cy="105" r="16" fill="url(#bubbleGrad4)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="105;103;105" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="r" values="16;17.5;16" dur="2.8s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="277" cy="101" rx="5" ry="7" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="280" y="111" fontFamily="Arial Black" fontSize="18" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>R</tspan>
            <animate attributeName="y" values="111;109;111" dur="2.8s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* "MAS" - Bottom */}
        
        {/* M */}
        <g>
          <circle cx="210" cy="150" r="18" fill="url(#bubbleGrad5)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="150;148;150" dur="2.3s" repeatCount="indefinite" />
            <animate attributeName="r" values="18;19.5;18" dur="2.3s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="207" cy="145" rx="6" ry="8" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="210" y="157" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>M</tspan>
            <animate attributeName="y" values="157;155;157" dur="2.3s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* A */}
        <g>
          <circle cx="243" cy="148" r="19" fill="url(#bubbleGrad1)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="148;146;148" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="r" values="19;20.5;19" dur="2.6s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="240" cy="143" rx="6" ry="8" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="243" y="156" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>A</tspan>
            <animate attributeName="y" values="156;154;156" dur="2.6s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* S */}
        <g>
          <circle cx="275" cy="150" r="18" fill="url(#bubbleGrad2)" opacity="0.95" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
            <animate attributeName="cy" values="150;148;150" dur="2.9s" repeatCount="indefinite" />
            <animate attributeName="r" values="18;19.5;18" dur="2.9s" repeatCount="indefinite" />
          </circle>
          <ellipse cx="272" cy="145" rx="6" ry="8" fill="url(#bubbleShine)" opacity="0.9" />
          <text x="275" y="157" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
            <tspan>S</tspan>
            <animate attributeName="y" values="157;155;157" dur="2.9s" repeatCount="indefinite" />
          </text>
        </g>
        
        {/* Floating bubbles rising */}
        <circle cx="180" cy="180" r="5" fill="rgba(255,255,255,0.6)" stroke="rgba(255,255,255,0.8)" strokeWidth="1">
          <animate attributeName="cy" values="180;40" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" values="5;7;5" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="240" cy="175" r="6" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.7)" strokeWidth="1">
          <animate attributeName="cy" values="175;35" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0" dur="5s" repeatCount="indefinite" />
          <animate attributeName="r" values="6;8;6" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="290" cy="178" r="5" fill="rgba(255,255,255,0.6)" stroke="rgba(255,255,255,0.8)" strokeWidth="1">
          <animate attributeName="cy" values="178;38" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="5;9;5" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="180" r="6" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.7)" strokeWidth="1">
          <animate attributeName="cy" values="180;32" dur="5.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur="5.5s" repeatCount="indefinite" />
        </circle>
        
        {/* Glass shine */}
        <ellipse cx="190" cy="70" rx="20" ry="40" fill="rgba(255,255,255,0.12)" />
      </svg>
    </div>
  );
}
