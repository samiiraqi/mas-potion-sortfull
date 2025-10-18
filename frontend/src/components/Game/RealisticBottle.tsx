import { useEffect, useRef } from 'react';

interface RealisticBottleProps {
  colors: string[];
  position: { x: number; y: number };
  onSelect: () => void;
  isSelected: boolean;
  isEmpty: boolean;
  isFull?: boolean;
}

const COLOR_MAP: { [key: string]: string } = {
  red: '#FF3B3B',
  blue: '#3B82F6',
  green: '#10B981',
  purple: '#A855F7',
  yellow: '#FBBF24',
  orange: '#F97316',
  cyan: '#06B6D4',
  pink: '#EC4899',
  lime: '#84CC16',
  magenta: '#D946EF',
  teal: '#14B8A6',
  coral: '#FB7185'
};

export default function RealisticBottle({ colors, position, onSelect, isSelected, isEmpty, isFull }: RealisticBottleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let frame = 0;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const bottleLeft = 5;
      const bottleRight = 55;
      const bottleTop = 8;
      const bottleBottom = 152;
      const bottleWidth = bottleRight - bottleLeft;
      
      // Glass bottle with 3D effect
      const bottleGradient = ctx.createLinearGradient(bottleLeft, 0, bottleRight, 0);
      bottleGradient.addColorStop(0, 'rgba(200, 220, 255, 0.3)');
      bottleGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      bottleGradient.addColorStop(1, 'rgba(200, 220, 255, 0.3)');
      
      ctx.fillStyle = bottleGradient;
      ctx.beginPath();
      ctx.moveTo(bottleLeft, bottleTop);
      ctx.lineTo(bottleLeft, bottleBottom - 10);
      ctx.quadraticCurveTo(bottleLeft, bottleBottom, bottleLeft + 10, bottleBottom);
      ctx.lineTo(bottleRight - 10, bottleBottom);
      ctx.quadraticCurveTo(bottleRight, bottleBottom, bottleRight, bottleBottom - 10);
      ctx.lineTo(bottleRight, bottleTop);
      ctx.closePath();
      ctx.fill();
      
      // Glass border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      if (isEmpty) {
        // Glowing empty bottle
        const pulse = 0.5 + Math.sin(frame * 0.08) * 0.2;
        
        ctx.fillStyle = `rgba(255, 215, 0, ${pulse * 0.3})`;
        ctx.fillRect(bottleLeft + 3, bottleTop + 3, bottleWidth - 6, bottleBottom - bottleTop - 13);
        
        // "EMPTY" text
        ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('EMPTY', 30, 80);
        
        ctx.strokeStyle = `rgba(255, 215, 0, ${pulse})`;
        ctx.lineWidth = 3;
        ctx.strokeRect(bottleLeft + 3, bottleTop + 3, bottleWidth - 6, bottleBottom - bottleTop - 13);
        
      } else {
        // Draw liquid - FILLED TO THE BRIM!
        const liquidHeight = (bottleBottom - bottleTop - 10) / 4;
        
        colors.forEach((color, index) => {
          const hexColor = COLOR_MAP[color];
          
          // Each layer position
          const layerTop = bottleBottom - 8 - (index + 1) * liquidHeight;
          
          // Gradient for depth
          const liquidGrad = ctx.createLinearGradient(bottleLeft + 5, layerTop, bottleRight - 5, layerTop);
          liquidGrad.addColorStop(0, hexColor + 'E6');
          liquidGrad.addColorStop(0.3, hexColor);
          liquidGrad.addColorStop(0.7, hexColor);
          liquidGrad.addColorStop(1, hexColor + 'E6');
          
          ctx.fillStyle = liquidGrad;
          ctx.fillRect(bottleLeft + 3, layerTop, bottleWidth - 6, liquidHeight);
          
          // Wave animation on top layer
          if (index === colors.length - 1) {
            ctx.fillStyle = hexColor;
            ctx.beginPath();
            ctx.moveTo(bottleLeft + 3, layerTop);
            
            for (let x = bottleLeft + 3; x <= bottleRight - 3; x += 2) {
              const progress = (x - bottleLeft - 3) / (bottleWidth - 6);
              const wave = Math.sin(progress * Math.PI * 5 + frame * 0.12) * 2;
              ctx.lineTo(x, layerTop + wave);
            }
            
            ctx.lineTo(bottleRight - 3, layerTop + 8);
            ctx.lineTo(bottleLeft + 3, layerTop + 8);
            ctx.closePath();
            ctx.fill();
            
            // Sparkle effect
            const sparkle = ctx.createRadialGradient(bottleLeft + 20, layerTop + 5, 0, bottleLeft + 20, layerTop + 5, 15);
            sparkle.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            sparkle.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = sparkle;
            ctx.fillRect(bottleLeft + 10, layerTop, 20, 15);
          }
        });
        
        // If bottle is full, add special glow
        if (isFull) {
          const glowPulse = 0.3 + Math.sin(frame * 0.1) * 0.2;
          ctx.strokeStyle = `rgba(255, 215, 0, ${glowPulse})`;
          ctx.lineWidth = 4;
          ctx.strokeRect(bottleLeft, bottleTop, bottleWidth, bottleBottom - bottleTop);
        }
      }
      
      // Strong glass shine
      const shine = ctx.createLinearGradient(bottleLeft + 8, 0, bottleLeft + 18, 0);
      shine.addColorStop(0, 'rgba(255, 255, 255, 0)');
      shine.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
      shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = shine;
      ctx.fillRect(bottleLeft + 8, bottleTop + 10, 10, bottleBottom - bottleTop - 20);
      
      frame++;
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [colors, isEmpty, isFull]);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: 'pointer'
      }}
      onClick={onSelect}
    >
      <canvas
        ref={canvasRef}
        width={60}
        height={160}
        style={{
          display: 'block',
          filter: isSelected ? 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.9))' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
        }}
      />
    </div>
  );
}
