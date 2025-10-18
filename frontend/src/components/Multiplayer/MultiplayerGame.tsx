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
      setFireworks(prev => prev.filter(f => f.id !== fw.id));
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

  const COLS = isMobile ? 3 : Math.min(bottles.length, 6);
  const scale = isMobile ? 0.7 : 0.9;
  const bottleSpacing = isMobile ? 85 : 110;
  const numCols = Math.min(bottles.length, COLS);
  const totalWidth = numCols * bottleSpacing;
  const startX = (window.innerWidth - totalWidth) / 2;
  const startY = 40;

  const getBottlePosition = (idx: number) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    return { 
      x: startX + col * bottleSpacing, 
      y: startY + row * 170
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

      <div style={{
        padding: "15px",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <button
          onClick={onExit}
          style={{
            padding: "10px 20px",
            background: "rgba(255,0,0,0.7)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          ← EXIT
        </button>

        <div style={{
          background: "rgba(255,255,255,0.2)",
          padding: "10px 20px",
          borderRadius: "12px",
          color: "white",
          fontSize: "0.9rem"
        }}>
          Room: <strong>{roomId}</strong>
        </div>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "20px",
        gap: "15px",
        flexWrap: "wrap"
      }}>
        <div style={{
          background: "linear-gradient(135deg, #11998e, #38ef7d)",
          padding: "15px 25px",
          borderRadius: "15px",
          color: "white",
          minWidth: "150px",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
          border: winner === playerId ? "4px solid gold" : "none"
        }}>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>YOU</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "5px 0" }}>
            {myStats?.name || "Player"}
          </div>
          <div style={{ fontSize: "1.2rem" }}>
            {moves} moves
          </div>
          {winner === playerId && (
            <div style={{ fontSize: "1.5rem", marginTop: "5px" }}>🏆 WINNER!</div>
          )}
        </div>

        {opponent ? (
          <div style={{
            background: "linear-gradient(135deg, #f093fb, #f5576c)",
            padding: "15px 25px",
            borderRadius: "15px",
            color: "white",
            minWidth: "150px",
            textAlign: "center",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            border: winner === opponent.id ? "4px solid gold" : "none"
          }}>
            <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>OPPONENT</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", margin: "5px 0" }}>
              {opponent.name}
            </div>
            <div style={{ fontSize: "1.2rem" }}>
              {opponent.moves} moves
            </div>
            {winner === opponent.id && (
              <div style={{ fontSize: "1.5rem", marginTop: "5px" }}>🏆 WINNER!</div>
            )}
          </div>
        ) : (
          <div style={{
            background: "rgba(255,255,255,0.2)",
            padding: "15px 25px",
            borderRadius: "15px",
            color: "white",
            minWidth: "150px",
            textAlign: "center",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)"
          }}>
            <div style={{ fontSize: "1.2rem" }}>
              ⏳ Waiting for opponent...
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
          paddingBottom: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "20px"
        }}
      >
        <div style={{
          position: "relative",
          width: "100%"
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
                  transform: `scale(${scale}) ${isSelected ? 'translateY(-15px) scale(1.1)' : ''}`,
                  transformOrigin: "center center",
                  cursor: winner ? "not-allowed" : "pointer",
                  zIndex: isSelected ? 1000 : 1,
                  transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                  filter: isSelected 
                    ? "drop-shadow(0 0 30px rgba(255,215,0,0.9))" 
                    : isFull 
                      ? "drop-shadow(0 0 20px rgba(255,215,0,0.6))"
                      : "drop-shadow(0 4px 12px rgba(0,0,0,0.4))",
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
