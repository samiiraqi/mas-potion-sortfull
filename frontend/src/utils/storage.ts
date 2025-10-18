interface GameStats {
  levelId: number;
  bestMoves: number;
  bestTime: number;
  completed: boolean;
}

export const storage = {
  // Save level stats
  saveLevelStats(levelId: number, moves: number, time: number) {
    const key = `level_${levelId}`;
    const existing = this.getLevelStats(levelId);
    
    const stats: GameStats = {
      levelId,
      bestMoves: existing.bestMoves === 0 ? moves : Math.min(existing.bestMoves, moves),
      bestTime: existing.bestTime === 0 ? time : Math.min(existing.bestTime, time),
      completed: true
    };
    
    localStorage.setItem(key, JSON.stringify(stats));
  },
  
  // Get level stats
  getLevelStats(levelId: number): GameStats {
    const key = `level_${levelId}`;
    const data = localStorage.getItem(key);
    
    if (data) {
      return JSON.parse(data);
    }
    
    return {
      levelId,
      bestMoves: 0,
      bestTime: 0,
      completed: false
    };
  },
  
  // Get all completed levels
  getAllStats(): GameStats[] {
    const stats: GameStats[] = [];
    for (let i = 1; i <= 20; i++) {
      const levelStats = this.getLevelStats(i);
      if (levelStats.completed) {
        stats.push(levelStats);
      }
    }
    return stats;
  },
  
  // Clear all data
  clearAll() {
    localStorage.clear();
  }
};
