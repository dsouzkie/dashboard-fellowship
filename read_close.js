const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const profileIdx = content.indexOf('function renderFellowProfile(');
const closeBtnIdx = content.indexOf('closeModal()', profileIdx);

console.log(content.substring(closeBtnIdx - 500, closeBtnIdx + 500));
