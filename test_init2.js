
global.window = { addEventListener: () => {} };
global.document = {
  getElementById: (id) => {
    return {
      value: '',
      classList: { add: () => {}, remove: () => {} },
      innerHTML: '',
      innerText: '',
      appendChild: () => {},
      createElement: () => ({ classList: { add: () => {}, remove: () => {} }, style: {} }),
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {}
    };
  },
  createElement: () => ({ className: '', innerHTML: '', style: {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {} }),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {},
  body: { appendChild: () => {} }
};
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.fetch = async () => ({ ok: true, text: async () => '' });

window.addEventListener('unhandledrejection', function(event) {
  const errDiv = document.createElement('div');
  errDiv.style.position = 'fixed';
  errDiv.style.top = '0';
  errDiv.style.left = '0';
  errDiv.style.width = '100%';
  errDiv.style.background = 'orange';
  errDiv.style.color = 'black';
  errDiv.style.zIndex = '999999';
  errDiv.style.padding = '20px';
  errDiv.innerHTML = '<h3>UNHANDLED PROMISE REJECTION</h3><p>' + (event.reason ? event.reason.message || event.reason : 'Unknown') + '</p><pre>' + (event.reason && event.reason.stack ? event.reason.stack : '') + '</pre>';
  document.body.appendChild(errDiv);
});

window.onerror = function(msg, url, lineNo, columnNo, error) {
  const errDiv = document.createElement('div');
  errDiv.style.position = 'fixed';
  errDiv.style.top = '0';
  errDiv.style.left = '0';
  errDiv.style.width = '100%';
  errDiv.style.background = 'red';
  errDiv.style.color = 'white';
  errDiv.style.zIndex = '999999';
  errDiv.style.padding = '20px';
  errDiv.style.fontFamily = 'monospace';
  errDiv.innerHTML = '<h3>CRITICAL ERROR</h3>' + 
    '<p>' + msg + '</p>' + 
    '<p>Line: ' + lineNo + ':' + columnNo + '</p>' + 
    '<pre>' + (error && error.stack ? error.stack : '') + '</pre>';
  document.body.appendChild(errDiv);
  return false;
};

// =============================================
// SECTION 1: CONFIGURATION & CONSTANTS
// =============================================

const FIELD_KEYS = [
  'intakeStatus', 'collegeName', 'fellowName', 'whatsappNo', 'city', 'pocAssigned', 'team',
  'emailId', 'clubPageActivity', 'whereTheyComeFrom', 'finalAcceptance', 'clubPageLink',
  'followersCount', 'fellowStatus', 'clubMade', 'clubPageLaunched', 'firstReelPosted',
  'reelsPostedWeek1', 'reelsIn7Days7Posts', 'reelsPostedWeek2', 'whatsappGroupAdded', 'mtf',
  'contentPiecesPosted', 'clubRecruitmentCampaign', 'comments',
  'strike1', 'statusOfStrike1', 'strike2', 'statusOfStrike2', 'strike3'
];

const FIELD_LABELS = {
  intakeStatus: 'Intake Status',
  collegeName: 'College Name',
  city: 'City',
  pocAssigned: 'POC Assigned',
  team: 'Team',
  fellowName: 'Fellow Name',
  whatsappNo: 'WhatsApp No.',
  emailId: 'Email ID',
  clubPageActivity: 'Club Page Activity',
  whereTheyComeFrom: 'Where they come from',
  finalAcceptance: 'Final Acceptance',
  clubPageLink: 'Club Page Link',
  followersCount: 'Followers Count',
  fellowStatus: 'Fellow Status',
  clubMade: 'Club Made',
  clubPageLaunched: 'Club Page Launched',
  firstReelPosted: 'First Reel Posted',
  reelsPostedWeek1: 'Reels Posted in Week 1',
  reelsIn7Days7Posts: 'Reels (7 Days 7 Posts)',
  reelsPostedWeek2: 'Reels Posted Week 2',
  whatsappGroupAdded: 'WhatsApp Group Added',
  mtf: 'MTF',
  contentPiecesPosted: 'Content Pieces Posted',
  clubRecruitmentCampaign: 'Club Recruitment Campaign',
  comments: 'Comments',
  strike1: 'Strike 1',
  statusOfStrike1: 'Status of Strike 1',
  strike2: 'Strike 2',
  statusOfStrike2: 'Status of Strike 2',
  strike3: 'Strike 3',
  manualHocName: 'Head of Content (Manual)',
  manualHocEmail: 'HOC Email (Manual)',
  manualHocPhone: 'HOC Phone (Manual)',
  manualHooName: 'Head of Ops (Manual)',
  manualHooEmail: 'HOO Email (Manual)',
  manualHooPhone: 'HOO Phone (Manual)',
  manualFaName: 'Faculty Advisor (Manual)',
  manualFaEmail: 'FA Email (Manual)',
  manualFaPhone: 'FA Phone (Manual)'
};

global.TEAM = [
  { name: 'Christy', color: '#EAB308', password: 'under25christy', isAdmin: true, team: 'Sapphire' },

  { name: 'Arjun', color: '#7C3AED', password: 'under25arjun', team: 'Jade' },
  { name: 'Harsh', color: '#EAB308', password: 'under25harsh', team: 'Sapphire' },
  { name: 'Kasis', color: '#F97316', password: 'under25kasis', team: 'Amber' },
  { name: 'Surya', color: '#F97316', password: 'under25surya', team: 'Amber' },
  { name: 'Urvi', color: '#10B981', password: 'under25urvi', team: 'Emerald' },
  { name: 'Vansh', color: '#EAB308', password: 'under25vansh', team: 'Sapphire' },
  { name: 'Kabir', color: '#10B981', password: 'under25kabir', isAdmin: true, team: 'Emerald' },
  { name: 'Ibadat', color: '#A3A3A3', password: 'under25ibadat', isAdmin: true }
];

const TEAM_COLORS = {
  'Emerald': { primary: '#10B981', glow: 'rgba(16,185,129,0.4)', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  'Sapphire': { primary: '#EAB308', glow: 'rgba(234,179,8,0.4)', gradient: 'linear-gradient(135deg, #EAB308, #CA8A04)' },
  'Amber': { primary: '#F97316', glow: 'rgba(249,115,22,0.4)', gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
  'Jade': { primary: '#7C3AED', glow: 'rgba(124,58,237,0.4)', gradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }
};

const INTAKE_OPTIONS = ['Existing', 'August Intake'];

const STATUS_OPTIONS = ['Active', 'Ghosted', 'On Hold', 'Dropped Out', 'Not Yet Started', 'Inactive'];
const ACTIVITY_OPTIONS = ['Active', 'Inactive', 'Not Set Up', 'Management Restraint'];
const YES_NO_OPTIONS = ['Yes', 'No', 'Scheduled', 'Management Restraint', ''];
const STRIKE_REASONS = ['Final Acceptance Form', 'Club Page Launch', 'Page Inactive', 'No Reels Posted', 'Not filled insight form', 'Not launched club page yet', 'Ghosting', 'N/A', ''];


// =============================================
// SECTION 2: STATE MANAGEMENT
// =============================================
const STRIKE_REASONS_MAP = {
  'Final Acceptance Form': 'not filling out the Under25 Fellowship Final Acceptance Form',
  'Club Page Launch': 'not launching your Club Page',
  'Page Inactive': 'your Club Page being inactive',
  'No Reels Posted': 'not posting any reels on your Club Page',
  'Fellow Ghosted': 'ghosting the Under25 Fellowship and remaining unresponsive'
};

global.AppState = {
  currentUser: null,
  currentView: 'dashboard', // dashboard, my-fellows, all-fellows, strikes, forms, instagram
  fellows: [],
  searchQuery: '',
  filterPOC: 'all',
  filterStatus: 'all',
  filterCity: 'all',
  filterTeam: 'all',
  filterIntake: 'all',
  filterActivity: 'all',
  filterLaunched: 'all',
  sortField: 'collegeName',
  sortDirection: 'asc',
  changeLog: [],
  editingCell: null,
  strikeRules: {
    rule1: true,
    rule2: true,
    rule3: true,
    rule4: true,
    rule5: true
  },
  nominations: [],
  acceptances: [],
  pocTransfers: [],
  fellowRequests: [],
  strikePhase: null,      // { phaseId, active, startedBy, startedAt, pocApprovals:{}, emailsSent }
  strikeRecords: [],      // [{ fellowId, strikes:[{id,reason,phase,approvedBy,approvedAt,emailSent,removed,removedAt,removedBy}] }]
  strikeReviews: {}       // { [phaseId]: { [pocName]: { [fellowId]: { suggested:[reasons], decisions:{reason:bool}, removeIds:[] } } } }
};


// =============================================
// SECTION 3: DATA LAYER (CSV Parser, Storage, CRUD)
// =============================================

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
      if (currentRow.some(c => c !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      if (char === '\r') i++;
    } else {
      currentCell += char;
    }
  }
  
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c !== '')) {
      rows.push(currentRow);
    }
  }

  const result = [];
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[1]) continue; // Skip empty rows without collegeName

    const fellow = {};
    FIELD_KEYS.forEach((key, index) => {
      fellow[key] = row[index] || '';
    });
    // Add unique ID
    fellow.id = 'f_' + Date.now() + '_' + i;
    result.push(fellow);
  }
  return result;
}

