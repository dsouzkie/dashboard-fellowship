const fs = require('fs');
let text = fs.readFileSync('app.js', 'utf8');

text = text.replace(
  "body: JSON.stringify({ action: 'updateInstagramStats' })",
  "body: JSON.stringify({ action: 'updateInstagramStats' }),\n      headers: {\n        'Content-Type': 'text/plain;charset=utf-8'\n      }"
);

fs.writeFileSync('app.js', text, 'utf8');
console.log('Fixed fetch headers for Google Apps Script');
