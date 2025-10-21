import { useState } from 'react';
import BottleTextLogo from './BottleTextLogo';
import Settings from './Settings';

interface HomeProps {
  onStartSinglePlayer: () => void;
  onStartMultiplayer: (data: any) => void;
}

export default function Home({ onStartSinglePlayer, onStartMultiplayer }: HomeProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const handleCreateRoom = async () => {
    setIsCreatingRoom(true);
    try {
      const response = await fetch('https://water-sort-backend.onrender.com/api/v1/multiplayer/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      onStartMultiplayer(data);
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('Failed to create room. Please try again.');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      alert('Please enter a room code');
      return;
    }
    
    try {
      const response = await fetch(`https://water-sort-backend.onrender.com/api/v1/multiplayer/join/${roomCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Room not found or full');
      }
      
      const data = await response.json();
      onStartMultiplayer(data);
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room. Please check the room code.');
    }
  };

  return (
    <>
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      
      <div style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative'
      }}>
        {/* Settings button - TOP RIGHT */}
        <button
          onClick={() => setShowSettings(true)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 100
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
          }}
        >
          ⚙️
        </button>

        <div style={{
          marginBottom: '40px',
          animation: 'fadeIn 1s ease'
        }}>
          <BottleTextLogo />
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          maxWidth: '400px'
        }}>
          <button
            onClick={onStartSinglePlayer}
            style={{
              padding: '20px 40px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
              border: 'none',
              borderRadius: '15px',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(17, 153, 142, 0.4)',
              transition: 'all 0.3s',
              animation: 'fadeIn 1s ease 0.2s both'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(17, 153, 142, 0.6)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(17, 153, 142, 0.4)';
            }}
          >
            🎮 Play Solo
          </button>

          <button
            onClick={handleCreateRoom}
            disabled={isCreatingRoom}
            style={{
              padding: '20px 40px',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #fa709a, #fee140)',
              border: 'none',
              borderRadius: '15px',
              color: 'white',
              cursor: isCreatingRoom ? 'wait' : 'pointer',
              boxShadow: '0 8px 30px rgba(250, 112, 154, 0.4)',
              transition: 'all 0.3s',
              animation: 'fadeIn 1s ease 0.4s both',
              opacity: isCreatingRoom ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!isCreatingRoom) {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(250, 112, 154, 0.6)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(250, 112, 154, 0.4)';
            }}
          >
            {isCreatingRoom ? '⏳ Creating...' : '👥 Create Room'}
          </button>

          {!showJoinInput ? (
            <button
              onClick={() => setShowJoinInput(true)}
              style={{
                padding: '20px 40px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
                border: 'none',
                borderRadius: '15px',
                color: '#333',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(168, 237, 234, 0.4)',
                transition: 'all 0.3s',
                animation: 'fadeIn 1s ease 0.6s both'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(168, 237, 234, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(168, 237, 234, 0.4)';
              }}
            >
              🔗 Join Room
            </button>
          ) : (
            <div style={{ animation: 'fadeIn 0.5s ease' }}>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter Room Code"
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '1.2rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.9)',
                  color: '#333',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  letterSpacing: '3px',
                  marginBottom: '10px'
                }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleJoinRoom}
                  style={{
                    flex: 1,
                    padding: '15px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Join
                </button>
                <button
                  onClick={() => {
                    setShowJoinInput(false);
                    setRoomCode('');
                  }}
                  style={{
                    flex: 1,
                    padding: '15px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer links - AT THE BOTTOM */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '20px',
          fontSize: '0.9rem',
          alignItems: 'center'
        }}>
          <a 
            href="/about" 
            style={{ 
              color: 'white', 
              opacity: 0.8, 
              textDecoration: 'none',
              transition: 'opacity 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            About
          </a>
          <span style={{ color: 'white', opacity: 0.5 }}>•</span>
          <a 
            href="/privacy" 
            style={{ 
              color: 'white', 
              opacity: 0.8, 
              textDecoration: 'none',
              transition: 'opacity 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            Privacy
          </a>
          <span style={{ color: 'white', opacity: 0.5 }}>•</span>
          <a 
            href="/qr" 
            style={{ 
              color: 'white', 
              opacity: 0.8, 
              textDecoration: 'none',
              transition: 'opacity 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
          >
            QR Code
          </a>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}
