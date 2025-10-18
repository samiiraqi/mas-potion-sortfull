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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
    e.preventDefault();
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
    e.preventDefault();
    if (!dragState) return;
    
    const touch = e.touches ? e.touches[0] : e;
    setDragState({
      ...dragState,
      currentX: touch.clientX,
      currentY: touch.clientY,
    });

    const COLS = isMobile ? 4 : 7;
    const scale = isMobile ? 0.7 : 1;
    const bottleWidth = 60 * scale;
    const spacing = isMobile ? 80 : 100;
    const startX = isMobile ? (window.innerWidth - (COLS * spacing)) / 2 : 100;
    const startY = isMobile ? 150 : 150;
    
    let foundHover = false;
    bottles.forEach((_, idx) => {
      if (idx === dragState.bottleIdx) return;
      const row = Math.floor(idx / COLS);
      const col = idx % COLS;
      const bottleX = startX + col * spacing;
      const bottleY = startY + row * (isMobile ? 140 : 200);
      
      const hitboxSize = isMobile ? 60 : 80;
      if (
        touch.clientX >= bottleX - hitboxSize/2 &&
        touch.clientX <= bottleX + hitboxSize/2 &&
        touch.clientY >= bottleY - hitboxSize/2 &&
        touch.clientY <= bottleY + hitboxSize
      ) {
        setHoverBottle(idx);
        foundHover = true;
      }
    });
    if (!foundHover) {
      setHoverBottle(null);
    }
  };

  const handleEnd = async (e: any) => {
    e.preventDefault();
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

  const COLS = isMobile ? 4 : 7;
  const scale = isMobile ? 0.7 : 1;
  const spacing = isMobile ? 80 : 100;
  const startX = isMobile ? (window.innerWidth - (COLS * spacing)) / 2 : 100;
  const startY = isMobile ? 150 : 150;

  const getBottlePosition = (idx: number) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    return { 
      x: startX + col * spacing, 
      y: startY + row * (isMobile ? 140 : 200) 
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
        width: "100vw",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "10px",
        position: "fixed",
        top: 0,
        left: 0,
        userSelect: "none",
        touchAction: "none",
        overflow: "hidden",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none"
      }}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <button
        onClick={testSound}
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          padding: "10px",
          background: "rgba(255,255,255,0.3)",
          color: "white",
          border: "2px solid white",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: "1.2rem",
          zIndex: 9999,
          width: "45px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        🔊
      </button>

      <h1 style={{ 
        textAlign: "center", 
        color: "white", 
        fontSize: isMobile ? "1.8rem" : "3rem", 
        margin: "10px 0",
        textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
      }}>
        💧 WATER SORT 💧
      </h1>

      <div
        style={{
          textAlign: "center",
          color: "white",
          fontSize: isMobile ? "1.1rem" : "1.5rem",
          marginBottom: "10px",
          fontWeight: "bold"
        }}
      >
        Level {currentLevelId} • Moves {moves}
      </div>

      {message && (
        <div
          style={{
            textAlign: "center",
            color: "#FFD700",
            fontSize: isMobile ? "1.3rem" : "2rem",
            fontWeight: "bold",
            marginBottom: "10px",
            padding: "10px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            animation: "bounce 0.5s"
          }}
        >
          {message}
        </div>
      )}

      <div style={{ 
        position: "relative", 
        height: isMobile ? "calc(100vh - 250px)" : "600px", 
        width: "100%",
        maxWidth: "100vw"
      }}>
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
                transform: `rotate(${isDragging ? tiltAngle : 0}deg) scale(${scale})`,
                transformOrigin: "center center",
                cursor: colors.length > 0 ? "grab" : "not-allowed",
                zIndex: isDragging ? 1000 : 1,
                filter: isTarget ? "drop-shadow(0 0 10px yellow)" : "none",
                transition: isDragging ? "none" : "all 0.2s"
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
          position: "fixed",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          width: "95%",
          maxWidth: "400px"
        }}
      >
        <button
          onClick={() => setCurrentLevelId((p) => Math.max(1, p - 1))}
          disabled={currentLevelId === 1}
          style={{
            flex: 1,
            padding: "12px",
            background: currentLevelId === 1 ? "#666" : "linear-gradient(135deg, #f093fb, #f5576c)",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: currentLevelId === 1 ? "not-allowed" : "pointer",
            opacity: currentLevelId === 1 ? 0.5 : 1,
            color: "white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
        >
          ← PREV
        </button>
        <button
          onClick={() => loadLevel(currentLevelId)}
          style={{
            flex: 1,
            padding: "12px",
            background: "linear-gradient(135deg, #fa709a, #fee140)",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
        >
          ↻
        </button>
        <button
          onClick={() => setCurrentLevelId((p) => p + 1)}
          style={{
            flex: 1,
            padding: "12px",
            background: "linear-gradient(135deg, #f093fb, #f5576c)",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
