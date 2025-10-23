import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface MagicParticlesProps {
  flaskPositions: Array<{ x: number; y: number }>;
}

export default function MagicParticles({ flaskPositions }: MagicParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate sparkles around each flask
      const newParticles: Particle[] = [];
      
      flaskPositions.forEach((pos) => {
        for (let i = 0; i < 2; i++) {
          newParticles.push({
            id: Date.now() + Math.random(),
            x: pos.x + 30 + (Math.random() - 0.5) * 60,
            y: pos.y + 80 + (Math.random() - 0.5) * 100,
            vx: (Math.random() - 0.5) * 2,
            vy: -1 - Math.random() * 2,
            life: 1,
            color: ['#FFD700', '#FF69B4', '#00CED1', '#9370DB'][Math.floor(Math.random() * 4)]
          });
        }
      });

      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life - 0.02
        })).filter(p => p.life > 0);
        
        return [...updated, ...newParticles].slice(-100); // Keep max 100 particles
      });
    }, 50);

    return () => clearInterval(interval);
  }, [flaskPositions]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: p.color,
            opacity: p.life,
            boxShadow: `0 0 8px ${p.color}`,
            transition: 'all 0.05s linear'
          }}
        />
      ))}
    </div>
  );
}