function saveFellows() {
  localStorage.setItem('under25_fellows', JSON.stringify(AppState.fellows));
}

function loadFellows() {
  const saved = localStorage.getItem('under25_fellows');
  return saved ? JSON.parse(saved) : null;
}

function savePocTransfers() {
  localStorage.setItem('under25_transfers', JSON.stringify(AppState.pocTransfers));
}

function loadPocTransfers() {
  const saved = localStorage.getItem('under25_transfers');
  return saved ? JSON.parse(saved) : [];
}

function saveFellowRequests() {
  localStorage.setItem('under25_requests', JSON.stringify(AppState.fellowRequests));
}

function loadFellowRequests() {
  const saved = localStorage.getItem('under25_requests');
  return saved ? JSON.parse(saved) : [];
}

function saveStrikePhase() { localStorage.setItem('under25_strike_phase', JSON.stringify(AppState.strikePhase)); }
function loadStrikePhase() { const s = localStorage.getItem('under25_strike_phase'); return s ? JSON.parse(s) : null; }
function saveStrikeRecords() { localStorage.setItem('under25_strike_records', JSON.stringify(AppState.strikeRecords)); }
function loadStrikeRecords() { const s = localStorage.getItem('under25_strike_records'); return s ? JSON.parse(s) : []; }
function saveStrikeReviews() { localStorage.setItem('under25_strike_reviews', JSON.stringify(AppState.strikeReviews)); }
function saveRemovalRequests() { localStorage.setItem('under25_removal_requests', JSON.stringify(AppState.removalRequests)); }
function loadStrikeReviews() { const s = localStorage.getItem('under25_strike_reviews'); return s ? JSON.parse(s) : {}; }
function loadRemovalRequests() { const s = localStorage.getItem('under25_removal_requests'); return s ? JSON.parse(s) : []; }

