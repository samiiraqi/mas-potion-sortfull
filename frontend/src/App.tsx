import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoadingScreen from './components/LoadingScreen'
import Home from './components/Home'
import WaterSortCanvas from './components/Game/WaterSortCanvas'
import MultiplayerGame from './components/Multiplayer/MultiplayerGame'
import Privacy from './components/Privacy'
import About from './components/About'
import QRCodePage from './components/QRCode'

type GameMode = 'loading' | 'home' | 'singleplayer' | 'multiplayer';

interface MultiplayerData {
  room_id: string;
  player_id: string;
  bottles: string[][];
  level_id: number;
  room_state: any;
}

function GameApp() {
  const [gameMode, setGameMode] = useState<GameMode>('loading');
  const [multiplayerData, setMultiplayerData] = useState<MultiplayerData | null>(null);

  const handleLoadComplete = () => {
    setGameMode('home');
  };

  const handleStartSinglePlayer = () => {
    setGameMode('singleplayer');
  };

  const handleStartMultiplayer = (data: MultiplayerData) => {
    setMultiplayerData(data);
    setGameMode('multiplayer');
  };

  const handleExitToHome = () => {
    setGameMode('home');
    setMultiplayerData(null);
  };

  return (
    <>
      {gameMode === 'loading' && (
        <LoadingScreen onLoadComplete={handleLoadComplete} />
      )}

      {gameMode === 'home' && (
        <Home 
          onStartSinglePlayer={handleStartSinglePlayer}
          onStartMultiplayer={handleStartMultiplayer}
        />
      )}
      
      {gameMode === 'singleplayer' && (
        <WaterSortCanvas onExit={handleExitToHome} />
      )}
      
      {gameMode === 'multiplayer' && multiplayerData && (
        <MultiplayerGame 
          roomData={multiplayerData}
          onExit={handleExitToHome}
        />
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GameApp />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
        <Route path="/qr" element={<QRCodePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
