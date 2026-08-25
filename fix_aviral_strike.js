const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetStr = `function loadStrikeRecords() { const s = localStorage.getItem('under25_strike_records'); return s ? JSON.parse(s) : []; }`;
const replaceStr = `function loadStrikeRecords() { 
  const s = localStorage.getItem('under25_strike_records'); 
  let records = s ? JSON.parse(s) : []; 
  
  // FIX: Un-remove Aviral Bhatt's strike
  records.forEach(rec => {
    // Find Aviral Bhatt in AppState.fellows to match the fellowId
    const fellow = AppState.fellows ? AppState.fellows.find(f => f.id === rec.fellowId) : null;
    if (fellow && fellow.fellowName && fellow.fellowName.includes('Aviral Bhatt')) {
      rec.strikes.forEach(strike => {
        if (strike.reason && strike.reason.includes('Not filled insight form') && strike.removed) {
          strike.removed = false; // Restore it!
          console.log('Restored strike for Aviral Bhatt');
        }
      });
    }
  });
  
  return records;
}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replaceStr);
  fs.writeFileSync('app.js', code);
  console.log('Injected strike repair script into app.js');
} else {
  console.log('Could not find loadStrikeRecords function');
}
