const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Update Grid Card Title
app = app.replace(
  /\$\{escapeHTML\(displayName\)\} \$\{renderStrikeDots\(f\.id\)\}/g,
  `#\${f.displayId || '000'} - \${escapeHTML(displayName)} \${renderStrikeDots(f.id)}`
);

// Update Profile Modal Title
app = app.replace(
  /\$\{escapeHTML\(dName\)\} \$\{renderStrikeDots\(fellow\.id\)\}/g,
  `#\${fellow.displayId || '000'} - \${escapeHTML(dName)} \${renderStrikeDots(fellow.id)}`
);

fs.writeFileSync('app.js', app);
