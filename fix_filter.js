const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const oldFilter = `    const name = fa || fn;
    return name !== '' && name !== 'no fellow' && name !== '?';`;

const newFilter = `    // Don't filter out legitimate fellows just because their name is currently blank!
    return fn !== 'no fellow' && fn !== '?';`;

app = app.replace(oldFilter, newFilter);

fs.writeFileSync('app.js', app);
console.log('Fixed missing fellows bug');
