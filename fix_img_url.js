const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /return \`https:\/\/drive\.google\.com\/thumbnail\?id=\$\{match\[1\]\}&sz=w800\`;/g,
  `return \`https://drive.google.com/uc?export=view&id=\${match[1]}\`;`
);

fs.writeFileSync('app.js', app);
