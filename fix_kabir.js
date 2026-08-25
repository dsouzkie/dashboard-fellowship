const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace('${!isAdmin ? `', '${true ? `');

fs.writeFileSync('app.js', app);
