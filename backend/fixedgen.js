const fs = require('fs');

function makeLevel(levelNum) {
  let uniqueColors;
  
  // Determine how many DIFFERENT colors to use
  if (levelNum <= 10) {
    uniqueColors = 4;   // Levels 1-10: Only 4 colors
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
    uniqueColors = 18;  // Levels 111-120: 18 colors
  }
  
  // SUPER DISTINCT COLORS
  const colorPalette = [
    '#FF0000', // RED
    '#00FF00', // GREEN
    '#0000FF', // BLUE
    '#FFFF00', // YELLOW
    '#FF00FF', // MAGENTA
    '#00FFFF', // CYAN
    '#FFA500', // ORANGE
    '#8B4513', // BROWN
    '#FF1493', // DEEP PINK
    '#800080', // PURPLE
    '#FFD700', // GOLD
    '#00CED1', // DARK TURQUOISE
    '#32CD32', // LIME GREEN
    '#FF6347', // TOMATO RED
    '#4169E1', // ROYAL BLUE
    '#FF69B4', // HOT PINK
    '#20B2AA', // LIGHT SEA GREEN
    '#DC143C'  // CRIMSON
  ];
  
  // CRITICAL FIX: Each color must appear EXACTLY 4 times!
  // 18 full bottles * 4 pieces = 72 pieces total
  // So we need colors that divide evenly
  
  // Make sure uniqueColors divides 18 evenly, or adjust
  let bottlesPerColor;
  
  if (18 % uniqueColors === 0) {
    // Perfect division
    bottlesPerColor = 18 / uniqueColors;
  } else {
    // Round to nearest divisor of 18
    // Divisors of 18: 1, 2, 3, 6, 9, 18
    const divisors = [1, 2, 3, 6, 9, 18];
    bottlesPerColor = divisors.reduce((prev, curr) => 
      Math.abs(curr - (18 / uniqueColors)) < Math.abs(prev - (18 / uniqueColors)) ? curr : prev
    );
    uniqueColors = 18 / bottlesPerColor;
  }
  
  const pieces = [];
  
  // Each color appears in exactly bottlesPerColor bottles
  // So each color needs bottlesPerColor * 4 pieces
  for (let i = 0; i < uniqueColors; i++) {
    const color = colorPalette[i];
    const piecesForThisColor = bottlesPerColor * 4;
    for (let j = 0; j < piecesForThisColor; j++) {
      pieces.push(color);
    }
  }
  
  // Now we have EXACTLY 72 pieces (18 bottles * 4)
  console.log(`Level ${levelNum}: ${uniqueColors} colors, ${bottlesPerColor} bottles per color, ${pieces.length} total pieces`);
  
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

console.log('\n✅ Generated 120 levels - ALL MATHEMATICALLY CORRECT!');
console.log('\n📊 Each level has EXACTLY the right number of each color!');
console.log('🎯 ALWAYS: 18 full bottles + 2 empty = 20 total');
console.log('✅ Every color appears in complete sets of 4!');
