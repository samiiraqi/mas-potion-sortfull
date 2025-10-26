const levels = require('./levels.json');

function solvePuzzle(bottles) {
  const moves = [];
  const state = bottles.map(b => [...b]);
  
  function isComplete() {
    return state.every(bottle => 
      bottle.length === 0 || 
      (bottle.length === 4 && bottle.every(c => c === bottle[0]))
    );
  }
  
  function canPour(from, to) {
    if (from === to) return false;
    if (state[from].length === 0) return false;
    if (state[to].length >= 4) return false;
    if (state[to].length === 0) return true;
    
    return state[from][state[from].length - 1] === state[to][state[to].length - 1];
  }
  
  function pour(from, to) {
    const piece = state[from].pop();
    state[to].push(piece);
    moves.push({ from, to });
    console.log(`Move ${moves.length}: Bottle ${from} -> Bottle ${to} (${piece})`);
  }
  
  function findBestMove() {
    // Priority 1: Complete bottles (3 same colors, need 1 more)
    for (let to = 0; to < state.length; to++) {
      if (state[to].length === 3) {
        const targetColor = state[to][0];
        if (state[to].every(c => c === targetColor)) {
          for (let from = 0; from < state.length; from++) {
            if (state[from].length > 0 && 
                state[from][state[from].length - 1] === targetColor) {
              return { from, to };
            }
          }
        }
      }
    }
    
    // Priority 2: Move to empty bottles
    for (let from = 0; from < state.length; from++) {
      if (state[from].length > 0) {
        for (let to = 0; to < state.length; to++) {
          if (state[to].length === 0) {
            return { from, to };
          }
        }
      }
    }
    
    // Priority 3: Stack same colors
    for (let from = 0; from < state.length; from++) {
      if (state[from].length > 0) {
        const topColor = state[from][state[from].length - 1];
        for (let to = 0; to < state.length; to++) {
          if (canPour(from, to)) {
            return { from, to };
          }
        }
      }
    }
    
    return null;
  }
  
  // Try to solve with simple strategy
  for (let attempt = 0; attempt < 200; attempt++) {
    if (isComplete()) break;
    
    const move = findBestMove();
    if (!move) break;
    
    pour(move.from, move.to);
  }
  
  console.log(`\nSolver completed: ${moves.length} moves, solved: ${isComplete()}`);
  return moves;
}

// Load level 10 and solve it
const level10 = levels['10'];
console.log('Solving Level 10...\n');

console.log('Initial state:');
level10.bottles.forEach((bottle, i) => {
  if (bottle.length > 0) {
    console.log(`Bottle ${i}: [${bottle.join(', ')}]`);
  } else {
    console.log(`Bottle ${i}: EMPTY`);
  }
});

console.log('\nSolution:');
const solution = solvePuzzle(level10.bottles);

if (solution.length > 0) {
  console.log(`\nLevel 10 can be solved in ${solution.length} moves!`);
} else {
  console.log('\nCould not find complete solution with this algorithm.');
}
