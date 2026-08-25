const fs = require('fs');
const lines = fs.readFileSync('app.js', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('onerror="this.outerHTML'));
console.log(lines[idx]);
