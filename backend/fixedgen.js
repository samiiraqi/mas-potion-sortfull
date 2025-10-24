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
  
  // HIGHLY DISTINCT COLORS - Easy to tell apart!
  const colorPalette = [
    '#FF0000', // Pure Red
    '#00FF00', // Pure Green (Lime)
    '#0000FF', // Pure Blue
    '#FFFF00', // Pure Yellow
    '#FF00FF', // Pure Magenta/Pink
    '#00FFFF', // Pure Cyan
    '#FFA500', // Orange
    '#8B4513', // Brown
    '#FF1493', // Hot Pink
    '#9400D3', // Purple
    '#00FF7F', // Spring Green
    '#FFD700', // Gold
    '#DC143C', // Crimson Red
    '#4169E1', // Royal Blue
    '#32CD32', // Lime Green
    '#FF69B4', // Light Pink
    '#20B2AA', // Turquoise
    '#FF4500'  // Red-Orange
  ];
  
  const totalPiecesNeeded = full * 4;
  const colorsNeeded = Math.ceil(totalPiecesNeeded / 4);
  
  const pieces = [];
  for (let i = 0; i < colorsNeeded; i++) {
    const color = colorPalette[i % colorPalette.length];
    pieces.push(color, color, color, color);
  }
  
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  
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
  
  for (let i = 0; i < empty; i++) {
    bottles.push([]);
  }
  
  while (bottles.length < 20) {
    bottles.push([]);
  }
  
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

console.log('✅ Generated 120 levels with HIGHLY DISTINCT colors!');
console.log('Colors used: Pure Red, Green, Blue, Yellow, Magenta, Cyan, Orange, Brown, etc.');
console.log('All colors are very different and easy to tell apart!');
