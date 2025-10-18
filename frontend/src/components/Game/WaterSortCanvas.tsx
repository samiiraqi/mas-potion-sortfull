import { useState, useEffect } from "react";
import { gameAPI } from "../../services/api";
import type { Level } from "../../types/game.tsx";
import axios from "axios";
import RealisticBottle from "./RealisticBottle";
import { soundManager } from "../../utils/sounds";

const API_URL = "https://water-sort-backend.onrender.com";

interface DragState {
  bottleIdx: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export default function WaterSortCanvas() {
  const [level, setLevel] = useState<Level | null>(null);
  const [bottles, setBottles] = useState<string[][]>([]);
  const [displayBottles, setDisplayBottles] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [hoverBottle, setHoverBottle] = useState<number | null>(null);

  useEffect(() => {
    loadLevel(currentLevelId);
  }, [currentLevelId]);

  const loadLevel = async (levelId: number) => {
    try {
      setLoading(true);
      const data = await gameAPI.getLevel(levelId);
      setLevel(data);
      setBottles(data.bottles);
      setDisplayBottles(data.bottles);
      setMoves(0);
      setMessage("");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testSound = () => {
    soundManager.play("click");
  };

  const handleStart = (e: any, bottleIdx: number) => {
    if (bottles[bottleIdx].length === 0) return;
    
    const touch = e.touches ? e.touches[0] : e;
    soundManager.play("select");
    
    setDragState({
      bottleIdx,
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
    });
  };

  const handleMove = (e: any) => {
    if (!dragState) return;
    
    const touch = e.touches ? e.touches[0] : e;
    setDragState({
      ...dragState,
      currentX: touch.clientX,
      currentY: touch.clientY,
    });

    const isMobile = window.innerWidth < 768;
    const COLS = isMobile ? 3 : 7;
    const bottleSize = isMobile ? 70 : 100;
    const startX = isMobile ? 20 : 100;
    const startY = isMobile ? 100 : 150;
    
    let foundHover = false;
    bottles.forEach((_, idx) => {
      if (idx === dragState.bottleIdx) return;
      const row = Math.floor(idx / COLS);
      const col = idx % COLS;
      const bottleX = startX + col * bottleSize;
      const bottleY = startY + row * (isMobile ? 120 : 200);
      
      if (
        touch.clientX >= bottleX - 30 &&
        touch.clientX <= bottleX + 90 &&
        touch.clientY >= bottleY - 30 &&
        touch.clientY <= bottleY + 190
      ) {
        setHoverBottle(idx);
        foundHover = true;
      }
    });
    if (!foundHover) {
      setHoverBottle(null);
    }
  };

  const handleEnd = async () => {
    if (!dragState) return;
    const fromIdx = dragState.bottleIdx;
    const toIdx = hoverBottle;

    if (toIdx !== null && toIdx !== fromIdx) {
      try {
        const res = await axios.post(API_URL + "/api/v1/make-move", {
          bottles: displayBottles,
          from_bottle: fromIdx,
          to_bottle: toIdx,
        });

        if (res.data.success) {
          soundManager.play("pour");
          setBottles(res.data.bottles);
          setDisplayBottles(res.data.bottles);
          setMoves((m) => m + 1);

          if (res.data.is_completed) {
            setMessage("🎉 Level Complete! 🎉");
            setTimeout(() => soundManager.play("success"), 300);
          }
        }
      } catch (error) {
        console.error("Pour failed:", error);
      }
    }

    setDragState(null);
    setHoverBottle(null);
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", fontSize: "1.5rem" }}>Loading...</div>;
  if (!level) return null;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const COLS = isMobile ? 3 : 7;
  const bottleSize = isMobile ? 70 : 100;
  const startX = isMobile ? 20 : 100;
  const startY = isMobile ? 100 : 150;

  const getBottlePosition = (idx: number) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    return { 
      x: startX + col * bottleSize, 
      y: startY + row * (isMobile ? 120 : 200) 
    };
  };

  let tiltAngle = 0;
  if (dragState) {
    const dx = dragState.currentX - dragState.startX;
    tiltAngle = Math.min(Math.max(dx * 0.5, -40), 40);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: isMobile ? "10px" : "30px",
        position: "relative",
        userSelect: "none",
        touchAction: "none",
        overflow: "hidden"
      }}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      
      <button
        onClick={testSound}
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          padding: isMobile ? "10px 15px" : "15px 30px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: isMobile ? "0.9rem" : "1.2rem",
          fontWeight: "bold",
          zIndex: 9999,
        }}
      >
        🔊
      </button>

