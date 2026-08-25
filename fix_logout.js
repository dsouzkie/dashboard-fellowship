const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetMenu = `<div class="nav-item" id="downloadDbBtn" style="color:#10B981; margin-top:20px; cursor:pointer;">
          <span class="nav-icon">⬇️</span><span class="nav-label">Download DB</span>
        </div>`;
const replacementMenu = `<div class="nav-item" id="downloadDbBtn" style="color:#10B981; margin-top:20px; cursor:pointer;">
          <span class="nav-icon">⬇️</span><span class="nav-label">Download DB</span>
        </div>
        <div class="nav-item" id="changePwdBtn" style="color:#F59E0B; cursor:pointer;">
          <span class="nav-icon">🔑</span><span class="nav-label">Change Password</span>
        </div>
        <div class="nav-item" id="btnLogout" style="color:#EF4444; cursor:pointer;">
          <span class="nav-icon">🚪</span><span class="nav-label">Logout</span>
        </div>`;

if (code.includes(targetMenu)) {
  code = code.replace(targetMenu, replacementMenu);
  console.log('Injected Logout and Change Password buttons');
} else {
  console.log('Could not find sidebar target');
}

// Add event listener for change password
const bindEventsIdx = code.indexOf('if (btnLogout) btnLogout.addEventListener(\'click\', logout);');
const pwdLogic = `
  const changePwdBtn = document.getElementById('changePwdBtn');
  if (changePwdBtn) {
    changePwdBtn.addEventListener('click', () => {
      const currentPwd = prompt('Enter your CURRENT password to verify:');
      if (!currentPwd) return;
      
      const me = TEAM.find(t => t.name === AppState.currentUser.name);
      if (currentPwd !== me.pwd) {
        showToast('Incorrect current password!', 'error');
        return;
      }
      
      const newPwd = prompt('Enter your NEW password:');
      if (!newPwd || newPwd.trim() === '') return;
      
      const newPwdConfirm = prompt('Confirm your NEW password:');
      if (newPwd !== newPwdConfirm) {
        showToast('Passwords do not match!', 'error');
        return;
      }
      
      // Update locally for session
      me.pwd = newPwd;
      showToast('Password changed locally (Note: Hardcoded passwords in app.js will reset on refresh until moved to DB)', 'success');
      
      // We will implement DB sync in next step
    });
  }
`;

code = code.substring(0, bindEventsIdx + 63) + '\n' + pwdLogic + code.substring(bindEventsIdx + 63);

fs.writeFileSync('app.js', code);
