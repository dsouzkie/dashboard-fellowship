const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /function renderFellowProfile\(fellowId\) \{\s*try \{\s*const fellow = AppState\.fellows\.find\(x => x\.id === fellowId\);\s*if \(!fellow\) return;/m,
  `function renderFellowProfile(fellowId) {
    try {
      const fellow = AppState.fellows.find(x => x.id === fellowId);
      if (!fellow) return;
      const alumni = typeof findAlumniForFellow === 'function' ? findAlumniForFellow(fellow) : null;`
);

fs.writeFileSync('app.js', app);
