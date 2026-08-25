const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const idx = content.indexOf('closeProfileModal');
console.log(content.substring(idx - 200, idx + 200));
