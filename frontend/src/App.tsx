import { useState } from 'react';
import Home from './components/Home';
import WaterSortCanvas from './components/Game/WaterSortCanvas';
import { progressManager } from './utils/progressManager';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const handleStartGame = (level?: number) => {
    if (level) {
      setSelectedLevel(level);
      // Save this as the current level
      progressManager.saveProgress(level - 1, 0);
    }
    setGameStarted(true);
  };

  const handleExitGame = () => {
    setGameStarted(false);
    setSelectedLevel(null);
  };

  return gameStarted ? (
    <WaterSortCanvas onExit={handleExitGame} />
  ) : (
    <Home onStartGame={handleStartGame} />
  );
}
