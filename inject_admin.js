const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const adminHTML = `
      \${AppState.currentUser && AppState.currentUser.isAdmin ? \`
        <div class="card" style="margin-top: 12px; margin-bottom: 24px; border: 1px solid rgba(245, 158, 11, 0.3);">
          <div class="card-header" style="background: rgba(245, 158, 11, 0.1);">
            <h2 class="card-title" style="color: #F59E0B; display: flex; align-items: center; gap: 8px;">🛡️ Admin: Team Passwords</h2>
          </div>
          <div class="card-body">
            <table class="data-table">
              <thead><tr><th style="text-align:left;">POC Name</th><th style="text-align:left;">Password</th><th style="text-align:left;">Team</th></tr></thead>
              <tbody>
                \${TEAM.map(t => \`
                  <tr>
                    <td><strong>\${escapeHTML(t.name)}</strong></td>
                    <td style="font-family: monospace; color: #F59E0B; font-size: 14px;">\${escapeHTML(t.password)}</td>
                    <td><span class="badge" style="background:\${t.color}22; color:\${t.color}">\${escapeHTML(t.team)}</span></td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      \` : ''}
`;

const lines = code.split('\n');
const idx = lines.findIndex(l => l.includes('<header class="page-header" style="margin-bottom:20px;">'));

if (idx > -1) {
  lines.splice(idx, 0, adminHTML);
  fs.writeFileSync('app.js', lines.join('\n'));
  console.log('Injected Admin HTML');
} else {
  console.log('Not found');
}
