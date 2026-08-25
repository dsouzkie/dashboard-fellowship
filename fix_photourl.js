const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /let photoUrl = null;\s*if fellow\. \{\s*\}/g,
  "let photoUrl = fellow.photoUrl || null;"
);
app = app.replace(
  /let photoUrl = null;\s*if fellow\. \{\s*\n\s*\n\s*\}/g,
  "let photoUrl = fellow.photoUrl || null;"
);
app = app.replace(/if fellow\. \{\s*\}/g, "");
app = app.replace(/if fellow\. \{\s*\n\s*\n\s*\}/g, "");
app = app.replace(/let photoUrl = null;\s*\n\s*/g, "let photoUrl = fellow.photoUrl || null;\n");


fs.writeFileSync('app.js', app);
