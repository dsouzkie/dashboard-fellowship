const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(/\${escapeHTML\(acceptance\.dob \|\| '-'\)}/, `\${escapeHTML(fellow.dob || (acceptance ? acceptance.dob : '-'))}`);
app = app.replace(/\${escapeHTML\(acceptance\.tshirt \|\| '-'\)}/, `\${escapeHTML(fellow.tshirt || (acceptance ? acceptance.tshirt : '-'))}`);
app = app.replace(/\${escapeHTML\(acceptance\.address \|\| '-'\)}/, `\${escapeHTML(fellow.address || (acceptance ? acceptance.address : '-'))}`);

fs.writeFileSync('app.js', app);
console.log('Patched fellow profile');
