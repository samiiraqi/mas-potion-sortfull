const fs = require('fs');

// Generate a solvable puzzle with exactly 20 bottles
function generateLevel(levelNumber) {
  const totalBottles = 20; // FIXED: Always 20 bottles
  
  // Progressive difficulty
  let numColors, emptyBottles;
  
  if (levelNumber <= 20) {
    // Easy: 2-3 colors, many empty bottles
    numColors = 2 + Math.floor(levelNumber / 10);
    emptyBottles = 8;
  } else if (levelNumber <= 40) {
    // Medium: 3-4 colors
    numColors = 3 + Math.floor((levelNumber - 20) / 10);
    emptyBottles = 6;
  } else if (levelNumber <= 60) {
    // Medium-Hard: 4-5 colors
    numColors = 4 + Math.floor((levelNumber - 40) / 10);
    emptyBottles = 5;
  } else if (levelNumber <= 80) {
    // Hard: 5-6 colors
    numColors = 5 + Math.floor((levelNumber - 60) / 10);
    emptyBottles = 4;
  } else if (levelNumber <= 100) {
    // Very Hard: 6-7 colors
    numColors = 6 + Math.floor((levelNumber - 80) / 10);
    emptyBottles = 3;
  } else {
    // Expert: 7-8 colors
    numColors = 7 + Math.floor((levelNumber - 100) / 10);
    emptyBottles = 2;
  }
  
  // Ensure we don't exceed bottle capacity
  const filledBottles = totalBottles - emptyBottles;
  if (numColors * 4 > filledBottles * 4) {
    numColors = Math.floor(filledBottles / 1.5);
  }
  
  const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#FFD700'
  ];
  
  const bottles = [];
  
  // Create filled bottles with colors
  for (let i = 0; i < numColors; i++) {
    bottles.push([colors[i], colors[i], colors[i], colors[i]]);
  }
  
  // Shuffle the colors to create puzzle
  const shuffledBottles = [];
  for (let i = 0; i < filledBottles; i++) {
    shuffledBottles.push([]);
  }
  
  // Distribute colors randomly
  const allColors = [];
  for (let i = 0; i < numColors; i++) {
    for (let j = 0; j < 4; j++) {
      allColors.push(colors[i]);
    }
  }
  
  // Shuffle
  for (let i = allColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allColors[i], allColors[j]] = [allColors[j], allColors[i]];
  }
  
  // Fill bottles
  let colorIndex = 0;
  for (let i = 0; i < filledBottles && colorIndex < allColors.length; i++) {
    for (let j = 0; j < 4 && colorIndex < allColors.length; j++) {
      shuffledBottles[i].push(allColors[colorIndex++]);
    }
  }
  
  // Add empty bottles
  for (let i = 0; i < emptyBottles; i++) {
    shuffledBottles.push([]);
  }
  
  // Ensure exactly 20 bottles
  while (shuffledBottles.length < totalBottles) {
    shuffledBottles.push([]);
  }
  
  return shuffledBottles.slice(0, totalBottles);
}

// Generate all 120 levels
const levels = {};
for (let i = 1; i <= 120; i++) {
  levels[i] = {
    level_id: i,
    bottles: generateLevel(i)
  };
}

// Save to file
fs.writeFileSync('levels.json', JSON.stringify(levels, null, 2));
console.log('✅ Generated 120 levels with fixed 20-bottle grid!');
console.log('Each level has exactly 20 bottles in 4×5 grid layout');
