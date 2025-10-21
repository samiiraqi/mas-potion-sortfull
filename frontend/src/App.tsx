import { useState } from 'react'
import Home from './components/Home'
import WaterSortCanvas from './components/Game/WaterSortCanvas'
import MultiplayerGame from './components/Multiplayer/MultiplayerGame'

type GameMode = 'home' | 'singleplayer' | 'multiplayer';

interface MultiplayerData {
  room_id: string;
  player_id: string;
  bottles: string[][];
  level_id: number;
  room_state: any;
}

function App() {
  const [gameMode, setGameMode] = useState<GameMode>('home');
  const [multiplayerData, setMultiplayerData] = useState<MultiplayerData | null>(null);

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

export default App;
