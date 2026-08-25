const fs = require('fs');
let text = fs.readFileSync('app.js', 'utf8');

const initRegex = /const saved = loadFellows\(\);\s*if \(saved && saved\.length > 0\) \{\s*AppState\.fellows = saved;\s*\}/;
const initNew = `const saved = loadFellows();
  if (saved && saved.length > 0) {
    AppState.fellows = saved;
  }
  // Automatically pull live data in the background on startup
  setTimeout(fetchLiveFellows, 100);`;

text = text.replace(initRegex, initNew);
fs.writeFileSync('app.js', text, 'utf8');
console.log('Fixed init() to automatically pull live data');
