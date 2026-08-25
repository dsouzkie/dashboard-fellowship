const fs = require('fs');
const trackerCsv = fs.readFileSync('Fellowship 26-27 Tracker - Final Fellowship Tracker.csv', 'utf8');

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
  
  if (rows.length < 2) return [];
  const headerRow = rows[0].map(h => h.trim().toLowerCase());
  const getIdx = (name) => { const idx = headerRow.findIndex(h => h.includes(name.toLowerCase())); return idx !== -1 ? idx : -1; };
  
  const map = {
    collegeName: getIdx('college name'),
    fellowName: getIdx('fellow name'),
    whatsappNo: getIdx('whatsapp'),
    city: getIdx('city'),
    pocAssigned: getIdx('poc assigned'),
    emailId: getIdx('email id') !== -1 ? getIdx('email id') : getIdx('email'),
  };
  
  const result = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    result.push({
      collegeName: row[map.collegeName] || '',
      fellowName: row[map.fellowName] || '',
      whatsappNo: row[map.whatsappNo] || '',
      emailId: row[map.emailId] || '',
      pocAssigned: row[map.pocAssigned] || ''
    });
  }
  return result;
};

const fellows = parseCSV(trackerCsv);
const cmr = fellows.find(f => f.collegeName.toLowerCase().includes('cmr college of engineering'));
console.log('CMR:', cmr);
