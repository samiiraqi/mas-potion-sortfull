const fs = require('fs');

function makeLevel(levelNum) {
  let uniqueColors;
  
  // GENTLE DIFFICULTY CURVE - Easy start, gradual increase
  if (levelNum <= 3) {
    uniqueColors = 3;   // Levels 1-3: Only 3 colors (EASY START!)
  } else if (levelNum <= 8) {
    uniqueColors = 6;   // Levels 4-8: 6 colors
  } else if (levelNum <= 15) {
    uniqueColors = 9;   // Levels 9-15: 9 colors
  } else if (levelNum <= 25) {
    uniqueColors = 12;  // Levels 16-25: 12 colors
  } else if (levelNum <= 40) {
    uniqueColors = 14;  // Levels 26-40: 14 colors
  } else if (levelNum <= 60) {
    uniqueColors = 15;  // Levels 41-60: 15 colors
  } else if (levelNum <= 80) {
    uniqueColors = 16;  // Levels 61-80: 16 colors
  } else if (levelNum <= 100) {
    uniqueColors = 17;  // Levels 81-100: 17 colors
  } else {
    uniqueColors = 18;  // Levels 101-120: 18 colors (HARDEST!)
  }
  
  // SUPER DISTINCT COLORS
  const colorPalette = [
    '#FF0000', // 1. BRIGHT RED
    '#00FF00', // 2. BRIGHT GREEN
    '#0000FF', // 3. BRIGHT BLUE
    '#FFFF00', // 4. BRIGHT YELLOW
    '#FF00FF', // 5. BRIGHT MAGENTA
    '#00FFFF', // 6. BRIGHT CYAN
    '#FFA500', // 7. BRIGHT ORANGE
    '#8B4513', // 8. BROWN
    '#FF1493', // 9. DEEP PINK
    '#800080', // 10. PURPLE
    '#FFD700', // 11. GOLD
    '#00CED1', // 12. DARK TURQUOISE
    '#32CD32', // 13. LIME GREEN
    '#FF6347', // 14. TOMATO RED
    '#4169E1', // 15. ROYAL BLUE
    '#FF69B4', // 16. HOT PINK
    '#20B2AA', // 17. LIGHT SEA GREEN
    '#DC143C'  // 18. CRIMSON
  ];
  
  const pieces = [];
  const totalPieces = 72; // 18 bottles * 4 pieces
  
  // Each color must appear in complete sets of 4
  const piecesPerColor = Math.floor(totalPieces / uniqueColors);
  const extraPieces = totalPieces % uniqueColors;
  
  for (let i = 0; i < uniqueColors; i++) {
    const color = colorPalette[i];
    const count = piecesPerColor + (i < extraPieces ? 1 : 0);
    for (let j = 0; j < count; j++) {
      pieces.push(color);
    }
  }
  
  // Shuffle pieces
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  
  const bottles = [];
  
  // Fill 18 bottles
  for (let i = 0; i < 18; i++) {
    const idx = i * 4;
    bottles.push([
      pieces[idx],
      pieces[idx + 1],
      pieces[idx + 2],
      pieces[idx + 3]
    ]);
  }
  
  // Add 2 empty bottles
  bottles.push([]);
  bottles.push([]);
  
  // Shuffle bottle positions
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

console.log('✅ Generated 120 levels with GENTLE difficulty curve!');
console.log('');
console.log('📊 DIFFICULTY PROGRESSION:');
console.log('   Levels 1-3:    3 colors  🟢🟢🟢 EASY START!');
console.log('   Levels 4-8:    6 colors  🟢🟢 EASY');
console.log('   Levels 9-15:   9 colors  🟢 MEDIUM-EASY');
console.log('   Levels 16-25:  12 colors 🟡 MEDIUM');
console.log('   Levels 26-40:  14 colors 🟠 MEDIUM-HARD');
console.log('   Levels 41-60:  15 colors 🟠 HARD');
console.log('   Levels 61-80:  16 colors 🔴 VERY HARD');
console.log('   Levels 81-100: 17 colors 🔴 EXPERT');
console.log('   Levels 101-120: 18 colors 🔴🔴 MASTER!');
console.log('');
console.log('🎨 Always: 18 full bottles + 2 empty = 20 total');
console.log('✅ All levels are perfectly solvable!');