function getActiveStrikeCount(fellowId) {
  const rec = AppState.strikeRecords.find(r => r.fellowId === fellowId);
  if (!rec) return 0;
  return rec.strikes.filter(s => !s.removed).length;
}

function getStrikeRecord(fellowId) {
  let rec = AppState.strikeRecords.find(r => r.fellowId === fellowId);
  if (!rec) { rec = { fellowId, strikes: [] }; AppState.strikeRecords.push(rec); }
  return rec;
}

function renderStrikeDots(fellowId) {
  const count = getActiveStrikeCount(fellowId);
  if (count === 0) return '';
  const colors = ['#F59E0B','#F97316','#EF4444'];
  return Array.from({length: Math.min(count,3)}, (_,i) =>
    `<span title="${i+1} strike" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${colors[i]||'#EF4444'};margin-left:2px;vertical-align:middle;"></span>`
  ).join('');
}

function generateStrikeEmailBody(fellow, reason, strikeSentence) {
  const poc = TEAM.find(t => t.name === fellow.pocAssigned);
  const ordinals = ['first','second','third'];
  const count = getActiveStrikeCount(fellow.id) + 1; // It gets the count before the current one is fully saved maybe? Actually count should be the current strike count.
  const ordinal = ordinals[Math.min(count,3)-1] || 'next';
  
  let body = '';
  if (reason === 'Final Acceptance Form') {
    body = `Dear Fellow,

This is your ${ordinal} strike for not filling out the Under25 Fellowship Final Acceptance Form.

We had flagged this earlier and given you time to complete it, but we still don't see your submission. This form is what confirms your spot in the Fellowship - without it, we can't move forward with you as part of the cohort.

At this point, we need you to treat this as urgent.

📌 What you need to do:
Fill out the Final Acceptance Form by Friday, 24th July
Final Acceptance Form - Click here

If we don't receive it by then, it will be treated as a lack of commitment to the Fellowship, and may affect your standing in the program, including potential removal from the Fellowship.

We genuinely want you in this journey with us - so if you're facing any issues with the form or have questions, reach out to your Respective POC (${fellow.pocAssigned}) or the Program Team right away.

Let's get this done.

Regards,
Team Under25`;
  } else {
    body = `Dear Fellow,

This is your ${ordinal} strike for ${strikeSentence}.

We had flagged this earlier and given you time to complete it, but we still don't see your submission. 

At this point, we need you to treat this as urgent.

📌 What you need to do:
Please rectify this immediately.

If we don't receive an update, it will be treated as a lack of commitment to the Fellowship, and may affect your standing in the program, including potential removal from the Fellowship.

We genuinely want you in this journey with us - so if you're facing any issues or have questions, reach out to your Respective POC (${fellow.pocAssigned}) or the Program Team right away.

Let's get this done.

Regards,
Team Under25`;
  }

  const template = {
    subject: `Under25 Fellowship — Strike ${count} | ${escapeHTML(fellow.collegeName)}`,
    body: body
  };
  return template;
}

