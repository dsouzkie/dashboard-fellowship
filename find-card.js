const fs = require('fs');
const lines = fs.readFileSync('app.js', 'utf8').split('\n');
lines.forEach((l, i) => { if (l.includes('<div class="fellow-card"')) console.log((i+1) + ': ' + l); });
