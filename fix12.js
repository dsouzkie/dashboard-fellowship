const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const regex = /if \(n\.type && !n\.type\.toLowerCase\(\)\.trim\(\)\.includes\('nominating'\)\) return false;/;
code = code.replace(regex, '// if (n.type && !n.type.toLowerCase().trim().includes(\'nominating\')) return false; // Relaxed requirement');

fs.writeFileSync('app.js', code);
