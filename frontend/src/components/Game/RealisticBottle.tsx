import { useEffect, useRef } from 'react';

interface RealisticBottleProps {
  colors: string[];
  position: { x: number; y: number };
  onSelect: () => void;
  isSelected: boolean;
  isEmpty: boolean;
}

const COLOR_MAP: { [key: string]: string } = {
  red: '#FF6B6B',
  blue: '#4ECDC4',
  green: '#95E1D3',
  purple: '#C77DFF',
  yellow: '#FFD93D',
  orange: '#FF9A76',
  cyan: '#6BCF7F',
  pink: '#FF85B3',
  lime: '#B8E986',
  magenta: '#E056FD',
  teal: '#38B6C4',
  coral: '#FF7F8F'
};

export default function RealisticBottle({ colors, position, onSelect, isSelected, isEmpty }: RealisticBottleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId: number;
    let frame = 0;
    
    const draw = () => {
      // CLEAR EVERYTHING FIRST
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Bottle dimensions - FULL WIDTH
      const bottleLeft = 8;
      const bottleRight = 52;
      const bottleTop = 12;
      const bottleBottom = 148;
      const bottleWidth = bottleRight - bottleLeft; // 44 pixels wide
      
      // Draw glass bottle outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(bottleLeft, bottleTop);
      ctx.lineTo(bottleLeft, bottleBottom - 8);
      ctx.quadraticCurveTo(bottleLeft, bottleBottom + 2, bottleLeft + 8, bottleBottom + 2);
      ctx.lineTo(bottleRight - 8, bottleBottom + 2);
      ctx.quadraticCurveTo(bottleRight, bottleBottom + 2, bottleRight, bottleBottom - 8);
      ctx.lineTo(bottleRight, bottleTop);
      ctx.stroke();
      
      if (isEmpty) {
        // Empty bottle glow
        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
        ctx.fillRect(bottleLeft + 2, bottleTop + 2, bottleWidth - 4, bottleBottom - bottleTop - 6);
        
        const pulse = 0.3 + Math.sin(frame * 0.05) * 0.1;
        ctx.strokeStyle = `rgba(255, 215, 0, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(bottleLeft + 2, bottleTop + 2, bottleWidth - 4, bottleBottom - bottleTop - 6);
      } else {
        // Draw liquid layers - FULL WIDTH RECTANGLES!
        const totalHeight = bottleBottom - bottleTop - 10;
        const layerHeight = totalHeight / 4;
        
        colors.forEach((color, index) => {
          const hexColor = COLOR_MAP[color];
          
          // Calculate Y position for this layer
          const layerBottom = bottleBottom - 4;
          const layerTop = layerBottom - (index + 1) * layerHeight;
          
          // FULL WIDTH RECTANGLE - no triangles!
          ctx.fillStyle = hexColor + 'F0';
          
          ctx.beginPath();
          ctx.rect(
            bottleLeft + 2,           // Left edge
            layerTop,                  // Top
            bottleWidth - 4,          // FULL WIDTH
            layerHeight               // Height
          );
          ctx.fill();
          
          // Add wave ONLY on top layer
          if (index === colors.length - 1) {
            // Draw wave on top
            ctx.fillStyle = hexColor + 'F0';
            ctx.beginPath();
            ctx.moveTo(bottleLeft + 2, layerTop);
            
            // Animated wave
            for (let x = bottleLeft + 2; x <= bottleRight - 2; x += 2) {
              const progress = (x - bottleLeft - 2) / (bottleWidth - 4);
              const wave = Math.sin(progress * Math.PI * 4 + frame * 0.1) * 2.5;
              ctx.lineTo(x, layerTop + wave);
            }
            
            ctx.lineTo(bottleRight - 2, layerTop);
            ctx.lineTo(bottleRight - 2, layerTop + 10);
            ctx.lineTo(bottleLeft + 2, layerTop + 10);
            ctx.closePath();
            ctx.fill();
            
            // Shine on water surface
            const shimmer = ctx.createLinearGradient(bottleLeft + 10, layerTop, bottleLeft + 25, layerTop);
            shimmer.addColorStop(0, 'rgba(255, 255, 255, 0)');
            shimmer.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
            shimmer.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = shimmer;
            ctx.fillRect(bottleLeft + 10, layerTop - 2, 15, 15);
          }
        });
      }
      
      // Glass shine
      const glassShine = ctx.createLinearGradient(bottleLeft + 5, 0, bottleLeft + 12, 0);
      glassShine.addColorStop(0, 'rgba(255, 255, 255, 0)');
      glassShine.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      glassShine.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glassShine;
      ctx.fillRect(bottleLeft + 5, bottleTop + 8, 7, bottleBottom - bottleTop - 16);
      
      frame++;
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [colors, isEmpty]);
  
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: 'pointer',
        filter: isSelected ? 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))' : 'none'
      }}
      onClick={onSelect}
    >
      <canvas
        ref={canvasRef}
        width={60}
        height={160}
        style={{
          display: 'block'
        }}
      />
    </div>
  );
}
