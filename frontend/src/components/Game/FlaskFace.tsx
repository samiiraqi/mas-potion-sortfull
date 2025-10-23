interface FlaskFaceProps {
  x: number;
  y: number;
  isSelected: boolean;
  isEmpty: boolean;
  isFull: boolean;
  isPouring?: boolean;
}

export default function FlaskFace({ x, y, isSelected, isEmpty, isFull, isPouring }: FlaskFaceProps) {
  const getExpression = () => {
    if (isFull) return 'happy';
    if (isPouring) return 'excited';
    if (isSelected) return 'nervous';
    if (isEmpty) return 'sleepy';
    return 'neutral';
  };

  const expression = getExpression();

  const getEyes = () => {
    switch (expression) {
      case 'happy':
        return { left: '^', right: '^', color: '#FFD700' };
      case 'excited':
        return { left: 'O', right: 'O', color: '#4ECDC4' };
      case 'nervous':
        return { left: '@', right: '@', color: '#FF6B6B' };
      case 'sleepy':
        return { left: '-', right: '-', color: '#999' };
      default:
        return { left: '•', right: '•', color: '#333' };
    }
  };

  const getMouth = () => {
    switch (expression) {
      case 'happy':
        return { shape: 'U', color: '#FFD700' };
      case 'excited':
        return { shape: 'O', color: '#FF69B4' };
      case 'nervous':
        return { shape: '~', color: '#FF6B6B' };
      case 'sleepy':
        return { shape: '_', color: '#999' };
      default:
        return { shape: '-', color: '#666' };
    }
  };

  const eyes = getEyes();
  const mouth = getMouth();

  return (
    <div style={{
      position: 'absolute',
      left: x + 15,
      top: y + 40,
      width: '30px',
      height: '40px',
      pointerEvents: 'none',
      zIndex: 10,
      animation: isPouring ? 'bounce 0.5s ease-in-out' : 'none'
    }}>
      {/* Left Eye */}
      <div style={{
        position: 'absolute',
        left: '8px',
        top: '10px',
        fontSize: '10px',
        fontWeight: 'bold',
        color: eyes.color,
        textShadow: `0 0 4px ${eyes.color}`,
        animation: 'blink 3s infinite'
      }}>
        {eyes.left}
      </div>

      {/* Right Eye */}
      <div style={{
        position: 'absolute',
        right: '8px',
        top: '10px',
        fontSize: '10px',
        fontWeight: 'bold',
        color: eyes.color,
        textShadow: `0 0 4px ${eyes.color}`,
        animation: 'blink 3s infinite'
      }}>
        {eyes.right}
      </div>

      {/* Mouth */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: '22px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: mouth.color,
        textShadow: `0 0 4px ${mouth.color}`
      }}>
        {mouth.shape}
      </div>

      {/* Love hearts when full */}
      {isFull && (
        <>
          <div style={{
            position: 'absolute',
            left: '-5px',
            top: '5px',
            fontSize: '8px',
            animation: 'heartFloat 2s ease-in-out infinite'
          }}>💕</div>
          <div style={{
            position: 'absolute',
            right: '-5px',
            top: '5px',
            fontSize: '8px',
            animation: 'heartFloat 2s ease-in-out infinite 0.5s'
          }}>💕</div>
        </>
      )}

      <style>{`
        @keyframes blink {
          0%, 48%, 52%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes heartFloat {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { transform: translateY(-10px) scale(1); opacity: 1; }
          100% { transform: translateY(-20px) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
