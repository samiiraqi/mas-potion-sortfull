interface PrivacyProps {
  onBack: () => void;
}

export default function Privacy({ onBack }: PrivacyProps) {
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
      
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1>Privacy Policy</h1>
        <p>We respect your privacy. All game data is stored locally on your device.</p>
        <p>No personal information is collected or shared.</p>
      </div>
    </div>
  );
}
