import { useState, useEffect, useRef } from "react";
import { gameAPI } from "../../services/api";
import type { Level } from "../../types/game.tsx";
import axios from "axios";
import RealisticBottle from "./RealisticBottle";
import { soundManager } from "../../utils/sounds";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

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
    console.log("TEST SOUND CLICKED");
    soundManager.play("click");
  };

  const handleMouseDown = (e: React.MouseEvent, bottleIdx: number) => {
    if (bottles[bottleIdx].length === 0) return;
    console.log("Playing select sound");
    soundManager.play("select");
    setDragState({
      bottleIdx,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;
    setDragState({
      ...dragState,
      currentX: e.clientX,
      currentY: e.clientY,
    });

    const COLS = 7;
    let foundHover = false;
    bottles.forEach((_, idx) => {
      if (idx === dragState.bottleIdx) return;
      const row = Math.floor(idx / COLS);
      const col = idx % COLS;
      const bottleX = 100 + col * 100;
      const bottleY = 150 + row * 200;
      if (
        e.clientX >= bottleX - 30 &&
        e.clientX <= bottleX + 90 &&
        e.clientY >= bottleY - 30 &&
        e.clientY <= bottleY + 190
      ) {
        setHoverBottle(idx);
        foundHover = true;
      }
    });
    if (!foundHover) {
      setHoverBottle(null);
    }
  };

  const handleMouseUp = async () => {
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
          console.log("Playing pour sound");
          soundManager.play("pour");
          setBottles(res.data.bottles);
          setDisplayBottles(res.data.bottles);
          setMoves((m) => m + 1);

          if (res.data.is_completed) {
            setMessage("Level Complete!");
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

  if (loading) return <div>Loading...</div>;
  if (!level) return null;

  const COLS = 7;
  const getBottlePosition = (idx: number) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    return { x: 100 + col * 100, y: 150 + row * 200 };
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
        padding: "30px",
        position: "relative",
        userSelect: "none",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <button
        onClick={testSound}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          padding: "15px 30px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "1.2rem",
          fontWeight: "bold",
          zIndex: 9999,
        }}
      >
        TEST SOUND
      </button>

      <h1 style={{ textAlign: "center", color: "white", fontSize: "3rem" }}>
        WATER SORT PUZZLE
      </h1>

      <div
        style={{
          textAlign: "center",
          color: "white",
          fontSize: "1.5rem",
          marginBottom: "30px",
        }}
      >
        Level: {currentLevelId} | Moves: {moves}
      </div>

      {message && (
        <div
          style={{
            textAlign: "center",
            color: "yellow",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          {message}
        </div>
      )}

      <div style={{ position: "relative", height: "600px" }}>
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
                  ? "rotate(" + tiltAngle + "deg)"
                  : isTarget
                  ? "scale(1.1)"
                  : "scale(1)",
                cursor: colors.length > 0 ? "grab" : "not-allowed",
                zIndex: isDragging ? 1000 : 1,
              }}
              onMouseDown={(e) => handleMouseDown(e, idx)}
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
          gap: "15px",
          marginTop: "30px",
        }}
      >
        <button
          onClick={() => setCurrentLevelId((p) => Math.max(1, p - 1))}
          disabled={currentLevelId === 1}
          style={{
            padding: "15px 30px",
            background: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: currentLevelId === 1 ? "not-allowed" : "pointer",
          }}
        >
          PREV
        </button>
        <button
          onClick={() => loadLevel(currentLevelId)}
          style={{
            padding: "15px 30px",
            background: "yellow",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          RESTART
        </button>
        <button
          onClick={() => setCurrentLevelId((p) => p + 1)}
          style={{
            padding: "15px 30px",
            background: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
