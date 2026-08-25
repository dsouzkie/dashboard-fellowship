const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');
app = app.replace(/const dPhone = fellow\. \|\| fellow\.whatsappNo \|\| '';/g, "const dPhone = fellow.whatsappNo || '';");
fs.writeFileSync('app.js', app);
