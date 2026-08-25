const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /\\$\\{(\\(|)!isAdmin \|\| myTotal > 0(\\)|) \? \\`/g,
  "${true ? `"
);

fs.writeFileSync('app.js', app);
