const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetStr = `<header class="page-header" style="margin-bottom:20px;">
        <div>
          <h1 class="page-title">📊 All Fellows Overview</h1>`;

const adminHTML = `
      \${AppState.currentUser && AppState.currentUser.isAdmin ? \`
        <div class="card" style="margin-top: 12px; margin-bottom: 24px; border: 1px solid #F59E0B;">
          <div class="card-header" style="background: rgba(245, 158, 11, 0.1);">
            <h2 class="card-title" style="color: #F59E0B;">🛡️ Admin: Team Passwords</h2>
          </div>
          <div class="card-body">
            <table class="data-table">
              <thead><tr><th style="text-align:left;">POC Name</th><th style="text-align:left;">Password</th><th style="text-align:left;">Team</th></tr></thead>
              <tbody>
                \${TEAM.map(t => \`
                  <tr>
                    <td><strong>\${t.name}</strong></td>
                    <td style="font-family: monospace; color: #F59E0B;">\${escapeHTML(t.password)}</td>
                    <td><span class="badge" style="background:\${t.color}22; color:\${t.color}">\${t.team}</span></td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      \` : ''}
`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, adminHTML + targetStr);
  console.log('Injected Admin Table Successfully!');
} else {
  console.log('Target string not found');
}

// 2. Fix POC profile not showing on dashboard that they're logged in with PFP
// Let's look for user profile section in sidebar
const targetSidebarUser = `<div class="sidebar-footer">
        <div style="font-size: 13px; color: #94A3B8;">Logged in as</div>
        <div style="font-size: 15px; font-weight: 600; color: #F1F5F9;">\${AppState.currentUser.name}</div>`;
        
const replaceSidebarUser = `<div class="sidebar-footer">
        <div style="font-size: 13px; color: #94A3B8; margin-bottom:6px;">Logged in as</div>
        <div style="display:flex; align-items:center; gap:10px;">
          \${renderAvatar(AppState.currentUser.name, AppState.currentUser.color, 'sm', AppState.currentUser.team)}
          <div style="font-size: 15px; font-weight: 600; color: #F1F5F9;">\${AppState.currentUser.name}</div>
        </div>`;

if (code.includes(targetSidebarUser)) {
  code = code.replace(targetSidebarUser, replaceSidebarUser);
  console.log('Injected User PFP');
} else {
  console.log('Target sidebar user not found');
}

fs.writeFileSync('app.js', code);
