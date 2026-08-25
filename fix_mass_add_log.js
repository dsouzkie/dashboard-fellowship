const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Add logChange to saveMassAdd
app = app.replace(
  /AppState\.fellows\.push\(fellow\);/,
  `AppState.fellows.push(fellow);\n      logChange(newId, 'Creation', '', 'Added via Mass Add');`
);

fs.writeFileSync('app.js', app);
