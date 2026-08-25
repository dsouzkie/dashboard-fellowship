const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const regex = /(?:FAF|NOMINATION|ACCEPTANCE).*_URL/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`Found ${match[0]} at index ${match.index}`);
}
