const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const profileIdx = content.indexOf('function renderFellowProfile(');
const photoIdx = content.indexOf('photoHtml =', profileIdx);
console.log(content.substring(photoIdx - 500, photoIdx + 500));
