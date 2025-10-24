const fs = require('fs');

function makeLevel(levelNum) {
  let full, empty, colors;
  
  // MUCH EASIER progression - fewer colors!
  if (levelNum <= 20) {
    full = 3; empty = 2; colors = 3;  // Levels 1-20: Only 3 colors!
  } else if (levelNum <= 40) {
    full = 4; empty = 2; colors = 4;  // Levels 21-40: 4 colors
  } else if (levelNum <= 60) {
    full = 5; empty = 2; colors = 5;  // Levels 41-60: 5 colors
  } else if (levelNum <= 80) {
    full = 6; empty = 2; colors = 6;  // Levels 61-80: 6 colors
  } else if (levelNum <= 100) {
    full = 7; empty = 3; colors = 7;  // Levels 81-100: 7 colors
  } else {
    full = 8; empty = 3; colors = 8;  // Levels 101-120: 8 colors
  }
  
  // SUPER DISTINCT COLORS - Maximum contrast, easy to tell apart!
  const colorPalette = [
    '#FF0000', // 1. BRIGHT RED
    '#00FF00', // 2. BRIGHT GREEN
    '#0000FF', // 3. BRIGHT BLUE
    '#FFFF00', // 4. BRIGHT YELLOW
    '#FF00FF', // 5. BRIGHT MAGENTA
    '#00FFFF', // 6. BRIGHT CYAN
    '#FFA500', // 7. BRIGHT ORANGE
    '#800080', // 8. PURPLE
    '#FFD700', // 9. GOLD
    '#FF1493', // 10. DEEP PINK
    '#8B4513', // 11. BROWN
    '#00CED1'  // 12. DARK TURQUOISE
  ];
  
  const totalPiecesNeeded = full * 4;
  const colorsNeeded = Math.min(colors, colorPalette.length);
  
  const pieces = [];
  for (let i = 0; i < colorsNeeded; i++) {
    const color = colorPalette[i];
    pieces.push(color, color, color, color);
  }
  
  // Shuffle pieces
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

console.log('✅ Generated 120 levels with SUPER DISTINCT colors!');
console.log('');
console.log('📊 PROGRESSION:');
console.log('   Levels 1-20:   3 bottles, 3 colors (EASY!)');
console.log('   Levels 21-40:  4 bottles, 4 colors');
console.log('   Levels 41-60:  5 bottles, 5 colors');
console.log('   Levels 61-80:  6 bottles, 6 colors');
console.log('   Levels 81-100: 7 bottles, 7 colors');
console.log('   Levels 101-120: 8 bottles, 8 colors');
console.log('');
console.log('🎨 COLORS USED (all extremely different):');
console.log('   🔴 Bright Red');
console.log('   🟢 Bright Green');
console.log('   🔵 Bright Blue');
console.log('   🟡 Bright Yellow');
console.log('   🟣 Bright Magenta');
console.log('   🩵 Bright Cyan');
console.log('   🟠 Bright Orange');
console.log('   🟣 Purple');
