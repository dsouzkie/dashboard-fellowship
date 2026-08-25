const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const regex = /function getFilteredFellows\(overridePoc = null\) \{\r?\n  let filtered = \[\.\.\.AppState\.fellows\];/g;
const replacement = `function getFilteredFellows(overridePoc = null) {
  let filtered = [...AppState.fellows].filter(f => {
    const fn = (f.fellowName || '').trim().toLowerCase();
    const fa = (findAcceptanceForFellow(f)?.fullName || '').trim().toLowerCase();
    const name = fa || fn;
    return name !== '' && name !== 'no fellow' && name !== '?';
  });`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  console.log('Patched getFilteredFellows');
} else {
  console.log('Failed to find getFilteredFellows');
}

fs.writeFileSync('app.js', code);
