const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split('\n');

for (let i = 0; i < lines.length - 1; i++) {
  if (lines[i].includes("filtered = filtered.filter(f => f.clubPageActivity === AppState.filterActivity);") && lines[i+1].trim() === "}") {
    if (lines[i+2].trim() === "}") {
      lines.splice(i+2, 1);
    }
  }
}

fs.writeFileSync('app.js', lines.join('\n'));
