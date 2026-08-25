const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /\\$\\{!isAdmin \\? \\`/g,
  "\\${(!isAdmin || myTotal > 0) ? \\`"
);

fs.writeFileSync('app.js', app);
