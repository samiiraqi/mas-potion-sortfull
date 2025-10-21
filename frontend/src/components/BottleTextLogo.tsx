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
          <linearGradient id="bubbleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FF6B9D', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#FEC163', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFC371', stopOpacity: 1 }} />
          </linearGradient>
          
          <linearGradient id="bubbleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4FACFE', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#00F2FE', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#43E97B', stopOpacity: 1 }} />
          </linearGradient>
          
          <linearGradient id="bubbleGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FA709A', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#FEE140', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#30CFD0', stopOpacity: 1 }} />
          </linearGradient>
          
          <linearGradient id="bubbleGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#A8EDEA', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#FED6E3', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#A8EDEA', stopOpacity: 1 }} />
          </linearGradient>
          
          <linearGradient id="bubbleGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FF9A8B', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#FF6A88', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FF99AC', stopOpacity: 1 }} />
          </linearGradient>
          
          {/* Bottle outline gradient */}
          <linearGradient id="bottleOutline" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.5)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(200,230,255,0.4)' }} />
          </linearGradient>
          
          {/* Liquid background */}
          <linearGradient id="liquidBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 0.2 }} />
          </linearGradient>
          
          {/* Bubble shine effect */}
          <radialGradient id="bubbleShine">
            <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.8)' }} />
            <stop offset="70%" style={{ stopColor: 'rgba(255,255,255,0.2)' }} />
            <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)' }} />
          </radialGradient>
        </defs>
        
        {/* Bottle shape outline */}
        <path
          d="M 180 15 L 180 30 C 180 30 165 40 165 55 L 165 170 C 165 178 170 185 190 185 L 310 185 C 330 185 335 178 335 170 L 335 55 C 335 40 320 30 320 30 L 320 15 C 320 10 315 5 310 5 L 190 5 C 185 5 180 10 180 15 Z"
          fill="url(#liquidBg)"
          stroke="url(#bottleOutline)"
          strokeWidth="3"
          opacity="0.6"
        />
        
        {/* Bottle cap */}
        <rect x="210" y="3" width="80" height="8" rx="3" fill="#E74C3C" opacity="0.8" />
        
        {/* "BOTTLE" - Each letter as a colorful bubble */}
        
        {/* B */}
        <circle cx="195" cy="60" r="16" fill="url(#bubbleGrad1)" opacity="0.95">
          <animate attributeName="r" values="16;18;16" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="192" cy="55" r="5" fill="url(#bubbleShine)" />
        <text x="195" y="67" fontFamily="Arial Black" fontSize="22" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>B</text>
        
        {/* O */}
        <circle cx="225" cy="58" r="17" fill="url(#bubbleGrad2)" opacity="0.95">
          <animate attributeName="r" values="17;19;17" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="222" cy="53" r="5" fill="url(#bubbleShine)" />
        <text x="225" y="65" fontFamily="Arial Black" fontSize="22" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>O</text>
        
        {/* T */}
        <circle cx="255" cy="60" r="16" fill="url(#bubbleGrad3)" opacity="0.95">
          <animate attributeName="r" values="16;18;16" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="252" cy="55" r="5" fill="url(#bubbleShine)" />
        <text x="255" y="67" fontFamily="Arial Black" fontSize="22" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>T</text>
        
        {/* T */}
        <circle cx="283" cy="58" r="17" fill="url(#bubbleGrad4)" opacity="0.95">
          <animate attributeName="r" values="17;19;17" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="280" cy="53" r="5" fill="url(#bubbleShine)" />
        <text x="283" y="65" fontFamily="Arial Black" fontSize="22" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>T</text>
        
        {/* L */}
        <circle cx="310" cy="60" r="16" fill="url(#bubbleGrad5)" opacity="0.95">
          <animate attributeName="r" values="16;18;16" dur="2.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="307" cy="55" r="5" fill="url(#bubbleShine)" />
        <text x="310" y="67" fontFamily="Arial Black" fontSize="22" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>L</text>
        
        {/* E */}
        <circle cx="335" cy="58" r="17" fill="url(#bubbleGrad1)" opacity="0.95">
          <animate attributeName="r" values="17;19;17" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="332" cy="53" r="5" fill="url(#bubbleShine)" />
        <text x="335" y="65" fontFamily="Arial Black" fontSize="22" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>E</text>
        
        {/* "FOR" - Middle section */}
        
        {/* F */}
        <circle cx="225" cy="105" r="15" fill="url(#bubbleGrad2)" opacity="0.95">
          <animate attributeName="r" values="15;17;15" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="222" cy="101" r="4" fill="url(#bubbleShine)" />
        <text x="225" y="111" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>F</text>
        
        {/* O */}
        <circle cx="255" cy="103" r="16" fill="url(#bubbleGrad3)" opacity="0.95">
          <animate attributeName="r" values="16;18;16" dur="2.3s" repeatCount="indefinite" />
        </circle>
        <circle cx="252" cy="99" r="4" fill="url(#bubbleShine)" />
        <text x="255" y="110" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>O</text>
        
        {/* R */}
        <circle cx="283" cy="105" r="15" fill="url(#bubbleGrad4)" opacity="0.95">
          <animate attributeName="r" values="15;17;15" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="280" cy="101" r="4" fill="url(#bubbleShine)" />
        <text x="283" y="111" fontFamily="Arial Black" fontSize="20" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>R</text>
        
        {/* "MAS" - Bottom section */}
        
        {/* M */}
        <circle cx="220" cy="150" r="17" fill="url(#bubbleGrad5)" opacity="0.95">
          <animate attributeName="r" values="17;19;17" dur="2.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="217" cy="145" r="5" fill="url(#bubbleShine)" />
        <text x="220" y="157" fontFamily="Arial Black" fontSize="22" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>M</text>
        
        {/* A */}
        <circle cx="253" cy="148" r="18" fill="url(#bubbleGrad1)" opacity="0.95">
          <animate attributeName="r" values="18;20;18" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="143" r="5" fill="url(#bubbleShine)" />
        <text x="253" y="156" fontFamily="Arial Black" fontSize="22" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>A</text>
        
        {/* S */}
        <circle cx="285" cy="150" r="17" fill="url(#bubbleGrad2)" opacity="0.95">
          <animate attributeName="r" values="17;19;17" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx="282" cy="145" r="5" fill="url(#bubbleShine)" />
        <text x="285" y="157" fontFamily="Arial Black" fontSize="22" fontWeight="bold" textAnchor="middle" fill="white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>S</text>
        
        {/* Floating bubbles rising */}
        <circle cx="190" cy="180" r="4" fill="rgba(255,255,255,0.6)">
          <animate attributeName="cy" values="180;50" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite" />
          <animate attributeName="r" values="4;6;4" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="240" cy="175" r="5" fill="rgba(255,255,255,0.5)">
          <animate attributeName="cy" values="175;40" dur="5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="280" cy="178" r="4" fill="rgba(255,255,255,0.6)">
          <animate attributeName="cy" values="178;45" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.8;0" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="r" values="4;7;4" dur="4.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="180" r="5" fill="rgba(255,255,255,0.5)">
          <animate attributeName="cy" values="180;35" dur="5.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur="5.5s" repeatCount="indefinite" />
        </circle>
        
        {/* Glass shine effect */}
        <ellipse cx="200" cy="70" rx="18" ry="35" fill="rgba(255,255,255,0.15)" />
      </svg>
    </div>
  );
}
