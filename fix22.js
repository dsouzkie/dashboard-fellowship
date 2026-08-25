const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const newLogin = `function login(username, pwd) {
  const user = TEAM.find(t => t.name === username);
  if (!user) return;
  
  if (pwd === user.password) {
    AppState.currentUser = user;
    AppState.currentView = 'dashboard';
    showToast(\`Welcome back, \${user.name}!\`, 'success');
    render();
  } else {
    showToast('Incorrect password', 'error');
  }
}`;

const loginStart = code.indexOf('function login() {');
if (loginStart > -1) {
  const loginEnd = code.indexOf('}', loginStart);
  code = code.substring(0, loginStart) + newLogin + code.substring(loginEnd + 1);
  fs.writeFileSync('app.js', code);
  console.log('Login function updated');
} else {
  console.log('Could not find function login()');
}
