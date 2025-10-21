export default function About() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255,255,255,0.1)',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🍾 Bottle For Mas</h1>
        <p style={{ fontSize: '1.3rem', marginBottom: '30px', opacity: 0.9 }}>
          A beautiful, relaxing color sorting puzzle game
        </p>

        <div style={{ textAlign: 'left', marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>✨ Features</h2>
          <ul style={{ lineHeight: '2', fontSize: '1.1rem', opacity: 0.9 }}>
            <li>🎮 120 challenging levels</li>
            <li>🎨 6 beautiful animated backgrounds</li>
            <li>🍾 5 unique bottle themes</li>
            <li>💥 Satisfying particle effects</li>
            <li>🌊 Realistic liquid physics</li>
            <li>🏆 Progress tracking</li>
            <li>👥 Multiplayer mode</li>
          </ul>

          <h2 style={{ fontSize: '1.8rem', marginTop: '40px', marginBottom: '15px' }}>🎯 How to Play</h2>
          <ol style={{ lineHeight: '2', fontSize: '1.1rem', opacity: 0.9 }}>
            <li>Tap a bottle to select it</li>
            <li>Tap another bottle to pour</li>
            <li>Sort colors until each bottle has one color</li>
            <li>Complete all bottles to win!</li>
          </ol>

          <h2 style={{ fontSize: '1.8rem', marginTop: '40px', marginBottom: '15px' }}>👨‍💻 About</h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', opacity: 0.9 }}>
            Bottle For Mas is a passion project created to bring joy and relaxation 
            through beautiful puzzle gameplay. Made with ❤️ using React and TypeScript.
          </p>

          <h2 style={{ fontSize: '1.8rem', marginTop: '40px', marginBottom: '15px' }}>📧 Contact</h2>
          <p style={{ lineHeight: '1.8', fontSize: '1.1rem', opacity: 0.9 }}>
            Email: contact@bottlefomas.com<br/>
            Support: support@bottlefomas.com
          </p>
        </div>

        <button
          onClick={() => window.history.back()}
          style={{
            marginTop: '40px',
            padding: '15px 30px',
            background: 'linear-gradient(135deg, #11998e, #38ef7d)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ← Back to Game
        </button>
      </div>
    </div>
  );
}
