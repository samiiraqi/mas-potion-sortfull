interface QRGeneratorProps {
  onBack: () => void;
}

export default function QRGenerator({ onBack }: QRGeneratorProps) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      color: 'white'
    }}>
      <button onClick={onBack} style={{
        padding: '10px 20px',
        background: 'rgba(255,255,255,0.2)',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: '10px',
        color: 'white',
        cursor: 'pointer',
        marginBottom: '20px'
      }}>
        ← Back
      </button>
      
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1>QR Code Generator</h1>
        <p>Generate QR codes for sharing the game!</p>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '40px',
          borderRadius: '20px',
          marginTop: '30px'
        }}>
          <p>QR Code functionality coming soon!</p>
        </div>
      </div>
    </div>
  );
}
