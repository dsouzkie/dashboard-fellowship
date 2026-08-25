const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  "} else if (field === 'finalAcceptance') {",
  "} else if (field === 'finalAcceptance' || field === 'clubPageLaunched') {"
);

fs.writeFileSync('app.js', app);
