const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split('\n');

for (let i = 0; i < lines.length - 1; i++) {
  if (lines[i].endsWith("includes('") && lines[i+1].startsWith("')")) {
    lines[i] = lines[i].slice(0, -1) + "\\n" + lines[i+1].slice(1);
    lines.splice(i + 1, 1);
    i--;
  }
}

let app = lines.join('\n');
fs.writeFileSync('app.js', app);
