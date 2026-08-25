const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Pages Launched') && lines[i].includes('clubPageLaunched')) {
    lines.splice(i, 1);
    i--;
  } else if (lines[i].includes('AppState.filterLaunched')) {
    lines.splice(i, 1);
    i--;
  } else if (lines[i].includes('strikeRules.rule2') && lines[i].includes('clubPageLaunched')) {
    // Delete this line and the next 2 lines
    lines.splice(i, 3);
    i--;
  }
}

fs.writeFileSync('app.js', lines.join('\n'));
