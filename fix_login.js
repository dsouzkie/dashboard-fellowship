const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split('\n');

const loginStart = `// =============================================
// SECTION 8: VIEWS (Login, Dashboard, Fellows, Strikes, Forms, Instagram)
// =============================================

function renderLogin() {
  const teamHTML = TEAM.map(t => \`
    <div class="team-btn" data-name="\${t.name}">
      \${renderAvatar(t.name, t.color, 'lg')}
      <div>\${t.name}</div>
    </div>
  \`).join('');
  
  const html = \`
    <div class="login-container">
      <div class="login-card fade-in">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="team%20photos/logo.png" alt="Under25" style="max-width: 180px;" />
        </div>
        <h2 style="text-align:center; margin-bottom:20px; color:#F1F5F9; font-size: 1.3rem;">Fellowship Tracking Dashboard</h2>
        <div class="login-subtitle" style="text-align:center; margin-bottom: 1.5rem; color:#94A3B8;">Select your profile to continue</div>
`;

// At line 1038 we have `        </div>`
let avatarEndIdx = lines.findIndex(l => l.includes('function renderAvatar')) + 8;
// Find where it currently has `        </div>`
let badLineIdx = lines.findIndex((l, i) => i > avatarEndIdx && l.includes('        </div>'));

lines.splice(badLineIdx, 0, ...loginStart.split('\n'));
fs.writeFileSync('app.js', lines.join('\n'));
console.log('Fixed renderLogin start');
