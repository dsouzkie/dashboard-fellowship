const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');
const lines = app.split('\n');
for (let i = 1250; i < 1300; i++) {
  if (lines[i]) {
    lines[i] = lines[i].replace(/\\\`/g, '`');
  }
}
fs.writeFileSync('app.js', lines.join('\n'), 'utf8');
console.log('Fixed backticks!');
