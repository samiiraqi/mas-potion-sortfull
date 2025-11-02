interface Move {
  from: number;
  to: number;
}

function canPour(fromBottle: string[], toBottle: string[], maxCapacity: number = 4): boolean {
  if (fromBottle.length === 0) return false;
  if (toBottle.length >= maxCapacity) return false;
  if (toBottle.length === 0) return true;
  return fromBottle[fromBottle.length - 1] === toBottle[toBottle.length - 1];
}

function isBottleComplete(bottle: string[]): boolean {
  if (bottle.length !== 4) return false;
  return bottle.every(c => c === bottle[0]);
}

export function solvePuzzle(bottles: string[][]): Move[] {
  const state = bottles.map(b => [...b]);
  
  // Priority 1: Complete a bottle that's almost done (3 pieces of same color)
  for (let from = 0; from < state.length; from++) {
    if (state[from].length === 0) continue;
    const topColor = state[from][state[from].length - 1];
    
    for (let to = 0; to < state.length; to++) {
      if (from === to) continue;
      if (state[to].length === 3 && state[to].every(c => c === topColor)) {
        return [{ from, to }];
      }
    }
  }
  
  // Priority 2: Move to a bottle with matching color on top
  for (let from = 0; from < state.length; from++) {
    if (state[from].length === 0) continue;
    if (isBottleComplete(state[from])) continue; // Don't move from completed bottles
    
    const topColor = state[from][state[from].length - 1];
    
    for (let to = 0; to < state.length; to++) {
      if (from === to) continue;
      if (state[to].length === 0) continue;
      if (state[to].length >= 4) continue;
      if (isBottleComplete(state[to])) continue;
      
      const toTopColor = state[to][state[to].length - 1];
      if (topColor === toTopColor && canPour(state[from], state[to])) {
        return [{ from, to }];
      }
    }
  }
  
  // Priority 3: Move to an empty bottle (but not if moving from a bottle with all same colors)
  for (let from = 0; from < state.length; from++) {
    if (state[from].length === 0) continue;
    if (isBottleComplete(state[from])) continue;
    
    // Don't move from bottle if all pieces are same color (unless it's not full)
    const allSameColor = state[from].every(c => c === state[from][0]);
    if (allSameColor && state[from].length === 4) continue;
    
    for (let to = 0; to < state.length; to++) {
      if (from === to) continue;
      if (state[to].length === 0) {
        return [{ from, to }];
      }
    }
  }
  
  // Priority 4: Any valid move
  for (let from = 0; from < state.length; from++) {
    if (state[from].length === 0) continue;
    
    for (let to = 0; to < state.length; to++) {
      if (from === to) continue;
      if (canPour(state[from], state[to])) {
        return [{ from, to }];
      }
    }
  }
  
  return []; // No valid moves found
}
