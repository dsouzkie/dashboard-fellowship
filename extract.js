const fs = require('fs');
const text = fs.readFileSync('C:\\Users\\chris\\.gemini\\antigravity\\brain\\a0d2c54f-7e81-4d3c-98ad-cc70dec186b3\\.system_generated\\logs\\transcript_full.jsonl', 'utf8');

const startIndex = text.indexOf('function evaluateStrikes(fellow) {');
if (startIndex !== -1) {
  const endIndex = text.indexOf('function getDriveImageUrl', startIndex);
  if (endIndex !== -1) {
    fs.writeFileSync('missing_functions.js', text.substring(startIndex - 30, endIndex));
    console.log('Saved missing functions');
  }
}
