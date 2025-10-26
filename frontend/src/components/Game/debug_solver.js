// Add this to your browser console to see the current bottles
console.log("Current bottles state:");
console.log(bottles.map((bottle, i) => `Bottle ${i}: [${bottle.join(', ')}]`));
console.log("Total bottles:", bottles.length);
console.log("Empty bottles:", bottles.filter(b => b.length === 0).length);
console.log("Full bottles:", bottles.filter(b => b.length === 4).length);

// Count colors
const colorCount = {};
bottles.forEach(bottle => {
  bottle.forEach(color => {
    colorCount[color] = (colorCount[color] || 0) + 1;
  });
});
console.log("Color distribution:", colorCount);
