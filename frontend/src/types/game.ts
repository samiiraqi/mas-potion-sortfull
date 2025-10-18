export interface Level {
  level_id: number;
  difficulty: 'easy' | 'medium' | 'hard';
  bottles: string[][];
  num_colors: number;
  num_bottles: number;
  max_moves: number;
}

export interface GameState {
  currentLevel: number;
  bottles: string[][];
  moves: number;
  maxMoves: number;
  isComplete: boolean;
}
