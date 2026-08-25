const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split('\n');

let firstSection7 = -1;
let secondSection7 = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('SECTION 7: UI COMPONENTS')) {
    if (firstSection7 === -1) {
      firstSection7 = i;
    } else if (secondSection7 === -1) {
      secondSection7 = i;
    }
  }
}

if (firstSection7 !== -1 && secondSection7 !== -1) {
  // Delete lines between the first section 7 and the second section 7
  lines.splice(firstSection7 + 1, secondSection7 - firstSection7);
  fs.writeFileSync('app.js', lines.join('\n'));
  console.log('Fixed app.js corruption by splicing out lines ' + (firstSection7+1) + ' to ' + secondSection7);
} else {
  console.log('Could not find both SECTION 7 lines.');
}