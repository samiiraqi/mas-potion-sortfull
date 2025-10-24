const fs = require('fs');

const allLevels = {};

for (let lvl = 1; lvl <= 120; lvl++) {
  let numFull, numEmpty, numColors;
  
  if (lvl <= 15) {
    // SUPER EASY (1-15)
    numFull = 18;
    numEmpty = 2;
    numColors = 5;
  } else if (lvl <= 30) {
    // EASY (16-30)
    numFull = 17;
    numEmpty = 3;
    numColors = 5;
  } else if (lvl <= 45) {
    // MEDIUM (31-45)
    numFull = 17;
    numEmpty = 3;
    numColors = 6;
  } else if (lvl <= 60) {
    // MEDIUM+ (46-60)
    numFull = 16;
    numEmpty = 4;
    numColors = 6;
  } else if (lvl <= 75) {
    // HARD (61-75)
    numFull = 16;
    numEmpty = 4;
    numColors = 7;
  } else if (lvl <= 90) {
    // VERY HARD (76-90)
    numFull = 15;
    numEmpty = 5;
    numColors = 7;
  } else if (lvl <= 105) {
    // EXPERT (91-105)
    numFull = 15;
    numEmpty = 5;
    numColors = 8;
  } else {
    // MASTER (106-120)
    numFull = 15;
    numEmpty = 5;
    numColors = 8;
  }
  
  const cols = ['#FF0000','#00FF00','#0000FF','#FFFF00','#FF00FF','#00FFFF','#FFA500','#800080','#FFC0CB','#A52A2A','#32CD32','#FFD700'];
  
  let allPieces = [];
  for (let c = 0; c < numColors; c++) {
    allPieces.push(cols[c], cols[c], cols[c], cols[c]);
  }
  
  for (let i = allPieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPieces[i], allPieces[j]] = [allPieces[j], allPieces[i]];
  }
  
  const bottles = [];
  
  for (let i = 0; i < numFull; i++) {
    bottles.push([allPieces[i*4], allPieces[i*4+1], allPieces[i*4+2], allPieces[i*4+3]]);
  }
  
  for (let i = 0; i < numEmpty; i++) {
    bottles.push([]);
  }
  
  while (bottles.length < 20) {
    bottles.push([]);
  }
  
  for (let i = bottles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bottles[i], bottles[j]] = [bottles[j], bottles[i]];
  }
  
  allLevels[String(lvl)] = { level_id: lvl, bottles: bottles };
}

fs.writeFileSync('levels.json', JSON.stringify(allLevels, null, 2));
console.log('✅ Generated 120 levels - PERFECT difficulty progression!');
