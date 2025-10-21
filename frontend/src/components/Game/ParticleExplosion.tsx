import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
}

interface ParticleExplosionProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

export default function ParticleExplosion({ x, y, color, onComplete }: ParticleExplosionProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create particles
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const speed = 3 + Math.random() * 4;
      newParticles.push({
        id: i,
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: color,
        size: 4 + Math.random() * 6
      });
    }
    setParticles(newParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.3, // Gravity
          vx: p.vx * 0.98 // Air resistance
        }))
      );
    }, 16);

    // Clean up
    setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, 1000);

    return () => clearInterval(interval);
  }, [x, y, color, onComplete]);

  const colorMap: { [key: string]: string } = {
    red: '#FF3B3B', blue: '#3B82F6', green: '#10B981', yellow: '#FBBF24',
    purple: '#A855F7', orange: '#F97316', cyan: '#06B6D4', pink: '#EC4899',
    lime: '#84CC16', magenta: '#D946EF', teal: '#14B8A6', coral: '#FB7185'
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: colorMap[p.color] || p.color,
            boxShadow: `0 0 ${p.size * 2}px ${colorMap[p.color] || p.color}`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.9
          }}
        />
      ))}

      {/* Star burst */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`star-${i}`}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: '3px',
            height: '40px',
            background: `linear-gradient(to bottom, ${colorMap[color] || color}, transparent)`,
            transform: `translate(-50%, -50%) rotate(${i * 60}deg)`,
            animation: 'starFade 0.6s ease-out',
            transformOrigin: 'center top'
          }}
        />
      ))}

      <style>{`
        @keyframes starFade {
          0% { opacity: 1; transform: translate(-50%, -50%) rotate(var(--rotation)) scale(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%, -50%) rotate(var(--rotation)) scale(1.5); }
        }
      `}</style>
    </div>
  );
}
