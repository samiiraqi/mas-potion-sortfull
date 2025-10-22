export default function Privacy() {
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
        borderRadius: '20px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Privacy Policy</h1>
        <p style={{ marginBottom: '20px', opacity: 0.9 }}>Last updated: October 21, 2025</p>
        
        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>1. Information We Collect</h2>
        <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
          Bottle For Mas stores your game progress locally on your device using browser storage. 
          We do not collect, transmit, or store any personal information on our servers.
        </p>

        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>2. Local Storage</h2>
        <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
          We use localStorage to save:
        </p>
        <ul style={{ lineHeight: '1.8', opacity: 0.9, marginLeft: '20px' }}>
          <li>Your current level progress</li>
          <li>Your selected theme and background preferences</li>
          <li>Your game settings (sound on/off)</li>
        </ul>
        <p style={{ lineHeight: '1.8', opacity: 0.9, marginTop: '10px' }}>
          All data stays on your device and is never transmitted.
        </p>

        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>3. Cookies</h2>
        <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
          We do not use cookies. If we add analytics in the future, we will update this policy.
        </p>

        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>4. Third-Party Services</h2>
        <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
          Currently, we do not use any third-party services. If we integrate ads or analytics in the future, 
          those services may collect data according to their own privacy policies.
        </p>

        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>5. Children's Privacy</h2>
        <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
          Our game is suitable for all ages. We do not knowingly collect any information from children.
        </p>

        <h2 style={{ fontSize: '1.8rem', marginTop: '30px', marginBottom: '15px' }}>6. Contact</h2>
        <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
          For any privacy concerns, please contact us on Instagram:<br/>
          <a 
            href="https://instagram.com/_sami_mas" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: '#E1306C', 
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
          >
            @_sami_mas
          </a>
        </p>

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
          ← Back
        </button>
      </div>
    </div>
  );
}