function generateRemovalEmailBody(fellow, reason) {
  return {
    subject: `Under25 Fellowship — Strike Cleared | ${escapeHTML(fellow.collegeName)}`,
    body: `Dear Fellow,

We're writing to inform you that one of your strikes (${reason}) has been reviewed and officially cleared from your record.

This reflects positively on your engagement with the Fellowship. Please continue to stay on track with your responsibilities.

If you have any questions, reach out to your POC ${fellow.pocAssigned}.

Regards,
Team Under25`
  };
}

function saveChangeLog() {
  localStorage.setItem('under25_changelog', JSON.stringify(AppState.changeLog));
}

function loadChangeLog() {
  const saved = localStorage.getItem('under25_changelog');
  return saved ? JSON.parse(saved) : null;
}

function logChange(fellowId, field, oldValue, newValue) {
  if (oldValue === newValue) return;
  AppState.changeLog.unshift({
    timestamp: new Date().toISOString(),
    user: AppState.currentUser.name,
    fellowId,
    field,
    oldValue,
    newValue
  });
  if (AppState.changeLog.length > 100) AppState.changeLog.pop();
  saveChangeLog();
}

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function updateFellow(id, field, value) {
  const fellow = AppState.fellows.find(f => f.id === id);
  if (!fellow) return;
  
  const oldValue = fellow[field];
  fellow[field] = value;
  
  logChange(id, field, oldValue, value);
  runAutoStrikes();
  saveFellows();
  
  // Re-render current view to reflect changes
  render();
}

function addFellow(data) {
  data.id = 'f_' + Date.now();
  AppState.fellows.unshift(data);
  runAutoStrikes();
  saveFellows();
  render();
  showToast('Fellow added successfully', 'success');
}

function deleteFellow(id) {
  if (confirm('Are you sure you want to delete this fellow?')) {
    AppState.fellows = AppState.fellows.filter(f => f.id !== id);
    saveFellows();
    render();
    showToast('Fellow deleted', 'info');
  }
}

