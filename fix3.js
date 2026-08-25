const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const badChunk = `}

  
  const fName = (fellow.fellowName || '').toLowerCase().trim();`;

const fixedChunk = `}

async function loadAcceptances() {
  try {
    const url = 'https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=faf';
    const response = await fetch(url);
    if (!response.ok) throw new Error('FAF sheet not found');
    const csvText = await response.text();
    AppState.acceptances = parseAcceptanceCSV(csvText);
    console.log(\`Loaded \${AppState.acceptances.length} FAF responses from live sheet\`);
    
    if (AppState.fellows && AppState.fellows.length) {
      let changed = false;
      AppState.fellows.forEach(fellow => {
        const acc = findAcceptanceForFellow(fellow);
        if (acc) {
          if (!fellow.fellowName || fellow.fellowName === 'N/A' || fellow.fellowName.trim() === '') {
            fellow.fellowName = acc.fullName; changed = true;
          }
          if (!fellow.emailId || fellow.emailId === 'N/A' || fellow.emailId.trim() === '') {
            fellow.emailId = acc.email; changed = true;
          }
          if (!fellow.whatsappNo || fellow.whatsappNo === 'N/A' || fellow.whatsappNo.trim() === '') {
            fellow.whatsappNo = acc.phone; changed = true;
          }
          if (!fellow.collegeName || fellow.collegeName === 'N/A' || fellow.collegeName.trim() === '') {
            fellow.collegeName = acc.college; changed = true;
          }
        }
      });
      if (changed) saveFellows();
    }
    
    render();
  } catch (err) {
    console.log('Could not load FAF sheet:', err);
  }
}

function findAlumniForFellow(fellow) {
  if (!AppState.nominations || !AppState.nominations.length) return null;
  
  const fName = (fellow.fellowName || '').toLowerCase().trim();`;

app = app.replace(badChunk, fixedChunk);
fs.writeFileSync('app.js', app);
console.log('Fixed deleted functions');
