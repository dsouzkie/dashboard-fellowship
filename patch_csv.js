const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const parseCsvFuncRegex = /function parseCSV\(csvText\) \{([\s\S]*?)return result;\s*\}/;

const newParseCsv = `function parseCSV(csvText) {
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
  if (rows.length < 2) return result;

  const headerRow = rows[0].map(h => h.trim().toLowerCase());
  
  const getIdx = (name) => {
    const idx = headerRow.findIndex(h => h.includes(name.toLowerCase()));
    return idx !== -1 ? idx : -1;
  };

  const map = {
    collegeName: getIdx('college name'),
    fellowName: getIdx('fellow name'),
    whatsappNo: getIdx('whatsapp'),
    city: getIdx('city'),
    pocAssigned: getIdx('poc assigned'),
    emailId: getIdx('email id') !== -1 ? getIdx('email id') : getIdx('email'),
    clubPageActivity: getIdx('club page activity'),
    whereTheyComeFrom: getIdx('where they come from'),
    finalAcceptance: getIdx('final acceptance'),
    clubPageLink: getIdx('club page link'),
    followersCount: getIdx('followers count'),
    fellowStatus: getIdx('fellow status'),
    clubMade: getIdx('club made'),
    clubPageLaunched: getIdx('club page launched'),
    firstReelPosted: getIdx('first reel posted'),
    reelsPostedWeek1: getIdx('reels posted in week 1'),
    whatsappGroupAdded: getIdx('whatsapp group'),
    mtf: getIdx('mtf'),
    contentPiecesPosted: getIdx('content pieces'),
    clubRecruitmentCampaign: getIdx('club recruitment'),
    comments: getIdx('comments'),
    strike1: getIdx('strike 1'),
    statusOfStrike1: getIdx('status of strike 1'),
    strike2: getIdx('strike 2'),
    statusOfStrike2: getIdx('status of strike 2'),
    strike3: getIdx('strike 3')
  };

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const collegeIdx = map.collegeName !== -1 ? map.collegeName : 0;
    if (!row[collegeIdx]) continue;
    
    const fellowIdx = map.fellowName !== -1 ? map.fellowName : 3;
    const fellowName = (row[fellowIdx] || '').trim();
    if (!fellowName || fellowName.toLowerCase() === 'no fellow') continue;

    const fellow = {};
    FIELD_KEYS.forEach(key => {
      const idx = map[key];
      if (idx !== undefined && idx !== -1) {
        fellow[key] = row[idx] || '';
      } else {
        fellow[key] = '';
      }
    });
    
    fellow.id = 'f_' + Date.now() + '_' + i;
    result.push(fellow);
  }
  return result;
}`;

app = app.replace(parseCsvFuncRegex, newParseCsv);
fs.writeFileSync('app.js', app);
console.log('Done mapping headers!');
