const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const regex = /const (.*?_URL) =/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`Found ${match[1]} around index ${match.index}`);
}

const findFuncs = /function parse.*?\(/g;
while ((match = findFuncs.exec(content)) !== null) {
  console.log(`Found func ${match[0]} around index ${match.index}`);
}
