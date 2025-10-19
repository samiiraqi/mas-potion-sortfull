import { useState, useEffect } from "react";
import { gameAPI } from "../../services/api";
import type { Level } from "../../types/game.tsx";
import axios from "axios";
import RealisticBottle from "./RealisticBottle";
import Fireworks from "./Fireworks";
import { soundManager } from "../../utils/sounds";
import { storage } from "../../utils/storage";
import { musicManager } from "../../utils/music";
import { themeManager, type Theme } from "../../utils/theme";
import MultiplayerLobby from "../Multiplayer/MultiplayerLobby";
import MultiplayerGame from "../Multiplayer/MultiplayerGame";
import LevelSelect from "./LevelSelect";

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
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [bestMoves, setBestMoves] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');
  const [showMenu, setShowMenu] = useState(false);
  const [showMultiplayerLobby, setShowMultiplayerLobby] = useState(false);
  const [multiplayerData, setMultiplayerData] = useState<any>(null);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const savedTheme = themeManager.loadTheme();
    setCurrentTheme(savedTheme);
  }, []);

  useEffect(() => {
    loadLevel(currentLevelId);
  }, [currentLevelId]);

  useEffect(() => {
    let interval: any;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const loadLevel = async (levelId: number) => {
    try {
      setLoading(true);
      const data = await gameAPI.getLevel(levelId);
      setLevel(data);
      setBottles(data.bottles);
      setMoves(0);
      setTimer(0);
      setTimerRunning(false);
      setMessage("");
      setSelectedBottle(null);
      setFireworks([]);
      setEarnedStars(0);
      
      const stats = storage.getLevelStats(levelId);
      setBestMoves(stats.bestMoves);
      setBestTime(stats.bestTime);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMusic = () => {
    const enabled = musicManager.toggle();
    setMusicEnabled(enabled);
    soundManager.play("click");
  };

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    themeManager.saveTheme(theme);
    soundManager.play("click");
    setShowMenu(false);
  };

  const shareScore = () => {
    const text = `🎮 I completed Water Sort Level ${currentLevelId} with ${earnedStars}⭐ in ${moves} moves! Can you beat it? 💧`;
    const url = 'https://water-sort-frontend.onrender.com';
    
    if (navigator.share) {
      navigator.share({
        title: 'Water Sort Puzzle',
        text: text,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      alert('Score copied to clipboard! Share it with friends! 🎉');
    }
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
    if (moves === 0 && !timerRunning) {
      setTimerRunning(true);
      musicManager.playBackgroundMusic();
    }

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

        const targetBottle = res.data.bottles[bottleIdx];
        if (checkBottleFull(targetBottle)) {
          triggerFireworks(bottleIdx, targetBottle[0]);
          soundManager.play("success");
        }

        if (res.data.is_completed) {
          setTimerRunning(false);
          
          const optimalMoves = level?.optimal_moves || 20;
          
          let stars = 1;
          if (moves + 1 <= optimalMoves) {
            stars = 3;
          } else if (moves + 1 <= optimalMoves + 5) {
            stars = 2;
          }
          
          setEarnedStars(stars);
          
          const starEmoji = '⭐'.repeat(stars);
          setMessage(`🎉 LEVEL COMPLETE! ${starEmoji}`);
          
          storage.saveLevelStats(currentLevelId, moves + 1, timer, optimalMoves);
          
          const newStats = storage.getLevelStats(currentLevelId);
          setBestMoves(newStats.bestMoves);
          setBestTime(newStats.bestTime);
          
          setTimeout(() => soundManager.play("success"), 300);
        }
      }
    } catch (error: any) {
      setSelectedBottle(null);
    }
  };

  const handleJoinRoom = (data: any) => {
    setMultiplayerData(data);
    setShowMultiplayerLobby(false);
  };

  const handleExitMultiplayer = () => {
    setMultiplayerData(null);
  };

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    setShowLevelSelect(false);
  };

  if (multiplayerData) {
    return (
      <MultiplayerGame 
        roomData={multiplayerData} 
        onExit={handleExitMultiplayer}
      />
    );
  }

  if (showLevelSelect) {
    return (
      <LevelSelect 
        onSelectLevel={handleSelectLevel}
        onClose={() => setShowLevelSelect(false)}
        currentTheme={currentTheme}
      />
    );
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: themeManager.getTheme(currentTheme).background, 
        color: "white", 
        fontSize: "1.5rem" 
      }}>
        Loading...
      </div>
    );
  }
  
  if (!level) return null;

  const theme = themeManager.getTheme(currentTheme);
  
  // SMART LAYOUT - Adjust based on bottle count!
  const bottleCount = bottles.length;
  let COLS, scale, bottleSpacing, rowSpacing;
  
  if (isMobile) {
    // Mobile layout
    if (bottleCount <= 6) {
      COLS = 3;
      scale = 0.65;
      bottleSpacing = 80;
      rowSpacing = 120;
    } else if (bottleCount <= 13) {
      COLS = 4;
      scale = 0.6;
      bottleSpacing = 70;
      rowSpacing = 110;
    } else {
      COLS = 4;
      scale = 0.5;
      bottleSpacing = 60;
      rowSpacing = 100;
    }
  } else {
    // Desktop layout
    if (bottleCount <= 6) {
      COLS = 6;
      scale = 1.0;
      bottleSpacing = 120;
      rowSpacing = 180;
    } else if (bottleCount <= 13) {
      COLS = 7;
      scale = 0.95;
      bottleSpacing = 110;
      rowSpacing = 170;
    } else {
      COLS = 6;
      scale = 0.9;
      bottleSpacing = 105;
      rowSpacing = 165;
    }
  }
  
  const numCols = Math.min(bottleCount, COLS);
  const totalWidth = numCols * bottleSpacing;
  const startX = (window.innerWidth - totalWidth) / 2;
  const startY = 10;

  const getBottlePosition = (idx: number) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    return { 
      x: startX + col * bottleSpacing, 
      y: startY + row * rowSpacing
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
    pink: '#EC4899',
    lime: '#84CC16',
    magenta: '#D946EF',
    teal: '#14B8A6',
    coral: '#FB7185'
  };

  const getDifficultyBadge = () => {
    if (currentLevelId <= 10) return { text: '🟢 EASY', color: '#10B981' };
    if (currentLevelId <= 25) return { text: '🟡 MEDIUM', color: '#F59E0B' };
    if (currentLevelId <= 35) return { text: '🔴 HARD', color: '#EF4444' };
    return { text: '🟣 EXPERT', color: '#8B5CF6' };
  };

  const difficulty = getDifficultyBadge();
  const totalStars = storage.getTotalStars();
  const currentStats = storage.getLevelStats(currentLevelId);

  const totalRows = Math.ceil(bottleCount / COLS);
  const bottlesAreaHeight = totalRows * rowSpacing + 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: theme.background,
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

      {showMultiplayerLobby && (
        <MultiplayerLobby 
          onJoinRoom={handleJoinRoom}
          onClose={() => setShowMultiplayerLobby(false)}
        />
      )}

      {showMenu && (
        <div style={{
          position: "absolute",
          top: isMobile ? "120px" : "160px",
          right: "50%",
          transform: "translateX(50%)",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "15px",
          padding: "15px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          zIndex: 9998,
          backdropFilter: "blur(10px)"
        }}>
          <div style={{ fontWeight: "bold", marginBottom: "10px", color: "#333" }}>Choose Theme:</div>
          {themeManager.getAllThemes().map(themeName => (
            <button
              key={themeName}
              onClick={() => changeTheme(themeName)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px 20px",
                margin: "5px 0",
                background: currentTheme === themeName 
                  ? "linear-gradient(135deg, #667eea, #764ba2)" 
                  : "#f0f0f0",
                color: currentTheme === themeName ? "white" : "#333",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "bold",
                textTransform: "capitalize"
              }}
            >
              {themeName === currentTheme ? '✓ ' : ''}{themeName}
            </button>
          ))}
        </div>
      )}

      <div style={{ 
        padding: isMobile ? "8px 5px" : "15px",
        textAlign: "center",
        color: theme.text,
        flexShrink: 0
      }}>
        <h1 style={{ 
          fontSize: isMobile ? "1.4rem" : "3rem", 
          margin: "3px 0",
          textShadow: "3px 3px 6px rgba(0,0,0,0.4)",
          background: "linear-gradient(to right, #FFD700, #FFA500, #FFD700)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "900"
        }}>
          💧 WATER SORT 💧
        </h1>

        <div style={{
          background: "rgba(0,0,0,0.3)",
          padding: isMobile ? "3px 10px" : "5px 15px",
          borderRadius: "15px",
          display: "inline-block",
          marginBottom: isMobile ? "5px" : "10px",
          fontSize: isMobile ? "0.75rem" : "1rem",
          fontWeight: "bold"
        }}>
          ⭐ {totalStars} / 150
        </div>

        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: isMobile ? "5px" : "10px",
          marginTop: isMobile ? "5px" : "10px",
          marginBottom: isMobile ? "5px" : "15px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => {
              soundManager.play("click");
              setShowLevelSelect(true);
            }}
            style={{
              padding: isMobile ? "6px 10px" : "10px 20px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "15px",
              cursor: "pointer",
              fontSize: isMobile ? "0.7rem" : "1rem",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
            }}
          >
            📋 LEVELS
          </button>

          <button
            onClick={() => setShowMultiplayerLobby(true)}
            style={{
              padding: isMobile ? "6px 10px" : "10px 20px",
              background: "linear-gradient(135deg, #f093fb, #f5576c)",
              color: "white",
              border: "none",
              borderRadius: "15px",
              cursor: "pointer",
              fontSize: isMobile ? "0.7rem" : "1rem",
              fontWeight: "bold",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
            }}
          >
            🎮 VS
          </button>

          {message && (
            <button
              onClick={shareScore}
              style={{
                padding: isMobile ? "6px 10px" : "10px 20px",
                background: "linear-gradient(135deg, #11998e, #38ef7d)",
                color: "white",
                border: "none",
                borderRadius: "15px",
                cursor: "pointer",
                fontSize: isMobile ? "0.7rem" : "1rem",
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
              }}
            >
              📤
            </button>
          )}

          <button
            onClick={toggleMusic}
            style={{
              padding: isMobile ? "5px" : "8px",
              background: "rgba(255,255,255,0.25)",
              color: "white",
              border: "3px solid rgba(255,255,255,0.5)",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: isMobile ? "0.9rem" : "1.2rem",
              width: isMobile ? "32px" : "45px",
              height: isMobile ? "32px" : "45px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
            }}
          >
            {musicEnabled ? '🎵' : '🔇'}
          </button>

          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              padding: isMobile ? "5px" : "8px",
              background: "rgba(255,255,255,0.25)",
              color: "white",
              border: "3px solid rgba(255,255,255,0.5)",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: isMobile ? "0.9rem" : "1.2rem",
              width: isMobile ? "32px" : "45px",
              height: isMobile ? "32px" : "45px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
            }}
          >
            🎨
          </button>
        </div>

        <div style={{
          display: "flex",
          gap: isMobile ? "6px" : "10px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: isMobile ? "5px" : "10px"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.2)",
            padding: isMobile ? "6px 12px" : "10px 20px",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255,255,255,0.3)",
            minWidth: isMobile ? "70px" : "90px"
          }}>
            <div style={{ fontSize: isMobile ? "0.6rem" : "0.75rem", opacity: 0.8 }}>LEVEL</div>
            <div style={{ fontSize: isMobile ? "1.1rem" : "1.5rem", fontWeight: "bold" }}>{currentLevelId}/50</div>
            <div style={{ fontSize: isMobile ? "0.55rem" : "0.7rem", color: difficulty.color, fontWeight: "bold" }}>
              {difficulty.text}
            </div>
            {currentStats.stars > 0 && (
              <div style={{ fontSize: isMobile ? "0.7rem" : "0.9rem", marginTop: "2px" }}>
                {'⭐'.repeat(currentStats.stars)}
              </div>
            )}
          </div>

          <div style={{
            background: "rgba(255,255,255,0.2)",
            padding: isMobile ? "6px 12px" : "10px 20px",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255,255,255,0.3)",
            minWidth: isMobile ? "70px" : "90px"
          }}>
            <div style={{ fontSize: isMobile ? "0.6rem" : "0.75rem", opacity: 0.8 }}>⏱️ TIME</div>
            <div style={{ fontSize: isMobile ? "1.1rem" : "1.5rem", fontWeight: "bold" }}>{formatTime(timer)}</div>
            {bestTime > 0 && (
              <div style={{ fontSize: isMobile ? "0.55rem" : "0.65rem", color: theme.accent }}>
                Best: {formatTime(bestTime)}
              </div>
            )}
          </div>

          <div style={{
            background: "rgba(255,255,255,0.2)",
            padding: isMobile ? "6px 12px" : "10px 20px",
            borderRadius: "12px",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255,255,255,0.3)",
            minWidth: isMobile ? "70px" : "90px"
          }}>
            <div style={{ fontSize: isMobile ? "0.6rem" : "0.75rem", opacity: 0.8 }}>MOVES</div>
            <div style={{ fontSize: isMobile ? "1.1rem" : "1.5rem", fontWeight: "bold" }}>{moves}</div>
            <div style={{ fontSize: isMobile ? "0.5rem" : "0.65rem", opacity: 0.8 }}>
              Target: {level.optimal_moves}
            </div>
          </div>
        </div>

        {message && (
          <div style={{
            color: theme.accent,
            fontSize: isMobile ? "1rem" : "2rem",
            fontWeight: "900",
            marginTop: isMobile ? "5px" : "10px",
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
          paddingBottom: isMobile ? "70px" : "100px",
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
          minHeight: bottlesAreaHeight
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
                  transform: `scale(${scale}) ${isSelected ? 'translateY(-10px) scale(1.15)' : ''}`,
                  transformOrigin: "center center",
                  cursor: "pointer",
                  zIndex: isSelected ? 1000 : 1,
                  transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                  filter: isSelected 
                    ? "drop-shadow(0 0 20px rgba(255,215,0,0.9))" 
                    : isFull 
                      ? "drop-shadow(0 0 15px rgba(255,215,0,0.6))"
                      : "drop-shadow(0 2px 8px rgba(0,0,0,0.4))"
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
          padding: isMobile ? "10px" : "12px",
          display: "flex",
          gap: isMobile ? "6px" : "10px",
          justifyContent: "center",
          boxShadow: "0 -6px 20px rgba(0,0,0,0.3)",
          backdropFilter: "blur(10px)",
          zIndex: 999
        }}
      >
        <button
          onClick={() => {
            soundManager.play("click");
            setCurrentLevelId((p) => Math.max(1, p - 1));
          }}
          disabled={currentLevelId === 1}
          style={{
            flex: 1,
            maxWidth: isMobile ? "100px" : "120px",
            padding: isMobile ? "12px 8px" : "14px 10px",
            background: currentLevelId === 1 
              ? "rgba(100,100,100,0.5)" 
              : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            border: "none",
            borderRadius: "12px",
            fontSize: isMobile ? "0.8rem" : "0.95rem",
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
          onClick={() => {
            soundManager.play("click");
            loadLevel(currentLevelId);
          }}
          style={{
            flex: 1,
            maxWidth: isMobile ? "80px" : "100px",
            padding: isMobile ? "12px 8px" : "14px 10px",
            background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            border: "none",
            borderRadius: "12px",
            fontSize: isMobile ? "0.8rem" : "0.95rem",
            fontWeight: "bold",
            cursor: "pointer",
            color: "white",
            boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
            transition: "all 0.2s"
          }}
        >
          ↻
        </button>
        <button
          onClick={() => {
            soundManager.play("click");
            setCurrentLevelId((p) => Math.min(50, p + 1));
          }}
          disabled={currentLevelId === 50}
          style={{
            flex: 1,
            maxWidth: isMobile ? "100px" : "120px",
            padding: isMobile ? "12px 8px" : "14px 10px",
            background: currentLevelId === 50
              ? "rgba(100,100,100,0.5)"
              : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            border: "none",
            borderRadius: "12px",
            fontSize: isMobile ? "0.8rem" : "0.95rem",
            fontWeight: "bold",
            cursor: currentLevelId === 50 ? "not-allowed" : "pointer",
            opacity: currentLevelId === 50 ? 0.5 : 1,
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
