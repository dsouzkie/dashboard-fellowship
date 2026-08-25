const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const profileIdx = content.indexOf('function renderFellowProfile(');
const profileEndIdx = content.indexOf('function', profileIdx + 10);
const profileContent = content.substring(profileIdx, profileEndIdx);

console.log('--- profile modal html end ---');
console.log(profileContent.substring(profileContent.lastIndexOf('</div>')));
