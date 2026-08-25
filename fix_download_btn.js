const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const target = `<div class="nav-item \${v === 'all-fellows' ? 'nav-item--active' : ''}" data-view="all-fellows">
          <span class="nav-icon">👥</span><span class="nav-label">All Fellows</span>
        </div>`;
const replacement = `<div class="nav-item \${v === 'all-fellows' ? 'nav-item--active' : ''}" data-view="all-fellows">
          <span class="nav-icon">👥</span><span class="nav-label">All Fellows</span>
        </div>
        <div class="nav-item" id="downloadDbBtn" style="color:#10B981; margin-top:20px; cursor:pointer;">
          <span class="nav-icon">⬇️</span><span class="nav-label">Download DB</span>
        </div>`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  console.log('Injected download button!');
} else {
  console.log('Could not find target');
}

fs.writeFileSync('app.js', code);
