const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const startIndex = content.indexOf('function renderFellowProfile(') + 6000;
const endIndex = startIndex + 8000;
console.log(content.substring(startIndex, endIndex));
