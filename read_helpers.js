const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const funcs = ['findAlumniForFellow', 'findAcceptanceForFellow', 'getDriveImageUrl'];
funcs.forEach(f => {
  const idx = content.indexOf(`function ${f}`);
  if (idx !== -1) {
    console.log(content.substring(idx, content.indexOf('function', idx + 10)));
  } else {
    console.log(`${f} not found`);
  }
});
