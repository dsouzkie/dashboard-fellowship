const fs = require('fs');
let code = fs.readFileSync('test_login.js', 'utf8');

// Remove mock top
const mockEnd = code.indexOf('global.fetch = async () => ({ ok: true, text: async () => \'\' });\n');
if (mockEnd > -1) {
  code = code.substring(mockEnd + 67);
}

// Remove mock bottom
const mockBottom = code.lastIndexOf('setTimeout(() => {');
if (mockBottom > -1) {
  code = code.substring(0, mockBottom);
}

// Restore globals
code = code.replace(/global\.AppState =/g, 'const AppState =');
code = code.replace(/global\.TEAM =/g, 'const TEAM =');

fs.writeFileSync('app.js', code.trim());
console.log('Restored app.js');
