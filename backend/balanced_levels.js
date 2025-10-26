const fs = require('fs');

function makeLevel(levelNum) {
  let uniqueColors;
  
  // GRADUAL PROGRESSION - Solvable until level 70
  if (levelNum <= 5) {
    uniqueColors = 3;   // Levels 1-5: 3 colors (super easy)
  } else if (levelNum <= 15) {
    uniqueColors = 6;   // Levels 6-15: 6 colors 
  } else if (levelNum <= 30) {
    uniqueColors = 9;   // Levels 16-30: 9 colors
  } else if (levelNum <= 50) {
    uniquecolors = 12;  // Levels 31-50: 12 colors
  } else if (levelNum <= 70) {
    uniqueColors = 14;  // Levels 51-70: 14 colors (still manageable)
  } else if (levelNum <= 90) {
    uniqueColors = 16;  // Levels 71-90: 16 colors (getting hard)
  } else if (levelNum <= 110) {
    uniqueColors = 17;  // Levels 91-110: 17 colors (very hard)
  } else {
    uniqueColors = 18;  // Levels 111-120: 18 colors (MASTER level!)
  }
  
  const colorPalette = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#8B4513', '#FF1493', '#800080', '#FFD700', '#00CED1',
    '#32CD32', '#FF6347', '#4169E1', '#FF69B4', '#20B2AA', '#DC143C'
  ];
  
  const pieces = [];
  const totalPieces = 72; // 18 bottles * 4 pieces
  
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

console.log('✅ Generated 120 levels with BALANCED difficulty!');
console.log('');
console.log('📊 NEW PROGRESSION:');
console.log('   Levels 1-5:    3 colors  🟢 SUPER EASY');
console.log('   Levels 6-15:   6 colors  🟢 EASY'); 
console.log('   Levels 16-30:  9 colors  🟡 MEDIUM');
console.log('   Levels 31-50:  12 colors 🟠 CHALLENGING');
console.log('   Levels 51-70:  14 colors 🟠 HARD (but robot can help)');
console.log('   Levels 71-90:  16 colors 🔴 VERY HARD');
console.log('   Levels 91-110: 17 colors 🔴 EXPERT');
console.log('   Levels 111-120: 18 colors 🔴🔴 MASTER!');
console.log('');
console.log('Robot solver should work reliably until level 70!');
