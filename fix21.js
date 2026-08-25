const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const missingUIFunctions = `
function selectUser(name) {
  AppState.selectedTeamUser = TEAM.find(t => t.name === name);
  document.getElementById('passwordSection').classList.remove('hidden');
  document.getElementById('selectedUserName').innerText = name;
  const t = AppState.selectedTeamUser;
  document.getElementById('selectedUserAvatar').innerHTML = renderAvatar(t.name, t.color, 'sm', t.team);
  
  document.querySelectorAll('.team-btn').forEach(btn => btn.classList.remove('team-btn--selected'));
  const btn = document.querySelector(\`.team-btn[data-name="\${name}"]\`);
  if (btn) btn.classList.add('team-btn--selected');
}

function login() {
  const pwd = document.getElementById('loginPassword').value;
  if (!AppState.selectedTeamUser) return;
  
  if (pwd === AppState.selectedTeamUser.password) {
    AppState.currentUser = AppState.selectedTeamUser;
    AppState.currentView = 'dashboard';
    showToast(\`Welcome back, \${AppState.currentUser.name}!\`, 'success');
    render();
  } else {
    showToast('Incorrect password', 'error');
  }
}

function calculateHealthScore(fellow) {
  let score = 0;
  if (fellow.finalAcceptance === 'Yes') score += 15;
  if (fellow.clubPageLaunched === 'Yes') score += 15;
  if (fellow.clubPageActivity === 'Active') score += 15;
  
  const strikes = (fellow._autoStrikes || []);
  score -= (strikes.length * 10);
  
  return Math.max(0, Math.min(100, 50 + score));
}

function renderHealthScore(score) {
  let color = '#10B981';
  if (score < 50) color = '#EF4444';
  else if (score < 80) color = '#F59E0B';
  return \`<span style="color: \${color}; font-weight: bold;">\${score}/100</span>\`;
}
`;

if (!code.includes('function login()')) {
  code = code + '\n' + missingUIFunctions;
  fs.writeFileSync('app.js', code);
}
