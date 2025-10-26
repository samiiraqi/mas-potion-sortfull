interface Move {
  from: number;
  to: number;
}

export function solvePuzzle(bottles: string[][]): Move[] {
  // Instead of solving completely, find ONE good move to suggest
  const state = bottles.map(b => [...b]);
  
  // Look for an obvious good move
  for (let from = 0; from < state.length; from++) {
    if (state[from].length === 0) continue;
    
    for (let to = 0; to < state.length; to++) {
      if (from === to) continue;
      if (state[to].length >= 4) continue;
      
      // Find a move that helps complete a bottle
      if (state[to].length === 3) {
        const topColor = state[from][state[from].length - 1];
        if (state[to].every(c => c === topColor)) {
          return [{ from, to }]; // Return just this one good move
        }
      }
    }
  }
  
  // If no obvious completing move, find any valid move
  for (let from = 0; from < state.length; from++) {
    if (state[from].length === 0) continue;
    
    for (let to = 0; to < state.length; to++) {
      if (from === to) continue;
      if (state[to].length >= 4) continue;
      if (state[to].length === 0) return [{ from, to }];
    }
  }
  
  return []; // No moves found
}
