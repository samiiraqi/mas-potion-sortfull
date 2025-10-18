export interface Level {
  level_id: number;
  bottles: string[][];
  max_capacity: number;
  optimal_moves: number;
}

export interface GameState {
  currentLevel: number;
  moves: number;
  timer: number;
  bottles: string[][];
}
