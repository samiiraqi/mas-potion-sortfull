import { useState, useEffect } from "react";
import axios from "axios";
import ThemedBottle from "./ThemedBottle";
import AnimatedBackground from "./AnimatedBackground";
import Fireworks from "./Fireworks";
import LiquidPourAnimation from "./LiquidPourAnimation";
import ParticleExplosion from "./ParticleExplosion";
import ComboText from "./ComboText";
import ComboSystem from "./ComboSystem";
import VictoryShare from "./VictoryShare";
import { soundManager } from "../../utils/sounds";
import { progressManager } from "../../utils/progressManager";

const API_URL = "https://water-sort-backend.onrender.com";

interface WaterSortCanvasProps {
  onExit: () => void;
}

export default function WaterSortCanvas({ onExit }: WaterSortCanvasProps) {
  const [currentLevel, setCurrentLevel] = useState(() => progressManager.getLastLevel());
  const [bottles, setBottles] = useState<string[][]>([]);
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [fireworks, setFireworks] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [pourAnimations, setPourAnimations] = useState<any[]>([]);
  const [particleEffects, setParticleEffects] = useState<any[]>([]);
  const [comboEffects, setComboEffects] = useState<any[]>([]);
  const [recentCompletions, setRecentCompletions] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pouringBottle, setPouringBottle] = useState<number | null>(null);
  const [comboCount, setComboCount] = useState(0);
  const [showComboSystem, setShowComboSystem] = useState(false);
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
      console.log('📦 Loaded level', levelId, ':', res.data.bottles);
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

  const checkIfComplete = (newBottles: string[][]): boolean => {
    let completedBottles = 0;
    let emptyBottles = 0;
    for (const bottle of newBottles) {
      if (bottle.length === 0) {
        emptyBottles++;
      } else if (bottle.length === 4 && bottle.every(color => color === bottle[0])) {
        completedBottles++;
      } else {
        return false;
      }
    }
    return completedBottles > 0 && (completedBottles + emptyBottles === newBottles.length);
  };

  const handleBottleClick = (bottleIdx: number) => {
    console.log('🖱️ Clicked bottle', bottleIdx, ':', bottles[bottleIdx]);
    
    if (showVictory || isAnimating) return;

    // Select bottle
    if (selectedBottle === null) {
      if (bottles[bottleIdx].length === 0) return;
      soundManager.play("select");
      setSelectedBottle(bottleIdx);
      console.log('✅ Selected bottle', bottleIdx);
      return;
    }

    // Deselect if clicking same bottle
    if (selectedBottle === bottleIdx) {
      setSelectedBottle(null);
      console.log('❌ Deselected');
      return;
    }

    console.log('🔄 Pouring from bottle', selectedBottle, 'to bottle', bottleIdx);
    console.log('   From:', bottles[selectedBottle]);
    console.log('   To:', bottles[bottleIdx]);

    const fromBottle = bottles[selectedBottle];
    const toBottle = bottles[bottleIdx];

    if (fromBottle.length === 0) {
      setSelectedBottle(null);
      return;
    }

    if (toBottle.length >= 4) {
      setSelectedBottle(null);
      return;
    }

    // Get TOP color (last in array = top of bottle)
    const topColor = fromBottle[fromBottle.length - 1];
    console.log('   Top color to pour:', topColor);

    // Check if can pour
    if (toBottle.length > 0 && toBottle[toBottle.length - 1] !== topColor) {
      console.log('   ❌ Cannot pour - colors dont match');
      setSelectedBottle(null);
      return;
    }

    // Count same colors on top
    let count = 1;
    for (let i = fromBottle.length - 2; i >= 0; i--) {
      if (fromBottle[i] === topColor) count++;
      else break;
    }

    const spaceAvailable = 4 - toBottle.length;
    const pourCount = Math.min(count, spaceAvailable);
    console.log('   💧 Pouring', pourCount, 'pieces of', topColor);

    if (pourCount === 0) {
      setSelectedBottle(null);
      return;
    }

    setIsAnimating(true);
    setPouringBottle(selectedBottle);

    setTimeout(() => {
      // Create NEW array with modifications
      const newBottles = bottles.map((bottle, idx) => {
        if (idx === selectedBottle) {
          // Remove pieces from source
          const copy = [...bottle];
          for (let i = 0; i < pourCount; i++) {
            copy.pop();
          }
          console.log('   After pour FROM:', copy);
          return copy;
        } else if (idx === bottleIdx) {
          // Add pieces to target
          const copy = [...bottle];
          for (let i = 0; i < pourCount; i++) {
            copy.push(topColor);
          }
          console.log('   After pour TO:', copy);
          return copy;
        } else {
          return [...bottle];
        }
      });

      console.log('✅ Pour complete! New state:', newBottles);
      
      soundManager.play("pour");
      setBottles(newBottles);
      setMoves(moves + 1);
      setSelectedBottle(null);
      setIsAnimating(false);
      setPouringBottle(null);

      if (checkBottleFull(newBottles[bottleIdx])) {
        soundManager.play("success");
      }

      if (checkIfComplete(newBottles)) {
        setTimeout(() => {
          setShowVictory(true);
          soundManager.play("success");
          progressManager.saveProgress(currentLevel, moves + 1);
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

  // FIXED LAYOUT FOR ALL 20 BOTTLES
  const COLS = 4;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  let scale, bottleSpacing, rowSpacing;
  
  if (isMobile) {
    scale = 0.55;
    bottleSpacing = windowWidth / 4.5;
    rowSpacing = (windowHeight - 220) / 5.5;
  } else {
    scale = 0.95;
    bottleSpacing = 140;
    rowSpacing = 185;
  }
  
  const totalWidth = COLS * bottleSpacing;
  const startX = (windowWidth - totalWidth) / 2 + (bottleSpacing / 2);
  const startY = isMobile ? 150 : 140;

  const getBottlePosition = (idx: number) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    return { 
      x: startX + col * bottleSpacing, 
      y: startY + row * rowSpacing
    };
  };

  const completedLevels = progressManager.getCompletedCount();

  return (
    <>
      <AnimatedBackground theme={background} />

      <div style={{
        minHeight: "100vh", width: "100vw",
        position: "fixed", top: 0, left: 0, display: "flex", flexDirection: "column", userSelect: "none", overflow: "hidden"
      }}>
        {showVictory && (
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.95)", padding: isMobile ? "30px" : "50px", borderRadius: "25px",
            zIndex: 10000, textAlign: "center", color: "white", boxShadow: "0 0 60px rgba(255,215,0,0.6)",
            minWidth: isMobile ? "90%" : "400px"
          }}>
            <h1 style={{ fontSize: isMobile ? "1.8rem" : "3rem", margin: "0 0 15px 0", color: "#4ECDC4" }}>LEVEL COMPLETE!</h1>
            <p style={{ fontSize: isMobile ? "1rem" : "1.3rem", marginBottom: "10px", opacity: 0.9 }}>Level {currentLevel} of 120</p>
            <p style={{ fontSize: isMobile ? "0.9rem" : "1.1rem", marginBottom: "10px", opacity: 0.8 }}>Completed in {moves} moves!</p>
            
            <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
              <button onClick={loadNextLevel} style={{
                padding: isMobile ? "14px 30px" : "18px 45px", background: "linear-gradient(135deg, #11998e, #38ef7d)",
                border: "none", borderRadius: "15px", color: "white", fontSize: isMobile ? "1rem" : "1.3rem",
                fontWeight: "bold", cursor: "pointer"
              }}>➡️ NEXT</button>
              
              <button onClick={onExit} style={{
                padding: isMobile ? "14px 30px" : "18px 45px", background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.3)", borderRadius: "15px", color: "white",
                fontSize: isMobile ? "1rem" : "1.3rem", fontWeight: "bold", cursor: "pointer"
              }}>🏠 EXIT</button>
            </div>
          </div>
        )}

        <div style={{
          padding: isMobile ? "8px" : "12px", 
          background: "rgba(0,0,0,0.3)", 
          display: "flex",
          justifyContent: "space-between", 
          alignItems: "center", 
          gap: "8px", 
          flexShrink: 0
        }}>
          <button onClick={onExit} style={{
            padding: isMobile ? "6px 12px" : "8px 16px", 
            background: "rgba(255,0,0,0.7)", 
            border: "none",
            borderRadius: "8px", 
            color: "white", 
            fontSize: isMobile ? "0.75rem" : "0.9rem", 
            fontWeight: "bold", 
            cursor: "pointer"
          }}>← EXIT</button>

          <div style={{
            background: "rgba(255,255,255,0.2)", 
            padding: isMobile ? "4px 10px" : "6px 15px", 
            borderRadius: "10px",
            color: "white", 
            fontSize: isMobile ? "0.7rem" : "0.85rem", 
            fontWeight: "bold"
          }}>
            Level {currentLevel}/120 • Moves: {moves}
          </div>

          <button onClick={restartLevel} style={{
            padding: isMobile ? "6px 12px" : "8px 16px", 
            background: "rgba(255,165,0,0.7)", 
            border: "none",
            borderRadius: "8px", 
            color: "white", 
            fontSize: isMobile ? "0.75rem" : "0.9rem", 
            fontWeight: "bold", 
            cursor: "pointer"
          }}>🔄</button>
        </div>

        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          overflowX: "hidden", 
          position: "relative",
          display: "flex", 
          justifyContent: "center", 
          alignItems: "flex-start"
        }}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {bottles.map((colors, idx) => {
              const isSelected = selectedBottle === idx;
              const isFull = checkBottleFull(colors);
              const basePos = getBottlePosition(idx);

              return (
                <div key={idx} onClick={() => handleBottleClick(idx)} style={{
                  position: "absolute", 
                  left: basePos.x, 
                  top: basePos.y,
                  transform: `scale(${scale}) ${isSelected ? 'translateY(-8px) scale(1.1)' : ''}`,
                  transformOrigin: "center center", 
                  cursor: "pointer",
                  zIndex: isSelected ? 1000 : 1, 
                  transition: "all 0.3s",
                  filter: isSelected ? "drop-shadow(0 0 20px rgba(255,215,0,0.9))" : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))"
                }}>
                  <ThemedBottle 
                    colors={colors} 
                    position={{ x: 0, y: 0 }} 
                    onSelect={() => {}} 
                    isSelected={isSelected} 
                    isEmpty={colors.length === 0} 
                    isFull={isFull}
                    theme={bottleTheme}
                    isPouring={false}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
