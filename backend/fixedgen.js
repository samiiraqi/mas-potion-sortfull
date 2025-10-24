const fs = require('fs');

function makeLevel(levelNum) {
  let full, empty, colors;
  
  if (levelNum <= 15) {
    full = 18; empty = 2; colors = 5;
  } else if (levelNum <= 30) {
    full = 17; empty = 3; colors = 5;
  } else if (levelNum <= 45) {
    full = 17; empty = 3; colors = 6;
  } else if (levelNum <= 60) {
    full = 16; empty = 4; colors = 6;
  } else if (levelNum <= 75) {
    full = 16; empty = 4; colors = 7;
  } else if (levelNum <= 90) {
    full = 15; empty = 5; colors = 7;
  } else if (levelNum <= 105) {
    full = 15; empty = 5; colors = 8;
  } else {
    full = 15; empty = 5; colors = 8;
  }
  
  const colorPalette = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF',
    '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#A52A2A',
    '#32CD32', '#FFD700', '#FF1493', '#00CED1', '#FF6347',
    '#8B4513', '#2E8B57', '#4169E1'
  ];
  
  // Calculate how many pieces we need total
  const totalPiecesNeeded = full * 4;
  
  // We need enough colors to fill all bottles
  // Each color appears 4 times (to make one complete bottle when solved)
  const colorsNeeded = Math.ceil(totalPiecesNeeded / 4);
  
  // Create pieces - use exactly the number of colors needed
  const pieces = [];
  for (let i = 0; i < colorsNeeded; i++) {
    const color = colorPalette[i % colorPalette.length];
    pieces.push(color, color, color, color);
  }
  
  // Shuffle pieces
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  
  // Create full bottles
  const bottles = [];
  for (let i = 0; i < full; i++) {
    const idx = i * 4;
    bottles.push([
      pieces[idx],
      pieces[idx + 1],
      pieces[idx + 2],
      pieces[idx + 3]
    ]);
  }
  
  // Add empty bottles
  for (let i = 0; i < empty; i++) {
    bottles.push([]);
  }
  
  // Pad to 20
  while (bottles.length < 20) {
    bottles.push([]);
  }
  
  // Shuffle bottles
  for (let i = bottles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bottles[i], bottles[j]] = [bottles[j], bottles[i]];
  }
  
  return bottles;
}

const allLevels = {};
for (let i = 1; i <= 120; i++) {
  allLevels[i.toString()] = {
    level_id: i,
    bottles: makeLevel(i)
  };
}

fs.writeFileSync('levels.json', JSON.stringify(allLevels, null, 2));

console.log('✅ Generated 120 levels\n');
console.log('VERIFICATION:');
for (const testLevel of [1, 6, 30, 60, 90, 120]) {
  const lvl = allLevels[testLevel.toString()];
  const fullBottles = lvl.bottles.filter(b => b.length === 4).length;
  const emptyBottles = lvl.bottles.filter(b => b.length === 0).length;
  console.log(`Level ${testLevel}: ${fullBottles} full, ${emptyBottles} empty`);
}
