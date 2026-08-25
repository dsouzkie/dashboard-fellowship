const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');
app = app.replace(/fellow\. \|\|/g, "fellow.instagram ||"); 
// wait, dInsta uses instagram. Let's just fix it properly.
app = app.replace(/const dInsta = fellow\.instagram \|\| \(alumni && alumni\.nominatedFellowInstagram\) \|\| '';/g, "const dInsta = fellow.instagram || '';");
app = app.replace(/const dInsta = fellow\. \|\| \(alumni && alumni\.nominatedFellowInstagram\) \|\| '';/g, "const dInsta = fellow.instagram || '';");
app = app.replace(/fellow\. \?/g, "fellow ?");
app = app.replace(/fellow\. \|\|/g, "fellow.fellowName ||");
fs.writeFileSync('app.js', app);
