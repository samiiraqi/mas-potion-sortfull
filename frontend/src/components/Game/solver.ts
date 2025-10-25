interface Move {
  from: number;
  to: number;
}

export function solvePuzzle(bottles: string[][]): Move[] {
  const moves: Move[] = [];
  const state = bottles.map(b => [...b]);
  let iterations = 0;
  const maxIterations = 500;

  function isComplete(): boolean {
    return state.every(bottle => 
      bottle.length === 0 || 
      (bottle.length === 4 && bottle.every(c => c === bottle[0]))
    );
  }

  function canPour(from: number, to: number): boolean {
    if (state[from].length === 0) return false;
    if (state[to].length >= 4) return false;
    if (from === to) return false;
    if (state[to].length === 0) return true;
    
    const fromTop = state[from][state[from].length - 1];
    const toTop = state[to][state[to].length - 1];
    return fromTop === toTop;
  }

  function pour(from: number, to: number): void {
    const color = state[from][state[from].length - 1];
    let count = 0;
    
    for (let i = state[from].length - 1; i >= 0; i--) {
      if (state[from][i] === color) count++;
      else break;
    }
    
    const space = 4 - state[to].length;
    const pourCount = Math.min(count, space);
    
    for (let i = 0; i < pourCount; i++) {
      state[from].pop();
      state[to].push(color);
    }
  }

  while (!isComplete() && iterations < maxIterations) {
    iterations++;
    let foundMove = false;

    for (let from = 0; from < state.length; from++) {
      if (state[from].length === 0) continue;
      
      for (let to = 0; to < state.length; to++) {
        if (!canPour(from, to)) continue;
        
        moves.push({ from, to });
        pour(from, to);
        foundMove = true;
        break;
      }
      if (foundMove) break;
    }

    if (!foundMove) break;
  }

  return isComplete() ? moves : [];
}
