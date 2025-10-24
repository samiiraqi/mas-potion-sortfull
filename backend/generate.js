const fs = require('fs');

function createLevel(levelNum) {
  // Decide configuration based on level
  let full, empty, colors;
  
  if (levelNum <= 10) { full = 9; empty = 2; colors = 3; }
  else if (levelNum <= 20) { full = 10; empty = 2; colors = 4; }
  else if (levelNum <= 35) { full = 11; empty = 2; colors = 5; }
  else if (levelNum <= 50) { full = 12; empty = 2; colors = 6; }
  else if (levelNum <= 65) { full = 11; empty = 3; colors = 7; }
  else if (levelNum <= 80) { full = 10; empty = 3; colors = 8; }
  else if (levelNum <= 95) { full = 9; empty = 3; colors = 9; }
  else if (levelNum <= 110) { full = 8; empty = 4; colors = 9; }
  else { full = 7; empty = 4; colors = 10; }
  
  const palette = ['#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF','#FFA500','#800080','#FFC0CB','#A52A2A','#32CD32','#FFD700'];
  
  // Build piece array
  let pieces = [];
  for (let i = 0; i < colors; i++) {
    pieces.push(palette[i], palette[i], palette[i], palette[i]);
  }
  
  // Shuffle pieces
  for (let i = pieces.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  
  // Build bottles
  let bottles = [];
  
  // Add full bottles (4 pieces each)
  for (let i = 0; i < full; i++) {
    bottles.push([pieces[i*4], pieces[i*4+1], pieces[i*4+2], pieces[i*4+3]]);
  }
  
  // Add empty bottles
  for (let i = 0; i < empty; i++) {
    bottles.push([]);
  }
  
  // Fill to 20 total
  while (bottles.length < 20) {
    bottles.push([]);
  }
  
  // Shuffle bottle order
  for (let i = bottles.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [bottles[i], bottles[j]] = [bottles[j], bottles[i]];
  }
  
  return bottles;
}

// Generate all 120 levels
let allLevels = {};
for (let i = 1; i <= 120; i++) {
  allLevels[i] = {
    level_id: i,
    bottles: createLevel(i)
  };
}

fs.writeFileSync('levels.json', JSON.stringify(allLevels, null, 2));

// Verify
console.log('GENERATED 120 LEVELS:');
console.log('Level 1:', allLevels[1].bottles.filter(b => b.length === 4).length, 'full');
console.log('Level 60:', allLevels[60].bottles.filter(b => b.length === 4).length, 'full');
console.log('Level 120:', allLevels[120].bottles.filter(b => b.length === 4).length, 'full');
