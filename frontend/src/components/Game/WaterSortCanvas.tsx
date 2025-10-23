import { useState, useEffect } from "react";
import axios from "axios";
import ThemedBottle from "./ThemedBottle";
import AnimatedBackground from "./AnimatedBackground";
import Fireworks from "./Fireworks";
import LiquidPourAnimation from "./LiquidPourAnimation";
import ParticleExplosion from "./ParticleExplosion";
import ComboText from "./ComboText";
import MagicParticles from "./MagicParticles";
import ComboSystem from "./ComboSystem";
import PerfectMoveTracker from "./PerfectMoveTracker";
import VictoryShare from "./VictoryShare";
import { soundManager } from "../../utils/sounds";
import { progressManager } from "../../utils/progressManager";

const API_URL = "https://water-sort-backend.onrender.com";

interface FireworkData {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface PourAnimation {
  id: number;
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
  color: string;
}

interface ParticleEffect {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface ComboEffect {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface WaterSortCanvasProps {
  onExit: () => void;
}

export default function WaterSortCanvas({ onExit }: WaterSortCanvasProps) {
  const [currentLevel, setCurrentLevel] = useState(() => {
    const lastLevel = progressManager.getLastLevel();
    return lastLevel;
  });
  
  const [bottles, setBottles] = useState<string[][]>([]);
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [fireworks, setFireworks] = useState<FireworkData[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  
  const [pourAnimations, setPourAnimations] = useState<PourAnimation[]>([]);
  const [particleEffects, setParticleEffects] = useState<ParticleEffect[]>([]);
  const [comboEffects, setComboEffects] = useState<ComboEffect[]>([]);
  const [recentCompletions, setRecentCompletions] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // NEW: Combo system state
  const [comboCount, setComboCount] = useState(0);
  const [showComboSystem, setShowComboSystem] = useState(false);

  // NEW: Perfect move tracking
  const [optimalMoves] = useState(15); // This should come from level data

  // NEW: Victory share
  const [showVictoryShare, setShowVictoryShare] = useState(false);

  const [background, setBackground] = useState('galaxy');
  const [bottleTheme, setBottleTheme] = useState('classic');

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setBackground(settings.background || 'galaxy');
      setBottleTheme(settings.theme || 'classic');
    }
  }, []);

  useEffect(() => {
    loadLevel(currentLevel);
  }, [currentLevel]);