function exportCSV() {
  const headers = FIELD_KEYS.map(k => FIELD_LABELS[k]).join(',');
  const rows = AppState.fellows.map(f => {
    return FIELD_KEYS.map(k => {
      let val = f[k] || '';
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
  });
  
  const csvContent = headers + '\n' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `under25_fellows_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


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
    
    const importedStrikes = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row[5]) continue; // No fellow name
      const fellowName = (row[5] || '').trim();
      const reason = (row[8] || '').trim();
      const email = (row[6] || '').trim();
      const pocAssigned = (row[3] || '').trim();
      
      const fellow = AppState.fellows.find(f => 
        f.fellowName.trim().replace(/[:\s]+$/,'') === fellowName.replace(/[:\s]+$/,'') ||
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
  } catch (err) {
    console.error('Failed to fetch strikes sheet:', err);
  }
}


async function fetchAdditionalDataFromSheets() {
  try {
    const fafResponse = await fetch('https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=FAF');
    const fafText = await fafResponse.text();
    if (typeof parseAcceptanceCSV === 'function') {
      AppState.acceptances = parseAcceptanceCSV(fafText);
    } else if (typeof parseFafCSV === 'function') {
      AppState.acceptances = parseFafCSV(fafText);
    }

    const nomResponse = await fetch('https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=nomination');
    const nomText = await nomResponse.text();
    if (typeof parseNominationCSV === 'function') {
      AppState.nominations = parseNominationCSV(nomText);
    }
    
    console.log('Fetched additional data successfully.');
  } catch (err) {
    console.error('Error fetching additional data:', err);
  }
}

async function syncFromSheets() {
  showToast('Syncing from Google Sheets...', 'info');
  await fetchTrackerFromSheet();
  await fetchStrikesFromSheet();
  if (typeof fetchAdditionalDataFromSheets === 'function') { await fetchAdditionalDataFromSheets(); }
  runAutoStrikes();
  render();
}


function importCSV(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = parseCSV(e.target.result);
      if (parsed.length > 0) {
        AppState.fellows = parsed;
        runAutoStrikes();
        saveFellows();
        render();
        showToast(`Imported ${parsed.length} fellows successfully!`, 'success');
      } else {
        showToast('No valid data found in CSV', 'error');
      }
    } catch (err) {
      showToast('Error parsing CSV file', 'error');
      console.error(err);
    }
  };
  reader.readAsText(file);
}


// Parse nomination CSV
function parseNominationCSV(csvText) {
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
      if (currentRow.some(c => c !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      if (char === '\r') i++;
    } else {
      currentCell += char;
    }
  }
  
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c !== '')) {
      rows.push(currentRow);
    }
  }

  const result = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row[1]) continue;

    result.push({
      timestamp: row[0] || '',
      alumniName: row[1] || '',
      alumniCollege: row[2] || '',
      type: row[3] || '',
      alumniEmail: row[4] || '',
      alumniPhone: row[5] || '',
      clubIGUsername: row[6] || '',
      clubIGPassword: row[7] || '',
      hadSummit: row[8] || '',
      nominatedFellowName: row[9] || '',
      nominatedFellowPhone: row[10] || '',
      nominatedFellowEmail: row[11] || '',
      nominatedFellowInstagram: row[12] || '',
      nominatedFellowPhoto: row[13] || '',
      nominatedFellowVideo: row[14] || '',
      reasonForHandover: row[15] || '',
      wantToBeContacted: row[16] || '',
      joinAlumniWhatsApp: row[17] || '',
      workWithUnder25: row[18] || '',
      anythingElse: row[19] || ''
    });
  }
  return result;
}

// Load nominations from live Google Sheet
async function loadNominations() {
  try {
    const url = 'https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=nomination';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const csvText = await response.text();
    AppState.nominations = parseNominationCSV(csvText);
    console.log(`Loaded ${AppState.nominations.length} nominations from live sheet`);
    render();
  } catch (err) {
    console.log('Could not load nomination sheet:', err);
  }
}

// Parse Final Acceptance CSV

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
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c !== '')) rows.push(currentRow);
      currentRow = [];
      currentCell = '';
      if (char === '\r') i++;
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
    if (!row[0] || row[0].trim() === '' || row[0].trim().toLowerCase() === 'no fellow') continue;
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

async function loadAcceptances() {
  try {
    const url = 'https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=faf';
    const response = await fetch(url);
    if (!response.ok) throw new Error('FAF sheet not found');
    const csvText = await response.text();
    AppState.acceptances = parseAcceptanceCSV(csvText);
    console.log(`Loaded ${AppState.acceptances.length} FAF responses from live sheet`);
    
    // Always re-render so photos show up instantly
    render();
  } catch (err) {
    console.log('Could not load FAF sheet:', err);
  }
}

function findAlumniForFellow(fellow) {
  if (!AppState.nominations || !AppState.nominations.length) return null;
  
  const fName = (fellow.fellowName || '').toLowerCase().trim();
  const fEmail = (fellow.emailId || '').toLowerCase().trim();
  const fPhone = String(fellow.whatsappNo || '').replace(/\\D/g, '');
  const fCollege = (fellow.collegeName || '').toLowerCase().trim();
  
  const match = AppState.nominations.find(n => {
    // if (n.type && !n.type.toLowerCase().trim().includes('nominating')) return false; // Relaxed requirement

    const nomName = (n.nominatedFellowName || '').toLowerCase().trim();
    const nomEmail = (n.nominatedFellowEmail || '').toLowerCase().trim();
    const nomPhone = String(n.nominatedFellowPhone || '').replace(/\\D/g, '');
    const nomCollege = (n.alumniCollege || '').toLowerCase().trim();
    
    // 1. Exact match on Email or Phone
    if (fEmail && nomEmail && fEmail === nomEmail) return true;
    if (fPhone && nomPhone && fPhone.length >= 10 && nomPhone.includes(fPhone.slice(-10))) return true;
    
    if (fName && nomName) {
       // 2. Exact name match
       if (nomName === fName) return true;
       
       // 3. Exact Word match (prevents "manish" matching "manisha")
       const fWords = fName.split(' ').filter(w => w.length > 2);
       const nomWords = nomName.split(' ').filter(w => w.length > 2);
       for (const w of fWords) {
         if (nomWords.includes(w)) return true;
       }
       
       // 4. Fallback substring match ONLY if college name matches closely
       const collegeMatches = (fCollege && nomCollege && (fCollege.includes(nomCollege) || nomCollege.includes(fCollege)));
       if (collegeMatches && (nomName.includes(fName) || fName.includes(nomName))) {
         return true;
       }
    }
    return false;
  });
  
  return match || null;
}

function findAcceptanceForFellow(fellow) {
  if (!AppState.acceptances || !AppState.acceptances.length) return null;
  
  const fName = (fellow.fellowName || '').toLowerCase().trim();
  const fCollege = (fellow.collegeName || '').toLowerCase().trim();
  const fEmail = (fellow.emailId || '').toLowerCase().trim();
  const fPhone = String(fellow.whatsappNo || '').replace(/\D/g, '');
  
  return AppState.acceptances.find(a => {
    const fafName = (a.fullName || '').toLowerCase().trim();
    const fafCollege = (a.college || '').toLowerCase().trim();
    const fafEmail = (a.email || '').toLowerCase().trim();
    const fafPhone = String(a.phone || '').replace(/\D/g, '');
    
    if (fName && fafName && fCollege && fafCollege) {
      if (fName === fafName && fCollege === fafCollege) return true;
      const nameMatch = fName.includes(fafName) || fafName.includes(fName);
      const fColWords = fCollege.split(/[^a-z0-9]/).filter(w => w.length > 3);
      const fafColWords = fafCollege.split(/[^a-z0-9]/).filter(w => w.length > 3);
      const colOverlap = fColWords.some(w => fafColWords.includes(w)) || 
                         fafColWords.some(w => fColWords.includes(w)) ||
                         fCollege.includes(fafCollege) || fafCollege.includes(fCollege);
                         
      if (nameMatch && colOverlap) return true;
      if (fName === fafName && fName.length > 5) return true;
    }
    
    if (fEmail && fafEmail && fEmail === fafEmail) return true;
    if (fPhone && fafPhone && fPhone.length >= 10 && fafPhone.includes(fPhone.slice(-10))) return true;
    return false;
  }) || null;
}

function getDriveImageUrl(driveLink) {
  if (!driveLink) return null;
  const match = String(driveLink).match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;
  }
  return null;
}


function renderSidebar() {
  const v = AppState.currentView;
  
  return `
    <aside class="sidebar">
      <div class="sidebar-header" style="text-align: center;">
        <img src="team%20photos/logo.png" alt="Under25" style="max-width: 130px; margin-bottom: 10px;" />
        <div style="font-weight: bold; font-size: 0.95rem; color: #fff; line-height: 1.2;">Fellowship Tracking<br>Dashboard</div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-item ${v === 'dashboard' ? 'nav-item--active' : ''}" data-view="dashboard">
          <span class="nav-icon">📊</span><span class="nav-label">Overview</span>
        </div>
        <div class="nav-item ${v === 'my-fellows' ? 'nav-item--active' : ''}" data-view="my-fellows">
          <span class="nav-icon">👤</span><span class="nav-label">My Fellows</span>
        </div>
        <div class="nav-item ${v === 'all-fellows' ? 'nav-item--active' : ''}" data-view="all-fellows">
          <span class="nav-icon">👥</span><span class="nav-label">All Fellows</span>
        </div>
        <div class="nav-item ${v === 'alerts' ? 'nav-item--active' : ''}" data-view="alerts">
          <span class="nav-icon">🔔</span><span class="nav-label">Alerts & Transfers</span>
        </div>
        <div class="nav-item ${v === 'strikes' ? 'nav-item--active' : ''}" data-view="strikes">
          <span class="nav-icon">⚡</span><span class="nav-label">Strikes</span>
        </div>
        <div class="nav-item ${v === 'forms' ? 'nav-item--active' : ''}" data-view="forms">
          <span class="nav-icon">📋</span><span class="nav-label">Form Tracker</span>
        </div>
        <div class="nav-item ${v === 'instagram' ? 'nav-item--active' : ''}" data-view="instagram">
          <span class="nav-icon">📸</span><span class="nav-label">Instagram</span>
        </div>
        <div class="nav-item ${v === 'requests' ? 'nav-item--active' : ''}" data-view="requests">
          <span class="nav-icon">📝</span><span class="nav-label">Fellow Requests</span>
        </div>
      </nav>
    </aside>
  `;
}


function renderDonutChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 10;
  
  ctx.clearRect(0, 0, width, height);
  
  let total = 0;
  for(let i = 0; i < data.length; i++) {
    total += data[i].value;
  }
  
  if (total === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 15;
    ctx.stroke();
    return;
  }
  
  let startAngle = -0.5 * Math.PI;
  for(let i = 0; i < data.length; i++) {
    const item = data[i];
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.strokeStyle = item.color || '#3b82f6';
    ctx.lineWidth = 15;
    ctx.stroke();
    startAngle += sliceAngle;
  }
}

function renderLegend(elementId, data) {
  const el = document.getElementById(elementId);
  if(!el) return;
  el.innerHTML = data.map(d =>
    `<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#94A3B8;">`+
    `<div style="width:10px;height:10px;border-radius:50%;background:${d.color};flex-shrink:0;"></div>`+
    `${escapeHTML(d.label)} (${d.value})</div>`
  ).join('');
}

function renderBarChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 20;
  
  ctx.clearRect(0, 0, width, height);
  if(!data || !data.length) return;
  
  let maxVal = 0;
  data.forEach(d => { if(d.value > maxVal) maxVal = d.value; });
  if (maxVal === 0) maxVal = 1;
  
  const barWidth = (width - padding*2) / data.length;
  
  data.forEach((item, i) => {
    const barHeight = (item.value / maxVal) * (height - padding*2 - 20);
    const x = padding + (i * barWidth) + (barWidth * 0.1);
    const y = height - padding - barHeight;
    const w = barWidth * 0.8;
    
    ctx.fillStyle = item.color || '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(x, y, w, barHeight, [4, 4, 0, 0]);
    ctx.fill();
    
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label.substring(0,5), x + w/2, height - padding + 15);
    
    ctx.fillStyle = '#F1F5F9';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(item.value, x + w/2, y - 5);
  });
}

