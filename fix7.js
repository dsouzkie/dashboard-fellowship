const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const regex = /<label class="btn btn--secondary">\s*📥 Import CSV\s*<input type="file" id="importFile" accept="\.csv" style="display:none;" \/>\s*<\/label>\s*<button class="btn btn--secondary" id="btnExport">📤 Export<\/button>/g;

code = code.replace(regex, '<button class="btn btn--secondary" onclick="syncFromSheets()">🔄 Refresh Data</button>');

fs.writeFileSync('app.js', code);
