const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /\\$\\{escapeHTML\\(phase\.name\\)\\}/g,
  "${escapeHTML(phase.name)}"
);

fs.writeFileSync('app.js', app);
