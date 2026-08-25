const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Add Christy to hasPhoto in renderAvatar
code = code.replace(/const hasPhoto = \['Arjun', 'Harsh', 'Ibadat', 'Kabir', 'Kasis', 'Surya', 'Urvi', 'Vansh'\]\.includes\(name\);/g, "const hasPhoto = ['Arjun', 'Christy', 'Harsh', 'Ibadat', 'Kabir', 'Kasis', 'Surya', 'Urvi', 'Vansh'].includes(name);");

// 2. Fix getDriveImageUrl to use thumbnail
code = code.replace(/return \`https:\/\/drive\.google\.com\/uc\?id=\$\{match\[1\]\}\`;/g, "return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;");

// 3. Replace Import/Export buttons with Refresh Data button
code = code.replace(/<label class="btn btn--secondary" style="cursor: pointer;">\s*📥 Import CSV\s*<input type="file" id="fileInput" accept="\.csv" style="display: none;" \/>\s*<\/label>\s*<button class="btn btn--secondary" id="btnExport">📤 Export<\/button>/g, '<button class="btn btn--secondary" onclick="syncFromSheets()">🔄 Refresh Data</button>');

// Alternative replacement in case the spacing is different:
code = code.replace(/<label class="btn btn--secondary" style="cursor: pointer;">[^<]*📥 Import CSV[^<]*<input type="file" id="fileInput" accept="\.csv" style="display: none;" \/>[^<]*<\/label>[^<]*<button class="btn btn--secondary" id="btnExport">📤 Export<\/button>/g, '<button class="btn btn--secondary" onclick="syncFromSheets()">🔄 Refresh Data</button>');

fs.writeFileSync('app.js', code);
