const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');
const cardStart = code.indexOf('class="card" style="cursor: pointer;');
console.log('card at:', cardStart);
if (cardStart > -1) console.log(code.substring(cardStart, cardStart + 800));
