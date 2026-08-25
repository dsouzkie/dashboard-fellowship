const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const newParseAcceptance = `
function parseAcceptanceCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentCell += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\\n' || (char === '\\r' && nextChar === '\\n')) && !insideQuotes) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c !== '')) rows.push(currentRow);
      currentRow = [];
      currentCell = '';
      if (char === '\\r') i++;
    } else {
      currentCell += char;
    }
  }
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c !== '')) rows.push(currentRow);
  }

  const result = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[3]) continue; // Full Name is at index 3
    
    result.push({
      timestamp: row[0] || '',
      college: row[1] || '',
      city: row[2] || '',
      fullName: row[3] || '',
      phone: row[4] || '',
      faName: row[5] || '',
      faEmail: row[6] || '',
      faPhone: row[7] || '',
      email: row[8] || '',
      instagram: row[9] || '',
      photo: row[30] || ''
    });
  }
  return result;
}
`;

const lines = code.split('\n');
const startIdx = lines.findIndex(l => l.includes('function parseAcceptanceCSV(csvText) {'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('async function loadAcceptances() {'));

if (startIdx !== -1 && endIdx !== -1) {
  lines.splice(startIdx, endIdx - startIdx, newParseAcceptance);
  code = lines.join('\n');
  fs.writeFileSync('app.js', code);
} else {
  console.log('Failed to find parseAcceptanceCSV bounds');
}
