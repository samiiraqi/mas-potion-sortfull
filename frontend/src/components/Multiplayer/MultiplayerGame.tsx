import { useState, useEffect } from "react";
import axios from "axios";
import RealisticBottle from "../Game/RealisticBottle";
import Fireworks from "../Game/Fireworks";
import { soundManager } from "../../utils/sounds";

const API_URL = "https://water-sort-backend.onrender.com";

interface FireworkData {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface MultiplayerGameProps {
  roomData: any;
  onExit: () => void;
}

export default function MultiplayerGame({ roomData, onExit }: MultiplayerGameProps) {
  const [currentLevel, setCurrentLevel] = useState(roomData?.level_id || 1);
  const [bottles, setBottles] = useState<string[][]>(roomData?.bottles || []);
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [roomState, setRoomState] = useState(roomData?.room_state || {});
  const [fireworks, setFireworks] = useState<FireworkData[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameReady, setGameReady] = useState(false);
  const [showVictory, setShowVictory] = useState(false);

  const playerId = roomData?.player_id || "";
  const roomId = roomData?.room_id || "";

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (roomState?.players?.length === 2) {
      setGameReady(true);
    }
  }, [roomState]);

  const loadNextLevel = async () => {
    try {
      setShowVictory(false);
      setWinner(null);
      setMoves(0);
      setSelectedBottle(null);
      setFireworks([]);
      
      const res = await axios.post(`${API_URL}/api/v1/multiplayer/next-level/${roomId}`);
      
      setCurrentLevel(res.data.level_id);
      setBottles(res.data.bottles);
      
      soundManager.play("click");
    } catch (err: any) {
      console.error("Failed to load next level:", err);
      alert("🎉 You completed all 50 levels!");
      onExit();
    }
  };

  useEffect(() => {
    if (!roomId) return;
    
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/multiplayer/room/${roomId}`);
        const newRoomState = res.data;
        
        // Check if level changed
        if (newRoomState.level_id && newRoomState.level_id !== currentLevel) {
          setCurrentLevel(newRoomState.level_id);
          setBottles(newRoomState.bottles);
          setMoves(0);
          setWinner(null);
          setShowVictory(false);
          setSelectedBottle(null);
          setFireworks([]);
        }
        
        setRoomState(newRoomState);
        
        // DON'T sync bottles - each player has their own!
        // Only sync winner status
        if (newRoomState.winner && !winner) {
          setWinner(newRoomState.winner);
          setShowVictory(true);
          
          if (newRoomState.winner === playerId) {
            soundManager.play("success");
            for (let i = 0; i < 5; i++) {
              setTimeout(() => {
                const fw: FireworkData = {
                  id: Date.now() + i,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight / 2,
                  color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][i]
                };
                setFireworks(prev => [...prev, fw]);
              }, i * 200);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch room state:", err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId, winner, playerId, currentLevel]);

  const checkBottleFull = (bottle: string[]): boolean => {
    if (bottle.length !== 4) return false;
    return bottle.every(color => color === bottle[0]);
  };

  const triggerFireworks = (bottleIdx: number, color: string) => {
    const pos = getBottlePosition(bottleIdx);
    const screenX = pos.x + 30;
    const screenY = pos.y + 80;
    
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
    
    const fw: FireworkData = {
      id: Date.now(),
      x: screenX,
      y: screenY,
      color: COLOR_MAP[color] || '#FFD700'
    };
    
    setFireworks(prev => [...prev, fw]);
    
    setTimeout(() => {
      setFireworks(prev => prev.filter(f => f.id !== fw.id));
    }, 2000);
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

  const handleBottleClick = async (bottleIdx: number) => {
    if (!gameReady || winner) return;

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
    let poured = 0;
    
    while (
      fromBottle.length > 0 &&
      toBottle.length < 4 &&
      fromBottle[fromBottle.length - 1] === colorToPour
    ) {
      toBottle.push(fromBottle.pop()!);
      poured++;
    }

    if (poured === 0) {
      setSelectedBottle(null);
      return;
    }

    const newBottles = [...bottles];
    newBottles[selectedBottle] = fromBottle;
    newBottles[bottleIdx] = toBottle;

    soundManager.play("pour");
    setBottles(newBottles);
    const newMoves = moves + 1;
    setMoves(newMoves);
    setSelectedBottle(null);

    if (checkBottleFull(toBottle)) {
      triggerFireworks(bottleIdx, toBottle[0]);
      soundManager.play("success");
    }

    const isCompleted = checkIfComplete(newBottles);

    // Send ONLY completion status and moves, NOT bottles!
    try {
      await axios.post(`${API_URL}/api/v1/multiplayer/update`, {
        room_id: roomId,
        player_id: playerId,
        moves: newMoves,
        completed: isCompleted
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (err: any) {
      console.error("Failed to update server:", err);
    }
  };

  if (!bottles || bottles.length === 0) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "20px",
        textAlign: "center"
      }}>
        <h2>⚠️ No Game Data</h2>
        <p>Bottles not loaded. Please try again.</p>
        <button
          onClick={onExit}
          style={{
            padding: "12px 24px",
            background: "rgba(255,0,0,0.7)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          EXIT
        </button>
      </div>
    );
  }

  const bottleCount = bottles.length;
  let COLS, scale, bottleSpacing, rowSpacing;
  
  if (isMobile) {
    if (bottleCount <= 6) {
      COLS = 3;
      scale = 0.5;
      bottleSpacing = 70;
      rowSpacing = 95;
    } else if (bottleCount <= 13) {
      COLS = 4;
      scale = 0.45;
      bottleSpacing = 58;
      rowSpacing = 85;
    } else {
      COLS = 4;
      scale = 0.42;
      bottleSpacing = 55;
      rowSpacing = 80;
    }
  } else {
    COLS = Math.min(bottles.length, 6);
    scale = 0.8;
    bottleSpacing = 100;
    rowSpacing = 150;
  }
  
  const numCols = Math.min(bottleCount, COLS);
  const totalWidth = numCols * bottleSpacing;
  const startX = (window.innerWidth - totalWidth) / 2;
  const startY = 5;

  const getBottlePosition = (idx: number) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    return { 
      x: startX + col * bottleSpacing, 
      y: startY + row * rowSpacing
    };
  };

  const opponent = roomState?.players?.find((p: any) => p.id !== playerId);
  const myStats = roomState?.players?.find((p: any) => p.id === playerId);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
        overflow: "hidden"
      }}
    >
      {fireworks.map(fw => (
        <Fireworks key={fw.id} x={fw.x} y={fw.y} color={fw.color} />
      ))}

      {showVictory && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0,0,0,0.95)",
          padding: isMobile ? "30px" : "50px",
          borderRadius: "25px",
          zIndex: 10000,
          textAlign: "center",
          color: "white",
          boxShadow: "0 0 60px rgba(255,215,0,0.6)",
          minWidth: isMobile ? "90%" : "400px"
        }}>
          <div style={{ fontSize: isMobile ? "3rem" : "5rem", marginBottom: "20px", animation: "bounce 0.6s infinite alternate" }}>
            {winner === playerId ? "🏆" : "😔"}
          </div>
          <h1 style={{ fontSize: isMobile ? "1.8rem" : "3rem", margin: "0 0 15px 0", color: winner === playerId ? "#FFD700" : "#FF6B6B" }}>
            {winner === playerId ? "YOU WON!" : "YOU LOST!"}
          </h1>
          <p style={{ fontSize: isMobile ? "1rem" : "1.3rem", marginBottom: "10px", opacity: 0.9 }}>
            Level {currentLevel} Complete!
          </p>
          <p style={{ fontSize: isMobile ? "0.9rem" : "1.1rem", marginBottom: "35px", opacity: 0.8 }}>
            {winner === playerId 
              ? `✨ Completed in ${moves} moves!` 
              : `${opponent?.name} finished first with ${opponent?.moves} moves`
            }
          </p>
          
          <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={loadNextLevel}
              style={{
                padding: isMobile ? "14px 30px" : "18px 45px",
                background: "linear-gradient(135deg, #11998e, #38ef7d)",
                border: "none",
                borderRadius: "15px",
                color: "white",
                fontSize: isMobile ? "1rem" : "1.3rem",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 6px 25px rgba(17, 153, 142, 0.4)",
                transition: "all 0.3s"
              }}
            >
              ➡️ NEXT LEVEL
            </button>
            
            <button
              onClick={onExit}
              style={{
                padding: isMobile ? "14px 30px" : "18px 45px",
                background: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.3)",
                borderRadius: "15px",
                color: "white",
                fontSize: isMobile ? "1rem" : "1.3rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            >
              🏠 EXIT
            </button>
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
        <button
          onClick={onExit}
          style={{
            padding: isMobile ? "6px 12px" : "8px 16px",
            background: "rgba(255,0,0,0.7)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: isMobile ? "0.75rem" : "0.9rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          ← EXIT
        </button>

        <div style={{
          background: "rgba(255,255,255,0.2)",
          padding: isMobile ? "4px 10px" : "6px 15px",
          borderRadius: "10px",
          color: "white",
          fontSize: isMobile ? "0.7rem" : "0.85rem",
          fontWeight: "bold"
        }}>
          Level {currentLevel} • Room: {roomId}
        </div>

        {!gameReady && (
          <div style={{
            background: "rgba(255,165,0,0.8)",
            padding: isMobile ? "4px 10px" : "6px 15px",
            borderRadius: "10px",
            color: "white",
            fontSize: isMobile ? "0.7rem" : "0.85rem",
            fontWeight: "bold"
          }}>
            ⏳ Starting...
          </div>
        )}
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-around",
        padding: isMobile ? "8px 5px" : "12px",
        gap: isMobile ? "6px" : "10px",
        flexShrink: 0
      }}>
        <div style={{
          background: "linear-gradient(135deg, #11998e, #38ef7d)",
          padding: isMobile ? "8px 12px" : "10px 18px",
          borderRadius: "12px",
          color: "white",
          flex: 1,
          maxWidth: "180px",
          textAlign: "center",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          border: winner === playerId ? "3px solid gold" : "none"
        }}>
          <div style={{ fontSize: isMobile ? "0.65rem" : "0.75rem", opacity: 0.9 }}>YOU</div>
          <div style={{ fontSize: isMobile ? "1rem" : "1.2rem", fontWeight: "bold", margin: "3px 0" }}>
            {myStats?.name || "Player"}
          </div>
          <div style={{ fontSize: isMobile ? "0.85rem" : "1rem" }}>
            {moves} moves
          </div>
          {winner === playerId && (
            <div style={{ fontSize: isMobile ? "1rem" : "1.2rem", marginTop: "3px" }}>🏆</div>
          )}
        </div>

        {opponent ? (
          <div style={{
            background: "linear-gradient(135deg, #f093fb, #f5576c)",
            padding: isMobile ? "8px 12px" : "10px 18px",
            borderRadius: "12px",
            color: "white",
            flex: 1,
            maxWidth: "180px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            border: winner === opponent.id ? "3px solid gold" : "none"
          }}>
            <div style={{ fontSize: isMobile ? "0.65rem" : "0.75rem", opacity: 0.9 }}>OPPONENT</div>
            <div style={{ fontSize: isMobile ? "1rem" : "1.2rem", fontWeight: "bold", margin: "3px 0" }}>
              {opponent.name}
            </div>
            <div style={{ fontSize: isMobile ? "0.85rem" : "1rem" }}>
              {opponent.moves} moves
            </div>
            {winner === opponent.id && (
              <div style={{ fontSize: isMobile ? "1rem" : "1.2rem", marginTop: "3px" }}>🏆</div>
            )}
          </div>
        ) : (
          <div style={{
            background: "rgba(255,255,255,0.2)",
            padding: isMobile ? "8px 12px" : "10px 18px",
            borderRadius: "12px",
            color: "white",
            flex: 1,
            maxWidth: "180px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}>
            <div style={{ fontSize: isMobile ? "0.9rem" : "1rem" }}>
              ⏳ Waiting...
            </div>
          </div>
        )}
      </div>

      <div 
        style={{ 
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          paddingBottom: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "5px",
          WebkitOverflowScrolling: "touch"
        }}
      >
        <div style={{
          position: "relative",
          width: "100%",
          minHeight: "100%"
        }}>
          {bottles.map((colors, idx) => {
            const isSelected = selectedBottle === idx;
            const isFull = checkBottleFull(colors);
            const basePos = getBottlePosition(idx);

            return (
              <div
                key={idx}
                onClick={() => handleBottleClick(idx)}
                style={{
                  position: "absolute",
                  left: basePos.x,
                  top: basePos.y,
                  transform: `scale(${scale}) ${isSelected ? 'translateY(-8px) scale(1.1)' : ''}`,
                  transformOrigin: "center center",
                  cursor: (!gameReady || winner) ? "not-allowed" : "pointer",
                  zIndex: isSelected ? 1000 : 1,
                  transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                  filter: isSelected 
                    ? "drop-shadow(0 0 20px rgba(255,215,0,0.9))" 
                    : isFull 
                      ? "drop-shadow(0 0 15px rgba(255,215,0,0.6))"
                      : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
                  opacity: (!gameReady || winner) ? 0.7 : 1
                }}
              >
                <RealisticBottle
                  colors={colors}
                  position={{ x: 0, y: 0 }}
                  onSelect={() => {}}
                  isSelected={isSelected}
                  isEmpty={colors.length === 0}
                  isFull={isFull}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
