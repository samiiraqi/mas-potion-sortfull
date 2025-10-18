import { useState, useEffect, useRef } from 'react';
import { gameAPI } from '../../services/api';
import type { Level } from '../../types/game.tsx';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

const COLOR_MAP: { [key: string]: string } = {
  red: '#E74C3C',
  blue: '#3498DB',
  green: '#2ECC71',
  purple: '#9B59B6',
  yellow: '#F39C12',
  orange: '#E67E22',
  cyan: '#1ABC9C',
  pink: '#E91E63',
  lime: '#8BC34A',
  magenta: '#9C27B0',
  teal: '#00BCD4',
  coral: '#FF7043'
};

interface DragState {
  bottleIdx: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export default function WaterSort2D() {
  const [level, setLevel] = useState<Level | null>(null);
  const [bottles, setBottles] = useState<string[][]>([]);
  const [displayBottles, setDisplayBottles] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState('');
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [hoverBottle, setHoverBottle] = useState<number | null>(null);
  const [isPouring, setIsPouring] = useState(false);
  const [liquidHeights, setLiquidHeights] = useState<{[key: number]: number}>({});
  
  const bottleRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    loadLevel(currentLevelId);
  }, [currentLevelId]);

  useEffect(() => {
    if (dragState && hoverBottle !== null && hoverBottle !== dragState.bottleIdx) {
      if (!isPouring) startPouring();
    } else {
      if (isPouring) stopPouring();
    }
    
    return () => { stopPouring(); };
  }, [dragState, hoverBottle]);

  const loadLevel = async (levelId: number) => {
    try {
      setLoading(true);
      const data = await gameAPI.getLevel(levelId);
      setLevel(data);
      setBottles(data.bottles);
      setDisplayBottles(data.bottles);
      setMoves(0);
      setIsComplete(false);
      setMessage('');
      
      const heights: {[key: number]: number} = {};
      data.bottles.forEach((bottle, idx) => {
        heights[idx] = bottle.length;
      });
      setLiquidHeights(heights);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startPouring = () => {
    if (isPouring || !dragState || hoverBottle === null) return;
    
    setIsPouring(true);
    setDisplayBottles([...bottles]);
    
    let sourceLevel = bottles[dragState.bottleIdx].length;
    let targetLevel = bottles[hoverBottle].length;
    
    const pourStep = () => {
      if (!dragState || hoverBottle === null) return;
      
      const from = dragState.bottleIdx;
      const to = hoverBottle;
      
      setLiquidHeights(prev => {
        const newHeights = { ...prev };
        
        if (newHeights[from] > sourceLevel - 1) {
          newHeights[from] -= 0.06;
        }
        
        if (newHeights[to] < targetLevel + 1) {
          newHeights[to] += 0.06;
        }
        
        return newHeights;
      });
      
      const currentSourceHeight = liquidHeights[from] || sourceLevel;
      const currentTargetHeight = liquidHeights[to] || targetLevel;
      
      if (currentSourceHeight <= sourceLevel - 0.94 && currentTargetHeight >= targetLevel + 0.94) {
        setDisplayBottles(prev => {
          const newBottles = prev.map(b => [...b]);
          
          if (newBottles[from].length === 0) {
            stopPouring();
            return prev;
          }
          
          if (newBottles[to].length >= 4) {
            stopPouring();
            return prev;
          }
          
          const sourceColor = newBottles[from][newBottles[from].length - 1];
          const targetColor = newBottles[to].length > 0 ? newBottles[to][newBottles[to].length - 1] : null;
          
          if (targetColor && targetColor !== sourceColor) {
            stopPouring();
            return prev;
          }
          
          const color = newBottles[from].pop();
          if (color) {
            newBottles[to].push(color);
          }
          
          sourceLevel = newBottles[from].length;
          targetLevel = newBottles[to].length;
          
          setLiquidHeights(prev => ({
            ...prev,
            [from]: sourceLevel,
            [to]: targetLevel
          }));
          
          if (newBottles[from].length > 0) {
            const nextColor = newBottles[from][newBottles[from].length - 1];
            if (nextColor !== sourceColor) {
              stopPouring();
              return newBottles;
            }
          } else {
            stopPouring();
            return newBottles;
          }
          
          return newBottles;
        });
      }
      
      animationFrameRef.current = requestAnimationFrame(pourStep);
    };
    
    animationFrameRef.current = requestAnimationFrame(pourStep);
  };

  const stopPouring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsPouring(false);
  };

  const handleMouseDown = (e: React.MouseEvent, bottleIdx: number) => {
    if (isComplete || bottles[bottleIdx].length === 0) return;
    
    const target = bottleRefs.current[bottleIdx];
    if (!target) return;
    
    setDragState({
      bottleIdx,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;
    
    setDragState({
      ...dragState,
      currentX: e.clientX,
      currentY: e.clientY
    });

    for (const [idx, ref] of Object.entries(bottleRefs.current)) {
      if (ref && parseInt(idx) !== dragState.bottleIdx) {
        const rect = ref.getBoundingClientRect();
        if (
          e.clientX >= rect.left - 25 &&
          e.clientX <= rect.right + 25 &&
          e.clientY >= rect.top - 25 &&
          e.clientY <= rect.bottom + 25
        ) {
          setHoverBottle(parseInt(idx));
          return;
        }
      }
    }
    setHoverBottle(null);
  };

  const handleMouseUp = async () => {
    if (!dragState) return;

    stopPouring();
    
    const fromIdx = dragState.bottleIdx;
    const toIdx = hoverBottle;

    if (toIdx !== null && toIdx !== fromIdx) {
      try {
        const res = await axios.post(`${API_URL}/api/v1/make-move`, {
          bottles: displayBottles,
          from_bottle: fromIdx,
          to_bottle: toIdx
        });

        if (res.data.success) {
          setBottles(res.data.bottles);
          setDisplayBottles(res.data.bottles);
          
          const heights: {[key: number]: number} = {};
          res.data.bottles.forEach((bottle: string[], idx: number) => {
            heights[idx] = bottle.length;
          });
          setLiquidHeights(heights);
          
          setMoves(m => m + 1);
          
          if (res.data.is_completed) {
            setIsComplete(true);
            setMessage('🎉 Perfect! Level Complete! 🎉');
          }
        }
      } catch (error) {
        setDisplayBottles([...bottles]);
        
        const heights: {[key: number]: number} = {};
        bottles.forEach((bottle, idx) => {
          heights[idx] = bottle.length;
        });
        setLiquidHeights(heights);
      }
    } else {
      setDisplayBottles([...bottles]);
    }

    setDragState(null);
    setHoverBottle(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px', animation: 'bounce 1s infinite' }}>💧</div>
          Loading...
        </div>
      </div>
    );
  }

  if (!level) return null;

  const COLS = 7;
  const rows: string[][][] = [];
  for (let i = 0; i < displayBottles.length; i += COLS) {
    rows.push(displayBottles.slice(i, i + COLS));
  }

  let tiltAngle = 0;
  let streamPath = '';
  let streamColor = '';
  
  if (dragState && hoverBottle !== null) {
    const dx = dragState.currentX - dragState.startX;
    tiltAngle = Math.min(Math.max(dx * 0.6, -45), 45);
    
    const targetRef = bottleRefs.current[hoverBottle];
    if (targetRef && isPouring && displayBottles[dragState.bottleIdx]?.length > 0) {
      const targetRect = targetRef.getBoundingClientRect();
      const fromX = dragState.currentX + (tiltAngle > 0 ? 22 : -22);
      const fromY = dragState.currentY + 28;
      const toX = targetRect.left + targetRect.width / 2;
      const toY = targetRect.top + 25;
      
      const midX = (fromX + toX) / 2;
      const midY = fromY + Math.abs(toY - fromY) * 0.5;
      
      streamPath = `M ${fromX} ${fromY} Q ${midX} ${midY}, ${toX} ${toY}`;
      streamColor = displayBottles[dragState.bottleIdx][displayBottles[dragState.bottleIdx].length - 1];
    }
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '30px 20px',
        color: 'white',
        userSelect: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          margin: '0 0 10px 0', 
          color: '#fff',
          textShadow: '0 4px 10px rgba(0,0,0,0.3)',
          letterSpacing: '2px'
        }}>
          WATER SORT PUZZLE
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', margin: 0, fontWeight: '500' }}>
          Drag and pour the colored water 💧
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '25px' }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          backdropFilter: 'blur(10px)',
          padding: '15px 30px', 
          borderRadius: '15px',
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '5px', fontWeight: '600' }}>LEVEL</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFF' }}>{level.level_id}</div>
        </div>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          backdropFilter: 'blur(10px)',
          padding: '15px 30px', 
          borderRadius: '15px',
          border: '2px solid rgba(255,255,255,0.3)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '5px', fontWeight: '600' }}>MOVES</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFF' }}>{moves}</div>
        </div>
      </div>

      {message && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          borderRadius: '15px',
          fontSize: '1.6rem',
          fontWeight: 'bold',
          maxWidth: '400px',
          margin: '0 auto 25px',
          boxShadow: '0 10px 30px rgba(17, 153, 142, 0.4)',
          animation: 'celebrate 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          border: '3px solid rgba(255,255,255,0.5)'
        }}>
          {message}
        </div>
      )}

      {/* LIQUID STREAM */}
      {streamPath && streamColor && (
        <svg style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 999 }}>
          <defs>
            <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={COLOR_MAP[streamColor]} stopOpacity="0.9" />
              <stop offset="100%" stopColor={COLOR_MAP[streamColor]} stopOpacity="1" />
            </linearGradient>
          </defs>
          <path d={streamPath} stroke="url(#liquidGrad)" strokeWidth="22" fill="none" strokeLinecap="round" />
          <path d={streamPath} stroke={COLOR_MAP[streamColor]} strokeWidth="30" fill="none" strokeLinecap="round" opacity="0.3" filter="blur(8px)" />
        </svg>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '35px', marginBottom: '30px' }}>
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} style={{ display: 'flex', justifyContent: 'center', gap: '25px' }}>
            {row.map((colors, colIdx) => {
              const bottleIdx = rowIdx * COLS + colIdx;
              const isEmpty = colors.length === 0;
              const isDragging = dragState?.bottleIdx === bottleIdx;
              const isTarget = hoverBottle === bottleIdx;
              
              const animatedHeight = liquidHeights[bottleIdx] !== undefined ? liquidHeights[bottleIdx] : colors.length;
              
              const style: React.CSSProperties = isDragging ? {
                position: 'fixed',
                left: dragState.currentX - 32,
                top: dragState.currentY - 85,
                zIndex: 1000,
                transform: `rotate(${tiltAngle}deg)`,
                transition: 'none',
                cursor: 'grabbing',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'
              } : {
                position: 'relative',
                cursor: isEmpty ? 'not-allowed' : 'grab',
                transform: isTarget ? 'scale(1.08) translateY(-5px)' : 'scale(1)',
                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))'
              };

              return (
                <div key={bottleIdx} ref={el => bottleRefs.current[bottleIdx] = el} style={{ ...style }} onMouseDown={(e) => handleMouseDown(e, bottleIdx)}>
                  <div style={{
                    width: '65px',
                    height: '160px',
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))',
                    border: '3px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '12px 12px 32px 32px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: isTarget 
                      ? '0 0 30px rgba(255, 255, 255, 0.8), inset 0 4px 15px rgba(255,255,255,0.3)' 
                      : 'inset 0 4px 15px rgba(255,255,255,0.2)'
                  }}>
                    {/* LIQUID WITH SVG WAVE - From CodePen! */}
                    {colors.map((color, idx) => {
                      const totalHeight = 148;
                      const layerH = totalHeight / 4;
                      const baseBottom = 4 + idx * layerH;
                      const currentHeightRatio = animatedHeight / colors.length;
                      const animatedBottom = baseBottom * currentHeightRatio;
                      const actualHeight = layerH * currentHeightRatio;
                      
                      return (
                        <div key={idx} style={{
                          position: 'absolute',
                          bottom: `${animatedBottom}px`,
                          left: '3px',
                          right: '3px',
                          height: `${actualHeight}px`,
                          overflow: 'hidden',
                          borderRadius: idx === 0 ? '0 0 29px 29px' : '0',
                          transition: 'bottom 0.05s linear, height 0.05s linear'
                        }}>
                          {/* Base liquid color */}
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '100%',
                            background: COLOR_MAP[color],
                            opacity: 0.95
                          }} />
                          
                          {/* SVG WAVE EFFECT - Like CodePen! */}
                          {idx === colors.length - 1 && (
                            <svg
                              style={{
                                position: 'absolute',
                                top: '-5px',
                                left: 0,
                                width: '100%',
                                height: '15px'
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <defs>
                                <linearGradient id={`wave-grad-${bottleIdx}-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                  <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.5)', stopOpacity: 1 }} />
                                  <stop offset="100%" style={{ stopColor: COLOR_MAP[color], stopOpacity: 1 }} />
                                </linearGradient>
                              </defs>
                              <path
                                d={`M 0 10 Q 16 ${isDragging ? 8 : 10}, 32 10 T 64 10 V 15 H 0 Z`}
                                fill={`url(#wave-grad-${bottleIdx}-${idx})`}
                                style={{
                                  animation: isDragging ? 'wave 1.5s ease-in-out infinite' : 'wave 3s ease-in-out infinite'
                                }}
                              />
                            </svg>
                          )}
                          
                          {/* Glass shine effect */}
                          <div style={{
                            position: 'absolute',
                            left: '8px',
                            top: '15%',
                            width: '16px',
                            height: '70%',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                            borderRadius: '20px',
                            filter: 'blur(5px)',
                            opacity: 0.9,
                            pointerEvents: 'none'
                          }} />
                        </div>
                      );
                    })}

                    {isEmpty && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '2.5rem',
                        opacity: 0.25,
                        color: '#fff',
                        fontWeight: 'bold'
                      }}>
                        ○
                      </div>
                    )}
                    
                    {/* Tube glass shine */}
                    <div style={{
                      position: 'absolute',
                      left: '10px',
                      top: '10%',
                      width: '15px',
                      height: '80%',
                      background: 'linear-gradient(to right, rgba(255,255,255,0.5), transparent)',
                      borderRadius: '15px',
                      filter: 'blur(5px)',
                      pointerEvents: 'none'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '30px' }}>
        <button onClick={() => setCurrentLevelId(p => Math.max(1, p - 1))} disabled={currentLevelId === 1} style={{
          padding: '15px 30px',
          background: currentLevelId === 1 ? 'rgba(100,100,100,0.4)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: currentLevelId === 1 ? 'not-allowed' : 'pointer',
          opacity: currentLevelId === 1 ? 0.5 : 1,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s',
          textTransform: 'uppercase'
        }}>
          ← PREV
        </button>
        <button onClick={() => loadLevel(currentLevelId)} style={{
          padding: '15px 30px',
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s',
          textTransform: 'uppercase'
        }}>
          ↻ RESTART
        </button>
        <button onClick={() => setCurrentLevelId(p => p + 1)} style={{
          padding: '15px 30px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: 'none',
          borderRadius: '12px',
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s',
          textTransform: 'uppercase'
        }}>
          NEXT →
        </button>
      </div>

      <style>{`
        @keyframes celebrate {
          0% { transform: scale(0.5) rotate(-5deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        
        @keyframes wave {
          0% { d: path("M 0 10 Q 16 10, 32 10 T 64 10 V 15 H 0 Z"); }
          50% { d: path("M 0 10 Q 16 7, 32 10 T 64 10 V 15 H 0 Z"); }
          100% { d: path("M 0 10 Q 16 10, 32 10 T 64 10 V 15 H 0 Z"); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
