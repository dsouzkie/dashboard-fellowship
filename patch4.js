const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const regex = /<button class="btn btn--secondary" onclick="syncFromSheets\(\)">\?\? Refresh Data<\/button>/;
const replacement = `<!-- Removed Refresh Data button to prevent wiping edits -->
            <button class="btn btn--secondary" onclick="renderMassAddModal()">?? Mass Add Fellows</button>`;

app = app.replace(regex, replacement);
fs.writeFileSync('app.js', app);
console.log('Replaced sync button with Mass Add');
