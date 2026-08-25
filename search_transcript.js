const fs = require('fs');
const lines = fs.readFileSync('C:\\Users\\chris\\.gemini\\antigravity\\brain\\a0d2c54f-7e81-4d3c-98ad-cc70dec186b3\\.system_generated\\logs\\transcript_full.jsonl', 'utf8').split('\n');

let latestCode = '';

for (let line of lines) {
  if (line.includes('function renderLogin(')) {
    try {
      const obj = JSON.parse(line);
      if (obj.content && obj.content.includes('function renderLogin(')) {
        const text = obj.content;
        let p1 = text.indexOf('<file path=');
        while (p1 > -1) {
          let p2 = text.indexOf('</file>', p1);
          if (p2 > -1) {
            let block = text.substring(p1, p2);
            if (block.includes('function renderLogin(')) {
              // extract the content after <file path="...">
              const blockStart = block.indexOf('>') + 1;
              latestCode = block.substring(blockStart).trim();
            }
          }
          p1 = text.indexOf('<file path=', p1 + 1);
        }
      }
    } catch(e) {}
  }
}

if (latestCode) {
  fs.writeFileSync('app_backup.js', latestCode);
  console.log('Saved app_backup.js, length:', latestCode.length);
} else {
  console.log('Could not extract');
}
