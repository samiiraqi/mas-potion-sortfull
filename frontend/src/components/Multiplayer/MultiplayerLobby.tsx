import { useState } from 'react';
import axios from 'axios';

const API_URL = "https://water-sort-backend.onrender.com";

interface MultiplayerLobbyProps {
  onJoinRoom: (roomData: any) => void;
  onClose: () => void;
}

export default function MultiplayerLobby({ onJoinRoom, onClose }: MultiplayerLobbyProps) {
  const [playerName, setPlayerName] = useState('');
  const [levelId, setLevelId] = useState(1);
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createRoom = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/v1/multiplayer/join`, {
        player_name: playerName,
        level_id: levelId
      });

      onJoinRoom(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!playerName.trim() || !roomId.trim()) {
      setError('Please enter your name and room ID!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_URL}/api/v1/multiplayer/join`, {
        player_name: playerName,
        level_id: levelId,
        room_id: roomId
      });

      onJoinRoom(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px',
        borderRadius: '25px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.3)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'white'
          }}
        >
          ✕
        </button>

        <h2 style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '2.5rem',
          margin: '0 0 30px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🎮 MULTIPLAYER
        </h2>

        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '1.1rem',
            borderRadius: '12px',
            border: '3px solid rgba(255,255,255,0.5)',
            marginBottom: '20px',
            background: 'rgba(255,255,255,0.9)',
            boxSizing: 'border-box'
          }}
        />

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'white', fontSize: '1.1rem', display: 'block', marginBottom: '10px' }}>
            Choose Level:
          </label>
          <select
            value={levelId}
            onChange={(e) => setLevelId(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '1.1rem',
              borderRadius: '12px',
              border: '3px solid rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.9)',
              cursor: 'pointer'
            }}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>Level {num}</option>
            ))}
          </select>
        </div>

        <button
          onClick={createRoom}
          disabled={loading}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '15px',
            border: 'none',
            background: loading ? '#666' : 'linear-gradient(135deg, #11998e, #38ef7d)',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '15px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
          }}
        >
          {loading ? '⏳ Creating...' : '🎯 CREATE NEW ROOM'}
        </button>

        <div style={{
          textAlign: 'center',
          color: 'white',
          margin: '20px 0',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}>
          OR
        </div>

        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '1.1rem',
            borderRadius: '12px',
            border: '3px solid rgba(255,255,255,0.5)',
            marginBottom: '15px',
            background: 'rgba(255,255,255,0.9)',
            boxSizing: 'border-box'
          }}
        />

        <button
          onClick={joinRoom}
          disabled={loading}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderRadius: '15px',
            border: 'none',
            background: loading ? '#666' : 'linear-gradient(135deg, #f093fb, #f5576c)',
            color: 'white',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
          }}
        >
          {loading ? '⏳ Joining...' : '🚪 JOIN ROOM'}
        </button>

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(255,0,0,0.2)',
            border: '2px solid rgba(255,0,0,0.5)',
            borderRadius: '12px',
            color: 'white',
            textAlign: 'center'
          }}>
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
}