  const loadLevel = async (levelId: number) => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/levels/${levelId}`);
      setBottles(res.data.bottles);
      setMoves(0);
      setSelectedBottle(null);
      setShowVictory(false);
      setFireworks([]);
      setRecentCompletions([]);
      setComboCount(0);
      soundManager.play("click");
    } catch (err) {
      console.error("Failed to load level:", err);
    }
  };

  const loadNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel > 120) {
      alert("🎉 Congratulations! You completed all 120 levels!");
      onExit();
      return;
    }
    
    progressManager.saveProgress(currentLevel, moves);
    setCurrentLevel(nextLevel);
    setShowVictory(false);
    setShowVictoryShare(false);
  };

  const restartLevel = () => {
    loadLevel(currentLevel);
    soundManager.play("click");
  };

  const checkBottleFull = (bottle: string[]): boolean => {
    if (bottle.length !== 4) return false;
    return bottle.every(color => color === bottle[0]);
  };

  const triggerParticleExplosion = (bottleIdx: number, color: string) => {
    const pos = getBottlePosition(bottleIdx);
    const screenX = pos.x + 30;
    const screenY = pos.y + 50;
    
    const particle: ParticleEffect = {
      id: Date.now(),
      x: screenX,
      y: screenY,
      color: color
    };
    
    setParticleEffects(prev => [...prev, particle]);
    setTimeout(() => {
      setParticleEffects(prev => prev.filter(p => p.id !== particle.id));
    }, 1000);
  };

  const checkCombo = (bottleIdx: number) => {
    const now = Date.now();
    const recent = [...recentCompletions, now];
    setRecentCompletions(recent);
    
    setTimeout(() => {
      setRecentCompletions(prev => prev.filter(t => now - t < 3000));
    }, 3000);
    
    const recentCount = recent.filter(t => now - t < 3000).length;
    
    // Update combo count
    setComboCount(recentCount);
    setShowComboSystem(true);
    
    if (recentCount >= 3) {
      showComboText("TRIPLE COMBO! 🔥", bottleIdx);
    } else if (recentCount === 2) {
      showComboText("DOUBLE! 💥", bottleIdx);
    }
  };

  const showComboText = (text: string, bottleIdx: number) => {
    const pos = getBottlePosition(bottleIdx);
    
    const combo: ComboEffect = {
      id: Date.now(),
      text: text,
      x: pos.x + 30,
      y: pos.y - 50
    };
    
    setComboEffects(prev => [...prev, combo]);
    setTimeout(() => {
      setComboEffects(prev => prev.filter(c => c.id !== combo.id));
    }, 1500);
  };

  const checkIfComplete = (newBottles: string[][]): boolean => {
    let completedBottles = 0;
    let emptyBottles = 0;
    
    for (const bottle of newBottles) {
      if (bottle.length === 0) {
        emptyBottles++;
        continue;
      }
      if (bottle.length === 4 && bottle.every(color => color === bottle[0])) {
        completedBottles++;
      } else {
        return false;
      }
    }
    return completedBottles > 0 && (completedBottles + emptyBottles === newBottles.length);
  };

  const handleBottleClick = (bottleIdx: number) => {
    if (showVictory || isAnimating) return;

    if (selectedBottle === null) {
      if (bottles[bottleIdx].length === 0) return;
      soundManager.play("select");
      setSelectedBottle(bottleIdx);
      return;
    }

    if (selectedBottle === bottleIdx) {
      setSelectedBottle(null);
      return;
    }

    const fromBottle = [...bottles[selectedBottle]];
    const toBottle = [...bottles[bottleIdx]];

    if (fromBottle.length === 0) {
      setSelectedBottle(null);
      return;
    }

    if (toBottle.length >= 4) {
      setSelectedBottle(null);
      return;
    }

    if (toBottle.length > 0 && fromBottle[fromBottle.length - 1] !== toBottle[toBottle.length - 1]) {
      setSelectedBottle(null);
      return;
    }

    const colorToPour = fromBottle[fromBottle.length - 1];
    let count = 1;
    for (let i = fromBottle.length - 2; i >= 0; i--) {
      if (fromBottle[i] === colorToPour) {
        count++;
      } else {
        break;
      }
    }

    const spaceAvailable = 4 - toBottle.length;
    const pourCount = Math.min(count, spaceAvailable);

    if (pourCount === 0) {
      setSelectedBottle(null);
      return;
    }

    setIsAnimating(true);
    const fromPos = getBottlePosition(selectedBottle);
    const toPos = getBottlePosition(bottleIdx);
    
    const pourAnim: PourAnimation = {
      id: Date.now(),
      fromPos: { x: fromPos.x + 30, y: fromPos.y + 40 },
      toPos: { x: toPos.x + 30, y: toPos.y + 60 },
      color: colorToPour
    };
    
    setPourAnimations(prev => [...prev, pourAnim]);

    setTimeout(() => {
      const newBottles = [...bottles];
      for (let i = 0; i < pourCount; i++) {
        newBottles[bottleIdx].push(newBottles[selectedBottle].pop()!);
      }

      soundManager.play("pour");
      setBottles(newBottles);
      setMoves(moves + 1);
      setSelectedBottle(null);
      setIsAnimating(false);

      setPourAnimations(prev => prev.filter(p => p.id !== pourAnim.id));

      if (checkBottleFull(newBottles[bottleIdx])) {
        triggerParticleExplosion(bottleIdx, newBottles[bottleIdx][0]);
        soundManager.play("success");
        checkCombo(bottleIdx);
      }

      if (checkIfComplete(newBottles)) {
        setTimeout(() => {
          setShowVictory(true);
          setShowVictoryShare(true);
          soundManager.play("success");
          progressManager.saveProgress(currentLevel, moves + 1);
          
          for (let i = 0; i < 8; i++) {
            setTimeout(() => {
              const fw: FireworkData = {
                id: Date.now() + i,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight / 2,
                color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'][i]
              };
              setFireworks(prev => [...prev, fw]);
            }, i * 150);
          }
        }, 500);
      }
    }, 400);
  };

  if (!bottles || bottles.length === 0) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white"
      }}>
        <h2>Loading level {currentLevel}...</h2>
      </div>
    );
  }

  const bottleCount = bottles.length;
  let COLS, scale, bottleSpacing, rowSpacing;
  
  if (isMobile) {
    if (bottleCount <= 5) {
      COLS = 3;
      scale = 0.7;
      bottleSpacing = 90;
      rowSpacing = 120;
    } else if (bottleCount <= 7) {
      COLS = 3;
      scale = 0.6;
      bottleSpacing = 80;
      rowSpacing = 110;
    } else if (bottleCount <= 9) {
      COLS = 4;
      scale = 0.5;
      bottleSpacing = 70;
      rowSpacing = 95;
    } else if (bottleCount <= 11) {
      COLS = 4;
      scale = 0.45;
      bottleSpacing = 65;
      rowSpacing = 90;
    } else {
      COLS = 4;
      scale = 0.42;
      bottleSpacing = 58;
      rowSpacing = 85;
    }
  } else {
    if (bottleCount <= 5) {
      COLS = 3;
      scale = 1.2;
      bottleSpacing = 140;
      rowSpacing = 200;
    } else if (bottleCount <= 7) {
      COLS = 4;
      scale = 1.0;
      bottleSpacing = 120;
      rowSpacing = 180;
    } else if (bottleCount <= 9) {
      COLS = 5;
      scale = 0.9;
      bottleSpacing = 110;
      rowSpacing = 165;
    } else if (bottleCount <= 11) {
      COLS = 5;
      scale = 0.85;
      bottleSpacing = 105;
      rowSpacing = 160;
    } else if (bottleCount <= 13) {
      COLS = 6;
      scale = 0.8;
      bottleSpacing = 100;
      rowSpacing = 150;
    } else {
      COLS = 6;
      scale = 0.75;
      bottleSpacing = 95;
      rowSpacing = 145;
    }
  }
  
  const numCols = Math.min(bottleCount, COLS);
  const totalWidth = numCols * bottleSpacing;
  const startX = (window.innerWidth - totalWidth) / 2;
  const startY = isMobile ? 10 : 20;

  const getBottlePosition = (idx: number) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    return { 
      x: startX + col * bottleSpacing, 
      y: startY + row * rowSpacing
    };
  };

  // Get flask positions for magic particles
  const flaskPositions = bottles.map((_, idx) => getBottlePosition(idx));

  const completedLevels = progressManager.getCompletedCount();
  const isPerfect = moves <= optimalMoves;

  return (
    <>
      <AnimatedBackground theme={background} />

      {/* NEW: Magic particles floating around flasks */}
      <MagicParticles flaskPositions={flaskPositions} />

      {/* NEW: Combo system */}
      {showComboSystem && (
        <ComboSystem 
          comboCount={comboCount} 
          onComboEnd={() => {
            setShowComboSystem(false);
            setComboCount(0);
          }} 
        />
      )}

      {/* NEW: Perfect move tracker */}
      {!showVictory && (
        <PerfectMoveTracker 
          currentMoves={moves} 
          optimalMoves={optimalMoves} 
          level={currentLevel}
        />
      )}

      <div style={{
        minHeight: "100vh", width: "100vw",
        position: "fixed", top: 0, left: 0, display: "flex", flexDirection: "column", userSelect: "none", overflow: "hidden"
      }}>
        {fireworks.map(fw => <Fireworks key={fw.id} x={fw.x} y={fw.y} color={fw.color} />)}
        {pourAnimations.map(anim => (
          <LiquidPourAnimation
            key={anim.id}
            fromPos={anim.fromPos}
            toPos={anim.toPos}
            color={anim.color}
            onComplete={() => {}}
          />
        ))}
        {particleEffects.map(effect => (
          <ParticleExplosion
            key={effect.id}
            x={effect.x}
            y={effect.y}
            color={effect.color}
            onComplete={() => {}}
          />
        ))}
        {comboEffects.map(combo => (
          <ComboText
            key={combo.id}
            text={combo.text}
            x={combo.x}
            y={combo.y}
            onComplete={() => {}}
          />
        ))}

        {/* NEW: Victory share popup */}
        {showVictoryShare && !showVictory && (
          <VictoryShare
            level={currentLevel}
            moves={moves}
            isPerfect={isPerfect}
            onShare={() => setShowVictoryShare(false)}
            onClose={() => setShowVictoryShare(false)}
          />
        )}

        {showVictory && (
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.95)", padding: isMobile ? "30px" : "50px", borderRadius: "25px",
            zIndex: 10000, textAlign: "center", color: "white", boxShadow: "0 0 60px rgba(255,215,0,0.6)",
            minWidth: isMobile ? "90%" : "400px"
          }}>
            <div style={{ fontSize: isMobile ? "3rem" : "5rem", marginBottom: "20px", animation: "bounce 0.6s infinite alternate" }}>
              {isPerfect ? '⭐' : '🎉'}
            </div>
            <h1 style={{ fontSize: isMobile ? "1.8rem" : "3rem", margin: "0 0 15px 0", color: isPerfect ? "#FFD700" : "#4ECDC4" }}>
              {isPerfect ? "PERFECT SCORE!" : "LEVEL COMPLETE!"}
            </h1>
            <p style={{ fontSize: isMobile ? "1rem" : "1.3rem", marginBottom: "10px", opacity: 0.9 }}>Level {currentLevel} of 120</p>
            <p style={{ fontSize: isMobile ? "0.9rem" : "1.1rem", marginBottom: "10px", opacity: 0.8 }}>
              Completed in {moves} moves! {isPerfect && '🏆'}
            </p>
            <p style={{ fontSize: isMobile ? "0.85rem" : "1rem", marginBottom: "35px", opacity: 0.7 }}>
              🏆 Total completed: {completedLevels}/120
            </p>
            
            <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={loadNextLevel} style={{
                padding: isMobile ? "14px 30px" : "18px 45px", background: "linear-gradient(135deg, #11998e, #38ef7d)",
                border: "none", borderRadius: "15px", color: "white", fontSize: isMobile ? "1rem" : "1.3rem",
                fontWeight: "bold", cursor: "pointer", boxShadow: "0 6px 25px rgba(17, 153, 142, 0.4)", transition: "all 0.3s"
              }}>➡️ NEXT LEVEL</button>
              
              <button onClick={onExit} style={{
                padding: isMobile ? "14px 30px" : "18px 45px", background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.3)", borderRadius: "15px", color: "white",
                fontSize: isMobile ? "1rem" : "1.3rem", fontWeight: "bold", cursor: "pointer", transition: "all 0.3s"
              }}>🏠 EXIT</button>
            </div>
          </div>
        )}

        <div style={{
          padding: isMobile ? "8px" : "12px", background: "rgba(0,0,0,0.3)", display: "flex",
          justifyContent: "space-between", alignItems: "center", gap: "8px", flexShrink: 0
        }}>
          <button onClick={onExit} style={{
            padding: isMobile ? "6px 12px" : "8px 16px", background: "rgba(255,0,0,0.7)", border: "none",
            borderRadius: "8px", color: "white", fontSize: isMobile ? "0.75rem" : "0.9rem", fontWeight: "bold", cursor: "pointer"
          }}>← EXIT</button>

          <div style={{
            background: "rgba(255,255,255,0.2)", padding: isMobile ? "4px 10px" : "6px 15px", borderRadius: "10px",
            color: "white", fontSize: isMobile ? "0.7rem" : "0.85rem", fontWeight: "bold"
          }}>Level {currentLevel}/120 • Moves: {moves}</div>

          <button onClick={restartLevel} style={{
            padding: isMobile ? "6px 12px" : "8px 16px", background: "rgba(255,165,0,0.7)", border: "none",
            borderRadius: "8px", color: "white", fontSize: isMobile ? "0.75rem" : "0.9rem", fontWeight: "bold", cursor: "pointer"
          }}>🔄 RESTART</button>
        </div>

        <div style={{
          padding: isMobile ? "4px 8px" : "6px 12px", background: "rgba(0,0,0,0.2)", textAlign: "center",
          color: "white", fontSize: isMobile ? "0.7rem" : "0.8rem", flexShrink: 0
        }}>🏆 Progress: {completedLevels}/120 levels completed</div>

        <div style={{ 
          flex: 1, overflowY: "auto", overflowX: "hidden", position: "relative", paddingBottom: "20px",
          display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: isMobile ? "10px" : "20px", 
          WebkitOverflowScrolling: "touch"
        }}>
          <div style={{ position: "relative", width: "100%", minHeight: "100%" }}>
            {bottles.map((colors, idx) => {
              const isSelected = selectedBottle === idx;
              const isFull = checkBottleFull(colors);
              const basePos = getBottlePosition(idx);

              return (
                <div key={idx} onClick={() => handleBottleClick(idx)} style={{
                  position: "absolute", left: basePos.x, top: basePos.y,
                  transform: `scale(${scale}) ${isSelected ? 'translateY(-8px) scale(1.1)' : ''}`,
                  transformOrigin: "center center", cursor: showVictory || isAnimating ? "not-allowed" : "pointer",
                  zIndex: isSelected ? 1000 : 1, transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                  filter: isSelected ? "drop-shadow(0 0 20px rgba(255,215,0,0.9))" : isFull ? "drop-shadow(0 0 15px rgba(255,215,0,0.6))" : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
                  opacity: showVictory || isAnimating ? 0.7 : 1
                }}>
                  <ThemedBottle 
                    colors={colors} 
                    position={{ x: 0, y: 0 }} 
                    onSelect={() => {}} 
                    isSelected={isSelected} 
                    isEmpty={colors.length === 0} 
                    isFull={isFull}
                    theme={bottleTheme}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }`}</style>
      </div>
    </>
  );
}
