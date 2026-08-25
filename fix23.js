const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');
code = code.replace(
  'return <span style="color: ${color}; font-weight: bold;">${score}/100</span>;', 
  'return `<span style="color: ${color}; font-weight: bold;">${score}/100</span>`;'
);
fs.writeFileSync('app.js', code);
