const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const functionsToAdd = `
const TRACKER_SHEET_URL = 'https://docs.google.com/spreadsheets/d/10BSyslWloYekTr5UEkVeUCgBv94iuLmMwZIyjD9Xto4/gviz/tq?tqx=out:csv&sheet=Tracker';
const STRIKES_SHEET_URL = 'https://docs.google.com/spreadsheets/d/10BSyslWloYekTr5UEkVeUCgBv94iuLmMwZIyjD9Xto4/gviz/tq?tqx=out:csv&sheet=Strikes';

async function fetchTrackerFromSheet() {
  try {
    const response = await fetch(TRACKER_SHEET_URL);
    const csvText = await response.text();
    const parsed = parseCSV(csvText);
    if (parsed.length > 0) {
      AppState.fellows = parsed;
      saveFellows();
      showToast('Synced ' + parsed.length + ' fellows from Google Sheets', 'success');
    }
  } catch (err) {
    console.error('Failed to fetch tracker sheet:', err);
    showToast('Failed to sync from Google Sheets. Using cached data.', 'error');
  }
}

async function fetchStrikesFromSheet() {
  try {
    const response = await fetch(STRIKES_SHEET_URL);
    const csvText = await response.text();
    const rows = [];
    let currentRow = [], currentCell = '', insideQuotes = false;
    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i], nextChar = csvText[i + 1];
      if (char === '"' && insideQuotes && nextChar === '"') { currentCell += '"'; i++; }
      else if (char === '"') insideQuotes = !insideQuotes;
      else if (char === ',' && !insideQuotes) { currentRow.push(currentCell.trim()); currentCell = ''; }
      else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c !== '')) rows.push(currentRow);
        currentRow = []; currentCell = '';
        if (char === '\r') i++;
      } else currentCell += char;
    }
    if (currentCell || currentRow.length) { currentRow.push(currentCell.trim()); if (currentRow.some(c => c !== '')) rows.push(currentRow); }
    
    // Skip header row, import as approved strikes
    const importedStrikes = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[5]) continue; // No fellow name
      const fellowName = (row[5] || '').trim();
      const reason = (row[8] || '').trim();
      const email = (row[6] || '').trim();
      const pocAssigned = (row[3] || '').trim();
      
      const fellow = AppState.fellows.find(f => 
        f.fellowName.trim().replace(/[:\\s]+$/,'') === fellowName.replace(/[:\\s]+$/,'') ||
        (f.emailId && f.emailId.trim().toLowerCase() === email.toLowerCase())
      );
      if (fellow) {
        let rec = importedStrikes.find(r => r.fellowId === fellow.id);
        if (!rec) { rec = { fellowId: fellow.id, strikes: [] }; importedStrikes.push(rec); }
        rec.strikes.push({
          id: 'strike_import_' + Date.now() + '_' + i,
          reason: reason,
          phase: 'sheet_import',
          approvedBy: pocAssigned,
          approvedAt: new Date().toISOString(),
          emailSent: false,
          removed: false
        });
      }
    }
    
    AppState.strikeRecords = importedStrikes;
    saveStrikeRecords();
    showToast('Imported ' + importedStrikes.reduce((s,r) => s + r.strikes.length, 0) + ' strikes from sheet', 'success');
  } catch (err) {
    console.error('Failed to fetch strikes sheet:', err);
  }
}

async function syncFromSheets() {
  showToast('Syncing from Google Sheets...', 'info');
  await fetchTrackerFromSheet();
  await fetchStrikesFromSheet();
  runAutoStrikes();
  render();
}
`;

if (!code.includes('async function syncFromSheets()')) {
  code = code.replace('function importCSV', functionsToAdd + '\n\nfunction importCSV');
  fs.writeFileSync('app.js', code);
}
