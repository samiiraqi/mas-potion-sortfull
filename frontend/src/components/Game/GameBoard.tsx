import { useState, useEffect } from 'react';
import { gameAPI } from '../../services/api';
import type { Level } from '../../types/game.tsx';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export default function GameBoard() {
  const [level, setLevel] = useState<Level | null>(null);
  const [bottles, setBottles] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  
  // Game state
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadLevel(currentLevelId);
  }, [currentLevelId]);

  const loadLevel = async (levelId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await gameAPI.getLevel(levelId);
      setLevel(data);
      setBottles(data.bottles);
      setMoves(0);
      setIsComplete(false);
      setSelectedBottle(null);
      setMessage('');
    } catch (err: any) {
      console.error('Failed to load level:', err);
      setError(err.message || 'Failed to load level');
    } finally {
      setLoading(false);
    }
  };

  const handleBottleClick = async (bottleIndex: number) => {
    if (isComplete) return;

    // First click - select bottle
    if (selectedBottle === null) {
      // Check if bottle is not empty
      if (bottles[bottleIndex].length > 0) {
        setSelectedBottle(bottleIndex);
        setMessage(`Selected Bottle ${bottleIndex + 1}`);
      } else {
        setMessage('Cannot select empty bottle!');
        setTimeout(() => setMessage(''), 2000);
      }
      return;
    }

    // Second click - try to pour
    if (selectedBottle === bottleIndex) {
      // Clicked same bottle - deselect
      setSelectedBottle(null);
      setMessage('');
      return;
    }

    // Try to make the move
    try {
      const response = await axios.post(`${API_URL}/api/v1/make-move`, {
        bottles: bottles,
        from_bottle: selectedBottle,
        to_bottle: bottleIndex
      });

      if (response.data.success) {
        setBottles(response.data.bottles);
        setMoves(prev => prev + 1);
        setSelectedBottle(null);
        
        if (response.data.is_completed) {
          setIsComplete(true);
          setMessage('🎉 Level Complete! 🎉');
        } else {
          setMessage('✓ Move successful!');
          setTimeout(() => setMessage(''), 1500);
        }
      }
    } catch (err: any) {
      console.error('Move failed:', err);
      setMessage('❌ Invalid move!');
      setTimeout(() => setMessage(''), 2000);
      setSelectedBottle(null);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontSize: '2rem',
        color: 'white'
      }}>
        Loading... 🧪
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        fontSize: '1.5rem',
        color: 'red',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div>❌ Error: {error}</div>
        <button 
          onClick={() => loadLevel(currentLevelId)}
          style={{
            padding: '1rem 2rem',
            background: '#9333ea',
            border: 'none',
            borderRadius: '0.5rem',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!level) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold',
            textShadow: '0 0 20px rgba(144, 19, 254, 0.8), 0 0 40px rgba(144, 19, 254, 0.4)',
            marginBottom: '0.5rem',
            animation: 'glow 2s ease-in-out infinite alternate'
          }}>
            Potion Sort
          </h1>
          <p style={{ fontSize: '1.5rem', color: '#c084fc' }}>
            The Alchemist's Puzzle ✨
          </p>
        </div>

        {/* Stats Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: 'rgba(88, 28, 135, 0.3)',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            flex: 1,
            minWidth: '150px'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#c084fc' }}>Level</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{level.level_id}</div>
          </div>

          <div style={{
            background: 'rgba(88, 28, 135, 0.3)',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            flex: 1,
            minWidth: '150px'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#c084fc' }}>Moves</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {moves} / {level.max_moves}
            </div>
          </div>

          <div style={{
            background: 'rgba(88, 28, 135, 0.3)',
            borderRadius: '1rem',
            padding: '1rem 1.5rem',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            flex: 1,
            minWidth: '150px'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#c084fc' }}>Difficulty</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {level.difficulty}
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            textAlign: 'center',
            marginBottom: '1rem',
            padding: '1rem',
            background: isComplete 
              ? 'rgba(34, 197, 94, 0.2)' 
              : message.includes('❌') 
                ? 'rgba(239, 68, 68, 0.2)'
                : 'rgba(59, 130, 246, 0.2)',
            borderRadius: '0.5rem',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            border: `2px solid ${isComplete ? '#22c55e' : message.includes('❌') ? '#ef4444' : '#3b82f6'}`,
            animation: 'pulse 0.5s ease-in-out'
          }}>
            {message}
          </div>
        )}

        {/* Game Board */}
        <div style={{
          background: 'rgba(88, 28, 135, 0.2)',
          borderRadius: '1rem',
          padding: '2rem',
          backdropFilter: 'blur(10px)',
          minHeight: '450px'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
            gap: '1.5rem',
            justifyItems: 'center'
          }}>
            {bottles.map((bottle, idx) => (
              <div 
                key={idx} 
                onClick={() => handleBottleClick(idx)}
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  cursor: isComplete ? 'default' : 'pointer',
                  transform: selectedBottle === idx ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s ease'
                }}
              >
                {/* Bottle Container */}
                <div style={{
                  width: '6rem',
                  height: '14rem',
                  background: selectedBottle === idx 
                    ? 'rgba(168, 85, 247, 0.3)' 
                    : 'rgba(31, 41, 55, 0.5)',
                  borderRadius: '0.5rem',
                  border: selectedBottle === idx 
                    ? '3px solid #a855f7' 
                    : '2px solid rgba(168, 85, 247, 0.3)',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  gap: '0.25rem',
                  boxShadow: selectedBottle === idx
                    ? '0 0 20px rgba(168, 85, 247, 0.6)'
                    : '0 4px 6px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.2s ease'
                }}>
                  {bottle.map((color, colorIdx) => (
                    <div
                      key={colorIdx}
                      style={{
                        width: '100%',
                        height: '2.75rem',
                        borderRadius: '0.25rem',
                        backgroundColor: color,
                        boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.2), 0 2px 4px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
                {/* Bottle Label */}
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: selectedBottle === idx ? '#a855f7' : '#c084fc',
                  marginTop: '0.75rem',
                  fontWeight: selectedBottle === idx ? 'bold' : '500',
                  transition: 'all 0.2s ease'
                }}>
                  Bottle {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        {!isComplete && (
          <div style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: '#9ca3af',
            fontSize: '0.875rem'
          }}>
            <p>💡 Click a bottle to select it, then click another to pour</p>
            <p>Rules: Can only pour same color on same color, or into empty bottle</p>
          </div>
        )}

        {/* Control Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          marginTop: '2rem',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => {
              setCurrentLevelId(prev => Math.max(1, prev - 1));
              setSelectedBottle(null);
            }}
            disabled={currentLevelId === 1}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentLevelId === 1 ? '#666' : '#9333ea',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              color: 'white',
              cursor: currentLevelId === 1 ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              opacity: currentLevelId === 1 ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            ← Previous
          </button>
          
          <button
            onClick={() => loadLevel(currentLevelId)}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#db2777',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            ↻ Restart
          </button>
          
          <button
            onClick={() => {
              setCurrentLevelId(prev => prev + 1);
              setSelectedBottle(null);
            }}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#9333ea',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s'
            }}
          >
            Next →
          </button>

          {isComplete && (
            <button
              onClick={() => {
                setCurrentLevelId(prev => prev + 1);
                setSelectedBottle(null);
              }}
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1.125rem',
                boxShadow: '0 4px 6px rgba(34, 197, 94, 0.4)',
                animation: 'pulse 1s ease-in-out infinite'
              }}
            >
              Continue → Next Level
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes glow {
          from { text-shadow: 0 0 20px rgba(144, 19, 254, 0.6); }
          to { text-shadow: 0 0 40px rgba(144, 19, 254, 0.9); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
