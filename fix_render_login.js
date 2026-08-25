const fs = require('fs');

const loginCode = `// =============================================
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
        
        <div class="team-grid" id="loginTeamGrid">
          \${teamHTML}
        </div>
        
        <div class="password-section hidden" id="passwordSection">
          <div class="flex flex-center" style="margin-bottom: 1rem; gap: 10px;">
            <div id="selectedUserAvatar"></div>
            <h3 id="selectedUserName" style="margin: 0"></h3>
          </div>
          <div class="form-group">
            <input type="password" id="loginPassword" class="form-input" placeholder="Enter password" />
          </div>
          <div class="flex" style="gap: 10px;">
            <button class="btn btn--ghost" id="btnCancelLogin" style="flex: 1">Cancel</button>
            <button class="btn btn--primary login-btn" id="btnSubmitLogin" style="flex: 2">Login</button>
          </div>
        </div>
      </div>
    </div>
  \`;
  
  document.getElementById('app').innerHTML = html;
  
  // Bind Login Events
  let selectedUser = null;
  const grid = document.getElementById('loginTeamGrid');
  const passSec = document.getElementById('passwordSection');
  const passInput = document.getElementById('loginPassword');
  
  document.querySelectorAll('.team-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.team-btn').forEach(b => b.classList.remove('team-btn--selected'));
      btn.classList.add('team-btn--selected');
      selectedUser = btn.dataset.name;
      
      const teamMember = TEAM.find(t => t.name === selectedUser);
      document.getElementById('selectedUserAvatar').innerHTML = renderAvatar(teamMember.name, teamMember.color, 'sm');
      document.getElementById('selectedUserName').innerText = teamMember.name;
      
      grid.style.display = 'none';
      passSec.classList.remove('hidden');
      passInput.focus();
    });
  });
  
  document.getElementById('btnCancelLogin').addEventListener('click', () => {
    selectedUser = null;
    passSec.classList.add('hidden');
    grid.style.display = 'grid';
    passInput.value = '';
    document.querySelectorAll('.team-btn').forEach(b => b.classList.remove('team-btn--selected'));
  });
  
  document.getElementById('btnSubmitLogin').addEventListener('click', () => {
    if (selectedUser && passInput.value) {
      login(selectedUser, passInput.value);
    }
  });
  
  passInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && selectedUser && passInput.value) {
      login(selectedUser, passInput.value);
    }
  });
}
`;

let code = fs.readFileSync('app.js', 'utf8');

// Find the line ending with return \`<div class="avatar avatar--\${size}" style="background-color: \${color}">\${initial}</div>\`;
// and add a closing brace!
code = code.replace(/return `<div class="avatar avatar--\$\{size\}" style="background-color: \$\{color\}">\$\{initial\}<\/div>`;/g, 'return `<div class="avatar avatar--${size}" style="background-color: ${color}">${initial}</div>`;\n}');

// Now remove the current broken renderLogin and replace with our clean one.
// The broken block starts at // ============================================= \n // SECTION 8: VIEWS
// And ends at the line right before function renderDashboard() {

const startStr = '// =============================================\n// SECTION 8: VIEWS';
const endStr = 'function renderDashboard() {';

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  code = before + loginCode + after;
  fs.writeFileSync('app.js', code);
  console.log('Successfully completely rebuilt renderLogin and closed renderAvatar!');
} else {
  console.log('Could not find boundaries for renderLogin replacement');
}
