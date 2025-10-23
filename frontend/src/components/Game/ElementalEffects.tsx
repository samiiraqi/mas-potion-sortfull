interface ElementalEffectsProps {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  intensity?: number;
}

export default function ElementalEffects({ color, x, y, width, height, intensity = 1 }: ElementalEffectsProps) {
  const getElementType = (color: string): string => {
    const lowerColor = color.toLowerCase();
    if (lowerColor.includes('red') || lowerColor === '#ff0000' || lowerColor === '#dc143c') return 'fire';
    if (lowerColor.includes('blue') || lowerColor === '#0000ff' || lowerColor === '#1e90ff') return 'water';
    if (lowerColor.includes('yellow') || lowerColor === '#ffff00' || lowerColor === '#ffd700') return 'lightning';
    if (lowerColor.includes('green') || lowerColor === '#00ff00' || lowerColor === '#32cd32') return 'nature';
    if (lowerColor.includes('cyan') || lowerColor === '#00ffff' || lowerColor === '#00ced1') return 'ice';
    if (lowerColor.includes('purple') || lowerColor === '#800080' || lowerColor === '#9370db') return 'dark';
    if (lowerColor.includes('orange') || lowerColor === '#ffa500') return 'fire';
    return 'none';
  };

  const element = getElementType(color);

  // Fire particles
  if (element === 'fire') {
    return (
      <>
        {/* Rising flames */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`flame-${i}`}
            style={{
              position: 'absolute',
              left: x + width * 0.3 + (i * width * 0.2),
              top: y + height * 0.5,
              width: '6px',
              height: '12px',
              background: 'linear-gradient(to top, #ff4500, #ff6347, transparent)',
              borderRadius: '50% 50% 0 0',
              animation: `flameRise ${1 + i * 0.3}s ease-in-out infinite`,
              opacity: 0.8 * intensity
            }}
          />
        ))}
        
        {/* Embers */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`ember-${i}`}
            style={{
              position: 'absolute',
              left: x + Math.random() * width,
              top: y + height * 0.6,
              width: '3px',
              height: '3px',
              background: '#ff6347',
              borderRadius: '50%',
              boxShadow: '0 0 4px #ff4500',
              animation: `emberFloat ${2 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.7 * intensity
            }}
          />
        ))}

        <style>{`
          @keyframes flameRise {
            0% { transform: translateY(0) scale(1); opacity: 0.8; }
            50% { transform: translateY(-15px) scale(1.2); opacity: 0.6; }
            100% { transform: translateY(-30px) scale(0.5); opacity: 0; }
          }
          
          @keyframes emberFloat {
            0% { transform: translateY(0); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-40px); opacity: 0; }
          }
        `}</style>
      </>
    );
  }

  // Water bubbles
  if (element === 'water') {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <div
            key={`bubble-${i}`}
            style={{
              position: 'absolute',
              left: x + width * 0.2 + (i * width * 0.2),
              top: y + height * 0.7,
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(173,216,230,0.3))',
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.3)',
              animation: `bubbleRise ${2 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.6 * intensity
            }}
          />
        ))}

        <style>{`
          @keyframes bubbleRise {
            0% { transform: translateY(0) scale(0.8); opacity: 0; }
            50% { transform: translateY(-20px) scale(1); opacity: 0.8; }
            100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
          }
        `}</style>
      </>
    );
  }

  // Lightning sparks
  if (element === 'lightning') {
    return (
      <>
        {[...Array(6)].map((_, i) => (
          <div
            key={`spark-${i}`}
            style={{
              position: 'absolute',
              left: x + width * 0.5,
              top: y + height * 0.5,
              width: '2px',
              height: `${8 + Math.random() * 8}px`,
              background: 'linear-gradient(to bottom, #ffff00, transparent)',
              boxShadow: '0 0 6px #ffff00',
              transform: `rotate(${i * 60}deg)`,
              transformOrigin: 'center',
              animation: `sparkle ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
              opacity: 0.8 * intensity
            }}
          />
        ))}

        <style>{`
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1.5); }
          }
        `}</style>
      </>
    );
  }

  // Nature leaves
  if (element === 'nature') {
    return (
      <>
        {[...Array(4)].map((_, i) => (
          <div
            key={`leaf-${i}`}
            style={{
              position: 'absolute',
              left: x + width * 0.3 + (i * width * 0.15),
              top: y + height * 0.8,
              width: '8px',
              height: '12px',
              background: 'linear-gradient(135deg, #228b22, #90ee90)',
              borderRadius: '0 50% 50% 50%',
              transform: 'rotate(-45deg)',
              animation: `leafFloat ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
              opacity: 0.7 * intensity
            }}
          />
        ))}

        <style>{`
          @keyframes leafFloat {
            0% { transform: translateY(0) rotate(-45deg); opacity: 0; }
            50% { transform: translateY(-25px) rotate(-25deg); opacity: 0.8; }
            100% { transform: translateY(-50px) rotate(-5deg); opacity: 0; }
          }
        `}</style>
      </>
    );
  }

  // Ice crystals
  if (element === 'ice') {
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <div
            key={`crystal-${i}`}
            style={{
              position: 'absolute',
              left: x + width * 0.2 + (i * width * 0.15),
              top: y + height * 0.4 + (Math.random() * height * 0.3),
              width: '6px',
              height: '6px',
              background: 'rgba(173,216,230,0.8)',
              boxShadow: '0 0 8px rgba(173,216,230,0.8)',
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              animation: `crystalShine ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              opacity: 0.6 * intensity
            }}
          />
        ))}

        <style>{`
          @keyframes crystalShine {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.4; }
            50% { transform: scale(1.3) rotate(180deg); opacity: 1; }
          }
        `}</style>
      </>
    );
  }

  // Dark magic
  if (element === 'dark') {
    return (
      <>
        {[...Array(6)].map((_, i) => (
          <div
            key={`shadow-${i}`}
            style={{
              position: 'absolute',
              left: x + width * 0.5,
              top: y + height * 0.5,
              width: `${10 + i * 5}px`,
              height: `${10 + i * 5}px`,
              background: `radial-gradient(circle, rgba(138,43,226,${0.3 - i * 0.05}), transparent)`,
              borderRadius: '50%',
              animation: `darkPulse ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              opacity: 0.5 * intensity
            }}
          />
        ))}

        <style>{`
          @keyframes darkPulse {
            0%, 100% { transform: scale(1); opacity: 0.2; }
            50% { transform: scale(1.5); opacity: 0.6; }
          }
        `}</style>
      </>
    );
  }

  return null;
}
