const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const target = "const myStrikes = myFellows.filter(f => f._autoStrikes && f._autoStrikes.length > 0).length;";
const replacement = "const myStrikes = myFellows.filter(f => f._autoStrikes && f._autoStrikes.length > 0).length;\n  const myLaunched = myFellows.filter(f => f.clubPageLaunched === 'Yes').length;";

app = app.replace(target, replacement);

fs.writeFileSync('app.js', app);
