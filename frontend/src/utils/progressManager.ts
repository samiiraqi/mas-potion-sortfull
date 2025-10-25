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
        const data = JSON.parse(stored);
        // CRITICAL FIX: Ensure objects exist
        return {
          lastLevel: data.lastLevel || 1,
          completedLevels: data.completedLevels || {},
          levelMoves: data.levelMoves || {}
        };
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

  private saveProgressData(data: ProgressData): void {
    try {
      // CRITICAL FIX: Ensure all properties exist before saving
      const safeData = {
        lastLevel: data.lastLevel || 1,
        completedLevels: data.completedLevels || {},
        levelMoves: data.levelMoves || {}
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
      console.log('✅ Progress saved:', safeData);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  getLastLevel(): number {
    const progress = this.getProgress();
    console.log('📖 Loading last level:', progress.lastLevel);
    return progress.lastLevel || 1;
  }

  completeLevelAndAdvance(levelId: number, moves: number): void {
    console.log('💾 Completing level', levelId, 'with', moves, 'moves');
    const progress = this.getProgress();
    
    // CRITICAL FIX: Ensure objects exist
    if (!progress.completedLevels) {
      progress.completedLevels = {};
    }
    if (!progress.levelMoves) {
      progress.levelMoves = {};
    }
    
    progress.completedLevels[levelId] = true;
    progress.levelMoves[levelId] = moves;
    progress.lastLevel = levelId + 1;
    
    console.log('   Updated progress:', progress);
    this.saveProgressData(progress);
  }

  setCurrentLevel(levelId: number): void {
    const progress = this.getProgress();
    progress.lastLevel = levelId;
    this.saveProgressData(progress);
    console.log('💾 Current level saved:', levelId);
  }

  isLevelCompleted(levelId: number): boolean {
    const progress = this.getProgress();
    return progress.completedLevels && progress.completedLevels[levelId] === true;
  }

  getCompletedCount(): number {
    const progress = this.getProgress();
    return progress.completedLevels ? Object.keys(progress.completedLevels).length : 0;
  }

  resetProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🔄 Progress reset');
  }
}

export const progressManager = new ProgressManager();
