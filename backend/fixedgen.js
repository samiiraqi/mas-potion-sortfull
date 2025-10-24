const fs = require('fs');

function makeLevel(levelNum) {
  let uniqueColors;
  
  // ALWAYS 18 full + 2 empty = 20 bottles
  // But fewer unique colors at start = easier!
  if (levelNum <= 10) {
    uniqueColors = 4;   // Levels 1-10: Only 4 DIFFERENT colors! (SUPER EASY)
  } else if (levelNum <= 20) {
    uniqueColors = 6;   // Levels 11-20: 6 different colors
  } else if (levelNum <= 35) {
    uniqueColors = 8;   // Levels 21-35: 8 different colors
  } else if (levelNum <= 50) {
    uniqueColors = 10;  // Levels 36-50: 10 different colors
  } else if (levelNum <= 70) {
    uniqueColors = 12;  // Levels 51-70: 12 different colors
  } else if (levelNum <= 90) {
    uniqueColors = 14;  // Levels 71-90: 14 different colors
  } else if (levelNum <= 110) {
    uniqueColors = 16;  // Levels 91-110: 16 different colors
  } else {
    uniqueColors = 18;  // Levels 111-120: 18 different colors (HARDEST!)
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
  
  // We need 18 full bottles * 4 pieces = 72 pieces total
  // But only use 'uniqueColors' different colors
  const pieces = [];
  
  // Calculate how many times to repeat each color
  const totalPieces = 72;
  const piecesPerColor = Math.floor(totalPieces / uniqueColors);
  const extraPieces = totalPieces % uniqueColors;
  
  // Add pieces for each color
  for (let i = 0; i < uniqueColors; i++) {
    const color = colorPalette[i];
    const count = piecesPerColor + (i < extraPieces ? 1 : 0);
    for (let j = 0; j < count; j++) {
      pieces.push(color);
    }
  }
  
  // Shuffle all pieces
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  
  const bottles = [];
  
  // Fill 18 bottles with 4 pieces each
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

console.log('✅ Generated 120 levels - 18 full + 2 empty ALWAYS!');
console.log('');
console.log('📊 DIFFICULTY PROGRESSION:');
console.log('   Levels 1-10:    4 different colors  🟢 SUPER EASY');
console.log('   Levels 11-20:   6 different colors  🟢 EASY');
console.log('   Levels 21-35:   8 different colors  🟡 MEDIUM');
console.log('   Levels 36-50:   10 different colors');
console.log('   Levels 51-70:   12 different colors');
console.log('   Levels 71-90:   14 different colors 🟠 HARD');
console.log('   Levels 91-110:  16 different colors');
console.log('   Levels 111-120: 18 different colors 🔴 HARDEST');
console.log('');
console.log('🎯 ALWAYS: 18 full bottles + 2 empty bottles = 20 total');
console.log('🎨 Using EXTREMELY DISTINCT colors only!');
