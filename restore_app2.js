const fs = require('fs');
let code = fs.readFileSync('test_login.js', 'utf8');

const mockEnd = code.indexOf('global.fetch = async () => ({ ok: true, text: async () => \'\' });\n');
if (mockEnd > -1) {
  code = code.substring(mockEnd + 67);
}

const mockBottom = code.lastIndexOf('setTimeout(() => {\n  global.AppState.selectedTeamUser');
if (mockBottom > -1) {
  code = code.substring(0, mockBottom);
}

code = code.replace(/global\\.AppState =/g, 'const AppState =');
code = code.replace(/global\\.TEAM =/g, 'const TEAM =');
if (!code.startsWith('w')) {
  code = 'w' + code;
}

fs.writeFileSync('app.js', code.trim());
console.log('Restored app.js completely! Length: ' + code.length);
