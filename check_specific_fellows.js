const fs = require('fs');

function parseCSV(csvText) {
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
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
      if (char === '\r') i++;
    } else {
      currentCell += char;
    }
  }
  if (currentCell || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      rows.push(currentRow);
  }
  return rows;
}

const txt = fs.readFileSync('faf.csv', 'utf8');
const rows = parseCSV(txt);

rows.forEach(row => {
  const str = row.join(' ').toLowerCase();
  if (str.includes('pratyush') || str.includes('piyush gupta') || str.includes('greeshma')) {
    console.log(row[2], ':', row[30]);
  }
});
