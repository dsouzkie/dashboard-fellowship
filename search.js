const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const findFunction = (name) => {
    const idx = content.indexOf(name);
    if (idx !== -1) {
        console.log(`Found ${name} at index ${idx}`);
        // print a few lines around it
        const start = content.lastIndexOf('\n', idx - 100);
        const end = content.indexOf('\n', idx + 1000);
        console.log(content.slice(start, end));
    } else {
        console.log(`${name} not found`);
    }
}

findFunction('function syncFromSheets');
findFunction('parseNominationCSV');
findFunction('parseFafCSV');
findFunction('renderFellowProfile');
