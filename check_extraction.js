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

code = code.replace(/global\.AppState =/g, 'const AppState =');
code = code.replace(/global\.TEAM =/g, 'const TEAM =');
if (!code.startsWith('w')) {
  code = 'w' + code;
}

console.log('Restored length:', code.length);

const s = code.indexOf('function findAcceptanceForFellow(fellow) {');
const e = code.indexOf('function getDriveImageUrl(driveLink)');
console.log('s:', s, 'e:', e);
if (s > -1 && e > -1) {
  const finalCode = code.substring(0, s) + '...updatedFindAcceptance...' + '\n\n' + code.substring(e);
  console.log('After patching length:', finalCode.length);
}
