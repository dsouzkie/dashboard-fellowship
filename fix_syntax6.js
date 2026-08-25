const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');
const lines = app.split('\n');
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('copyToClipboardText')) {
    lines[i] = \`              <button class="btn btn--sm btn--ghost" onclick="window.copyToClipboardText('\\$\\{escapeHTML(emailText.replace(/\\\\\\\\/g, '\\\\\\\\\\\\\\\\').replace(/\\\\'/g, "\\\\\\\\'").replace(/\\\\n/g, '\\\\\\\\n'))\\}')">Copy Email</button>\`;
  }
}
fs.writeFileSync('app.js', lines.join('\n'));
