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

    const COLS = isMobile ? 3 : 7;
    const scale = isMobile ? 0.65 : 1;
    const bottleSpacing = isMobile ? 90 : 100;
    const containerWidth = isMobile ? window.innerWidth : 800;
    const startX = (containerWidth - (COLS * bottleSpacing)) / 2;
    const startY = isMobile ? 10 : 20;
    
    let foundHover = false;
    bottles.forEach((_, idx) => {
      if (idx === dragState.bottleIdx) return;
      const row = Math.floor(idx / COLS);
      const col = idx % COLS;
      const bottleX = startX + col * bottleSpacing + 30;
      const bottleY = startY + row * 130;
      
      const hitboxSize = 70;
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

  const COLS = isMobile ? 3 : 7;
  const scale = isMobile ? 0.65 : 1;
  const bottleSpacing = isMobile ? 90 : 100;
  const containerWidth = isMobile ? window.innerWidth : 800;
  const startX = (containerWidth - (COLS * bottleSpacing)) / 2;
  const startY = isMobile ? 10 : 20;

  const getBottlePosition = (idx: number) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    return { 
      x: startX + col * bottleSpacing + 30, 
      y: startY + row * 130
    };
  };

  let tiltAngle = 0;
  if (dragState) {
    const dx = dragState.currentX - dragState.startX;
    tiltAngle = Math.min(Math.max(dx * 0.5, -40), 40);
  }

  const totalRows = Math.ceil(bottles.length / COLS);
  const bottlesAreaHeight = totalRows * 130;

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
        touchAction: "none",
        overflow: "hidden",
        WebkitUserSelect: "none"
      }}
    >
      {/* Header */}
      <div style={{ 
        padding: "10px",
        textAlign: "center",
        color: "white",
        flexShrink: 0
      }}>
        <button
          onClick={testSound}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "8px",
            background: "rgba(255,255,255,0.3)",
            color: "white",
            border: "2px solid white",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "1.2rem",
            zIndex: 9999,
            width: "40px",
            height: "40px"
          }}
        >
          🔊
        </button>

        <h1 style={{ 
          fontSize: isMobile ? "1.5rem" : "2.5rem", 
          margin: "5px 0",
          textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
        }}>
          💧 WATER SORT 💧
        </h1>

        <div style={{
          fontSize: isMobile ? "1rem" : "1.3rem",
          fontWeight: "bold",
          marginTop: "5px"
        }}>
          Level {currentLevelId} • Moves {moves}
        </div>

        {message && (
          <div style={{
            color: "#FFD700",
            fontSize: isMobile ? "1.2rem" : "1.8rem",
            fontWeight: "bold",
            marginTop: "5px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
          }}>
            {message}
          </div>
        )}
      </div>

      {/* Scrollable bottles area */}
      <div 
        style={{ 
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          paddingBottom: "80px",
          WebkitOverflowScrolling: "touch"
        }}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <div style={{
          position: "relative",
          height: bottlesAreaHeight + 50,
          width: "100%",
          minHeight: "100%"
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
      </div>

      {/* Fixed buttons at bottom */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(to top, rgba(102, 126, 234, 0.95), rgba(102, 126, 234, 0.8))",
          padding: "10px",
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          boxShadow: "0 -4px 10px rgba(0,0,0,0.2)",
          zIndex: 999
        }}
      >
        <button
          onClick={() => setCurrentLevelId((p) => Math.max(1, p - 1))}
          disabled={currentLevelId === 1}
          style={{
            flex: 1,
            maxWidth: "120px",
            padding: "14px 10px",
            background: currentLevelId === 1 ? "#666" : "linear-gradient(135deg, #f093fb, #f5576c)",
            border: "none",
            borderRadius: "12px",
            fontSize: "0.95rem",
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
            maxWidth: "100px",
            padding: "14px 10px",
            background: "linear-gradient(135deg, #fa709a, #fee140)",
            border: "none",
            borderRadius: "12px",
            fontSize: "0.95rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "white",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
        >
          ↻ RESTART
        </button>
        <button
          onClick={() => setCurrentLevelId((p) => p + 1)}
          style={{
            flex: 1,
            maxWidth: "120px",
            padding: "14px 10px",
            background: "linear-gradient(135deg, #f093fb, #f5576c)",
            border: "none",
            borderRadius: "12px",
            fontSize: "0.95rem",
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
