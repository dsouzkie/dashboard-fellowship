const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /if \(user && \(!user\.isAdmin \|\| myTotal > 0\)\) \{/,
  `if (user) {
    const myFellowsCheck = fellows.filter(f => f.pocAssigned === user.name);
    if (!user.isAdmin || myFellowsCheck.length > 0) {`
);

app = app.replace(
  /renderLegend\('myStatusLegend', myStatusData\);\s*\}/,
  `renderLegend('myStatusLegend', myStatusData);\n    }\n}`
);

fs.writeFileSync('app.js', app);
