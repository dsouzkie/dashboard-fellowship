const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// Replace specific problematic string
code = code.replace(
  `onerror="this.outerHTML='<div class=\\'profile-photo-placeholder\${teamClass}\\' style=\\'background-color:\${poc.color}\\'>\${dName.charAt(0).toUpperCase()}</div>'"`,
  `onerror="this.outerHTML='<div class=&quot;profile-photo-placeholder\${teamClass}&quot; style=&quot;background-color:\${poc.color}&quot;>\${dName.charAt(0).toUpperCase()}</div>'"`
);

fs.writeFileSync('app.js', code);
console.log('Fixed syntax error in onerror');
