import { useState, useEffect } from 'react';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [selectedBackground, setSelectedBackground] = useState('galaxy');
  const [selectedTheme, setSelectedTheme] = useState('classic');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unlockedLevels, setUnlockedLevels] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setSelectedBackground(settings.background || 'galaxy');
      setSelectedTheme(settings.theme || 'classic');
      setSoundEnabled(settings.sound !== false);
    }

    const progress = localStorage.getItem('bottleForMasProgress');
    if (progress) {
      const data = JSON.parse(progress);
      setUnlockedLevels(data.lastLevel || 1);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      background: selectedBackground,
      theme: selectedTheme,
      sound: soundEnabled
    };
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    onClose();
  };

  const backgrounds = [
    { id: 'galaxy', name: '🌌 Galaxy Space', unlock: 1 },
    { id: 'sunset', name: '🌅 Sunset Beach', unlock: 20 },
    { id: 'cherry', name: '🌸 Cherry Blossom', unlock: 40 },
    { id: 'ocean', name: '🌊 Ocean Deep', unlock: 60 },
    { id: 'mountain', name: '⛰️ Mountain View', unlock: 80 },
    { id: 'night', name: '🌙 Night City', unlock: 100 }
  ];

  const themes = [
    { id: 'classic', name: '🍾 Classic Bottle', unlock: 1 },
    { id: 'lab', name: '🧪 Laboratory', unlock: 20 },
    { id: 'coffee', name: '☕ Coffee Shop', unlock: 40 },
    { id: 'juice', name: '🧃 Juice Bottle', unlock: 60 },
    { id: 'potion', name: '🧙 Magic Potion', unlock: 80 }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '30px',
        borderRadius: '20px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: 'white'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '2rem', textAlign: 'center' }}>⚙️ Settings</h2>

        {/* Backgrounds */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>🎨 Backgrounds</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {backgrounds.map(bg => {
              const isLocked = unlockedLevels < bg.unlock;
              return (
                <button
                  key={bg.id}
                  disabled={isLocked}
                  onClick={() => setSelectedBackground(bg.id)}
                  style={{
                    padding: '12px',
                    background: selectedBackground === bg.id ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)',
                    border: selectedBackground === bg.id ? '2px solid #FFD700' : '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: isLocked ? 'rgba(255,255,255,0.4)' : 'white',
                    fontSize: '0.9rem',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    opacity: isLocked ? 0.5 : 1
                  }}
                >
                  {bg.name}
                  {isLocked && <div style={{ fontSize: '0.7rem', marginTop: '5px' }}>🔒 Level {bg.unlock}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Themes */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>🍾 Bottle Themes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {themes.map(th => {
              const isLocked = unlockedLevels < th.unlock;
              return (
                <button
                  key={th.id}
                  disabled={isLocked}
                  onClick={() => setSelectedTheme(th.id)}
                  style={{
                    padding: '12px',
                    background: selectedTheme === th.id ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.1)',
                    border: selectedTheme === th.id ? '2px solid #FFD700' : '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    color: isLocked ? 'rgba(255,255,255,0.4)' : 'white',
                    fontSize: '0.9rem',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    opacity: isLocked ? 0.5 : 1
                  }}
                >
                  {th.name}
                  {isLocked && <div style={{ fontSize: '0.7rem', marginTop: '5px' }}>🔒 Level {th.unlock}</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sound */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>🔊 Sound</h3>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              padding: '12px 20px',
              background: soundEnabled ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
          </button>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={saveSettings}
            style={{
              flex: 1,
              padding: '15px',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(17, 153, 142, 0.4)'
            }}
          >
            ✅ Save
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '15px',
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
