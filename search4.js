const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const str = content.substring(16155 - 500, 16155 + 500);
console.log(str);
