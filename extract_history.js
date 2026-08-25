const fs = require('fs');

const transcriptPath = 'C:/Users/chris/.gemini/antigravity/brain/5ee5d364-bae6-4976-adc5-38d5a6d4640a/.system_generated/logs/transcript.jsonl';
const outputPath = 'C:/Users/chris/.gemini/antigravity/brain/5ee5d364-bae6-4976-adc5-38d5a6d4640a/raw_instructions_history.md';

const data = fs.readFileSync(transcriptPath, 'utf8');
const lines = data.split('\n').filter(line => line.trim() !== '');

let output = '# User Instructions History\n\n';
let count = 1;

for (const line of lines) {
    try {
        const step = JSON.parse(line);
        if (step.type === 'USER_INPUT' && step.source === 'USER_EXPLICIT' && step.content) {
            output += `Instruction ${count}\n`;
            output += `${step.content.trim()}\n\n`;
            count++;
        }
    } catch (e) {
        console.error('Error parsing line', e);
    }
}

fs.writeFileSync(outputPath, output, 'utf8');
console.log('Successfully generated raw_instructions_history.md');
