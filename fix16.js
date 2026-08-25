const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const missingSidebar = `
function renderSidebar() {
  const v = AppState.currentView;
  
  return \`
    <aside class="sidebar">
      <div class="sidebar-header" style="text-align: center;">
        <img src="team%20photos/logo.png" alt="Under25" style="max-width: 130px; margin-bottom: 10px;" />
        <div style="font-weight: bold; font-size: 0.95rem; color: #fff; line-height: 1.2;">Fellowship Tracking<br>Dashboard</div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-item \${v === 'dashboard' ? 'nav-item--active' : ''}" data-view="dashboard">
          <span class="nav-icon">📊</span><span class="nav-label">Overview</span>
        </div>
        <div class="nav-item \${v === 'my-fellows' ? 'nav-item--active' : ''}" data-view="my-fellows">
          <span class="nav-icon">👤</span><span class="nav-label">My Fellows</span>
        </div>
        <div class="nav-item \${v === 'all-fellows' ? 'nav-item--active' : ''}" data-view="all-fellows">
          <span class="nav-icon">👥</span><span class="nav-label">All Fellows</span>
        </div>
        <div class="nav-item \${v === 'alerts' ? 'nav-item--active' : ''}" data-view="alerts">
          <span class="nav-icon">🔔</span><span class="nav-label">Alerts & Transfers</span>
        </div>
        <div class="nav-item \${v === 'strikes' ? 'nav-item--active' : ''}" data-view="strikes">
          <span class="nav-icon">⚡</span><span class="nav-label">Strikes</span>
        </div>
        <div class="nav-item \${v === 'forms' ? 'nav-item--active' : ''}" data-view="forms">
          <span class="nav-icon">📋</span><span class="nav-label">Form Tracker</span>
        </div>
        <div class="nav-item \${v === 'instagram' ? 'nav-item--active' : ''}" data-view="instagram">
          <span class="nav-icon">📸</span><span class="nav-label">Instagram</span>
        </div>
        <div class="nav-item \${v === 'requests' ? 'nav-item--active' : ''}" data-view="requests">
          <span class="nav-icon">📝</span><span class="nav-label">Fellow Requests</span>
        </div>
      </nav>
    </aside>
  \`;
}
`;

if (!code.includes('function renderSidebar() {')) {
  code = code + '\n' + missingSidebar;
  fs.writeFileSync('app.js', code);
}
