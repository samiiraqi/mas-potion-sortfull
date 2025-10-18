import { useState, useEffect } from "react";
import { gameAPI } from "../../services/api";
import type { Level } from "../../types/game.tsx";
import axios from "axios";
import RealisticBottle from "./RealisticBottle";
import { soundManager } from "../../utils/sounds";

const API_URL = "https://water-sort-backend.onrender.com";

export default function WaterSortCanvas() {
  const [level, setLevel] = useState<Level | null>(null);
  const [bottles, setBottles] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [debugMsg, setDebugMsg] = useState("");

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
      setDebugMsg("");
      setSelectedBottle(null);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const testSound = () => {
    soundManager.play("click");
  };

  const handleBottleClick = async (bottleIdx: number) => {
    // First click - select bottle
    if (selectedBottle === null) {
      if (bottles[bottleIdx].length === 0) {
        setDebugMsg("❌ Can't select empty bottle!");
        return;
      }
      soundManager.play("select");
      setSelectedBottle(bottleIdx);
      setDebugMsg(`✅ Selected bottle ${bottleIdx}. Click a bottle to pour into!`);
      return;
    }

    // Second click - pour or deselect
    if (selectedBottle === bottleIdx) {
      // Clicked same bottle - deselect
      setSelectedBottle(null);
      setDebugMsg("Deselected");
      return;
    }

    // Try to pour
    const fromBottle = bottles[selectedBottle];
    const toBottle = bottles[bottleIdx];

    setDebugMsg(`⏳ Trying to pour from ${selectedBottle} to ${bottleIdx}...`);

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
        setDebugMsg(`✅ ${res.data.message}`);
        setSelectedBottle(null);

        if (res.data.is_completed) {
          setMessage("🎉 Level Complete! 🎉");
          setTimeout(() => soundManager.play("success"), 300);
        }
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.message;
      setDebugMsg(`❌ ${errorMsg}`);
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

  const COLS = isMobile ? 3 : 7;
  const scale = isMobile ? 0.7 : 1;
  const bottleSpacing = isMobile ? 90 : 100;
  const containerWidth = isMobile ? window.innerWidth : 800;
  const startX = (containerWidth - (COLS * bottleSpacing)) / 2;
  const startY = 20;

  const getBottlePosition = (idx: number) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    return { 
      x: startX + col * bottleSpacing + 30, 
      y: startY + row * 140
    };
  };

  const totalRows = Math.ceil(bottles.length / COLS);
  const bottlesAreaHeight = totalRows * 140 + 100;

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

        {debugMsg && (
          <div style={{
            background: "rgba(0,0,0,0.8)",
            color: selectedBottle !== null ? "yellow" : "white",
            padding: "8px 15px",
            borderRadius: "8px",
            marginTop: "10px",
            fontSize: "0.9rem",
            display: "inline-block",
            maxWidth: "90%"
          }}>
            {debugMsg}
          </div>
        )}

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

      <div 
        style={{ 
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
          paddingBottom: "80px",
          WebkitOverflowScrolling: "touch"
        }}
      >
        <div style={{
          position: "relative",
          height: bottlesAreaHeight,
          width: "100%"
        }}>
          {bottles.map((colors, idx) => {
            const isSelected = selectedBottle === idx;
            const basePos = getBottlePosition(idx);

            return (
              <div
                key={idx}
                onClick={() => handleBottleClick(idx)}
                style={{
                  position: "absolute",
                  left: basePos.x,
                  top: basePos.y,
                  transform: `scale(${scale}) ${isSelected ? 'translateY(-10px)' : ''}`,
                  transformOrigin: "center center",
                  cursor: "pointer",
                  zIndex: isSelected ? 1000 : 1,
                  filter: isSelected ? "drop-shadow(0 0 25px yellow)" : "none",
                  transition: "all 0.2s",
                  outline: isSelected ? "5px solid yellow" : "none",
                  borderRadius: "10px"
                }}
              >
                <RealisticBottle
                  colors={colors}
                  position={{ x: 0, y: 0 }}
                  onSelect={() => {}}
                  isSelected={isSelected}
                  isEmpty={colors.length === 0}
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
            color: "white"
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
            color: "white"
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
            color: "white"
          }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
