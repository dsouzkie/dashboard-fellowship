const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// The string `\${` needs to be replaced with `${`
app = app.replace(/\\\$\\{/g, '${');

fs.writeFileSync('app.js', app, 'utf8');
console.log('Fixed escaped dollar signs!');
