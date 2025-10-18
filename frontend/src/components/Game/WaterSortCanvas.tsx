import { useState, useEffect } from "react";
import { gameAPI } from "../../services/api";
import type { Level } from "../../types/game.tsx";
import axios from "axios";
import RealisticBottle from "./RealisticBottle";
import Fireworks from "./Fireworks";
import { soundManager } from "../../utils/sounds";

const API_URL = "https://water-sort-backend.onrender.com";

interface FireworkData {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function WaterSortCanvas() {
  const [level, setLevel] = useState<Level | null>(null);
  const [bottles, setBottles] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [fireworks, setFireworks] = useState<FireworkData[]>([]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    loadLevel(currentLevelId);
  }, [currentLevelId]);

  const loadLevel = async (levelId: number) => {
    try {
      setLoading(true);
      const data = await gameAPI.getLevel(levelId);
      setLevel(data);
      setBottles(data.bottles);
      setMoves(0);
      setMessage("");
      setSelectedBottle(null);
      setFireworks([]);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testSound = () => {
    soundManager.play("click");
  };

  const checkBottleFull = (bottle: string[]): boolean => {
    if (bottle.length !== 4) return false;
    return bottle.every(color => color === bottle[0]);
  };

  const triggerFireworks = (bottleIdx: number, color: string) => {
    const pos = getBottlePosition(bottleIdx);
    const screenX = pos.x + 30;
    const screenY = pos.y + 80;
    
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

  const handleBottleClick = async (bottleIdx: number) => {
    if (selectedBottle === null) {
      if (bottles[bottleIdx].length === 0) {
        return;
      }
      soundManager.play("select");
      setSelectedBottle(bottleIdx);
      return;
    }

    if (selectedBottle === bottleIdx) {
      setSelectedBottle(null);
      return;
    }

    try {
      const res = await axios.post(API_URL + "/api/v1/make-move", {
        bottles: bottles,
        from_bottle: selectedBottle,
        to_bottle: bottleIdx,
      });

      if (res.data.success) {
        soundManager.play("pour");
        setBottles(res.data.bottles);
        setMoves((m) => m + 1);
        setSelectedBottle(null);

        // Check if target bottle is now full
        const targetBottle = res.data.bottles[bottleIdx];
        if (checkBottleFull(targetBottle)) {
          triggerFireworks(bottleIdx, targetBottle[0]);
          soundManager.play("success");
        }

        if (res.data.is_completed) {
          setMessage("🎉 LEVEL COMPLETE! 🎉");
          setTimeout(() => soundManager.play("success"), 300);
        }
      }
    } catch (error: any) {
      setSelectedBottle(null);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
        color: "white", 
        fontSize: "1.5rem" 
      }}>
        Loading...
      </div>
    );
  }
  
  if (!level) return null;

  const COLS = isMobile ? 3 : Math.min(bottles.length, 6);
  const scale = isMobile ? 0.8 : 1;
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

  const COLOR_MAP: { [key: string]: string } = {
    red: '#FF3B3B',
    blue: '#3B82F6',
    green: '#10B981',
    purple: '#A855F7',
    yellow: '#FBBF24',
    orange: '#F97316',
    cyan: '#06B6D4',
    pink: '#EC4899'
  };

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
      {/* Fireworks */}
      {fireworks.map(fw => (
        <Fireworks key={fw.id} x={fw.x} y={fw.y} color={fw.color} />
      ))}

      <div style={{ 
        padding: "15px",
        textAlign: "center",
        color: "white",
        flexShrink: 0
      }}>
        <button
          onClick={testSound}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            padding: "10px",
            background: "rgba(255,255,255,0.25)",
            color: "white",
            border: "3px solid rgba(255,255,255,0.5)",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "1.3rem",
            zIndex: 9999,
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}
        >
          🔊
        </button>

        <h1 style={{ 
          fontSize: isMobile ? "2rem" : "3.5rem", 
          margin: "10px 0",
          textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
          background: "linear-gradient(to right, #FFD700, #FFA500, #FFD700)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "900"
        }}>
          💧 WATER SORT PUZZLE 💧
        </h1>

        <div style={{
          fontSize: isMobile ? "1.1rem" : "1.5rem",
          fontWeight: "bold",
          marginTop: "8px",
          background: "rgba(255,255,255,0.2)",
          display: "inline-block",
          padding: "8px 25px",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          border: "2px solid rgba(255,255,255,0.3)"
        }}>
          Level {currentLevelId} • Moves {moves}
        </div>

        {message && (
          <div style={{
            color: "#FFD700",
            fontSize: isMobile ? "1.5rem" : "2.5rem",
            fontWeight: "900",
            marginTop: "15px",
            textShadow: "0 0 20px rgba(255,215,0,0.8), 3px 3px 6px rgba(0,0,0,0.5)",
            animation: "bounce 0.6s infinite alternate"
          }}>
            {message}
          </div>
        )}
      </div>

      <div 
        style={{ 
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          paddingBottom: "100px",
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
                  cursor: "pointer",
                  zIndex: isSelected ? 1000 : 1,
                  transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                  filter: isSelected 
                    ? "drop-shadow(0 0 30px rgba(255,215,0,0.9))" 
                    : isFull 
                      ? "drop-shadow(0 0 20px rgba(255,215,0,0.6))"
                      : "drop-shadow(0 4px 12px rgba(0,0,0,0.4))"
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

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, rgba(102, 126, 234, 0.95), rgba(102, 126, 234, 0.85))",
          padding: "15px",
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          boxShadow: "0 -6px 20px rgba(0,0,0,0.3)",
          backdropFilter: "blur(10px)",
          zIndex: 999
        }}
      >
        <button
          onClick={() => setCurrentLevelId((p) => Math.max(1, p - 1))}
          disabled={currentLevelId === 1}
          style={{
            flex: 1,
            maxWidth: "140px",
            padding: "16px 12px",
            background: currentLevelId === 1 
              ? "rgba(100,100,100,0.5)" 
              : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            border: "none",
            borderRadius: "15px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: currentLevelId === 1 ? "not-allowed" : "pointer",
            opacity: currentLevelId === 1 ? 0.5 : 1,
            color: "white",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            transition: "all 0.2s"
          }}
        >
          ← PREV
        </button>
        <button
          onClick={() => loadLevel(currentLevelId)}
          style={{
            flex: 1,
            maxWidth: "120px",
            padding: "16px 12px",
            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            border: "none",
            borderRadius: "15px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "white",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            transition: "all 0.2s"
          }}
        >
          ↻ RESTART
        </button>
        <button
          onClick={() => setCurrentLevelId((p) => p + 1)}
          style={{
            flex: 1,
            maxWidth: "140px",
            padding: "16px 12px",
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            border: "none",
            borderRadius: "15px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "white",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            transition: "all 0.2s"
          }}
        >
          NEXT →
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
        button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
}
