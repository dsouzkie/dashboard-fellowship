const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(/\(fellow\.manualHocName \|\| fellow\.\) \?/g, "(fellow.manualHocName || fellow.hocName) ?");
app = app.replace(/\(fellow\.manualHooName \|\| fellow\.\) \?/g, "(fellow.manualHooName || fellow.hooName) ?");
app = app.replace(/\(fellow\.manualFaName \|\| fellow\.\) \?/g, "(fellow.manualFaName || fellow.faName) ?");
app = app.replace(/fellow\. \?/g, "fellow.photoUrl ?");

fs.writeFileSync('app.js', app);
