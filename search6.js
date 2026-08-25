const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const regex = /(url|URL)/g;
let found = false;
let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('docs.google.com/spreadsheets')) {
    console.log(`Line ${i}: ${lines[i]}`);
    found = true;
  }
}
if (!found) console.log("No other sheet URLs found.");
