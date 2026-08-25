const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetSidebarEnd = '      </nav>\n    </aside>';

const replaceSidebarEnd = `      </nav>
      
      <div style="margin-top: auto; border-top: 1px solid rgba(148, 163, 184, 0.1); padding: 20px 16px;">
        <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 12px;">Logged in as</div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          \${renderAvatar(AppState.currentUser.name, AppState.currentUser.color, 'sm', AppState.currentUser.team)}
          <div>
            <div style="font-weight: 600; color: #F1F5F9; font-size: 14px;">\${escapeHTML(AppState.currentUser.name)}</div>
            <div style="font-size: 12px; color: \${AppState.currentUser.color};">\${escapeHTML(AppState.currentUser.team)}</div>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div class="nav-item" id="downloadDbBtn" style="color: #10B981; padding: 8px 10px; cursor: pointer;">
            <span class="nav-icon" style="font-size: 14px;">⬇️</span><span class="nav-label" style="font-size: 13px;">Download DB</span>
          </div>
          <div class="nav-item" id="changePwdBtn" style="color: #F59E0B; padding: 8px 10px; cursor: pointer;">
            <span class="nav-icon" style="font-size: 14px;">🔑</span><span class="nav-label" style="font-size: 13px;">Change Password</span>
          </div>
          <div class="nav-item" id="btnLogout" style="color: #EF4444; padding: 8px 10px; cursor: pointer;">
            <span class="nav-icon" style="font-size: 14px;">🚪</span><span class="nav-label" style="font-size: 13px;">Logout</span>
          </div>
        </div>
      </div>
    </aside>`;

if (code.includes(targetSidebarEnd)) {
  code = code.replace(targetSidebarEnd, replaceSidebarEnd);
  
  // Remove the old injected buttons in the middle of the nav
  const oldButtonsRegex = /<div class="nav-item" id="downloadDbBtn"[\s\S]*?Logout<\/span>\s*<\/div>/;
  code = code.replace(oldButtonsRegex, '');
  
  console.log('Sidebar user profile injected!');
} else {
  console.log('Target sidebar end not found');
}

const dashboardOverviewHeader = `      <header class="page-header" style="margin-bottom:20px;">
        <div>
          <h1 class="page-title">📊 All Fellows Overview</h1>`;

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

if (code.includes(dashboardOverviewHeader)) {
  code = code.replace(dashboardOverviewHeader, adminHTML + dashboardOverviewHeader);
  console.log('Admin Table injected!');
} else {
  console.log('Target admin table string not found');
}

fs.writeFileSync('app.js', code);
