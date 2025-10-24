interface AboutProps {
  onBack: () => void;
}

export default function About({ onBack }: AboutProps) {
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
        <h1>About Potion Sort</h1>
        <p>A magical puzzle game where you sort colorful potions!</p>
        <p>Created with React and TypeScript.</p>
      </div>
    </div>
  );
}
