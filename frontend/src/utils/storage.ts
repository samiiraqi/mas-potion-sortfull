interface GameStats {
  levelId: number;
  bestMoves: number;
  bestTime: number;
  completed: boolean;
  stars: number;
  optimalMoves: number;
}

export const storage = {
  saveLevelStats(levelId: number, moves: number, time: number, optimalMoves: number) {
    const key = `level_${levelId}`;
    const existing = this.getLevelStats(levelId);
    
    // Calculate stars based on moves
    let stars = 1; // 1 star for completing
    if (moves <= optimalMoves) {
      stars = 3; // 3 stars for optimal!
    } else if (moves <= optimalMoves + 5) {
      stars = 2; // 2 stars for near-optimal
    }
    
    const stats: GameStats = {
      levelId,
      bestMoves: existing.bestMoves === 0 ? moves : Math.min(existing.bestMoves, moves),
      bestTime: existing.bestTime === 0 ? time : Math.min(existing.bestTime, time),
      completed: true,
      stars: Math.max(existing.stars, stars), // Keep best star rating
      optimalMoves
    };
    
    localStorage.setItem(key, JSON.stringify(stats));
  },
  
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
      completed: false,
      stars: 0,
      optimalMoves: 20
    };
  },
  
  getAllStats(): GameStats[] {
    const stats: GameStats[] = [];
    for (let i = 1; i <= 50; i++) {
      const levelStats = this.getLevelStats(i);
      if (levelStats.completed) {
        stats.push(levelStats);
      }
    }
    return stats;
  },
  
  getTotalStars(): number {
    let total = 0;
    for (let i = 1; i <= 50; i++) {
      const stats = this.getLevelStats(i);
      total += stats.stars;
    }
    return total;
  },
  
  clearAll() {
    localStorage.clear();
  }
};
