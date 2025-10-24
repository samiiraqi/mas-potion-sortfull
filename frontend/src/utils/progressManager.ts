const STORAGE_KEY = 'bottleForMasProgress';

interface ProgressData {
  lastLevel: number;
  completedLevels: { [key: number]: boolean };
  levelMoves: { [key: number]: number };
}

class ProgressManager {
  private getProgress(): ProgressData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading progress:', error);
    }
    
    return {
      lastLevel: 1,
      completedLevels: {},
      levelMoves: {}
    };
  }

  private saveProgress(data: ProgressData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('✅ Progress saved:', data);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  // Get the last level the player was on
  getLastLevel(): number {
    const progress = this.getProgress();
    console.log('📖 Loading last level:', progress.lastLevel);
    return progress.lastLevel || 1;
  }

  // Save progress when completing a level
  saveProgress(levelId: number, moves: number): void {
    const progress = this.getProgress();
    
    // Mark level as completed
    progress.completedLevels[levelId] = true;
    progress.levelMoves[levelId] = moves;
    
    // Update last level to next level
    progress.lastLevel = levelId + 1;
    
    this.saveProgress(progress);
  }

  // Update current level (when user selects a level or exits)
  setCurrentLevel(levelId: number): void {
    const progress = this.getProgress();
    progress.lastLevel = levelId;
    this.saveProgress(progress);
    console.log('💾 Current level saved:', levelId);
  }

  // Check if a level is completed
  isLevelCompleted(levelId: number): boolean {
    const progress = this.getProgress();
    return progress.completedLevels[levelId] === true;
  }

  // Get number of completed levels
  getCompletedCount(): number {
    const progress = this.getProgress();
    return Object.keys(progress.completedLevels).length;
  }

  // Reset all progress
  resetProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🔄 Progress reset');
  }
}

export const progressManager = new ProgressManager();
