interface PlayerProgress {
  currentLevel: number;
  completedLevels: number[];
  totalMoves: number;
  bestTimes: { [level: number]: number };
  lastPlayed: string;
}

export const progressManager = {
  saveProgress(level: number, moves: number): void {
    const progress = this.getProgress();
    progress.currentLevel = level;
    progress.totalMoves += moves;
    progress.lastPlayed = new Date().toISOString();
    
    if (!progress.completedLevels.includes(level)) {
      progress.completedLevels.push(level);
    }
    
    localStorage.setItem('bottleForMasProgress', JSON.stringify(progress));
    console.log('✅ Progress saved! Level:', level);
  },

  getProgress(): PlayerProgress {
    const saved = localStorage.getItem('bottleForMasProgress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse progress:', e);
      }
    }
    
    return {
      currentLevel: 1,
      completedLevels: [],
      totalMoves: 0,
      bestTimes: {},
      lastPlayed: new Date().toISOString()
    };
  },

  getLastLevel(): number {
    const progress = this.getProgress();
    return progress.currentLevel;
  },

  getCompletedCount(): number {
    const progress = this.getProgress();
    return progress.completedLevels.length;
  },

  resetProgress(): void {
    localStorage.removeItem('bottleForMasProgress');
    console.log('🔄 Progress reset!');
  },

  isLevelCompleted(level: number): boolean {
    const progress = this.getProgress();
    return progress.completedLevels.includes(level);
  }
};