function renderCharts() {
  if (AppState.currentView !== 'dashboard') return;
  const fellows = AppState.fellows;
  const statusColors = {
    'Active': '#10B981', 'Ghosted': '#64748B', 'On Hold': '#F59E0B',
    'Dropped Out': '#EF4444', 'Not Yet Started': '#3B82F6', 'Inactive': '#94A3B8'
  };

  const statusCounts = {};
  fellows.forEach(f => { statusCounts[f.fellowStatus] = (statusCounts[f.fellowStatus] || 0) + 1; });
  const statusData = Object.keys(statusCounts).map(s => ({ label: s, value: statusCounts[s], color: statusColors[s] || '#CBD5E1' }));
  renderDonutChart('statusChart', statusData);
  renderLegend('statusLegend', statusData);

  const activityColors = { 'Active': '#10B981', 'Inactive': '#64748B', 'Not Set Up': '#EF4444', 'Management Restraint': '#F59E0B' };
  const activityCounts = {};
  fellows.forEach(f => { const a = f.clubPageActivity || 'Not Set Up'; activityCounts[a] = (activityCounts[a] || 0) + 1; });
  const activityData = Object.keys(activityCounts).map(a => ({ label: a, value: activityCounts[a], color: activityColors[a] || '#CBD5E1' }));
  renderDonutChart('clubHealthChart', activityData);
  renderLegend('clubHealthLegend', activityData);

  const user = AppState.currentUser;
  if (user && !user.isAdmin) {
    const myFellows = fellows.filter(f => f.pocAssigned === user.name);
    const myStatusCounts = {};
    myFellows.forEach(f => { myStatusCounts[f.fellowStatus] = (myStatusCounts[f.fellowStatus] || 0) + 1; });
    const myStatusData = Object.keys(myStatusCounts).map(s => ({ label: s, value: myStatusCounts[s], color: statusColors[s] || '#CBD5E1' }));
    renderDonutChart('myStatusChart', myStatusData);
    renderLegend('myStatusLegend', myStatusData);
  }
}


