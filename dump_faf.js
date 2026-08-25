const fs = require('fs');
const text = fs.readFileSync('test_faf2.csv', 'utf8');

const parseCSV = (csvText) => {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i], nextChar = csvText[i + 1];
    if (char === '"' && insideQuotes && nextChar === '"') { currentCell += '"'; i++; }
    else if (char === '"') { insideQuotes = !insideQuotes; }
    else if (char === ',' && !insideQuotes) { currentRow.push(currentCell.trim()); currentCell = ''; }
    else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c !== '')) rows.push(currentRow);
      currentRow = []; currentCell = '';
      if (char === '\r') i++;
    }
    else { currentCell += char; }
  }
  if (currentCell !== '' || currentRow.length > 0) { currentRow.push(currentCell.trim()); rows.push(currentRow); }
  return rows;
};

const rows = parseCSV(text);
if (rows.length > 0) {
  rows[0].forEach((h, i) => console.log(i + ': ' + h));
}
