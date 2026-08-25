const fs = require('fs');
const acorn = require('acorn');
const code = fs.readFileSync('app.js', 'utf8');

try {
  acorn.parse(code, { ecmaVersion: 2022 });
  console.log('No syntax errors according to acorn');
} catch (e) {
  console.log('Syntax error at line ' + e.loc.line + ' column ' + e.loc.column);
  const lines = code.split('\n');
  for(let i=Math.max(0, e.loc.line-10); i<Math.min(lines.length, e.loc.line+10); i++) {
    console.log((i+1) + ': ' + lines[i]);
  }
}
