const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');

// Strip out comments and strings to count braces safely.
let stripped = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
stripped = stripped.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '""');
// Also strip out template literals properly (simplified)
stripped = stripped.replace(/`[\s\S]*?`/g, '``');

let openBraces = 0;
let lines = stripped.split('\n');
for(let i=0; i<lines.length; i++) {
  let line = lines[i];
  for(let j=0; j<line.length; j++) {
    if(line[j] === '{') openBraces++;
    if(line[j] === '}') openBraces--;
  }
  if (openBraces < 0) {
    console.log('Too many closing braces at line ' + (i+1));
    openBraces = 0;
  }
}
console.log('Final open braces: ' + openBraces);
