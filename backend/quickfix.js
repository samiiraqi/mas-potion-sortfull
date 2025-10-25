const fs = require('fs');

// Read existing levels
const levels = JSON.parse(fs.readFileSync('levels.json', 'utf8'));

// Make level 1 SUPER EASY - only 2 colors (Red and Blue)
// 2 bottles of red, 2 bottles of blue, 16 empty bottles
levels['1'] = {
  level_id: 1,
  bottles: [
    ['#FF0000', '#FF0000', '#FF0000', '#FF0000'], // Red bottle 1
    ['#FF0000', '#0000FF', '#FF0000', '#0000FF'], // Mixed
    ['#0000FF', '#FF0000', '#0000FF', '#FF0000'], // Mixed  
    ['#0000FF', '#0000FF', '#0000FF', '#0000FF'], // Blue bottle 1
    [], // Empty
    [], // Empty
    [], [], [], [], [], [], [], [], [], [], [], [], [], []
  ]
};

fs.writeFileSync('levels.json', JSON.stringify(levels, null, 2));
console.log('✅ Level 1 is now SUPER EASY - only 2 colors!');
