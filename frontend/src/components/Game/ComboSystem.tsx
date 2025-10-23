import { useEffect, useState } from 'react';

interface ComboSystemProps {
  comboCount: number;
  onComboEnd: () => void;
}

export default function ComboSystem({ comboCount, onComboEnd }: ComboSystemProps) {
  const [visible, setVisible] = useState(false);
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    if (comboCount > 1) {
      setVisible(true);
      setMultiplier(Math.min(comboCount, 10));

      const timeout = setTimeout(() => {
        setVisible(false);
        onComboEnd();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [comboCount, onComboEnd]);

  if (!visible || comboCount < 2) return null;

  const getMessage = () => {
    if (comboCount >= 5) return '🔥 ON FIRE! 🔥';
    if (comboCount >= 3) return '⚡ AMAZING! ⚡';
    return '✨ GREAT! ✨';
  };

  return (
    <div style={{
      position: 'fixed',
      top: '30%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10000,
      textAlign: 'center',
      animation: 'comboPopIn 0.3s ease-out'
    }}>
      <div style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        color: '#FFD700',
        textShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.6)',
        marginBottom: '10px',
        animation: 'pulse 0.5s ease-in-out infinite'
      }}>
        {multiplier}x
      </div>
      
      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 0 10px rgba(255,255,255,0.8)',
        background: 'linear-gradient(135deg, #FF6B6B, #FFD93D)',
        padding: '10px 30px',
        borderRadius: '20px',
        animation: 'shake 0.5s ease-in-out'
      }}>
        {getMessage()}
      </div>

      <div style={{
        fontSize: '1.5rem',
        color: 'white',
        marginTop: '10px',
        opacity: 0.9
      }}>
        {comboCount} COMBO!
      </div>

      <style>{`
        @keyframes comboPopIn {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