      <h1 style={{ textAlign: "center", color: "white", fontSize: isMobile ? "1.5rem" : "3rem", marginBottom: "10px" }}>
        💧 WATER SORT 💧
      </h1>

      <div
        style={{
          textAlign: "center",
          color: "white",
          fontSize: isMobile ? "1rem" : "1.5rem",
          marginBottom: isMobile ? "15px" : "30px",
        }}
      >
        Level: {currentLevelId} | Moves: {moves}
      </div>

      {message && (
        <div
          style={{
            textAlign: "center",
            color: "yellow",
            fontSize: isMobile ? "1.2rem" : "2rem",
            fontWeight: "bold",
            marginBottom: "20px",
            padding: "10px"
          }}
        >
          {message}
        </div>
      )}

      <div style={{ position: "relative", height: isMobile ? "500px" : "600px", width: "100%" }}>
        {displayBottles.map((colors, idx) => {
          const isDragging = dragState?.bottleIdx === idx;
          const isTarget = hoverBottle === idx;
          const basePos = getBottlePosition(idx);
          const position = isDragging
            ? { x: dragState.currentX - 30, y: dragState.currentY - 80 }
            : basePos;

          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: position.x,
                top: position.y,
                transform: isDragging
                  ? `rotate(${tiltAngle}deg) scale(${isMobile ? 0.8 : 1})`
                  : isTarget
                  ? `scale(${isMobile ? 0.9 : 1.1})`
                  : `scale(${isMobile ? 0.8 : 1})`,
                cursor: colors.length > 0 ? "grab" : "not-allowed",
                zIndex: isDragging ? 1000 : 1,
              }}
              onMouseDown={(e) => handleStart(e, idx)}
              onTouchStart={(e) => handleStart(e, idx)}
            >
              <RealisticBottle
                colors={colors}
                position={{ x: 0, y: 0 }}
                onSelect={() => {}}
                isSelected={isDragging}
                isEmpty={colors.length === 0}
              />
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: isMobile ? "10px" : "15px",
          marginTop: "20px",
          flexWrap: "wrap",
          padding: isMobile ? "0 10px" : "0"
        }}
      >
        <button
          onClick={() => setCurrentLevelId((p) => Math.max(1, p - 1))}
          disabled={currentLevelId === 1}
          style={{
            padding: isMobile ? "12px 20px" : "15px 30px",
            background: currentLevelId === 1 ? "#666" : "white",
            border: "none",
            borderRadius: "12px",
            fontSize: isMobile ? "0.9rem" : "1.1rem",
            fontWeight: "bold",
            cursor: currentLevelId === 1 ? "not-allowed" : "pointer",
            opacity: currentLevelId === 1 ? 0.5 : 1
          }}
        >
          ← PREV
        </button>
        <button
          onClick={() => loadLevel(currentLevelId)}
          style={{
            padding: isMobile ? "12px 20px" : "15px 30px",
            background: "yellow",
            border: "none",
            borderRadius: "12px",
            fontSize: isMobile ? "0.9rem" : "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ↻ RESTART
        </button>
        <button
          onClick={() => setCurrentLevelId((p) => p + 1)}
          style={{
            padding: isMobile ? "12px 20px" : "15px 30px",
            background: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: isMobile ? "0.9rem" : "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
