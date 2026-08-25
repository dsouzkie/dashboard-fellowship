const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

code = code.replace(
  '  const result = [];\n  for (let i = 1; i < rows.length; i++) {\n    const row = rows[i];',
  '  const result = [];\n  for (let i = 1; i < rows.length; i++) {\n    const row = rows[i];\n    if (!row[0] || row[0].trim() === \'\' || row[0].trim().toLowerCase() === \'no fellow\') continue;'
);

// Also filter out any "No Fellow" or blank names
code = code.replace(
  '    if (!row[2]) continue;', 
  '    if (!row[2] || row[2].trim() === \'\' || row[2].trim().toLowerCase() === \'no fellow\') continue;'
);

fs.writeFileSync('app.js', code);
console.log('Fixed empty rows in CSV parser');
