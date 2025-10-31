import { useState, useEffect } from 'react';
import { progressManager } from '../utils/progressManager';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [selectedBackground, setSelectedBackground] = useState('galaxy');
  const [selectedTheme, setSelectedTheme] = useState('classic');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [unlockedLevels, setUnlockedLevels] = useState(1);
  const [colorMode, setColorMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Load settings
    const saved = localStorage.getItem('gameSettings');
    console.log('📂 Settings - Raw localStorage:', saved);
    
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        console.log('📂 Settings - Parsed:', settings);
        setSelectedBackground(settings.background || 'galaxy');
        setSelectedTheme(settings.theme || 'classic');
        setSoundEnabled(settings.sound !== false);
        setColorMode(settings.colorMode || 'dark');
        console.log('✅ Settings loaded - Theme is:', settings.theme || 'classic');
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    } else {
      console.log('⚠️ No saved settings found in localStorage');
    }

    // Get REAL current level from progressManager
    const currentLevel = progressManager.getLastLevel();
    console.log('📊 Current Level from progressManager:', currentLevel);
    setUnlockedLevels(currentLevel);
  }, []);

  const saveSettings = () => {
    const settings = {
      background: selectedBackground,
      theme: selectedTheme,
      sound: soundEnabled,
      colorMode: colorMode
    };
    
    console.log('💾 SAVING SETTINGS:', settings);
    console.log('   - Background:', selectedBackground);
    console.log('   - Theme:', selectedTheme);
    console.log('   - Sound:', soundEnabled);
    
    localStorage.setItem('gameSettings', JSON.stringify(settings));
    
    // Verify save
    const verify = localStorage.getItem('gameSettings');
    console.log('✅ VERIFIED in localStorage:', verify);
    
    // Show confirmation
    alert(`✅ Settings Saved!\n\nTheme: ${selectedTheme}\nBackground: ${selectedBackground}\n\nPage will reload...`);
    
    // Hard reload
    setTimeout(() => {
      window.location.href = window.location.href.split('?')[0] + '?reload=' + Date.now();
    }, 1000);
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

  const isDark = colorMode === 'dark';

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
        background: isDark 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        padding: '30px',
        borderRadius: '20px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: isDark ? 'white' : '#333',
        transition: 'all 0.5s ease'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', textAlign: 'center' }}>⚙️ Settings</h2>
        <p style={{ margin: '0 0 20px 0', textAlign: 'center', fontSize: '0.9rem', opacity: 0.8 }}>
          🎮 Level {unlockedLevels} / 120
        </p>

        {/* DEBUG BOX */}
        <div style={{ 
          background: 'yellow', 
          color: 'black', 
          padding: '10px', 
          marginBottom: '20px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '0.9rem'
        }}>
          📊 CURRENT SELECTION:<br/>
          Theme: <strong>{selectedTheme}</strong><br/>
          Background: <strong>{selectedBackground}</strong>
        </div>

        {/* COLOR MODE */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>🎨 Color Mode</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setColorMode('dark')}
              style={{
                flex: 1,
                padding: '15px',
                background: colorMode === 'dark' 
                  ? 'linear-gradient(135deg, #2c3e50, #34495e)'
                  : 'rgba(255,255,255,0.3)',
                border: colorMode === 'dark' ? '3px solid #34495e' : '2px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: colorMode === 'dark' ? 'white' : '#333',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: colorMode === 'dark' ? 'bold' : 'normal'
              }}
            >
              🌙 Dark
              {colorMode === 'dark' && ' ✓'}
            </button>

            <button
              onClick={() => setColorMode('light')}
              style={{
                flex: 1,
                padding: '15px',
                background: colorMode === 'light'
                  ? 'linear-gradient(135deg, #fff5e6, #ffe4cc)'
                  : 'rgba(255,255,255,0.3)',
                border: colorMode === 'light' ? '3px solid #ffa500' : '2px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#333',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: colorMode === 'light' ? 'bold' : 'normal'
              }}
            >
              ☀️ Light
              {colorMode === 'light' && ' ✓'}
            </button>
          </div>
        </div>

        {/* Backgrounds */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>🎨 Backgrounds</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            {backgrounds.map(bg => {
              const isLocked = unlockedLevels < bg.unlock;
              const isSelected = selectedBackground === bg.id;
              return (
                <button
                  key={bg.id}
                  disabled={isLocked}
                  onClick={() => {
                    if (!isLocked) {
                      console.log('🖱️ Background selected:', bg.id);
                      setSelectedBackground(bg.id);
                    }
                  }}
                  style={{
                    padding: '12px',
                    background: isSelected 
                      ? 'rgba(255,215,0,0.5)'
                      : 'rgba(255,255,255,0.2)',
                    border: isSelected 
                      ? '3px solid #FFD700'
                      : '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    color: isLocked ? 'rgba(255,255,255,0.4)' : 'white',
                    fontSize: '0.9rem',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.5 : 1,
                    fontWeight: isSelected ? 'bold' : 'normal'
                  }}
                >
                  {bg.name}
                  {isLocked && <div style={{ fontSize: '0.7rem', marginTop: '5px' }}>🔒 Lv{bg.unlock}</div>}
                  {isSelected && ' ✓'}
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
              const isSelected = selectedTheme === th.id;
              return (
                <button
                  key={th.id}
                  disabled={isLocked}
                  onClick={() => {
                    if (!isLocked) {
                      console.log('🖱️ Theme CLICKED:', th.id);
                      setSelectedTheme(th.id);
                      console.log('✅ Theme state updated to:', th.id);
                    }
                  }}
                  style={{
                    padding: '12px',
                    background: isSelected 
                      ? 'rgba(255,215,0,0.5)'
                      : 'rgba(255,255,255,0.2)',
                    border: isSelected 
                      ? '3px solid #FFD700'
                      : '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                    color: isLocked ? 'rgba(255,255,255,0.4)' : 'white',
                    fontSize: '0.9rem',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.5 : 1,
                    fontWeight: isSelected ? 'bold' : 'normal'
                  }}
                >
                  {th.name}
                  {isLocked && <div style={{ fontSize: '0.7rem', marginTop: '5px' }}>🔒 Lv{th.unlock}</div>}
                  {isSelected && ' ✓'}
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
              padding: '15px',
              background: soundEnabled ? 'rgba(76,175,80,0.5)' : 'rgba(244,67,54,0.5)',
              border: soundEnabled ? '3px solid #4CAF50' : '3px solid #F44336',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
              width: '100%',
              fontWeight: 'bold'
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
              padding: '18px',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✅ SAVE
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '18px',
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.2rem',
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
