const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("fellow.mtf") && lines[i].includes("score +=")) {
    lines.splice(i, 1);
    i--;
  } else if (lines[i].includes("field: 'mtf'")) {
    lines.splice(i, 1);
    i--;
  }
}

fs.writeFileSync('app.js', lines.join('\n'));
