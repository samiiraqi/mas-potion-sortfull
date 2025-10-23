export default function QRCodePage() {
  const gameURL = "https://water-sort-frontend.onrender.com";
  const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(gameURL)}`;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>📱 Scan to Play!</h1>
        
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '15px',
          marginBottom: '30px'
        }}>
          <img src={qrCodeURL} alt="QR Code" style={{ width: '100%', maxWidth: '300px' }} />
        </div>

        {/* Alchemist flask icon */}
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
          ⚗️
        </div>

        <p style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: 'bold' }}>
          Potion Sort
        </p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '20px', wordBreak: 'break-all' }}>
          {gameURL}
        </p>

        <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '30px' }}>
          Follow on Instagram: <a 
            href="https://instagram.com/_sami_mas" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#E1306C', 
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            @_sami_mas
          </a>
        </p>

        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = qrCodeURL;
            link.download = 'potion-sort-qr-code.png';
            link.click();
          }}
          style={{
            padding: '15px 30px',
            background: 'linear-gradient(135deg, #11998e, #38ef7d)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
        >
          📥 Download QR Code
        </button>

        <br/>

        <button
          onClick={() => window.history.back()}
          style={{
            padding: '12px 25px',
            background: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
