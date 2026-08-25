const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const lines = app.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Current Phase:')) {
    lines[i] = '      <div class="card-header"><h2 class="card-title" style="color:#3B82F6;">Current Phase: ${escapeHTML(phase.name)}</h2></div>';
  }
}

fs.writeFileSync('app.js', lines.join('\n'));
