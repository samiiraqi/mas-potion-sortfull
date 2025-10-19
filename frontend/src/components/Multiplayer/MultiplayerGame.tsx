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
  const [bottles, setBottles] = useState<string[][]>(roomData.bottles || []);
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [roomState, setRoomState] = useState(roomData.room_state);
  const [fireworks, setFireworks] = useState<FireworkData[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const playerId = roomData.player_id;
  const roomId = roomData.room_id;

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // CRITICAL FIX: Initialize bottles if not available
  useEffect(() => {
    if (!bottles || bottles.length === 0) {
      if (roomData.bottles && roomData.bottles.length > 0) {
        setBottles(roomData.bottles);
      }
    }
  }, [roomData, bottles]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/multiplayer/room/${roomId}`);
        setRoomState(res.data);
        
        if (res.data.winner && !winner) {
          setWinner(res.data.winner);
          if (res.data.winner === playerId) {
            soundManager.play("success");
          }
        }
      } catch (err) {
        console.error("Failed to fetch room state:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [roomId, winner, playerId]);

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
      setFireeworks(prev => prev.filter(f => f.id !== fw.id));
    }, 2000);
  };

  const checkIfComplete = (newBottles: string[][]): boolean => {
    for (const bottle of newBottles) {
      if (bottle.length === 0) continue;
      if (bottle.length !== 4) return false;
      if (!bottle.every(color => color === bottle[0])) return false;
    }
    return true;
  };

  const handleBottleClick = async (bottleIdx: number) => {
    if (winner) return;

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
    setMoves(m => m + 1);
    setSelectedBottle(null);

    if (checkBottleFull(toBottle)) {
      triggerFireworks(bottleIdx, toBottle[0]);
      soundManager.play("success");
    }

    const isCompleted = checkIfComplete(newBottles);

    try {
      await axios.post(`${API_URL}/api/v1/multiplayer/update`, {
        room_id: roomId,
        player_id: playerId,
        moves: moves + 1,
        completed: isCompleted
      });
    } catch (err) {
      console.error("Failed to update server:", err);
    }
  };

  // COMPACT MOBILE LAYOUT
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

      {/* COMPACT TOP BAR */}
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
          Room: {roomId}
        </div>
      </div>

      {/* ULTRA-COMPACT PLAYER STATS */}
      <div style={{
        display: "flex",
        justifyContent: "space-around",
        padding: isMobile ? "8px 5px" : "12px",
        gap: isMobile ? "6px" : "10px",
        flexShrink: 0
      }}>
        {/* YOU */}
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

        {/* OPPONENT */}
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

      {/* SCROLLABLE GAME AREA */}
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
                  cursor: winner ? "not-allowed" : "pointer",
                  zIndex: isSelected ? 1000 : 1,
                  transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                  filter: isSelected 
                    ? "drop-shadow(0 0 20px rgba(255,215,0,0.9))" 
                    : isFull 
                      ? "drop-shadow(0 0 15px rgba(255,215,0,0.6))"
                      : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
                  opacity: winner ? 0.7 : 1
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
    </div>
  );
}
