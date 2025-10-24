import { useState } from 'react';

interface QRGeneratorProps {
  onBack: () => void;
}

export default function QRGenerator({ onBack }: QRGeneratorProps) {
  const [text, setText] = useState('https://potion-sort.com');
  const gameUrl = window.location.href.replace(/\/$/, '');

  const generateQR = (content: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(content)}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      color: 'white',
      overflowY: 'auto'
    }}>
      <button onClick={onBack} style={{
        padding: '12px 24px',
        background: 'rgba(255,255,255,0.2)',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: '12px',
        color: 'white',
        fontSize: '1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginBottom: '20px'
      }}>
        ← Back
      </button>
      
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        textAlign: 'center' 
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px' 
        }}>
          📱 QR Code Generator
        </h1>
        
        <p style={{ 
          fontSize: '1.1rem', 
          opacity: 0.9, 
          marginBottom: '40px' 
        }}>
          Share Potion Sort with friends!
        </p>

        {/* Quick share buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setText(gameUrl)}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🎮 Game Link
          </button>
          
          <button
            onClick={() => setText('Check out Potion Sort! A fun puzzle game: ' + gameUrl)}
            style={{
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #fa709a, #fee140)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📢 Share Message
          </button>
        </div>

        {/* QR Code Display */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}>
          <img 
            src={generateQR(text)} 
            alt="QR Code"
            style={{
              width: '300px',
              height: '300px',
              maxWidth: '100%'
            }}
          />
        </div>

        {/* Custom text input */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '25px',
          borderRadius: '15px',
          marginBottom: '20px'
        }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}>
            Custom Text or URL:
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '10px',
              border: '2px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.9)',
              fontSize: '1rem',
              color: '#333',
              marginBottom: '15px'
            }}
            placeholder="Enter text or URL..."
          />
          
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = generateQR(text);
              link.download = 'potion-sort-qr.png';
              link.click();
            }}
            style={{
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              boxShadow: '0 5px 20px rgba(102, 126, 234, 0.4)'
            }}
          >
            💾 Download QR Code
          </button>
        </div>

        <p style={{
          fontSize: '0.9rem',
          opacity: 0.7
        }}>
          Scan this QR code with your phone to share the game!
        </p>
      </div>
    </div>
  );
}
