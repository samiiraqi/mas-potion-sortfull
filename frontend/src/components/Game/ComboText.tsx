interface ComboTextProps {
  text: string;
  x: number;
  y: number;
  onComplete: () => void;
}

export default function ComboText({ text, x, y, onComplete }: ComboTextProps) {
  setTimeout(onComplete, 1500);

  const colors = ['#FF6B9D', '#4FACFE', '#43E97B', '#FFA726', '#A855F7'];
  
  return (
    <div style={{
      position: 'fixed',
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
      zIndex: 10000,
      pointerEvents: 'none',
      animation: 'comboPopup 1.5s ease-out'
    }}>
      <div style={{
        fontSize: 'clamp(2rem, 8vw, 4rem)',
        fontWeight: 'bold',
        background: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textShadow: '0 0 30px rgba(255,255,255,0.8)',
        animation: 'rainbowShift 0.5s ease infinite',
        filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))'
      }}>
        {text}
      </div>

      <style>{`
        @keyframes comboPopup {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
          40% { transform: translate(-50%, -50%) scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -80%) scale(0.8); }
        }
        @keyframes rainbowShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}
