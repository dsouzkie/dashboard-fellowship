const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:/Users/chris/.gemini/antigravity/brain/a0d2c54f-7e81-4d3c-98ad-cc70dec186b3/.system_generated/logs/transcript_full.jsonl';
const outPath = 'C:/Users/chris/.gemini/antigravity/brain/a0d2c54f-7e81-4d3c-98ad-cc70dec186b3/user_instructions.md';

async function processFile() {
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let markdown = '# User Instructions History\n\n';
  let counter = 1;

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'USER_INPUT') {
        markdown += `## Instruction ${counter}\n\n`;
        markdown += `${entry.content}\n\n---\n\n`;
        counter++;
      }
    } catch(e) {}
  }

  fs.writeFileSync(outPath, markdown);
  console.log('Saved to', outPath);
}

processFile();
