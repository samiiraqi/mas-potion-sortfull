const fs = require('fs');

const allLevels = {};

for (let lvl = 1; lvl <= 120; lvl++) {
  let numFull, numEmpty, numColors;
  
  if (lvl <= 15) {
    numFull = 18;
    numEmpty = 2;
    numColors = 5;
  } else if (lvl <= 30) {
    numFull = 17;
    numEmpty = 3;
    numColors = 5;
  } else if (lvl <= 45) {
    numFull = 17;
    numEmpty = 3;
    numColors = 6;
  } else if (lvl <= 60) {
    numFull = 16;
    numEmpty = 4;
    numColors = 6;
  } else if (lvl <= 75) {
    numFull = 16;
    numEmpty = 4;
    numColors = 7;
  } else if (lvl <= 90) {
    numFull = 15;
    numEmpty = 5;
    numColors = 7;
  } else if (lvl <= 105) {
    numFull = 15;
    numEmpty = 5;
    numColors = 8;
  } else {
    numFull = 15;
    numEmpty = 5;
    numColors = 8;
  }
  
  const cols = ['#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF','#FFA500','#800080','#FFC0CB','#A52A2A','#32CD32','#FFD700'];
  
  // Create pieces array
  let allPieces = [];
  for (let c = 0; c < numColors; c++) {
    for (let p = 0; p < 4; p++) {
      allPieces.push(cols[c]);
    }
  }
  
  // Shuffle
  for (let i = allPieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPieces[i], allPieces[j]] = [allPieces[j], allPieces[i]];
  }
  
  // Build bottles
  const bottles = [];
  
  // Add full bottles
  let pieceIdx = 0;
  for (let b = 0; b < numFull; b++) {
    const bottle = [];
    for (let p = 0; p < 4; p++) {
      if (pieceIdx < allPieces.length) {
        bottle.push(allPieces[pieceIdx]);
        pieceIdx++;
      }
    }
    // Only add if bottle has exactly 4 pieces
    if (bottle.length === 4) {
      bottles.push(bottle);
    }
  }
  
  // Add empty bottles
  for (let e = 0; e < numEmpty; e++) {
    bottles.push([]);
  }
  
  // Pad to 20 total
  while (bottles.length < 20) {
    bottles.push([]);
  }
  
  // Shuffle bottle order
  for (let i = bottles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bottles[i], bottles[j]] = [bottles[j], bottles[i]];
  }
  
  allLevels[String(lvl)] = { level_id: lvl, bottles: bottles };
}

fs.writeFileSync('levels.json', JSON.stringify(allLevels, null, 2));
console.log('✅ Generated 120 levels');
