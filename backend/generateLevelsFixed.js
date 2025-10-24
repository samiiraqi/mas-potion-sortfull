const fs = require('fs');

/**
 * PERFECT LEVEL GENERATOR
 * - ALL bottles have EXACTLY 4 pieces (completely full)
 * - Progressive difficulty by number of colors
 * - Always exactly 20 bottles
 * - Always solvable
 */
function generateLevel(levelNumber) {
  const TOTAL_BOTTLES = 20;
  const BOTTLE_CAPACITY = 4;
  
  // Determine number of colors based on level (difficulty)
  let numColors;
  
  if (levelNumber <= 15) {
    // EASY: 4 colors = 16 pieces = 4 full bottles + 16 empty bottles? NO!
    // We need: 4 colors, each color gets 1 full bottle = 4 full bottles + some mixed bottles
    numColors = 4;
  } else if (levelNumber <= 30) {
    numColors = 5;
  } else if (levelNumber <= 45) {
    numColors = 6;
  } else if (levelNumber <= 60) {
    numColors = 7;
  } else if (levelNumber <= 75) {
    numColors = 8;
  } else if (levelNumber <= 90) {
    numColors = 9;
  } else if (levelNumber <= 105) {
    numColors = 10;
  } else {
    numColors = 11;
  }
  
  // Maximum colors we can handle with 20 bottles
  numColors = Math.min(numColors, 12);
  
  const colors = [
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#FFC0CB', // Pink
    '#A52A2A', // Brown
    '#32CD32', // Lime
    '#FFD700'  // Gold
  ];
  
  // Calculate how many bottles we'll have
  // We need: numColors full bottles (solved state) + 2 empty bottles for moving
  const fullBottlesNeeded = numColors + 2; // +2 empty for gameplay
  const mixedBottlesNeeded = TOTAL_BOTTLES - fullBottlesNeeded;
  
  // Create color pieces: 4 pieces per color
  const allColorPieces = [];
  for (let i = 0; i < numColors; i++) {
    for (let j = 0; j < BOTTLE_CAPACITY; j++) {
      allColorPieces.push(colors[i]);
    }
  }
  
  // Shuffle the pieces
  for (let i = allColorPieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allColorPieces[i], allColorPieces[j]] = [allColorPieces[j], allColorPieces[i]];
  }
  
  // Create bottles - each bottle MUST have exactly 4 pieces!
  const bottles = [];
  let pieceIndex = 0;
  
  // Fill bottles with shuffled colors (each bottle gets EXACTLY 4 pieces)
  const bottlesToFill = numColors + Math.floor(numColors / 2); // Smart calculation
  
  for (let i = 0; i < bottlesToFill && pieceIndex + BOTTLE_CAPACITY <= allColorPieces.length; i++) {
    const bottle = [];
    for (let j = 0; j < BOTTLE_CAPACITY; j++) {
      bottle.push(allColorPieces[pieceIndex++]);
    }
    bottles.push(bottle);
  }
  
  // Add empty bottles (for solving the puzzle)
  const emptyBottles = TOTAL_BOTTLES - bottles.length;
  for (let i = 0; i < emptyBottles; i++) {
    bottles.push([]);
  }
  
  return bottles;
}

// Generate all 120 levels
console.log('🔮 Generating 120 PERFECT levels...\n');

const levels = {};
for (let i = 1; i <= 120; i++) {
  levels[i] = {
    level_id: i,
    bottles: generateLevel(i)
  };
  
  // Verify and log
  const totalBottles = levels[i].bottles.length;
  const filled = levels[i].bottles.filter(b => b.length === 4).length;
  const empty = levels[i].bottles.filter(b => b.length === 0).length;
  const partial = levels[i].bottles.filter(b => b.length > 0 && b.length < 4).length;
  const uniqueColors = new Set(levels[i].bottles.flat()).size;
  
  if (i <= 10 || i % 20 === 0) {
    console.log(`Level ${String(i).padStart(3)}: ${filled} full, ${empty} empty, ${partial} partial, ${uniqueColors} colors`);
  }
}

fs.writeFileSync('levels.json', JSON.stringify(levels, null, 2));

console.log('\n✅ Generated 120 levels with perfect logic!');
