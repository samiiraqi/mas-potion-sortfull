const fs = require('fs');

// Generate a solvable puzzle with exactly 20 bottles
function generateLevel(levelNumber) {
  const totalBottles = 20; // FIXED: Always 20 bottles
  
  // Progressive difficulty - FIXED: More filled bottles
  let numColors, emptyBottles;
  
  if (levelNumber <= 20) {
    // Easy: 3-4 colors, 4 empty bottles
    numColors = 3 + Math.floor((levelNumber - 1) / 10);
    emptyBottles = 4;
  } else if (levelNumber <= 40) {
    // Medium: 4-5 colors, 4 empty
    numColors = 4 + Math.floor((levelNumber - 20) / 10);
    emptyBottles = 4;
  } else if (levelNumber <= 60) {
    // Medium-Hard: 5-6 colors, 3 empty
    numColors = 5 + Math.floor((levelNumber - 40) / 10);
    emptyBottles = 3;
  } else if (levelNumber <= 80) {
    // Hard: 6-7 colors, 3 empty
    numColors = 6 + Math.floor((levelNumber - 60) / 10);
    emptyBottles = 3;
  } else if (levelNumber <= 100) {
    // Very Hard: 7-8 colors, 2 empty
    numColors = 7 + Math.floor((levelNumber - 80) / 10);
    emptyBottles = 2;
  } else {
    // Expert: 8-9 colors, 2 empty
    numColors = Math.min(9, 7 + Math.floor((levelNumber - 100) / 10));
    emptyBottles = 2;
  }
  
  const colors = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#32CD32', '#FFD700'
  ];
  
  // Create all colors (4 of each)
  const allColors = [];
  for (let i = 0; i < numColors; i++) {
    for (let j = 0; j < 4; j++) {
      allColors.push(colors[i]);
    }
  }
  
  // Shuffle colors
  for (let i = allColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allColors[i], allColors[j]] = [allColors[j], allColors[i]];
  }
  
  // Calculate filled bottles
  const filledBottles = totalBottles - emptyBottles;
  
  // Fill bottles
  const bottles = [];
  let colorIndex = 0;
  
  for (let i = 0; i < filledBottles && colorIndex < allColors.length; i++) {
    const bottle = [];
    for (let j = 0; j < 4 && colorIndex < allColors.length; j++) {
      bottle.push(allColors[colorIndex++]);
    }
    bottles.push(bottle);
  }
  
  // Add empty bottles
  for (let i = 0; i < emptyBottles; i++) {
    bottles.push([]);
  }
  
  return bottles;
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
console.log('✅ Generated 120 levels with proper difficulty!');
console.log('Level 1:', levels[1].bottles.filter(b => b.length > 0).length, 'filled bottles');
console.log('Level 60:', levels[60].bottles.filter(b => b.length > 0).length, 'filled bottles');
console.log('Level 120:', levels[120].bottles.filter(b => b.length > 0).length, 'filled bottles');