function selectUser(name) {
  AppState.selectedTeamUser = TEAM.find(t => t.name === name);
  document.getElementById('passwordSection').classList.remove('hidden');
  document.getElementById('selectedUserName').innerText = name;
  const t = AppState.selectedTeamUser;
  document.getElementById('selectedUserAvatar').innerHTML = renderAvatar(t.name, t.color, 'sm', t.team);
  
  document.querySelectorAll('.team-btn').forEach(btn => btn.classList.remove('team-btn--selected'));
  const btn = document.querySelector(`.team-btn[data-name="${name}"]`);
  if (btn) btn.classList.add('team-btn--selected');
}

function login() {
  const pwd = document.getElementById('loginPassword').value;
  if (!AppState.selectedTeamUser) return;
  
  if (pwd === AppState.selectedTeamUser.password) {
    AppState.currentUser = AppState.selectedTeamUser;
    AppState.currentView = 'dashboard';
    showToast(`Welcome back, ${AppState.currentUser.name}!`, 'success');
    render();
  } else {
    showToast('Incorrect password', 'error');
  }
}

function calculateHealthScore(fellow) {
  let score = 0;
  if (fellow.finalAcceptance === 'Yes') score += 15;
  if (fellow.clubPageLaunched === 'Yes') score += 15;
  if (fellow.clubPageActivity === 'Active') score += 15;
  
  const strikes = (fellow._autoStrikes || []);
  score -= (strikes.length * 10);
  
  return Math.max(0, Math.min(100, 50 + score));
}

function renderHealthScore(score) {
  let color = '#10B981';
  if (score < 50) color = '#EF4444';
  else if (score < 80) color = '#F59E0B';
  return `<span style="color: ${color}; font-weight: bold;">${score}/100</span>`;
}

function logout() {
  AppState.currentUser = null;
  AppState.currentView = 'dashboard';
  showToast('Logged out successfully', 'info');
  render();
}
setTimeout(async () => {
  try {
    await init();
    console.log('Init success');
  } catch(e) {
    console.error('INIT ERROR:', e);
  }
}, 100);
