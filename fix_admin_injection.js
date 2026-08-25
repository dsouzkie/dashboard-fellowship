const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const lines = code.split('\n');
if (lines[1] && lines[1].includes('AppState.currentUser.name')) {
  lines.splice(0, 19);
  code = lines.join('\n');
  console.log('Removed broken injection');
}

const targetHTML = '</div>\n      <div class="stats-grid">';
const adminHTML = `
      \${AppState.currentUser.name === 'Admin' ? \`
        <div class="card" style="margin-top: 24px; margin-bottom: 24px;">
          <div class="card-header">
            <h2 class="card-title">🛡️ Admin: Team Passwords</h2>
          </div>
          <div class="card-body">
            <table class="data-table">
              <thead><tr><th style="text-align:left;">POC Name</th><th style="text-align:left;">Password</th><th style="text-align:left;">Team</th></tr></thead>
              <tbody>
                \${TEAM.map(t => \`
                  <tr>
                    <td><strong>\${t.name}</strong></td>
                    <td style="font-family: monospace; color: #F59E0B;">\${escapeHTML(t.pwd)}</td>
                    <td><span class="badge" style="background:\${t.color}22; color:\${t.color}">\${t.team}</span></td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      \` : ''}
`;

code = code.replace(targetHTML, adminHTML + targetHTML);
fs.writeFileSync('app.js', code);
console.log('Admin UI injected successfully');
