const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// I will literally just restore app.js by using regex to fix these specific breakages
app = app.replace(/headers \+ \\n \+ rows\.join\(\\n\)/g, "headers + '\\n' + rows.join('\\n')");

fs.writeFileSync('app.js', app);
