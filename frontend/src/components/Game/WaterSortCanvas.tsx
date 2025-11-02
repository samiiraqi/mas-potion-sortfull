import { useState, useEffect } from "react";
import axios from "axios";
import ThemedBottle from "./ThemedBottle";
import AnimatedBackground from "./AnimatedBackground";
import Fireworks from "./Fireworks";
import confetti from 'canvas-confetti';
import { soundManager } from "../../utils/sounds";
import { progressManager } from "../../utils/progressManager";

import { solvePuzzle } from "./solver";
import PasswordDialog from "./PasswordDialog";
const API_URL = "https://water-sort-backend.onrender.com";

interface MoveHistory {
  bottles: string[][];
  moves: number;
}

interface WaterSortCanvasProps {
  onExit: () => void;
}

export default function WaterSortCanvas({ onExit }: WaterSortCanvasProps) {
  const [currentLevel, setCurrentLevel] = useState(() => {
    const lastLevel = progressManager.getLastLevel();
    return lastLevel > 0 ? lastLevel : 1;
  });
  
  const [bottles, setBottles] = useState<string[][]>([]);
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [fireworks, setFireworks] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 🔥 LOAD SETTINGS IMMEDIATELY FROM LOCALSTORAGE ON INITIALIZATION
  const [background, setBackground] = useState(() => {
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
      try {
        return JSON.parse(saved).background || 'galaxy';
      } catch (e) {
        return 'galaxy';
      }
    }
    return 'galaxy';
  });
  
  const [bottleTheme, setBottleTheme] = useState(() => {
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
      try {
        const theme = JSON.parse(saved).theme || 'classic';
        console.log('🍾 Initial theme loaded:', theme);
        return theme;
      } catch (e) {
        return 'classic';
      }
    }
    return 'classic';
  });
  
  const [hintFrom, setHintFrom] = useState<number | null>(null);
  const [hintTo, setHintTo] = useState<number | null>(null);
  const [moveHistory, setMoveHistory] = useState<MoveHistory[]>([]);
  const [undosRemaining, setUndosRemaining] = useState(3);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    soundManager.init();
    setIsMobile(window.innerWidth < 768);
    
    const loadSettings = () => {
      const saved = localStorage.getItem('gameSettings');
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          console.log('🎨 Loading settings:', settings);
          setBackground(settings.background || 'galaxy');
          setBottleTheme(settings.theme || 'classic');
          console.log('🍾 Theme updated to:', settings.theme || 'classic');
        } catch (e) {
          console.error('Error loading settings:', e);
        }
      }
    };
    
    loadSettings();
    
    const handleFocus = () => {
      console.log('🔄 Window focused, reloading settings...');
      loadSettings();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    if (currentLevel >= 1 && currentLevel <= 120) {
      loadLevel(currentLevel);
      progressManager.setCurrentLevel(currentLevel);
    }
  }, [currentLevel]);

  const loadLevel = async (levelId: number) => {
    try {
      console.log('Loading level:', levelId);
      const res = await axios.get(`${API_URL}/api/v1/levels/${levelId}`);
      setBottles(res.data.bottles);
      setMoves(0);
      setSelectedBottle(null);
      setShowVictory(false);
      setFireworks([]);
      setHintFrom(null);
      setHintTo(null);
      setMoveHistory([]);
      setUndosRemaining(3);
      setHintsRemaining(3);
      soundManager.play("click");
    } catch (err) {
      console.error("Failed to load level:", err);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD700']
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1']
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#FFA07A', '#FFD700', '#FF6B6B']
      });
    }, 400);

    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 180,
        origin: { y: 0.2 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD700', '#98D8C8']
      });
    }, 600);
  };

  const loadNextLevel = () => {
    console.log("🔵 NEXT button clicked!");
    console.log("   Current level:", currentLevel);
    console.log("   Moves:", moves);
    
    const nextLevel = currentLevel + 1;
    console.log("   Next level will be:", nextLevel);
    
    if (nextLevel > 120) {
      alert("🎉 Congratulations! You completed all 120 levels!");
      handleExit();
      return;
    }
    
    console.log("   Saving progress...");
    progressManager.completeLevelAndAdvance(currentLevel, moves);
    
    console.log("   Setting current level to:", nextLevel);
    setCurrentLevel(nextLevel);
    
    console.log("   Closing victory screen...");
    setShowVictory(false);
    
    console.log("🟢 loadNextLevel complete!");
  };

  const restartLevel = () => {
    loadLevel(currentLevel);
    soundManager.play("click");
  };

  const handleExit = () => {
    progressManager.setCurrentLevel(currentLevel);
    console.log('💾 Saving level', currentLevel, 'before exit');
    onExit();
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

  const showHint = () => {
    if (hintsRemaining <= 0) {
      alert("No hints remaining! Use the Robot button for more help (password required).");
      return;
    }
    
    setHintFrom(null);
    setHintTo(null);

    for (let from = 0; from < bottles.length; from++) {
      if (bottles[from].length === 0) continue;
      
      const topColor = bottles[from][bottles[from].length - 1];
      
      for (let to = 0; to < bottles.length; to++) {
        if (from === to) continue;
        if (bottles[to].length >= 4) continue;
        
        if (bottles[to].length === 0 || bottles[to][bottles[to].length - 1] === topColor) {
          setHintFrom(from);
          setHintTo(to);
          setHintsRemaining(hintsRemaining - 1);
          soundManager.play("select");
          
          setTimeout(() => {
            setHintFrom(null);
            setHintTo(null);
          }, 3000);
          
          return;
        }
      }
    }
    
    alert("No obvious moves found!");
  };

  const solveWithRobot = async () => {
    const solution = solvePuzzle(bottles);
    
    if (solution.length === 0) {
      alert("Robot suggests: Try restarting this level!");
      return;
    }
    
    const move = solution[0];
    alert("Robot suggests: Pour from bottle " + (move.from + 1) + " to bottle " + (move.to + 1));
    
    setSelectedBottle(move.from);
    setTimeout(() => setSelectedBottle(null), 2000);
  };

  const undoMove = () => {
    if (moveHistory.length === 0) {
      alert("❌ No moves to undo!");
      return;
    }
    
    if (undosRemaining <= 0) {
      alert("❌ No undos remaining!");
      return;
    }

    const lastState = moveHistory[moveHistory.length - 1];
    setBottles(lastState.bottles.map(b => [...b]));
    setMoves(lastState.moves);
    setMoveHistory(moveHistory.slice(0, -1));
    setUndosRemaining(undosRemaining - 1);
    soundManager.play("click");
  };

  const handleBottleClick = (bottleIdx: number) => {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      soundManager.init();
    }
    
    if (!soundManager.isInitialized()) {
      soundManager.init();
    }
    
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

    const topColor = fromBottle[fromBottle.length - 1];

    if (toBottle.length > 0 && toBottle[toBottle.length - 1] !== topColor) {
      setSelectedBottle(null);
      return;
    }

    let count = 1;
    for (let i = fromBottle.length - 2; i >= 0; i--) {
      if (fromBottle[i] === topColor) count++;
      else break;
    }

    const spaceAvailable = 4 - toBottle.length;
    const pourCount = Math.min(count, spaceAvailable);

    if (pourCount === 0) {
      setSelectedBottle(null);
      return;
    }

    setMoveHistory([...moveHistory, {
      bottles: bottles.map(b => [...b]),
      moves: moves
    }]);

    setIsAnimating(true);

    setTimeout(() => {
      const newBottles: string[][] = bottles.map(bottle => [...bottle]);

      for (let i = 0; i < pourCount; i++) {
        newBottles[selectedBottle].pop();
      }

      for (let i = 0; i < pourCount; i++) {
        newBottles[bottleIdx].push(topColor);
      }

      soundManager.play("pour");
      setBottles(newBottles);
      setMoves(moves + 1);
      setSelectedBottle(null);
      setIsAnimating(false);

      if (checkBottleFull(newBottles[bottleIdx])) {
        soundManager.play("success");
      }

      if (checkIfComplete(newBottles)) {
        setTimeout(() => {
          triggerConfetti();
          setShowVictory(true);
          soundManager.play("success");
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
        {showPasswordDialog && (
          <PasswordDialog
            onClose={() => setShowPasswordDialog(false)}
            onSuccess={solveWithRobot}
            levelNumber={currentLevel}
          />
        )}
      </div>
    );
  }

  // Dynamic layout based on bottle count
  const bottleCount = bottles.length;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  let scale, bottleSpacing, rowSpacing, COLS;
  
  // Determine columns and sizing based on bottle count
  if (bottleCount <= 12) {
    COLS = 4;  // 3 rows of 4 for 12 bottles
    scale = isMobile ? 0.65 : 1.1;
    bottleSpacing = isMobile ? windowWidth / 4.2 : 150;
    rowSpacing = isMobile ? (windowHeight - 220) / 4.5 : 200;
  } else if (bottleCount <= 15) {
    COLS = 5;  // 3 rows of 5 for 15 bottles
    scale = isMobile ? 0.55 : 0.95;
    bottleSpacing = isMobile ? windowWidth / 5.2 : 130;
    rowSpacing = isMobile ? (windowHeight - 220) / 4.5 : 185;
  } else if (bottleCount <= 18) {
    COLS = 6;  // 3 rows of 6 for 18 bottles
    scale = isMobile ? 0.48 : 0.85;
    bottleSpacing = isMobile ? windowWidth / 6.2 : 115;
    rowSpacing = isMobile ? (windowHeight - 220) / 4.5 : 170;
  } else {
    COLS = 5;  // 4 rows of 5 for 20 bottles
    scale = isMobile ? 0.48 : 0.8;
    bottleSpacing = isMobile ? windowWidth / 5.2 : 120;
    rowSpacing = isMobile ? (windowHeight - 220) / 5.5 : 160;
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
            <p style={{ fontSize: isMobile ? "1rem" : "1.3rem", marginBottom: "10px" }}>Level {currentLevel} of 120</p>
            <p style={{ fontSize: isMobile ? "0.9rem" : "1.1rem", marginBottom: "10px" }}>Completed in {moves} moves!</p>
            
            <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap", marginTop: "20px" }}>
              <button onClick={loadNextLevel} style={{
                padding: isMobile ? "14px 30px" : "18px 45px", background: "linear-gradient(135deg, #11998e, #38ef7d)",
                border: "none", borderRadius: "15px", color: "white", fontSize: isMobile ? "1rem" : "1.3rem",
                fontWeight: "bold", cursor: "pointer"
              }}>➡️ NEXT</button>
              
              <button onClick={handleExit} style={{
                padding: isMobile ? "14px 30px" : "18px 45px", background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.3)", borderRadius: "15px", color: "white",
                fontSize: isMobile ? "1rem" : "1.3rem", fontWeight: "bold", cursor: "pointer"
              }}>🏠 EXIT</button>
            </div>
          </div>
        )}

        <div style={{
          padding: isMobile ? "6px" : "10px", 
          background: "rgba(0,0,0,0.3)", 
          display: "flex",
          justifyContent: "space-between", 
          alignItems: "center", 
          gap: isMobile ? "4px" : "8px", 
          flexShrink: 0,
          flexWrap: "wrap"
        }}>
          <button onClick={handleExit} style={{
            padding: isMobile ? "6px 10px" : "8px 16px", 
            background: "rgba(255,0,0,0.7)", 
            border: "none",
            borderRadius: "8px", 
            color: "white", 
            fontSize: isMobile ? "0.7rem" : "0.9rem", 
            fontWeight: "bold", 
            cursor: "pointer"
          }}>← EXIT</button>

          <div style={{
            background: "rgba(255,255,255,0.2)", 
            padding: isMobile ? "4px 8px" : "6px 12px", 
            borderRadius: "8px",
            color: "white", 
            fontSize: isMobile ? "0.65rem" : "0.8rem", 
            fontWeight: "bold"
          }}>
            Lv {currentLevel} • {moves} moves • 🎨 {bottleTheme}
          </div>

          <button onClick={undoMove} disabled={moveHistory.length === 0 || undosRemaining === 0} style={{
            padding: isMobile ? "6px 10px" : "8px 16px", 
            background: moveHistory.length === 0 || undosRemaining === 0 ? "rgba(128,128,128,0.5)" : "rgba(138,43,226,0.7)", 
            border: "none",
            borderRadius: "8px", 
            color: "white", 
            fontSize: isMobile ? "0.7rem" : "0.9rem", 
            fontWeight: "bold", 
            cursor: moveHistory.length === 0 || undosRemaining === 0 ? "not-allowed" : "pointer",
            opacity: moveHistory.length === 0 || undosRemaining === 0 ? 0.5 : 1
          }}>↩️ {undosRemaining}</button>

          <button onClick={showHint} style={{
            padding: isMobile ? "6px 10px" : "8px 16px", 
            background: "rgba(255,215,0,0.7)", 
            border: "none",
            borderRadius: "8px", 
            color: "white", 
            fontSize: isMobile ? "0.7rem" : "0.9rem", 
            fontWeight: "bold", 
            cursor: "pointer"
          }}>💡 {hintsRemaining}</button>

          <button onClick={() => setShowPasswordDialog(true)} style={{
            padding: isMobile ? "6px 10px" : "8px 16px", 
            background: "linear-gradient(135deg, #667eea, #764ba2)", 
            border: "none", borderRadius: "8px", color: "white", 
            fontSize: isMobile ? "0.7rem" : "0.9rem", fontWeight: "bold", cursor: "pointer"
          }}>🤖 ROBOT</button>

          <button onClick={restartLevel} style={{
            padding: isMobile ? "6px 10px" : "8px 16px", 
            background: "rgba(255,165,0,0.7)", 
            border: "none",
            borderRadius: "8px", 
            color: "white", 
            fontSize: isMobile ? "0.7rem" : "0.9rem", 
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
              const isHintSource = hintFrom === idx;
              const isHintTarget = hintTo === idx;
              const bottleKey = `bottle-${idx}-${bottleTheme}`;

              return (
                <div key={bottleKey} onClick={() => handleBottleClick(idx)} style={{
                  position: "absolute", 
                  left: basePos.x, 
                  top: basePos.y,
                  transform: `scale(${scale}) ${isSelected ? 'translateY(-8px) scale(1.1)' : ''}`,
                  transformOrigin: "center center", 
                  cursor: "pointer",
                  zIndex: isSelected ? 1000 : 1, 
                  transition: "all 0.3s",
                  filter: isSelected 
                    ? "drop-shadow(0 0 20px rgba(255,215,0,0.9))" 
                    : isHintSource 
                    ? "drop-shadow(0 0 30px rgba(0,255,0,1))"
                    : isHintTarget
                    ? "drop-shadow(0 0 30px rgba(0,255,255,1))"
                    : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
                  animation: isHintSource || isHintTarget ? 'pulse 1s infinite' : 'none'
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

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}</style>
        {showPasswordDialog && (
          <PasswordDialog
            onClose={() => setShowPasswordDialog(false)}
            onSuccess={solveWithRobot}
            levelNumber={currentLevel}
          />
        )}
      </div>
    </>
  );
}
