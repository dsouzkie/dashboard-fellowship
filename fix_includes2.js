const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace('val.includes(\\n)', "val.includes('\\n')");

fs.writeFileSync('app.js', app);
