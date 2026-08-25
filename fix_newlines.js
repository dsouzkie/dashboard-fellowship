const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');
app = app.replace(/char === ''/g, "char === '\\n'");
app = app.replace(/nextChar === ''/g, "nextChar === '\\n'");
fs.writeFileSync('app.js', app);
