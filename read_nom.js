const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const parseNomIdx = content.indexOf('function parseNominationCSV');
const parseNomContent = content.substring(parseNomIdx, content.indexOf('function', parseNomIdx + 10));

console.log(parseNomContent);
