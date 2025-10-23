const fs = require('fs');

/**
 * MAXIMALLY FILLED LEVELS - Minimum empty bottles!
 */
function generateLevel(levelNumber) {
  const TOTAL_BOTTLES = 20;
  const BOTTLE_CAPACITY = 4;
  
  // AGGRESSIVE DIFFICULTY - Most bottles filled!
  let numColors, emptyBottles;
  
  if (levelNumber <= 10) {
    // EASY: Levels 1-10
    // 4 colors (16 pieces), 2 empty bottles
    numColors = 4;
    emptyBottles = 2;
  } else if (levelNumber <= 20) {
    // EASY-MEDIUM: Levels 11-20
    // 5 colors (20 pieces), 2 empty bottles
    numColors = 5;
    emptyBottles = 2;
  } else if (levelNumber <= 35) {
    // MEDIUM: Levels 21-35
    // 6 colors (24 pieces), 2 empty bottles
    numColors = 6;
    emptyBottles = 2;
  } else if (levelNumber <= 50) {
    // MEDIUM-HARD: Levels 36-50
    // 7 colors (28 pieces), 2 empty bottles
    numColors = 7;
    emptyBottles = 2;
  } else if (levelNumber <= 70) {
    // HARD: Levels 51-70
    // 8 colors (32 pieces), 2 empty bottles
    numColors = 8;
    emptyBottles = 2;
  } else if (levelNumber <= 90) {
    // VERY HARD: Levels 71-90
    // 9 colors (36 pieces), 2 empty bottles
    numColors = 9;
    emptyBottles = 2;
  } else if (levelNumber <= 110) {
    // EXPERT: Levels 91-110
    // 9 colors (36 pieces), 1 empty bottle (HARD!)
    numColors = 9;
    emptyBottles = 1;
  } else {
    // MASTER: Levels 111-120
    // 9 colors (36 pieces), 1 empty bottle (HARDEST!)
    numColors = 9;
    emptyBottles = 1;
  }
  
  const colors = [
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#FFC0CB'  // Pink
  ];
  
  // Create all color pieces (4 of each color)
  const allColorPieces = [];
  for (let i = 0; i < numColors; i++) {
    for (let j = 0; j < BOTTLE_CAPACITY; j++) {
      allColorPieces.push(colors[i]);
    }
  }
  
  // Shuffle thoroughly
  for (let i = allColorPieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allColorPieces[i], allColorPieces[j]] = [allColorPieces[j], allColorPieces[i]];
  }
  
  // Calculate how many bottles we need for all pieces
  const filledBottles = TOTAL_BOTTLES - emptyBottles;
  
  // Distribute pieces into bottles
  const bottles = [];
  let pieceIndex = 0;
  
  for (let i = 0; i < filledBottles; i++) {
    const bottle = [];
    for (let j = 0; j < BOTTLE_CAPACITY && pieceIndex < allColorPieces.length; j++) {
      bottle.push(allColorPieces[pieceIndex++]);
    }
    bottles.push(bottle);
  }
  
  // Add empty bottles at the end
  for (let i = 0; i < emptyBottles; i++) {
    bottles.push([]);
  }
  
  // Shuffle bottle order so empties aren't always at the end
  for (let i = bottles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bottles[i], bottles[j]] = [bottles[j], bottles[i]];
  }
  
  return bottles;
}

// Generate all 120 levels
console.log('🔮 Generating 120 MAXIMALLY FILLED levels...\n');

const levels = {};
for (let i = 1; i <= 120; i++) {
  levels[i] = {
    level_id: i,
    bottles: generateLevel(i)
  };
  
  // Log examples
  if (i === 1 || i === 10 || i === 20 || i === 50 || i === 90 || i === 120) {
    const filled = levels[i].bottles.filter(b => b.length > 0).length;
    const empty = levels[i].bottles.filter(b => b.length === 0).length;
    const uniqueColors = new Set(levels[i].bottles.flat()).size;
    console.log(`Level ${String(i).padStart(3)}: ${filled} filled, ${empty} empty, ${uniqueColors} colors ✓`);
  }
}

fs.writeFileSync('levels.json', JSON.stringify(levels, null, 2));

console.log('\n✅ DONE! All 120 levels generated!');
console.log('📊 Difficulty curve:');
console.log('   Levels 1-10:    4 colors, 18 filled, 2 empty');
console.log('   Levels 11-20:   5 colors, 18 filled, 2 empty');
console.log('   Levels 21-35:   6 colors, 18 filled, 2 empty');
console.log('   Levels 36-50:   7 colors, 18 filled, 2 empty');
console.log('   Levels 51-70:   8 colors, 18 filled, 2 empty');
console.log('   Levels 71-90:   9 colors, 18 filled, 2 empty');
console.log('   Levels 91-120:  9 colors, 19 filled, 1 empty (HARDEST!)');
console.log('\n🎮 MAXIMUM challenge with MINIMUM empty bottles!');
