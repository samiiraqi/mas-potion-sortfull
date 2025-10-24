const fs = require('fs');

function makeLevel(levelNum) {
  let uniqueColors;
  
  // ALWAYS 20 bottles, but fewer unique colors at start = EASIER!
  if (levelNum <= 10) {
    uniqueColors = 4;   // Levels 1-10: Only 4 colors across 20 bottles (VERY EASY)
  } else if (levelNum <= 20) {
    uniqueColors = 6;   // Levels 11-20: 6 colors
  } else if (levelNum <= 35) {
    uniqueColors = 8;   // Levels 21-35: 8 colors
  } else if (levelNum <= 50) {
    uniqueColors = 10;  // Levels 36-50: 10 colors
  } else if (levelNum <= 70) {
    uniqueColors = 12;  // Levels 51-70: 12 colors
  } else if (levelNum <= 90) {
    uniqueColors = 14;  // Levels 71-90: 14 colors
  } else if (levelNum <= 110) {
    uniqueColors = 16;  // Levels 91-110: 16 colors
  } else {
    uniqueColors = 18;  // Levels 111-120: 18 colors (HARDEST!)
  }
  
  // SUPER DISTINCT COLORS - Maximum contrast!
  const colorPalette = [
    '#FF0000', // 1. BRIGHT RED
    '#00FF00', // 2. BRIGHT GREEN (LIME)
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
  
  // Create pieces: 4 of each color
  const pieces = [];
  for (let i = 0; i < uniqueColors; i++) {
    const color = colorPalette[i];
    pieces.push(color, color, color, color);
  }
  
  // Shuffle all pieces
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  
  // Calculate how many full bottles we need
  const fullBottles = uniqueColors;
  const emptyBottles = 2;
  const totalBottles = 20;
  
  const bottles = [];
  
  // Fill bottles with shuffled pieces
  for (let i = 0; i < fullBottles; i++) {
    const idx = i * 4;
    bottles.push([
      pieces[idx],
      pieces[idx + 1],
      pieces[idx + 2],
      pieces[idx + 3]
    ]);
  }
  
  // Add empty bottles
  for (let i = 0; i < emptyBottles; i++) {
    bottles.push([]);
  }
  
  // Fill remaining bottles with empty bottles
  while (bottles.length < totalBottles) {
    bottles.push([]);
  }
  
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

console.log('✅ Generated 120 levels - ALWAYS 20 bottles!');
console.log('');
console.log('📊 DIFFICULTY PROGRESSION (20 bottles each):');
console.log('   Levels 1-10:    4 colors  (4 full + 16 empty) 🟢 SUPER EASY');
console.log('   Levels 11-20:   6 colors  (6 full + 14 empty) 🟢 EASY');
console.log('   Levels 21-35:   8 colors  (8 full + 12 empty) 🟡 MEDIUM');
console.log('   Levels 36-50:   10 colors (10 full + 10 empty)');
console.log('   Levels 51-70:   12 colors (12 full + 8 empty)');
console.log('   Levels 71-90:   14 colors (14 full + 6 empty) 🟠 HARD');
console.log('   Levels 91-110:  16 colors (16 full + 4 empty)');
console.log('   Levels 111-120: 18 colors (18 full + 2 empty) 🔴 HARDEST');
console.log('');
console.log('🎨 Using 18 EXTREMELY DISTINCT colors!');
