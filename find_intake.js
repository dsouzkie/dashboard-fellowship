const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');

// Find the exact card pattern around line 1430
const idx = code.indexOf('renderFellowProfile');
// Search for h3 pattern with intake-badge inside it
const searchFor = 'intake-badge';
let pos = 0;
let count = 0;
while ((pos = code.indexOf(searchFor, pos)) !== -1) {
  // Show context around this match
  const before = code.lastIndexOf('<h3', pos);
  const after = code.indexOf('</div>', pos);
  console.log(`Match ${count++} at ${pos}:`);
  console.log(code.substring(Math.max(0, pos-80), pos+120));
  console.log('---');
  pos++;
  if (count > 10) break;
}
