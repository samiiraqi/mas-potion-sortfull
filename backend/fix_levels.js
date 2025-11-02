const fs = require('fs');

function makeLevel(levelNum) {
  let uniqueColors;
  let totalBottles;
  let emptyBottles;
  
  if (levelNum <= 30) {
    uniqueColors = 10;
    totalBottles = 12;
    emptyBottles = 2;
  } else if (levelNum <= 60) {
    uniqueColors = 12;
    totalBottles = 15;
    emptyBottles = 3;
  } else if (levelNum <= 90) {
    uniqueColors = 15;
    totalBottles = 18;
    emptyBottles = 3;
  } else {
    uniqueColors = 17;
    totalBottles = 20;
    emptyBottles = 3;
  }
  
  const colorPalette = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#FFB6C1', '#8B4513', '#000000', '#FFFFFF',
    '#808080', '#FFD700', '#00CED1', '#FF1493', '#32CD32'
  ];
  
  const pieces = [];
  for (let i = 0; i < uniqueColors; i++) {
    for (let j = 0; j < 4; j++) {
      pieces.push(colorPalette[i]);
    }
  }
  
  const seed = levelNum * 99999;
  let s = seed;
  const random = () => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
  
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  
  const bottles = [];
  
  let pieceIdx = 0;
  for (let i = 0; i < uniqueColors; i++) {
    const bottle = [];
    for (let j = 0; j < 4; j++) {
      bottle.push(pieces[pieceIdx++]);
    }
    bottles.push(bottle);
  }
  
  for (let i = 0; i < emptyBottles; i++) {
    bottles.push([]);
  }
  
  return { level_id: levelNum, bottles: bottles };
}

console.log('Generating variable bottle counts...');
const allLevels = {};

for (let i = 1; i <= 120; i++) {
  allLevels[i.toString()] = makeLevel(i);
  if (i % 30 === 0) console.log(`  Level ${i}...`);
}

fs.writeFileSync('levels.json', JSON.stringify(allLevels, null, 2));
console.log('✅ DONE!');
console.log('   Levels 1-30: 10 colors, 12 bottles');
console.log('   Levels 31-60: 12 colors, 15 bottles');
console.log('   Levels 61-90: 15 colors, 18 bottles');
console.log('   Levels 91-120: 17 colors, 20 bottles');
