const fs = require('fs');
let text = fs.readFileSync('app.js', 'utf8');

const initRegex = /setTimeout\(fetchLiveFellows, 100\);/;
const initNew = `setTimeout(() => {
    fetchLiveFellows();
    loadNominations();
    loadAcceptances();
  }, 100);`;

text = text.replace(initRegex, initNew);
fs.writeFileSync('app.js', text, 'utf8');
console.log('Fixed init() to automatically pull all live data');
