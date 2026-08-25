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
  'followersCount', 'fellowStatus', 'clubMade', 'clubPageLaunched', 'comments',
  'strike1', 'statusOfStrike1', 'strike2', 'statusOfStrike2', 'strike3',
  'manualHocName', 'manualHocEmail', 'manualHocPhone',
  'manualHooName', 'manualHooEmail', 'manualHooPhone',
  'manualFaName', 'manualFaEmail', 'manualFaPhone',
  'dob', 'tshirt', 'address'
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
  clubPageLaunched: 'Club Page Launched',  strike1: 'Strike 1',
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
  manualFaPhone: 'FA Phone (Manual)',
  dob: 'Date of Birth (FAF)',
  tshirt: 'T-Shirt Size (FAF)',
  address: 'Address (FAF)'
};

const TEAM = [
  { name: 'Christy', color: '#EAB308', password: 'under25christy', isAdmin: true, team: 'Sapphire' },

  { name: 'Arjun', color: '#7C3AED', password: 'under25arjun', team: 'Jade' },
  { name: 'Harsh', color: '#EAB308', password: 'under25harsh', team: 'Sapphire' },
  { name: 'Kasis', color: '#F97316', password: 'under25kasis', team: 'Amber' },
  { name: 'Surya', color: '#F97316', password: 'under25surya', isAdmin: true, team: 'Amber' },
  { name: 'Urvi', color: '#10B981', password: 'under25urvi', team: 'Emerald' },
  { name: 'Vansh', color: '#EAB308', password: 'under25vansh', team: 'Sapphire' },
  { name: 'Kabir', color: '#10B981', password: 'under25kabir', isAdmin: true, team: 'Emerald' },
  { name: 'Ibadat', color: '#A3A3A3', password: 'under25ibadat' }
];

const TEAM_COLORS = {
  'Emerald': { primary: '#10B981', glow: 'rgba(16,185,129,0.4)', gradient: 'linear-gradient(135deg, #10B981, #059669)' },
  'Sapphire': { primary: '#EAB308', glow: 'rgba(234,179,8,0.4)', gradient: 'linear-gradient(135deg, #EAB308, #CA8A04)' },
  'Amber': { primary: '#F97316', glow: 'rgba(249,115,22,0.4)', gradient: 'linear-gradient(135deg, #F97316, #EA580C)' },
  'Jade': { primary: '#7C3AED', glow: 'rgba(124,58,237,0.4)', gradient: 'linear-gradient(135deg, #7C3AED, #6D28D9)' }
};

const INTAKE_OPTIONS = ['Existing', 'August Intake'];

const STATUS_OPTIONS = ['Active', 'Inactive', 'Not Set Up', 'Management Restraint'];
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

const AppState = {
  formFilter: 'all',
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


function mapClubPageActivity(val) {
  if (!val) return 'Not Set Up';
  const s = val.toString().toLowerCase().trim();
  if (s === 'active' || s.includes('launched') && !s.includes('not launched')) return 'Active';
  if (s === 'inactive') return 'Inactive';
  if (s.includes('management') || s.includes('restraint')) return 'Management Restraint';
  if (s.includes('not launched') || s.includes('not set up') || s.includes('credentials') || s.includes('mtf') || s.includes('dp')) return 'Not Set Up';
  
  // fallback for things like 'yes', 'no'
  if (s === 'yes') return 'Active';
  if (s === 'no') return 'Not Set Up';
  
  return 'Not Set Up';
}

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

    reelsPostedWeek1: getIdx('reels posted in week 1'),

    contentPiecesPosted: getIdx('content pieces'),
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
    if (!fellowName || fellowName.toLowerCase() === 'unknown') continue;

    const fellow = {};
    FIELD_KEYS.forEach(key => {
      const idx = map[key];
      if (idx !== undefined && idx !== -1) {
        fellow[key] = row[idx] || '';
      } else {
        fellow[key] = '';
      }
    });
    
    const rawEmail = (fellow.emailId || '').toLowerCase().trim();
    const rawName = (fellow.fellowName || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const rawCol = (fellow.collegeName || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    const str = rawEmail + rawName + rawCol;
    let hash = 0;
    for (let j = 0; j < str.length; j++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(j);
      hash = hash & hash;
    }
    fellow.id = 'f_' + Math.abs(hash);
    result.push(fellow);
  }
  return result;
}

function saveFellows() {
  localStorage.setItem('under25_fellows', JSON.stringify(AppState.fellows));
  // Fire-and-forget sync for all modified fellows (if Supabase is ever turned on)
  // AppState.fellows.forEach(f => syncFellowToSupabase(f));
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
function loadStrikeRecords() { 
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
}
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
  data.id = generateDeterministicId(data.emailId, data.fellowName, data.collegeName);
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
      if (val.includes(',') || val.includes('"') || val.includes('')) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',');
  });
  
  const csvContent = headers + '' + rows.join('');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `under25_fellows_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



const SUPABASE_URL = 'https://ylqerlvtelexijthiuuu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YMPDWgP7LCipfPp-wId45Q_ngK5Slp0';

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
    mergeFafDataOnce();
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
    if (!row[2] || row[2].trim() === '' || row[2].trim().toLowerCase() === 'unknown') continue;
      
      result.push({
        timestamp: row[0] || '',
        email: row[1] || '',
        fullName: row[2] || '',
        phone: row[3] || '',
        instagram: row[4] || '',
        dob: row[5] || '',
        college: row[6] || '',
        city: row[7] || '',
        state: row[8] || '',
        capacity: row[9] || '',
        address: row[10] || '',
        tshirt: row[11] || '',
        hocName: row[12] || '',
        hocEmail: row[13] || '',
        hocPhone: row[14] || '',
        hooName: row[15] || '',
        hooEmail: row[16] || '',
        hooPhone: row[17] || '',
        faName: row[18] || '',
        faEmail: row[19] || '',
        faPhone: row[20] || '',
        photo: row[29] || '',
        video: row[30] || ''
      });
  }
  return result;
}

function saveAcceptances() {
  localStorage.setItem('under25_acceptances', JSON.stringify(AppState.acceptances || []));
}

function loadAcceptancesFromLocal() {
  const data = localStorage.getItem('under25_acceptances');
  if (data) {
    try {
      AppState.acceptances = JSON.parse(data);
    } catch(e) {}
  }
}

async function loadAcceptances() {
  loadAcceptancesFromLocal();
  try {
    const url = 'https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=faf';
    const response = await fetch(url);
    if (!response.ok) throw new Error('FAF sheet not found');
    const csvText = await response.text();
    const parsed = parseAcceptanceCSV(csvText);
    
    let appendedCount = 0;
    if (!AppState.acceptances) AppState.acceptances = [];
    
    parsed.forEach(incoming => {
      const exists = AppState.acceptances.find(a => 
        a.timestamp === incoming.timestamp && 
        a.email === incoming.email && 
        a.fullName === incoming.fullName
      );
      if (!exists) {
        AppState.acceptances.push(incoming);
        appendedCount++;
      }
    });
    
    console.log(`Appended ${appendedCount} new FAF responses from live sheet. Total: ${AppState.acceptances.length}`);
    saveAcceptances();
    

    
    render();
  } catch (err) {
    console.log('Could not load FAF sheet:', err);
  }
}


// =============================================
// UNIFIED MATCHING & ID LOGIC
// =============================================

function generateDeterministicId(email, name, college) {
  const rawEmail = (email || '').toLowerCase().trim();
  const rawName = (name || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const rawCol = (college || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const str = rawEmail + rawName + rawCol;
  let hash = 0;
  for (let j = 0; j < str.length; j++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(j);
    hash = hash & hash;
  }
  return 'f_' + Math.abs(hash);
}

function matchFellow(trackerFellow, externalRecord, extMap) {
  const fEmail = (trackerFellow.emailId || '').toLowerCase().trim();
  const fPhone = String(trackerFellow.whatsappNo || '').replace(/\D/g, '');
  const fName = (trackerFellow.fellowName || '').toLowerCase().trim();
  const fCollege = (trackerFellow.collegeName || '').toLowerCase().trim();

  const extEmail = (externalRecord[extMap.email] || '').toLowerCase().trim();
  const extPhone = String(externalRecord[extMap.phone] || '').replace(/\D/g, '');
  const extName = (externalRecord[extMap.name] || '').toLowerCase().trim();
  const extCollege = (externalRecord[extMap.college] || '').toLowerCase().trim();

  // 1. Exact Email
  if (fEmail && extEmail && fEmail === extEmail) return true;
  // 2. Exact Phone (last 10)
  if (fPhone && extPhone && fPhone.length >= 10 && extPhone.length >= 10 && fPhone.slice(-10) === extPhone.slice(-10)) return true;
  // 3. Name & College Partial
  if (fName && extName && fCollege && extCollege) {
    const fParts = fName.split(' ').filter(x => x.length > 2);
    const extParts = extName.split(' ').filter(x => x.length > 2);
    const nameOverlaps = fParts.some(p => extName.includes(p)) || extParts.some(p => fName.includes(p));

    const fColParts = fCollege.split(' ').filter(x => x.length > 3 && !['college', 'university', 'institute'].includes(x));
    const extColParts = extCollege.split(' ').filter(x => x.length > 3 && !['college', 'university', 'institute'].includes(x));
    const colOverlaps = fColParts.some(p => extCollege.includes(p)) || extColParts.some(p => fCollege.includes(p)) || fCollege.includes(extCollege) || extCollege.includes(fCollege);

    if (nameOverlaps && colOverlaps) return true;
  }
  return false;
}

function findAlumniForFellow(fellow) {
  if (!AppState.nominations || !AppState.nominations.length) return null;
  return AppState.nominations.find(n => matchFellow(fellow, n, {
    email: 'nominatedFellowEmail',
    phone: 'nominatedFellowPhone',
    name: 'nominatedFellowName',
    college: 'alumniCollege'
  })) || null;
}

function findAcceptanceForFellow(fellow, force = false) {
  if (!force && fellow.finalAcceptance !== 'Yes') return null;
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
    
    // 1. Exact Email Match
    if (fEmail && fafEmail && fEmail === fafEmail) return true;
    
    // 2. Exact Phone Match (last 10 digits)
    if (fPhone && fafPhone && fPhone.length >= 10 && fafPhone.length >= 10 && fPhone.slice(-10) === fafPhone.slice(-10)) return true;
    
    // 3. Name & College Match
    if (fName && fafName && fCollege && fafCollege) {
      if (fName === fafName && fCollege === fafCollege) return true;
      
      const fNameWords = fName.split(/[^a-z0-9]/).filter(w => w.length > 2);
      const fafNameWords = fafName.split(/[^a-z0-9]/).filter(w => w.length > 2);
      const nameWordOverlap = fNameWords.some(w => fafNameWords.includes(w)) || fafNameWords.some(w => fNameWords.includes(w));
      
      const fColWords = fCollege.split(/[^a-z0-9]/).filter(w => w.length > 3);
      const fafColWords = fafCollege.split(/[^a-z0-9]/).filter(w => w.length > 3);
      const colOverlap = fColWords.some(w => fafColWords.includes(w)) || fafColWords.some(w => fColWords.includes(w));
      
      if (nameWordOverlap && colOverlap) return true;
    }
    return false;
  }) || null;
}

function renderStatCard(icon, value, label, variant = 'info') {
  return `
    <div class="stat-card stat-card--${variant}">
      <div class="stat-card__icon">${icon}</div>
      <div class="stat-card__value">${value}</div>
      <div class="stat-card__label">${label}</div>
    </div>
  `;
}

function renderBadge(text, customVariant) {
  let variant = 'info';
  
  if (customVariant) {
    variant = customVariant;
  } else {
    const t = (text || '').trim();
    if (t === 'Active' || t === 'Yes') variant = 'active'; // map to badge--active CSS
    else if (t === 'Ghosted') variant = 'ghosted';
    else if (t === 'On Hold') variant = 'on-hold';
    else if (t === 'Dropped Out') variant = 'dropped';
    else if (t === 'Inactive' || t === 'No') variant = 'inactive';
    else if (t === 'Not Yet Started') variant = 'not-started';
    else if (t === 'Scheduled') variant = 'scheduled';
    else if (t === 'Management Restraint') variant = 'management';
    
    // For general yes/no
    if (t === 'Yes') variant = 'yes';
    if (t === 'No') variant = 'no';
  }
  
  return `<span class="badge badge--${variant}">${escapeHTML(text || 'N/A')}</span>`;
}

function renderAvatar(name, color, size = 'sm', teamName = null) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const hasPhoto = ['Arjun', 'Christy', 'Harsh', 'Ibadat', 'Kabir', 'Kasis', 'Surya', 'Urvi', 'Vansh'].includes(name);
  const teamClass = teamName ? ` team-ring--${teamName.toLowerCase()}
` : '';
  if (hasPhoto) {
    return `<div class="avatar avatar--${size}${teamClass}" style="background-image: url('team%20photos/${name.toLowerCase()}.png'); background-size: cover; background-position: center;"></div>`;
  }
  return `<div class="avatar avatar--${size}${teamClass}" style="background-color: ${color}">${initial}</div>`;
}
function calculateHealthScore(fellow) {
  let score = 0;
  if (fellow.finalAcceptance === 'Yes') score += 15;
  
  if (fellow.clubPageActivity === 'Active') score += 15;
  if (fellow.clubPageLaunched === 'Yes') score += 15;
  
  if (parseInt(fellow.reelsPostedWeek1) > 0) score += 10;
  if (parseInt(fellow.contentPiecesPosted) > 0 || fellow.contentPiecesPosted === '1-5' || fellow.contentPiecesPosted === '5-10') score += 10;
  
  // Penalty for strikes
  const strikeRec = AppState.strikeRecords.find(r => r.fellowId === fellow.id);
  if (!strikeRec || strikeRec.strikes.filter(s => !s.removed).length === 0) score += 5;
  return Math.min(score, 100);
}

function renderHealthScore(score) {
  const color = score >= 70 ? '#10B981' : score >= 40 ? '#EAB308' : '#EF4444';
  return `<div class="health-ring" style="--health-color:${color};--health-pct:${score}%" title="Health: ${score}%"><span>${score}</span></div>`;
}

// =============================================
// SECTION 8: VIEWS (Login, Dashboard, Fellows, Strikes, Forms, Instagram)
// =============================================

async function renderLogin() {
  try {
    const teamRes = await fetch('https://ylqerlvtelexijthiuuu.supabase.co/rest/v1/team_users?select=*', {
      headers: { 'apikey': 'sb_publishable_YMPDWgP7LCipfPp-wId45Q_ngK5Slp0', 'Authorization': 'Bearer sb_publishable_YMPDWgP7LCipfPp-wId45Q_ngK5Slp0' }
    });
    if (teamRes.ok) {
      const dbTeam = await teamRes.json();
      if (dbTeam.length > 0) {
        TEAM.length = 0;
        dbTeam.forEach(t => TEAM.push({
          name: t.name,
          password: t.password,
          color: t.color,
          team: t.team,
          isAdmin: ['Christy', 'Kabir', 'Surya'].includes(t.name)
        }));
      }
    }
  } catch(e) { console.error('Failed to load team', e); }
  
  const teamHTML = TEAM.map(t => `
    <div class="team-btn" data-name="${t.name}">
      ${renderAvatar(t.name, t.color, 'lg', t.team)}
      <div>${t.name}</div>
      ${AppState.currentUser.isAdmin ? `<div style="font-size:10px; color:#EF4444; margin-top:4px;">${t.password}</div>` : ''}
    </div>
  `).join('');
  
  const html = `
    <div class="login-container">
      <div class="login-card fade-in">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="team%20photos/logo.png" alt="Under25" style="max-width: 180px;" />
        </div>
        <h2 style="text-align:center; margin-bottom:20px; color:#F1F5F9; font-size: 1.3rem;">Fellowship Tracking Dashboard</h2>
        <div class="login-subtitle" style="text-align:center; margin-bottom: 1.5rem; color:#94A3B8;">Select your profile to continue</div>
        
        <div class="team-grid" id="loginTeamGrid">
          ${teamHTML}
        </div>
        
        <div class="password-section hidden" id="passwordSection">
          <div class="flex flex-center" style="margin-bottom: 1rem; gap: 10px;">
            <div id="selectedUserAvatar"></div>
            <h3 id="selectedUserName" style="margin: 0"></h3>
          </div>
          <div class="form-group">
            <input type="password" id="loginPassword" class="form-input" placeholder="Enter password" />
          </div>
          <div class="flex" style="gap: 10px; align-items: center;">
    <div style="display:flex; align-items:center; gap:8px; margin-right:15px; padding-right:15px; border-right:1px solid rgba(148,163,184,0.2);">
      ${renderAvatar(AppState.currentUser.name, AppState.currentUser.color, 'sm', AppState.currentUser.team)}
      <span style="color:#F1F5F9;font-weight:600;font-size:14px;">${AppState.currentUser.name}</span>
    </div>
            <button class="btn btn--ghost" id="btnCancelLogin" style="flex: 1">Cancel</button>
            <button class="btn btn--primary login-btn" id="btnSubmitLogin" style="flex: 2">Login</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('app').innerHTML = html;
  
  // Bind Login Events
  let selectedUser = null;
  const grid = document.getElementById('loginTeamGrid');
  const passSec = document.getElementById('passwordSection');
  const passInput = document.getElementById('loginPassword');
  
  document.querySelectorAll('.team-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.team-btn').forEach(b => b.classList.remove('team-btn--selected'));
      btn.classList.add('team-btn--selected');
      selectedUser = btn.dataset.name;
      
      const teamMember = TEAM.find(t => t.name === selectedUser);
      document.getElementById('selectedUserAvatar').innerHTML = renderAvatar(teamMember.name, teamMember.color, 'sm', teamMember.team);
      document.getElementById('selectedUserName').innerText = teamMember.name;
      
      grid.style.display = 'none';
      passSec.classList.remove('hidden');
      passInput.focus();
    });
  });
  
  document.getElementById('btnCancelLogin').addEventListener('click', () => {
    selectedUser = null;
    passSec.classList.add('hidden');
    grid.style.display = 'grid';
    passInput.value = '';
    document.querySelectorAll('.team-btn').forEach(b => b.classList.remove('team-btn--selected'));
  });
  
  document.getElementById('btnSubmitLogin').addEventListener('click', () => {
    if (selectedUser && passInput.value) {
      login(selectedUser, passInput.value);
    }
  });
  
  passInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && selectedUser && passInput.value) {
      login(selectedUser, passInput.value);
    }
  });
}
function renderDashboard() {
  const fellows = AppState.fellows;
  const user = AppState.currentUser;
  const isAdmin = user && user.isAdmin;
  const POCS = TEAM.filter(t => !t.isAdmin);
  const total = fellows.length;
  const active = fellows.filter(f => f.fellowStatus === 'Active').length;
  const ghosted = fellows.filter(f => f.fellowStatus === 'Ghosted').length;
  const onHold = fellows.filter(f => f.fellowStatus === 'On Hold').length;
  const dropped = fellows.filter(f => f.fellowStatus === 'Dropped Out').length;
  const nys = fellows.filter(f => f.fellowStatus === 'Not Yet Started').length;
  const withStrikes = fellows.filter(f => f._autoStrikes && f._autoStrikes.length > 0).length;
  const twoStrikes = fellows.filter(f => f._autoStrikes && f._autoStrikes.length >= 2).length;
  

  // City distribution
  const cityMap = {};
  fellows.forEach(f => { const c = (f.city || 'Unknown').trim(); cityMap[c] = (cityMap[c] || 0) + 1; });
  const topCities = Object.entries(cityMap).sort((a,b) => b[1]-a[1]).slice(0,10);
  const mostActiveCity = topCities[0] ? topCities[0][0] : 'N/A';

  // POC stats (exclude admins)
  const pocStats = {};
  POCS.forEach(p => { pocStats[p.name] = { total: 0, active: 0, ghosted: 0, color: p.color }; });
  fellows.forEach(f => {
    if (pocStats[f.pocAssigned]) {
      pocStats[f.pocAssigned].total++;
      if (f.fellowStatus === 'Active') pocStats[f.pocAssigned].active++;
      if (f.fellowStatus === 'Ghosted') pocStats[f.pocAssigned].ghosted++;
    }
  });

  const mostGhostedPOC = POCS.map(p => ({ name: p.name, g: pocStats[p.name].ghosted })).sort((a,b) => b.g-a.g)[0];
  const topFollower = fellows.filter(f => parseInt(f.followersCount) > 0).sort((a,b) => parseInt(b.followersCount||0)-parseInt(a.followersCount||0))[0];
  const perfectPOCs = POCS.filter(p => pocStats[p.name].total > 0 && pocStats[p.name].ghosted === 0).map(p => p.name);

  // My fellows
  const myFellows = (!isAdmin && user) ? fellows.filter(f => f.pocAssigned === user.name) : [];
  const myTotal = myFellows.length;
  const myActive = myFellows.filter(f => f.fellowStatus === 'Active').length;
  const myGhosted = myFellows.filter(f => f.fellowStatus === 'Ghosted').length;
  const myStrikes = myFellows.filter(f => f._autoStrikes && f._autoStrikes.length > 0).length;
  const myLaunched = myFellows.filter(f => f.clubPageLaunched === 'Yes').length;
  
  const myActiveRate = myTotal > 0 ? Math.round((myActive/myTotal)*100) : 0;
  const allActiveRate = total > 0 ? Math.round((active/total)*100) : 0;
  const myAtRisk = myFellows.filter(f => 
  f.fellowStatus === 'Ghosted' || 
  f.fellowStatus === 'On Hold' || 
  f.clubPageActivity === 'Management Restraint' || 
  f.clubPageActivity === 'Inactive' || 
  f.clubPageActivity === 'Not Set Up' || 
  f.finalAcceptance !== 'Yes' || 
  (f._autoStrikes && f._autoStrikes.length > 0)
);

  // Recent activity
  const recentChanges = AppState.changeLog.slice(0, 5).map(log => {
    const fellow = fellows.find(f => f.id === log.fellowId);
    const acc = fellow ? (typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(fellow, true) : null) : null;
    let fname = fellow ? ((acc && acc.fullName) || fellow.fellowName || 'Unknown') : 'Unknown';
    if (fname.toLowerCase() === 'unknown' || fname === 'N/A' || fname === '') fname = 'Unknown';
    const fieldLabel = FIELD_LABELS[log.field] || log.field;
    const userColor = (TEAM.find(t => t.name === log.user) || {}).color || '#7C3AED';
    return `<div style="padding:12px;border-bottom:1px solid rgba(148,163,184,0.1);font-size:0.85rem;display:flex;gap:12px;align-items:flex-start;">`+
      `<div style="width:30px;height:30px;border-radius:50%;background:${userColor};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0;">${escapeHTML((log.user || '?')[0])}</div>`+
      `<div><span style="color:#F1F5F9;font-weight:600;">${escapeHTML(log.user)}</span> updated <em style="color:#A78BFA;">${escapeHTML(fname)}</em>'s <strong style="color:#94A3B8;">${escapeHTML(fieldLabel)}</strong>`+
      `<div style="margin-top:4px;"><span style="color:#EF4444;text-decoration:line-through;">${escapeHTML(log.oldValue||'empty')}</span> → <span style="color:#10B981;">${escapeHTML(log.newValue||'empty')}</span></div>`+
      `<div style="font-size:0.75rem;color:#64748B;margin-top:2px;">${new Date(log.timestamp).toLocaleString()}</div></div></div>`;
  }).join('');

  const milestones = [
    { label: 'Club Made', field: 'clubMade' },
    
    
    
    { label: 'Final Acceptance', field: 'finalAcceptance' },
  ];

  const mCard = (icon, val, lbl, color) =>
    `<div class="card" style="text-align:center;padding:14px 8px;border-top:3px solid ${color};">`+
    `<div style="font-size:1.4rem;">${icon}</div>`+
    `<div style="font-size:1.7rem;font-weight:800;color:${color};line-height:1.2;">${val}</div>`+
    `<div style="font-size:10px;color:#64748B;margin-top:2px;text-transform:uppercase;letter-spacing:0.5px;">${lbl}</div></div>`;

  const iCard = (icon, title, val, sub, color) =>
    `<div class="card" style="padding:14px;display:flex;gap:12px;align-items:center;">`+
    `<div style="width:40px;height:40px;border-radius:10px;background:${color}20;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">${icon}</div>`+
    `<div style="min-width:0;"><div style="font-size:10px;color:#64748B;text-transform:uppercase;letter-spacing:0.5px;">${title}</div>`+
    `<div style="font-size:13px;font-weight:700;color:#F1F5F9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHTML(String(val))}</div>`+
    `<div style="font-size:11px;color:${color};">${escapeHTML(String(sub))}</div></div></div>`;

  return `
    <div class="fade-in" style="padding-bottom:40px;">
      <!-- 3-Strike Alert -->
      ${fellows.filter(f => getActiveStrikeCount(f.id) >= 3).length > 0 ? `
        <div class="card" style="border: 2px solid #EF4444; margin-bottom: 20px; background: rgba(239, 68, 68, 0.1);">
          <div class="card-body" style="padding: 16px;">
            <div style="display: flex; gap: 12px; align-items: flex-start;">
              <div style="font-size: 1.5rem;">🚨</div>
              <div>
                <h3 style="color: #EF4444; margin: 0 0 8px 0; font-size: 1.1rem;">Fellows with 3+ Strikes (Action Required)</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${fellows.filter(f => getActiveStrikeCount(f.id) >= 3).map(f => `
                    <button onclick="renderFellowProfile('${f.id}')" class="btn btn--sm" style="background: rgba(239, 68, 68, 0.2); color: #EF4444; border: 1px solid #EF4444;">
                      ${escapeHTML(f.fellowName)}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}


      ${AppState.currentUser && AppState.currentUser.isAdmin ? `
        <div class="card" style="margin-top: 12px; margin-bottom: 24px; border: 1px solid rgba(245, 158, 11, 0.3);">
          <div class="card-header" style="background: rgba(245, 158, 11, 0.1);">
            <h2 class="card-title" style="color: #F59E0B; display: flex; align-items: center; gap: 8px;">🛡️ Admin: Team Passwords</h2>
          </div>
          <div class="card-body">
            <table class="data-table">
              <thead><tr><th style="text-align:left;">POC Name</th><th style="text-align:left;">Password</th><th style="text-align:left;">Team</th></tr></thead>
              <tbody>
                ${TEAM.map(t => `
                  <tr>
                    <td><strong>${escapeHTML(t.name)}</strong></td>
                    <td style="font-family: monospace; color: #F59E0B; font-size: 14px;">${escapeHTML(t.password)}</td>
                    <td><span class="badge" style="background:${t.color}22; color:${t.color}">${escapeHTML(t.team)}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <header class="page-header" style="margin-bottom:20px;">
        <div>
          <h1 class="page-title">📊 All Fellows Overview</h1>
          <p class="page-subtitle">Live metrics across all ${total} fellows · Auto-updates from Google Sheets</p>
        </div>
      </header>

      <!-- 6 stat cards -->
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:16px;">
        ${mCard('👥', total, 'Total', '#7C3AED')}
        ${mCard('✅', active, 'Active', '#10B981')}
        ${mCard('👻', ghosted, 'Ghosted', '#64748B')}
        ${mCard('⏸', onHold, 'On Hold', '#F59E0B')}
        ${mCard('❌', dropped, 'Dropped', '#EF4444')}
        ${mCard('🆕', nys, 'Not Started', '#3B82F6')}
      </div>

      <!-- 6 insight cards -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px;">
        ${iCard('🔥','Top City', mostActiveCity, (cityMap[mostActiveCity]||0)+' fellows', '#F59E0B')}
        ${iCard('⚠️','Most Ghosted POC', mostGhostedPOC ? mostGhostedPOC.name : 'N/A', mostGhostedPOC ? mostGhostedPOC.g+' ghosted' : '', '#EF4444')}
        ${iCard('📸','Top IG Club', topFollower ? topFollower.collegeName : 'No data', topFollower ? parseInt(topFollower.followersCount||0).toLocaleString()+' followers' : '', '#EC4899')}
        ${iCard('🚨','At Risk (2 Strikes)', twoStrikes+' fellows', 'Need immediate attention', '#EF4444')}
        ${iCard('🏆','Zero-Ghost POCs', perfectPOCs.length > 0 ? perfectPOCs.join(', ') : 'None yet', '100% active rate', '#7C3AED')}
      </div>

      <!-- Charts row 1 -->
      <!-- Charts row 1 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Fellow Status Breakdown</h3></div>
          <div class="card-body" style="padding:16px;">
            <canvas id="statusChart" width="380" height="200"></canvas>
            <div id="statusLegend" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;justify-content:center;"></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Top Cities by Fellows</h3></div>
          <div class="card-body" style="padding:16px;">
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${Object.entries(cityMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c, count]) => {
                const pct = total > 0 ? Math.round((count/total)*100) : 0;
                return `<div>
                  <div style="display:flex;justify-content:space-between;font-size:12px;color:#F1F5F9;margin-bottom:3px;">
                    <span>${escapeHTML(c)}</span><span style="color:#64748B;">${count}</span>
                  </div>
                  <div style="height:6px;background:rgba(148,163,184,0.1);border-radius:3px;overflow:hidden;">
                    <div style="height:100%;background:#3B82F6;width:${pct}%"></div>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Charts row 2 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
        <div class="card">
          <div class="card-header"><h3 class="card-title">POC Performance (Active vs Ghosted)</h3></div>
          <div class="card-body" style="padding:16px;">
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${POCS.map(p => {
                const s = pocStats[p.name];
                const aW = s.total > 0 ? Math.round((s.active/s.total)*100) : 0;
                const gW = s.total > 0 ? Math.round((s.ghosted/s.total)*100) : 0;
                return `<div>`+
                  `<div style="display:flex;justify-content:space-between;margin-bottom:3px;">`+
                  `<span style="font-size:12px;color:#F1F5F9;font-weight:600;">${escapeHTML(p.name)}</span>`+
                  `<span style="font-size:10px;color:#64748B;">${s.total} total · ${s.active} active · ${s.ghosted} ghosted</span></div>`+
                  `<div style="display:flex;height:12px;border-radius:6px;overflow:hidden;background:rgba(148,163,184,0.1);">`+
                  `<div style="width:${aW}%;background:#10B981;"></div>`+
                  `<div style="width:${gW}%;background:#64748B;"></div></div></div>`;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Club Page Health</h3></div>
          <div class="card-body" style="padding:16px;">
            <canvas id="clubHealthChart" width="380" height="180"></canvas>
            <div id="clubHealthLegend" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;justify-content:center;"></div>
          </div>
        </div>
      </div>

      <!-- Charts row 3 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Milestone Completion Rates</h3></div>
          <div class="card-body" style="padding:16px;">
            <div style="display:flex;flex-direction:column;gap:10px;">
              ${milestones.map(m => {
                const count = fellows.filter(f => f[m.field] === 'Yes').length;
                const pct = total > 0 ? Math.round((count/total)*100) : 0;
                const color = pct >= 75 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444';
                return `<div style="display:flex;align-items:center;gap:8px;">`+
                  `<div style="width:115px;font-size:11px;color:#94A3B8;flex-shrink:0;">${m.label}</div>`+
                  `<div style="flex:1;background:rgba(148,163,184,0.1);border-radius:4px;height:16px;overflow:hidden;">`+
                  `<div style="width:${pct}%;background:${color};height:100%;border-radius:4px;display:flex;align-items:center;padding-left:5px;font-size:9px;color:white;font-weight:700;">${pct}%</div></div>`+
                  `<div style="font-size:10px;color:#64748B;width:45px;">${count}/${total}</div></div>`;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Recent Activity</h3></div>
          <div class="card-body" style="padding:0;max-height:260px;overflow-y:auto;">
            ${recentChanges || '<div style="padding:20px;text-align:center;color:#94A3B8;">No recent activity</div>'}
          </div>
        </div>
      </div>

      ${true ? `
      <!-- MY FELLOWS SECTION -->
      <div style="border-top:2px solid rgba(124,58,237,0.3);padding-top:28px;">
        <header style="margin-bottom:20px;">
          <h2 style="font-size:1.4rem;font-weight:800;color:#F1F5F9;margin:0;">👤 My Fellows — ${escapeHTML(user.name)}</h2>
          <p style="color:#64748B;margin-top:4px;font-size:0.9rem;">Your personal performance overview</p>
        </header>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:16px;">
          ${mCard('👥', myTotal, 'My Total', '#7C3AED')}
          ${mCard('✅', myActive, 'My Active', '#10B981')}
          ${mCard('👻', myGhosted, 'My Ghosted', '#64748B')}
          ${mCard('⚡', myStrikes, 'With Strikes', '#F59E0B')}
          ${mCard('🚀', myLaunched, 'Pages Live', '#3B82F6')}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
          <div class="card">
            <div class="card-header"><h3 class="card-title">My Active Rate vs Team</h3></div>
            <div class="card-body" style="padding:16px;">
              <div style="display:flex;flex-direction:column;gap:12px;">
                <div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="font-size:12px;color:#F1F5F9;font-weight:600;">My Rate</span>
                    <span style="font-size:12px;color:#10B981;font-weight:700;">${myActiveRate}%</span>
                  </div>
                  <div style="background:rgba(148,163,184,0.1);border-radius:6px;height:18px;overflow:hidden;">
                    <div style="width:${myActiveRate}%;background:${myActiveRate >= allActiveRate ? '#10B981' : '#F59E0B'};height:100%;border-radius:6px;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
                    <span style="font-size:12px;color:#94A3B8;">Team Average</span>
                    <span style="font-size:12px;color:#94A3B8;font-weight:700;">${allActiveRate}%</span>
                  </div>
                  <div style="background:rgba(148,163,184,0.1);border-radius:6px;height:18px;overflow:hidden;">
                    <div style="width:${allActiveRate}%;background:#7C3AED;height:100%;border-radius:6px;"></div>
                  </div>
                </div>
                <div style="text-align:center;padding:8px;border-radius:8px;background:${myActiveRate >= allActiveRate ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)'};font-size:12px;color:${myActiveRate >= allActiveRate ? '#10B981' : '#F59E0B'};font-weight:600;">
                  ${myActiveRate >= allActiveRate ? '🏆 Above team average!' : '📈 Room to improve'}
                </div>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><h3 class="card-title">My Fellows Status</h3></div>
            <div class="card-body" style="padding:16px;">
              <canvas id="myStatusChart" width="300" height="160"></canvas>
              <div id="myStatusLegend" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;justify-content:center;"></div>
            </div>
          </div>
        </div>
        ${myAtRisk.length > 0 ?
          `<div class="card" style="border:1px solid rgba(239,68,68,0.3);">`+
          `<div class="card-header" style="background:rgba(239,68,68,0.05);"><h3 class="card-title" style="color:#EF4444;">🚨 Fellows Needing Attention</h3></div>`+
          `<div class="card-body" style="padding:12px;"><div style="display:flex;flex-direction:column;gap:8px;">`+
          myAtRisk.map(f => {
    let reasons = [];
    if(f.clubPageActivity === 'Management Restraint') reasons.push('Management Restraint');
    if(f.clubPageActivity === 'Not Set Up') reasons.push('Page not set up');
    if(f.clubPageActivity === 'Inactive') reasons.push('Page inactive');
    if(f._autoStrikes && f._autoStrikes.length > 0) reasons.push(f._autoStrikes.length + ' Strikes');
    if(f.fellowStatus === 'Ghosted') reasons.push('Ghosted');
    if(f.fellowStatus === 'On Hold') reasons.push('On Hold');
    if(f.finalAcceptance !== 'Yes') reasons.push('Missing forms');
    if(reasons.length === 0) reasons.push('Needs attention');

    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:rgba(239,68,68,0.05);border-radius:8px;cursor:pointer;" onclick="renderFellowProfile('${f.id}')">
      <div>
        <div style="font-size:13px;color:#F1F5F9;font-weight:600;">${escapeHTML(f.fellowName)}</div>
        <div style="font-size:11px;color:#64748B;">${escapeHTML(f.collegeName)}</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;">
        ${reasons.map(r => `<span style="background:rgba(239,68,68,0.2);color:#EF4444;padding:2px 7px;border-radius:4px;font-size:11px;white-space:nowrap;">${r}</span>`).join('')}
      </div>
    </div>`;
  }).join('')+
          `</div></div></div>` :
          `<div class="card" style="border:1px solid rgba(16,185,129,0.3);"><div class="card-body" style="text-align:center;padding:20px;color:#10B981;font-weight:600;">🎉 All your fellows are in good standing!</div></div>`
        }
      </div>
      ` : ''}
    </div>
  `;
}

function getFilteredFellows(overridePoc = null) {
  let filtered = [...AppState.fellows].filter(f => {
    const fn = (f.fellowName || '').trim().toLowerCase();
    const fa = (findAcceptanceForFellow(f)?.fullName || '').trim().toLowerCase();
    // Don't filter out legitimate fellows just because their name is currently blank!
    return fn !== 'unknown' && fn !== '?' && fn !== '' && fn !== 'n/a';
  });
  
  const pocToMatch = overridePoc || AppState.filterPOC;
  if (pocToMatch !== 'all') {
    filtered = filtered.filter(f => f.pocAssigned === pocToMatch);
  }
  
  if (AppState.filterStatus !== 'all') {
    filtered = filtered.filter(f => f.fellowStatus === AppState.filterStatus);
  }

  if (AppState.filterCity !== 'all') {
    filtered = filtered.filter(f => f.city === AppState.filterCity);
  }
  if (AppState.filterActivity !== 'all') {
    filtered = filtered.filter(f => f.clubPageActivity === AppState.filterActivity);
  }
  if (AppState.filterLaunched && AppState.filterLaunched !== 'all') {
    filtered = filtered.filter(f => f.clubPageLaunched === AppState.filterLaunched);
  }
  if (AppState.filterLaunched && AppState.filterLaunched !== 'all') {
    filtered = filtered.filter(f => f.clubPageLaunched === AppState.filterLaunched);
  }
  
  if (AppState.searchQuery) {
    const q = AppState.searchQuery.toLowerCase();
    filtered = filtered.filter(f => 
      (f.collegeName && f.collegeName.toLowerCase().includes(q)) ||
      (f.fellowName && f.fellowName.toLowerCase().includes(q)) ||
      (f.city && f.city.toLowerCase().includes(q))
    );
  }
  
  // Sort
  filtered.sort((a, b) => {
    let valA = a[AppState.sortField] || '';
    let valB = b[AppState.sortField] || '';
    if (valA < valB) return AppState.sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return AppState.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  return filtered;
}

function renderFilterBar(isMyFellows = false) {
  const uniqueCities = [...new Set(AppState.fellows.map(f => f.city).filter(Boolean))].sort();
  const cityOptions = ['all', ...uniqueCities].map(c => `<option value="${escapeHTML(c)}" ${AppState.filterCity === c ? 'selected' : ''}>${c === 'all' ? 'All Cities' : escapeHTML(c)}</option>`).join('');
  const activityOptionsList = ['all', ...ACTIVITY_OPTIONS].map(a => `<option value="${escapeHTML(a)}" ${AppState.filterActivity === a ? 'selected' : ''}>${a === 'all' ? 'All Activities' : a}</option>`).join('');
  const launchedOptionsList = ['all', 'Yes', 'No'].map(l => `<option value="${escapeHTML(l)}" ${AppState.filterLaunched === l ? 'selected' : ''}>${l === 'all' ? 'All Form Status' : l}</option>`).join('');
  
  const pocOptions = ['all', ...TEAM.filter(t=>!t.isAdmin).map(t=>t.name)]
    .map(poc => `<option value="${escapeHTML(poc)}" ${AppState.filterPOC === poc ? 'selected' : ''}>${poc === 'all' ? 'All POCs' : poc}</option>`)
    .join('');
    
  const statusOptions = ['all', ...STATUS_OPTIONS]
    .map(st => `<option value="${escapeHTML(st)}" ${AppState.filterStatus === st ? 'selected' : ''}>${st === 'all' ? 'All Statuses' : st}</option>`)
    .join('');

  return `
    <div class="card" style="margin-bottom: 1rem;">
      <div class="card-body">
        <div class="search-bar" style="margin-bottom: 1rem;">
          <span class="search-bar__icon">🔍</span>
          <input type="text" class="search-bar__input" id="searchFellows" placeholder="Search by college, name, or city..." value="${escapeHTML(AppState.searchQuery)}">
        </div>
        
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          ${!isMyFellows ? `
          <div style="flex: 1; min-width: 140px;">
            <label style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary); display: block; margin-bottom: 4px;">POC:</label>
            <select class="form-select" style="padding: 6px 10px; font-size: 13px;" data-filter-type="poc">${pocOptions}</select>
          </div>
          ` : ''}
          <div style="flex: 1; min-width: 140px;">
            <label style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary); display: block; margin-bottom: 4px;">Status:</label>
            <select class="form-select" style="padding: 6px 10px; font-size: 13px;" data-filter-type="status">${statusOptions}</select>
          </div>
          <div style="flex: 1; min-width: 140px;">
            <label style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary); display: block; margin-bottom: 4px;">Location (City):</label>
            <select class="form-select" style="padding: 6px 10px; font-size: 13px;" data-filter-type="city">${cityOptions}</select>
          </div>
          <div style="flex: 1; min-width: 140px;">
            <label style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary); display: block; margin-bottom: 4px;">Club Activity:</label>
            <select class="form-select" style="padding: 6px 10px; font-size: 13px;" data-filter-type="activity">${activityOptionsList}</select>
          </div>
          <div style="flex: 1; min-width: 140px;">
            <label style="font-size: 0.8rem; font-weight: bold; color: var(--text-secondary); display: block; margin-bottom: 4px;">Club Page Launched:</label>
            <select class="form-select" style="padding: 6px 10px; font-size: 13px;" data-filter-type="launched">${launchedOptionsList}</select>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMyFellows() {
  const myFellows = getFilteredFellows(AppState.currentUser.name);
  
  if (typeof AppState.myFellowsViewMode === 'undefined') {
    AppState.myFellowsViewMode = 'grid';
  }
  
  let contentHtml = '';
  
  if (AppState.myFellowsViewMode === 'sheet') {
    const tableRows = myFellows.map(f => {
      const autoStrikes = (f._autoStrikes || []).map(s => `<span class="strike-dot strike-dot--${s.severity}" title="${s.reason}"></span>`).join('');
      const manual1 = f.strike1 && f.strike1 !== 'N/A' && f.strike1 !== '' ? `<span class="strike-dot strike-dot--danger" title="${f.strike1}"></span>` : '';
      const manual2 = f.strike2 && f.strike2 !== 'N/A' && f.strike2 !== '' ? `<span class="strike-dot strike-dot--danger" title="${f.strike2}"></span>` : '';
      
      const canEdit = AppState.currentUser.isAdmin || AppState.currentUser.name === f.pocAssigned;
      const editableClass = canEdit ? 'editable' : '';
      
      return `
        <tr>
          <td>
            <a href="#" class="fellow-name-link truncate" data-id="${f.id}" style="max-width: 200px; display:inline-block; color:#A78BFA; text-decoration:none; font-weight:600; cursor:pointer;" title="${escapeHTML(f.collegeName)}">${escapeHTML(f.collegeName)}</a>
          </td>
          <td class="${editableClass}" data-id="${f.id}" data-field="city">${escapeHTML(f.city)}</td>
          <td class="${editableClass}" data-id="${f.id}" data-field="pocAssigned">${escapeHTML(f.pocAssigned)}</td>
          <td><a href="#" class="fellow-name-link" data-id="${f.id}" style="color:#A78BFA; text-decoration:none; font-weight:600; cursor:pointer;">#${f.displayId || '000'} - ${escapeHTML(f.fellowName)} ${renderStrikeDots(f.id)}</a> ${f.intakeStatus ? `<span class="intake-badge--${f.intakeStatus === 'August Intake' ? 'august' : 'existing'}" style="margin-left:8px">${f.intakeStatus === 'August Intake' ? 'Aug Intake' : 'Existing'}</span>` : ""}</td>
          <td class="${editableClass}" data-id="${f.id}" data-field="fellowStatus">${renderBadge(f.fellowStatus)}</td>
          <td class="${editableClass}" data-id="${f.id}" data-field="clubPageActivity">${renderBadge(f.clubPageActivity)}</td>
          <td class="${editableClass}" data-id="${f.id}" data-field="finalAcceptance">${renderBadge(f.finalAcceptance)}</td>
          <td class="${editableClass}" data-id="${f.id}" data-field="clubPageLaunched">${renderBadge(f.clubPageLaunched)}</td>
          
          
          <td>
            ${canEdit ? `<button class="btn btn--icon btn-edit-full" data-id="${f.id}">✏️</button>` : `<button class="btn btn--icon btn-view-profile" data-id="${f.id}">👁️</button>`}
            ${canEdit ? `<button class="btn btn--icon text-danger btn-delete" data-id="${f.id}">🗑️</button>` : ''}
          </td>
        </tr>
      `;
    }).join('');

    contentHtml = `
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th data-sort="collegeName">College Name ${AppState.sortField === 'collegeName' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="city">City ${AppState.sortField === 'city' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="pocAssigned">POC ${AppState.sortField === 'pocAssigned' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="fellowName">Fellow ${AppState.sortField === 'fellowName' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="fellowStatus">Status ${AppState.sortField === 'fellowStatus' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="clubPageActivity">Activity ${AppState.sortField === 'clubPageActivity' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="finalAcceptance">Form ${AppState.sortField === 'finalAcceptance' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              
              <th>Strikes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.length > 0 ? tableRows : '<tr><td colspan="10" style="text-align:center; padding: 2rem;">No fellows found.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  } else {
    const cardsHtml = myFellows.map(f => {
      const photoUrl = f.photoUrl || null; const displayName = f.fellowName || 'Unknown'; const displayCollege = f.collegeName || 'Unknown';
      
      const teamColor = TEAM_COLORS[f.team]?.primary || '#7C3AED';
      const poc = TEAM.find(t => t.name === f.pocAssigned) || TEAM[TEAM.length - 1]; // fallback
      
      const photoHtml = photoUrl 
        ? `<img src="${photoUrl}" referrerpolicy="no-referrer" style="width: 100%; height: 280px; object-fit: cover; object-position: top; border-bottom: 3px solid ${teamColor};" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div style="width:100%; height:280px; display:none; align-items:center; justify-content:center; background:#1E293B; font-size:60px; font-weight:800; color:${teamColor}; border-bottom:3px solid ${teamColor};">${escapeHTML(displayName.charAt(0))}</div>`
        : `<div style="width:100%; height:280px; display:flex; align-items:center; justify-content:center; background:#1E293B; font-size:60px; font-weight:800; color:${teamColor}; border-bottom:3px solid ${teamColor};">${escapeHTML(displayName.charAt(0))}</div>`;
        
      const pocHtml = f.pocAssigned ? `<div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:8px; padding:4px 8px; background:rgba(255,255,255,0.03); border-radius:20px; display:inline-flex;">${renderAvatar(poc.name, poc.color, 'sm', poc.team)}<span style="font-size:11px; color:#E2E8F0; font-weight:600;">${escapeHTML(f.pocAssigned)}</span></div>` : '';
      
      return `
        <div class="card" style="cursor: pointer; transition: transform 0.2s; overflow:hidden;" onclick="renderFellowProfile('${f.id}')" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          ${photoHtml}
          <div style="padding: 16px;">
            ${pocHtml}
            <h3 style="margin: 0 0 6px 0; font-size: 18px; color: #F1F5F9; word-break: break-word;">#${f.displayId || '000'} - ${escapeHTML(displayName)} ${renderStrikeDots(f.id)}</h3>
            <div style="font-size: 14px; color: #94A3B8; margin-bottom: 12px; word-break: break-word;">${escapeHTML(displayCollege)}</div>
            <div style="display:flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap;">
              ${renderBadge(f.fellowStatus)}
              <span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA; font-size:11px; padding: 4px 8px; white-space:nowrap; display:inline-block;">August Intake</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    contentHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
        ${cardsHtml.length ? cardsHtml : '<div class="empty-state" style="grid-column: 1/-1;"><div class="empty-state__title">You have no assigned fellows</div></div>'}
      </div>
    `;
  }

  return `
    <div class="fade-in">
      <header class="page-header">
        <div>
          <h1 class="page-title">My Fellows</h1>
          <p class="page-subtitle">You are managing ${myFellows.length} fellows</p>
        </div>
        <div class="flex" style="gap: 10px; align-items: center;">
    <div style="display:flex; align-items:center; gap:8px; margin-right:15px; padding-right:15px; border-right:1px solid rgba(148,163,184,0.2);">
      ${renderAvatar(AppState.currentUser.name, AppState.currentUser.color, 'sm', AppState.currentUser.team)}
      <span style="color:#F1F5F9;font-weight:600;font-size:14px;">${AppState.currentUser.name}</span>
    </div>
          <div style="background: rgba(30,41,59,0.8); border-radius: 8px; padding: 4px; display: flex; border: 1px solid rgba(148,163,184,0.1);">
            <button class="btn btn--sm ${AppState.myFellowsViewMode === 'grid' ? 'btn--primary' : 'btn--ghost'}" id="btnMyViewGrid" style="border-radius: 6px;">📱 Grid</button>
            <button class="btn btn--sm ${AppState.myFellowsViewMode === 'sheet' ? 'btn--primary' : 'btn--ghost'}" id="btnMyViewSheet" style="border-radius: 6px;">📊 Sheet</button>
          </div>
        </div>
      </header>
      
      ${renderFilterBar(true)}
      
      ${contentHtml}
      <div id="modalContainer"></div>
    </div>
  `;
}

function renderAllFellows() {
  const filtered = getFilteredFellows();
  
  // Default to sheet view if not set
  if (typeof AppState.allFellowsViewMode === 'undefined') {
    AppState.allFellowsViewMode = 'grid';
  }
  
  let contentHtml = '';
  
  if (AppState.allFellowsViewMode === 'sheet') {
    const tableRows = filtered.map(f => {
      const autoStrikes = (f._autoStrikes || []).map(s => `<span class="strike-dot strike-dot--${s.severity}" title="${s.reason}"></span>`).join('');
      const manual1 = f.strike1 && f.strike1 !== 'N/A' && f.strike1 !== '' ? `<span class="strike-dot strike-dot--danger" title="${f.strike1}"></span>` : '';
      const manual2 = f.strike2 && f.strike2 !== 'N/A' && f.strike2 !== '' ? `<span class="strike-dot strike-dot--danger" title="${f.strike2}"></span>` : '';
      
      const canEdit = AppState.currentUser.isAdmin || AppState.currentUser.name === f.pocAssigned;
      const editableClass = canEdit ? 'editable' : '';
      
      return `
        <tr>
          <td>
            <a href="#" class="fellow-name-link truncate" data-id="${f.id}" style="max-width: 200px; display:inline-block; color:#A78BFA; text-decoration:none; font-weight:600; cursor:pointer;" title="${escapeHTML(f.collegeName)}">${escapeHTML(f.collegeName)}</a>
          </td>
          <td class="${editableClass}" data-id="${f.id}" data-field="city">${escapeHTML(f.city)}</td>
          <td class="${editableClass}" data-id="${f.id}" data-field="pocAssigned">${escapeHTML(f.pocAssigned)}</td>
          <td><a href="#" class="fellow-name-link" data-id="${f.id}" style="color:#A78BFA; text-decoration:none; font-weight:600; cursor:pointer;">#${f.displayId || '000'} - ${escapeHTML(f.fellowName)} ${renderStrikeDots(f.id)}</a> ${f.intakeStatus ? `<span class="intake-badge--${f.intakeStatus === 'August Intake' ? 'august' : 'existing'}" style="margin-left:8px">${f.intakeStatus === 'August Intake' ? 'Aug Intake' : 'Existing'}</span>` : ""}</td>
          <td class="${editableClass}" data-id="${f.id}" data-field="fellowStatus">${renderBadge(f.fellowStatus)}</td>
          <td class="${editableClass}" data-id="${f.id}" data-field="clubPageActivity">${renderBadge(f.clubPageActivity)}</td>
          <td class="${editableClass}" data-id="${f.id}" data-field="finalAcceptance">${renderBadge(f.finalAcceptance)}</td>
          
          
          <td>
            ${canEdit ? `<button class="btn btn--icon btn-edit-full" data-id="${f.id}">✏️</button>` : `<button class="btn btn--icon btn-view-profile" data-id="${f.id}">👁️</button>`}
            ${canEdit ? `<button class="btn btn--icon text-danger btn-delete" data-id="${f.id}">🗑️</button>` : ''}
          </td>
        </tr>
      `;
    }).join('');

    contentHtml = `
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th data-sort="collegeName">College Name ${AppState.sortField === 'collegeName' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="city">City ${AppState.sortField === 'city' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="pocAssigned">POC ${AppState.sortField === 'pocAssigned' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="fellowName">Fellow ${AppState.sortField === 'fellowName' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="fellowStatus">Status ${AppState.sortField === 'fellowStatus' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="clubPageActivity">Activity ${AppState.sortField === 'clubPageActivity' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th data-sort="finalAcceptance">Form ${AppState.sortField === 'finalAcceptance' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              
              <th>Strikes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows.length > 0 ? tableRows : '<tr><td colspan="10" style="text-align:center; padding: 2rem;">No fellows found.</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  } else {
    // Grid View
    const cardsHtml = filtered.map(f => {
      const photoUrl = f.photoUrl || null; const displayName = f.fellowName || 'Unknown'; const displayCollege = f.collegeName || 'Unknown';
      
      const teamColor = TEAM_COLORS[f.team]?.primary || '#7C3AED';
      const poc = TEAM.find(t => t.name === f.pocAssigned) || TEAM[TEAM.length - 1]; // fallback
      
      const photoHtml = photoUrl 
        ? `<img src="${photoUrl}" referrerpolicy="no-referrer" style="width: 100%; height: 280px; object-fit: cover; object-position: top; border-bottom: 3px solid ${teamColor};" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div style="width:100%; height:280px; display:none; align-items:center; justify-content:center; background:#1E293B; font-size:60px; font-weight:800; color:${teamColor}; border-bottom:3px solid ${teamColor};">${escapeHTML(displayName.charAt(0))}</div>`
        : `<div style="width:100%; height:280px; display:flex; align-items:center; justify-content:center; background:#1E293B; font-size:60px; font-weight:800; color:${teamColor}; border-bottom:3px solid ${teamColor};">${escapeHTML(displayName.charAt(0))}</div>`;
        
      const pocHtml = f.pocAssigned ? `<div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:8px; padding:4px 8px; background:rgba(255,255,255,0.03); border-radius:20px; display:inline-flex;">${renderAvatar(poc.name, poc.color, 'sm', poc.team)}<span style="font-size:11px; color:#E2E8F0; font-weight:600;">${escapeHTML(f.pocAssigned)}</span></div>` : '';
      
      return `
        <div class="card" style="cursor: pointer; transition: transform 0.2s; overflow:hidden;" onclick="renderFellowProfile('${f.id}')" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          ${photoHtml}
          <div style="padding: 16px;">
            ${pocHtml}
            <h3 style="margin: 0 0 6px 0; font-size: 18px; color: #F1F5F9; word-break: break-word;">#${f.displayId || '000'} - ${escapeHTML(displayName)} ${renderStrikeDots(f.id)}</h3>
            <div style="font-size: 14px; color: #94A3B8; margin-bottom: 12px; word-break: break-word;">${escapeHTML(displayCollege)}</div>
            <div style="display:flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap;">
              ${renderBadge(f.fellowStatus)}
              <span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA; font-size:11px; padding: 4px 8px; white-space:nowrap; display:inline-block;">August Intake</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    contentHtml = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">
        ${cardsHtml.length ? cardsHtml : '<div class="empty-state" style="grid-column: 1/-1;"><div class="empty-state__title">No fellows found</div></div>'}
      </div>
    `;
  }

  return `
    <div class="fade-in">
      <header class="page-header">
        <div>
          <h1 class="page-title">All Fellows</h1>
          <p class="page-subtitle">${filtered.length} fellows found</p>
        </div>
        <div class="flex" style="gap: 10px; align-items: center;">
    <div style="display:flex; align-items:center; gap:8px; margin-right:15px; padding-right:15px; border-right:1px solid rgba(148,163,184,0.2);">
      ${renderAvatar(AppState.currentUser.name, AppState.currentUser.color, 'sm', AppState.currentUser.team)}
      <span style="color:#F1F5F9;font-weight:600;font-size:14px;">${AppState.currentUser.name}</span>
    </div>
          <div style="background: rgba(30,41,59,0.8); border-radius: 8px; padding: 4px; display: flex; border: 1px solid rgba(148,163,184,0.1); margin-right: 15px;">
            <button class="btn btn--sm ${AppState.allFellowsViewMode === 'grid' ? 'btn--primary' : 'btn--ghost'}" id="btnViewGrid" style="border-radius: 6px;">📱 Grid</button>
            <button class="btn btn--sm ${AppState.allFellowsViewMode === 'sheet' ? 'btn--primary' : 'btn--ghost'}" id="btnViewSheet" style="border-radius: 6px;">📊 Sheet</button>
          </div>
          ${AppState.currentUser.isAdmin ? `
            <button class="btn btn--secondary" onclick="syncFromSheets()">🔄 Refresh</button>
  <button class="btn btn--secondary" onclick="exportCSV()" style="margin-left: 10px;">⬇️ Download Database</button>
            <button class="btn btn--secondary" onclick="renderMassAddModal()" style="margin-right: 10px;">z Mass Add</button>
            <button class="btn btn--primary" id="btnAddFellow">➕ Add Fellow</button>
          ` : ''}
        </div>
      </header>
      
      ${renderFilterBar(false)}
      
      ${contentHtml}
      
      <!-- Edit Modal Container -->
      <div id="modalContainer"></div>
    </div>
  `;
}


function requestStrikeRemoval(fellowId, strikeId) {
  const reason = prompt("Reason for requesting strike removal:");
  if (!reason) return;
  const req = {
    id: 'req_' + Date.now() + Math.random().toString(36).substr(2,5),
    fellowId,
    strikeId,
    requestedBy: AppState.currentUser.name,
    reason,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  AppState.removalRequests.push(req);
  saveRemovalRequests();
  logChange(fellowId, 'strikeRemovalRequest', 'Requested', reason);
  render();
}

function adminApproveRemoval(reqId) {
  const req = AppState.removalRequests.find(r => r.id === reqId);
  if (!req) return;
  const rec = AppState.strikeRecords.find(r => r.fellowId === req.fellowId);
  if (rec) {
    const s = rec.strikes.find(x => x.id === req.strikeId);
    if (s) {
      s.removed = true;
      s.removedAt = new Date().toISOString();
      s.removedBy = AppState.currentUser.name;
    }
  }
  req.status = 'approved';
  saveStrikeRecords();
  saveRemovalRequests();
  logChange(req.fellowId, 'strikeRemoved', 'Active', 'Removed via POC request');
  render();
}

function adminRejectRemoval(reqId) {
  const req = AppState.removalRequests.find(r => r.id === reqId);
  if (req) {
    req.status = 'rejected';
    saveRemovalRequests();
    render();
  }
}

function adminDirectRemove(fellowId, strikeId) {
  if (!confirm("Are you sure you want to directly remove this strike?")) return;
  const rec = AppState.strikeRecords.find(r => r.fellowId === fellowId);
  if (rec) {
    const s = rec.strikes.find(x => x.id === strikeId);
    if (s) {
      s.removed = true;
      s.removedAt = new Date().toISOString();
      s.removedBy = AppState.currentUser.name;
      saveStrikeRecords();
      logChange(fellowId, 'strikeRemoved', 'Active', 'Removed directly by Admin');
      
      const fellow = AppState.fellows.find(f => f.id === fellowId);
      if (fellow && fellow.emailId) {
        const remainingStrikes = getActiveStrikeCount(fellow.id);
        const subject = `Update: Your Under25 Strike has been removed`;
        let body = `Dear ${fellow.fellowName ? fellow.fellowName.trim() : 'Fellow'},

Good news! We have reviewed your profile and removed your strike for "${s.reason}".

`;
        body += `You now have ${remainingStrikes} active strike(s).

`;
        if (remainingStrikes === 0) {
          body += `Keep up the great work!

`;
        } else {
          body += `Please ensure you complete any other pending requirements to avoid further strikes.

`;
        }
        body += `Best,
Under25 Program Team`;
        
        const mailto = `mailto:${encodeURIComponent(fellow.emailId)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailto, '_blank');
      }
      
      render();
    }
  }
}


function pocDecideStrike(fellowId, reasonStr, action) {
  if (!window._tempReviews) window._tempReviews = {};
  if (!window._tempReviews[fellowId]) window._tempReviews[fellowId] = {};
  
  window._tempReviews[fellowId][reasonStr] = action;
  
  const container = document.getElementById('strike-actions-' + fellowId);
  if (container) {
    if (action === 'approve') {
      container.innerHTML = '<span style="color:#10B981;font-weight:700;">✓ Approved</span>';
    } else {
      container.innerHTML = '<span style="color:#94A3B8;font-weight:700;">✗ Rejected</span>';
    }
  }
}

function submitStrikeReview() {
  if (!confirm("Are you sure you want to submit? This cannot be undone.")) return;
  const user = AppState.currentUser;
  
  if (window._tempReviews) {
    Object.entries(window._tempReviews).forEach(([fid, decisions]) => {
      Object.entries(decisions).forEach(([reason, action]) => {
        if (action === 'approve') {
          const rec = AppState.strikeRecords.find(r => r.fellowId === fid);
          if (!rec) {
            AppState.strikeRecords.push({ fellowId: fid, strikes: [] });
          }
          const realRec = AppState.strikeRecords.find(r => r.fellowId === fid);
          realRec.strikes.push({
            id: 'str_' + Date.now() + Math.random().toString(36).substr(2,5),
            reason: reason,
            phase: AppState.strikePhase.id,
            approvedBy: user.name,
            approvedAt: new Date().toISOString(),
            emailSent: false,
            removed: false
          });
        }
      });
    });
  }
  
  AppState.strikePhase.pocApprovals[user.name] = true;
  saveStrikeRecords();
  saveStrikeReviews();
  window._tempReviews = {};
  render();
}

function markStrikeEmailSent(fellowId, strikeId) {
  const rec = AppState.strikeRecords.find(r => r.fellowId === fellowId);
  if (rec) {
    const s = rec.strikes.find(x => x.id === strikeId);
    if (s) {
      s.emailSent = true;
      saveStrikeRecords();
      render();
    }
  }
}

function renderStrikes() {
  const user = AppState.currentUser;
  const isAdmin = user && user.isAdmin;
  const phase = AppState.strikePhase || { active: false };

  // --- POC VIEW ---
  if (!isAdmin) {
    let html = `<header class="page-header" style="margin-bottom:20px;">
      <h1 class="page-title">⚡ Strike Management</h1>
      <p class="page-subtitle">${phase.active ? '🔴 STRIKE PHASE ACTIVE — Please review your fellows.' : 'Strike history and active strikes for your fellows.'}</p>
    </header>`;

    const myFellows = getFilteredFellows(user.name);
    
    if (phase.active) {
      const isApproved = AppState.strikePhase && AppState.strikePhase.pocApprovals && AppState.strikePhase.pocApprovals[user.name] === true;
      
      if (isApproved) {
        html += `<div class="card" style="padding:40px;text-align:center;border-top:4px solid #10B981;">
          <div style="font-size:3rem;margin-bottom:10px;">✅</div>
          <h3>Reviews Submitted</h3>
          <p style="color:#94A3B8;">Thank you. Your strike reviews have been sent to the admins.</p>
        </div>`;
        return html;
      }

      html += `<div class="card" style="border: 2px solid #EF4444; background: rgba(239,68,68,0.1); padding:16px; margin-bottom:20px;">
        <h3 style="color:#EF4444;margin:0 0 10px 0;">Action Required: Review Auto-Strikes</h3>
        <p style="margin:0;font-size:0.9rem;">Review the suggested strikes below. Approve or reject each one, then submit your final review.</p>
      </div>`;

      const myAlerts = [];
      myFellows.forEach(f => {
        const strikes = evaluateStrikes(f);
        if (strikes.length > 0) {
          myAlerts.push({ fellowId: f.id, reasons: strikes.map(s => s.reason) });
        }
      });

      if (myAlerts.length === 0) {
        html += `<div class="card" style="padding:30px;text-align:center;">
          <p>No auto-strikes detected for your fellows.</p>
          <button class="btn btn--primary" onclick="submitStrikeReview()">Confirm & Submit Empty Review</button>
        </div>`;
      } else {
        html += `<div style="display:flex;flex-direction:column;gap:16px;margin-bottom:20px;">`;
        myAlerts.forEach(alert => {
          const f = myFellows.find(x => x.id === alert.fellowId);
          html += `<div class="card" style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
              <div>
                <h4 style="margin:0 0 4px 0;">#${f.displayId || '000'} - ${escapeHTML(f.fellowName)} ${renderStrikeDots(f.id)}</h4>
                <div style="color:#94A3B8;font-size:0.85rem;margin-bottom:12px;">${escapeHTML(f.collegeName)}</div>
                
                <div style="background:rgba(239,68,68,0.1);border-left:3px solid #EF4444;padding:8px 12px;margin-bottom:12px;">
                  <strong style="color:#EF4444;">Auto-detected:</strong> ${alert.reasons.join(', ')}
                </div>
              </div>
              <div style="display:flex;gap:8px;" id="strike-actions-${f.id}">
                <button class="btn btn--primary" onclick="pocDecideStrike('${f.id}', '${alert.reasons.join(', ')}', 'approve')" style="background:#10B981;">✓ Approve</button>
                <button class="btn btn--ghost" onclick="pocDecideStrike('${f.id}', '${alert.reasons.join(', ')}', 'reject')">✗ Reject</button>
              </div>
            </div>
          </div>`;
        });
        html += `</div>
        <div style="text-align:right;">
          <button class="btn btn--primary" style="padding:12px 24px;font-size:1.1rem;" onclick="submitStrikeReview()">Submit All Reviews</button>
        </div>`;
      }
    } else {
      // Phase is OFF - Show current active strikes and allow removal requests
      let activeStrikesCount = 0;
      let strikesListHtml = `<div style="display:flex;flex-direction:column;gap:12px;">`;
      
      myFellows.forEach(f => {
        const rec = AppState.strikeRecords.find(r => r.fellowId === f.id);
        if (rec) {
          const activeS = rec.strikes.filter(s => !s.removed);
          activeS.forEach(s => {
            activeStrikesCount++;
            const hasPendingRequest = AppState.removalRequests.some(r => r.strikeId === s.id && r.status === 'pending');
            
            strikesListHtml += `<div class="card" style="padding:12px;display:flex;justify-content:space-between;align-items:center;border-left:3px solid #F59E0B;">
              <div>
                <h4 style="margin:0 0 4px 0;">#${f.displayId || '000'} - ${escapeHTML(f.fellowName)} ${renderStrikeDots(f.id)}</h4>
                <div style="font-size:0.85rem;color:#94A3B8;">Reason: ${escapeHTML(s.reason)} (Phase: ${s.phase})</div>
              </div>
              <div>
                ${hasPendingRequest 
                  ? `<span class="badge badge--warning">Removal Requested ⏳</span>`
                  : `<button class="btn btn--sm btn--ghost" onclick="requestStrikeRemoval('${f.id}', '${s.id}')">Request Removal</button>`}
              </div>
            </div>`;
          });
        }
      });
      strikesListHtml += `</div>`;

      if (activeStrikesCount === 0) {
        html += `<div class="card" style="padding:40px;text-align:center;">
          <div style="font-size:2rem;margin-bottom:10px;">✨</div>
          <h3 style="color:#94A3B8;">No active strikes for your fellows.</h3>
        </div>`;
      } else {
        html += strikesListHtml;
      }
    }
    return html;
  }

  // --- ADMIN VIEW ---
  const POCS = TEAM.filter(t => !t.isAdmin);
  let pocProgressHtml = `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">`;
  let pendingCount = 0;
  
  POCS.forEach(p => {
    const isApp = AppState.strikePhase && AppState.strikePhase.pocApprovals && AppState.strikePhase.pocApprovals[p.name] === true;
    if (!isApp) pendingCount++;
    pocProgressHtml += `<div style="padding:6px 12px;border-radius:20px;font-size:0.85rem;background:${isApp ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)'};color:${isApp ? '#10B981' : '#94A3B8'};border:1px solid ${isApp ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.2)'}">
      ${isApp ? '✓' : '⏳'} ${p.name}
    </div>`;
  });
  pocProgressHtml += `</div>`;

  let html = `<header class="page-header" style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <h1 class="page-title">⚡ Admin Strike Master</h1>
      <p class="page-subtitle">Manage strike phases, approve removals, and send emails.</p>
    </div>
    <div>
      ${phase.active 
        ? `<button class="btn" style="background:#EF4444;color:white;padding:10px 20px;" onclick="toggleStrikePhase(false)">🛑 End Strike Phase</button>` 
        : `<button class="btn" style="background:#10B981;color:white;padding:10px 20px;" onclick="toggleStrikePhase(true)">🚀 Start New Strike Phase</button>`}
    </div>
  </header>`;

  // SECTION A: ACTIVE STRIKE PHASE (Giving Strikes)
  if (phase.active) {
    html += `<div class="card" style="margin-bottom:30px;border: 2px solid #3B82F6;">
      <div class="card-header"><h2 class="card-title" style="color:#3B82F6;">Current Phase: ${escapeHTML(phase.name)}</h2></div>
      <div class="card-body" style="padding:20px;">
        <h3 style="margin:0 0 10px 0;font-size:0.9rem;text-transform:uppercase;color:#94A3B8;">POC Submission Status</h3>
        ${pocProgressHtml}`;

    // Gather emails for POCs that HAVE submitted
    let pendingEmails = [];
    AppState.strikeRecords.forEach(rec => {
      const fellow = AppState.fellows.find(f => f.id === rec.fellowId);
      if (fellow && AppState.strikePhase && AppState.strikePhase.pocApprovals && AppState.strikePhase.pocApprovals[fellow.pocAssigned] === true) {
        rec.strikes.filter(s => s.phase === phase.id && !s.emailSent && !s.removed).forEach(s => {
          pendingEmails.push({ type: 'strike', fellow, strike: s });
        });
      }
    });

    if (pendingEmails.length > 0) {
      html += `<h3 style="margin:20px 0 10px 0;font-size:0.9rem;text-transform:uppercase;color:#94A3B8;">Pending Emails (Grouped for Bulk Send)</h3>`;
      
      const bulkGroups = {};
      pendingEmails.forEach(item => {
        const r = item.strike.reason;
        const count = getActiveStrikeCount(item.fellow.id) + 1;
        const ord = count === 1 ? 'first' : (count === 2 ? 'second' : 'third');
        const key = r + '_' + ord;
        if (!bulkGroups[key]) bulkGroups[key] = { reason: r, ordinal: ord, items: [] };
        bulkGroups[key].items.push(item);
      });

      Object.values(bulkGroups).forEach(group => {
        // Generate a generic email for the group (we just use the first fellow to generate, but make sure the template doesn't use fellow-specific data)
        // I will temporarily patch generateStrikeEmailBody to not use pocAssigned so it's fully generic.
        const firstItem = group.items[0];
        const emailData = generateStrikeEmailBody(firstItem.fellow, group.reason, STRIKE_REASONS_MAP[group.reason] || group.reason);
        // Clean out any fellow-specific POC insertion that might have been there
        let cleanBody = emailData.body.replace(/\(.*\)/g, ''); // Removes things like (Christy) if it was generated
        
        const emailText = `Subject: ${emailData.subject}${emailData.body}`;
        
        const allEmails = group.items.map(i => i.fellow.emailId).filter(e => e).join(','); // mailto uses comma
        const mailtoLink = `mailto:?bcc=${encodeURIComponent(allEmails)}&subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
        
        html += `<div class="card" style="padding:16px;background:rgba(15,23,42,0.5);margin-bottom:16px;">
          <h4 style="margin:0 0 12px 0;color:#F1F5F9;border-bottom:1px solid rgba(148,163,184,0.1);padding-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
            <span>${escapeHTML(group.reason)} - ${group.ordinal.toUpperCase()} STRIKE (${group.items.length} Fellows)</span>
            <a href="${mailtoLink}" target="_blank" class="btn btn--sm" style="background:#3B82F6;color:white;text-decoration:none;">🚀 Open in Mail App</a>
          </h4>
          
          <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <strong style="color:#94A3B8;font-size:0.85rem;">BCC Email IDs:</strong>
              <button class="btn btn--sm btn--ghost" onclick="window.copyToClipboardText('${escapeHTML(allEmails.replace(/'/g, "\\'"))}')">📋 Copy Emails</button>
            </div>
            <textarea readonly style="width:100%;height:60px;background:#0F172A;color:#64748B;border:1px solid #1E293B;padding:8px;border-radius:6px;font-family:monospace;font-size:0.8rem;">${escapeHTML(allEmails)}</textarea>
          </div>
          
          <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <strong style="color:#94A3B8;font-size:0.85rem;">Email Template:</strong>
              <button class="btn btn--sm btn--ghost" onclick="window.copyToClipboardText(this.nextElementSibling.value)">📋 Copy Body</button>
            </div>
            <textarea readonly style="width:100%;height:150px;background:#0F172A;color:#94A3B8;border:1px solid #1E293B;padding:12px;border-radius:6px;font-family:monospace;font-size:0.85rem;">${escapeHTML(emailText)}</textarea>
          </div>
          
          <div style="text-align:right;">
            <button class="btn btn--primary" onclick="markBulkStrikeEmailsSent('${escapeHTML(JSON.stringify(group.items.map(i => ({ fellowId: i.fellow.id, strikeId: i.strike.id }))))}')">
              ✓ Mark All ${group.items.length} as Sent
            </button>
          </div>
        </div>`;
      });
    } else {
      if (pendingCount === 0) {
        html += `<div style="padding:20px;background:rgba(16,185,129,0.1);color:#10B981;border-radius:8px;text-align:center;">All emails for this phase have been sent!</div>`;
      } else {
        html += `<div style="padding:20px;background:rgba(148,163,184,0.1);color:#94A3B8;border-radius:8px;text-align:center;">Waiting for more POCs to submit to generate their emails...</div>`;
      }
    }
    
    html += `</div></div>`;
  }

  // SECTION B: STRIKE MANAGEMENT & REMOVALS
  html += `<div class="card" style="margin-bottom:30px;">
    <div class="card-header"><h2 class="card-title">Strike Management & Removals</h2></div>
    <div class="card-body" style="padding:20px;">`;

  // 1. Pending Removal Requests
  const pendingRequests = AppState.removalRequests.filter(r => r.status === 'pending');
  if (pendingRequests.length > 0) {
    html += `<h3 style="color:#F59E0B;margin:0 0 10px 0;">Pending Removal Requests from POCs</h3>
    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:30px;">`;
    pendingRequests.forEach(req => {
      const f = AppState.fellows.find(x => x.id === req.fellowId);
      const rec = AppState.strikeRecords.find(r => r.fellowId === req.fellowId);
      const strike = rec ? rec.strikes.find(s => s.id === req.strikeId) : null;
      
      html += `<div class="card" style="padding:12px;border-left:3px solid #F59E0B;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h4 style="margin:0 0 4px 0;">${f ? escapeHTML(f.fellowName) : 'Unknown Fellow'} <span style="font-size:0.85rem;color:#94A3B8;font-weight:normal;">(Requested by ${escapeHTML(req.requestedBy)})</span></h4>
          <div style="font-size:0.85rem;color:#94A3B8;"><strong>Original Strike:</strong> ${strike ? escapeHTML(strike.reason) : 'Unknown'}</div>
          <div style="font-size:0.9rem;color:#F1F5F9;margin-top:4px;"><strong>POC Reason:</strong> "${escapeHTML(req.reason)}"</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn--primary" onclick="adminApproveRemoval('${req.id}')" style="background:#10B981;">✓ Approve</button>
          <button class="btn btn--ghost" onclick="adminRejectRemoval('${req.id}')">✗ Reject</button>
        </div>
      </div>`;
    });
    html += `</div>`;
  }

  // 2. All Active Strikes Master List
  html += `<h3 style="margin:0 0 10px 0;color:#F1F5F9;">All Active Strikes Master List</h3>`;
  
  let allActiveHtml = `<table class="data-table">
    <thead>
      <tr>
        <th>Fellow</th>
        <th>POC</th>
        <th>Active Strikes</th>
        <th>Reasons</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>`;
  
  let totalActiveStrikes = 0;
  AppState.strikeRecords.forEach(rec => {
    const activeStrikes = rec.strikes.filter(s => !s.removed);
    if (activeStrikes.length > 0) {
      const f = AppState.fellows.find(x => x.id === rec.fellowId);
      if (f) {
        totalActiveStrikes += activeStrikes.length;
        allActiveHtml += `<tr>
          <td>#${f.displayId || '000'} - ${escapeHTML(f.fellowName)} ${renderStrikeDots(f.id)}</td>
          <td>${escapeHTML(f.pocAssigned)}</td>
          <td>${activeStrikes.length}</td>
          <td>
            <ul style="margin:0;padding-left:16px;font-size:0.85rem;color:#94A3B8;">
              ${activeStrikes.map(s => `<li>${escapeHTML(s.reason)} (Phase ${s.phase})</li>`).join('')}
            </ul>
          </td>
          <td>
            <div style="display:flex;flex-direction:column;gap:4px;">
              ${activeStrikes.map(s => `
                <button class="btn btn--sm btn--ghost" onclick="adminDirectRemove('${f.id}', '${s.id}')" style="color:#EF4444;border-color:rgba(239,68,68,0.3);font-size:10px;">Remove: ${escapeHTML(s.reason).substring(0,10)}...</button>
              `).join('')}
            </div>
          </td>
        </tr>`;
      }
    }
  });
  allActiveHtml += `</tbody></table>`;

  if (totalActiveStrikes === 0) {
    html += `<p style="color:#94A3B8;">There are zero active strikes in the system.</p>`;
  } else {
    html += `<div class="table-container" style="">${allActiveHtml}</div>`;
  }

  html += `</div></div>`;
  
  return html;
}


// ================================================================
// STRIKE SYSTEM ACTION HANDLERS
// ================================================================

function startStrikePhase() {
  if (AppState.strikePhase && AppState.strikePhase.active) return showToast('Phase already active', 'warning');
  const phaseId = 'phase_' + Date.now();
  AppState.strikePhase = {
    phaseId,
    active: true,
    startedBy: AppState.currentUser.name,
    startedAt: new Date().toISOString(),
    pocApprovals: {},
    emailsSent: false,
    sentStrikes: {},
    sentRemovals: {},
    pocNotified: {}
  };
  // Init reviews for this phase
  AppState.strikeReviews[phaseId] = {};
  saveStrikePhase();
  saveStrikeReviews();
  render();
  showToast('Strike phase started! POCs will now see review requests.', 'success');
}

function endStrikePhase() {
  if (!AppState.strikePhase) return;
  const phaseId = AppState.strikePhase.phaseId;
  
  // Validation: Check if there are any pending emails to send
  const POCS = TEAM.filter(t => !t.isAdmin);
  let hasPending = false;
  
  POCS.forEach(poc => {
    const revs = AppState.strikeReviews[phaseId];
    if (revs) {
      Object.keys(revs).forEach(fId => {
        if (revs[fId].decisions) {
          Object.keys(revs[fId].decisions).forEach(reason => {
            if (revs[fId].decisions[reason] === true) {
              const key = fId + reason;
              if (!AppState.strikePhase.sentStrikes || !AppState.strikePhase.sentStrikes[key]) {
                hasPending = true;
              }
            }
          });
        }
      });
    }
  });
  
  if (hasPending) {
    return showToast('You cannot end the strike phase until all approved strikes have their emails marked as Sent!', 'error');
  }

  AppState.strikePhase.active = false;
  saveStrikePhase();
  render();
  showToast('Strike phase ended.', 'info');
}

window.toggleStrikePhase = function(start) {
  if (start) startStrikePhase();
  else endStrikePhase();
};

function setStrikeDecision(fellowId, reason, approved) {
  const phase = AppState.strikePhase;
  if (!phase || !phase.active) return;
  const phaseId = phase.phaseId;
  const pocName = AppState.currentUser.name;
  if (!AppState.strikeReviews[phaseId]) AppState.strikeReviews[phaseId] = {};
  if (!AppState.strikeReviews[phaseId][fellowId]) AppState.strikeReviews[phaseId][fellowId] = { decisions: {}, removeIds: [] };
  AppState.strikeReviews[phaseId][fellowId].decisions[reason] = approved;
  saveStrikeReviews();
  render();
}

function toggleStrikeRemoval(fellowId, strikeId) {
  const phase = AppState.strikePhase;
  if (!phase || !phase.active) return;
  const phaseId = phase.phaseId;
  const pocName = AppState.currentUser.name;
  if (!AppState.strikeReviews[phaseId]) AppState.strikeReviews[phaseId] = {};
  if (!AppState.strikeReviews[phaseId][fellowId]) AppState.strikeReviews[phaseId][fellowId] = { decisions: {}, removeIds: [] };
  const removeIds = AppState.strikeReviews[phaseId][fellowId].removeIds;
  const idx = removeIds.indexOf(strikeId);
  if (idx >= 0) removeIds.splice(idx, 1); else removeIds.push(strikeId);
  saveStrikeReviews();
  render();
}

function submitPOCReview() {
  const phase = AppState.strikePhase;
  const pocName = AppState.currentUser.name;
  if (!phase || !phase.active) return showToast('No active phase', 'warning');
  const phaseId = phase.phaseId;
  const myFellows = AppState.fellows.filter(f => f.pocAssigned === pocName);
  const myReviews = AppState.strikeReviews[phaseId] || {};
  // Check all auto-detected strikes have a decision
  for (const f of myFellows) {
    const auto = evaluateStrikes(f).map(s => s.reason);
    for (const reason of auto) {
      const dec = myReviews[f.id] && myReviews[f.id].decisions && myReviews[f.id].decisions[reason];
      if (dec === undefined) {
        return showToast(`Please approve or reject "${reason}" for ${f.fellowName} before submitting.`, 'warning');
      }
    }
  }
  if (!AppState.strikePhase.pocApprovals) AppState.strikePhase.pocApprovals = {};
  AppState.strikePhase.pocApprovals[pocName] = 'approved';
  saveStrikePhase();
  render();
  showToast('Reviews submitted! ✅ Admins will now be notified.', 'success');
}

function markEmailSent(type, fellowId, reasonOrStrikeId, phaseId) {
  const phase = AppState.strikePhase;
  if (!phase) return;
  if (type === 'strike') {
    if (!phase.sentStrikes) phase.sentStrikes = {};
    phase.sentStrikes[fellowId + reasonOrStrikeId] = true;
    // Commit the strike to the fellow's record
    const POCS = TEAM.filter(t => !t.isAdmin);
    let reason = reasonOrStrikeId;
    POCS.forEach(poc => {
      const rev = AppState.strikeReviews[phaseId] && AppState.strikeReviews[phaseId][fellowId];
      if (rev && rev.decisions && rev.decisions[reason] === true) {
        const rec = getStrikeRecord(fellowId);
        rec.strikes.push({
          id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2,5),
          reason,
          phase: phaseId,
          approvedBy: poc.name,
          approvedAt: new Date().toISOString(),
          emailSent: true,
          removed: false,
          removedAt: null,
          removedBy: null
        });
      }
    });
    saveStrikeRecords();
    // Notify POC
    const fellow = AppState.fellows.find(f => f.id === fellowId);
    if (fellow) {
      if (!phase.pocNotified) phase.pocNotified = {};
      if (!phase.pocNotified[fellow.pocAssigned]) phase.pocNotified[fellow.pocAssigned] = [];
      phase.pocNotified[fellow.pocAssigned].push({ fellowId, reason, type: 'struck' });
    }
  } else if (type === 'removal') {
    const strikeId = reasonOrStrikeId;
    if (!phase.sentRemovals) phase.sentRemovals = {};
    phase.sentRemovals[strikeId] = true;
    // Commit removal
    AppState.strikeRecords.forEach(rec => {
      const s = rec.strikes.find(st => st.id === strikeId);
      if (s) {
        s.removed = true;
        s.removedAt = new Date().toISOString();
        s.removedBy = AppState.currentUser.name;
      }
    });
    saveStrikeRecords();
    const fellow = AppState.fellows.find(f => {
      const rec = AppState.strikeRecords.find(r => r.fellowId === f.id);
      return rec && rec.strikes.some(s => s.id === strikeId);
    });
    if (fellow) {
      if (!phase.pocNotified) phase.pocNotified = {};
      if (!phase.pocNotified[fellow.pocAssigned]) phase.pocNotified[fellow.pocAssigned] = [];
      phase.pocNotified[fellow.pocAssigned].push({ fellowId: fellow.id, type: 'cleared', strikeId });
    }
  }
  saveStrikePhase();
  runAutoStrikes();
  render();
  showToast('Marked as sent ✅', 'success');
}

function markAllEmailsSent() {
  if (!AppState.strikePhase) return;
  AppState.strikePhase.emailsSent = true;
  AppState.strikePhase.active = false;
  saveStrikePhase();
  runAutoStrikes();
  render();
  showToast('Phase complete! All strike emails marked as sent.', 'success');
}

function copyEmailToClipboard(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => showToast('Email copied to clipboard! 📋', 'success'));
}

window.copyToClipboardText = function(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard! 📋', 'success')).catch(err => {
    console.error('Failed to copy', err);
    showToast('Failed to copy to clipboard.', 'error');
  });
};

function renderForms() {
  let formsHtml = `<div class="page-header">
    <div>
      <h2 class="page-title">Form Tracker</h2>
      <div class="page-subtitle">Track Final Acceptance form submissions</div>
    </div>
  </div>`;
  
  let actionRequiredHtml = '';
  const actionableFellows = [];

  if (AppState.acceptances.length > 0) {
    AppState.fellows.forEach(fellow => {
      if (fellow.finalAcceptance !== 'Yes') {
        const fellowName = (fellow.fellowName || '').toLowerCase().trim();
        const fellowEmail = (fellow.emailId || '').toLowerCase().trim();
        
        if (!fellowName && !fellowEmail) return;

        const match = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(fellow, true) : null;

        if (match && (AppState.currentUser.isAdmin || AppState.currentUser.name === fellow.pocAssigned)) {
          actionableFellows.push({ fellow, match });
        }
      }
    });
  }

  if (actionableFellows.length > 0) {
    actionRequiredHtml += `
      <div class="card mb-24" style="border: 1px solid #10B981; background: linear-gradient(135deg, rgba(16,185,129,0.05), transparent);">
        <div class="card-header" style="border-bottom-color: rgba(16,185,129,0.2);">
          <div style="display:flex; justify-content:space-between; align-items:center;"><h3 class="card-title" style="color: #10B981; margin:0;">⚠️ Action Required: New Acceptances</h3><button class="btn btn--sm btn--primary" id="btn-approve-all-faf" onclick="approveAllFaf()">✅ Approve All</button></div>
        </div>
        <div class="card-body" style="max-height: 250px; overflow-y: auto;">
          <div class="tracker-list">
            ${actionableFellows.map(({fellow, match}) => `
              <div class="tracker-item" style="border-left-color: #10B981; background: rgba(30,41,59,0.8);">
                <div style="flex: 1;">
                  <div class="tracker-item__name">${escapeHTML(fellow.fellowName)} <span style="font-size:12px; font-weight:normal; color:#94A3B8;">(${escapeHTML(fellow.collegeName)})</span></div>
                  <div class="tracker-item__meta">
                    Form Submitted By: <strong style="color:#F1F5F9">${escapeHTML(match.fullName)}</strong> (${escapeHTML(match.email)})
                  </div>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                  <div class="tracker-item__status">Currently: ${renderBadge(fellow.finalAcceptance)}</div>
                  <button class="btn btn--sm btn--primary btn-approve-faf" data-id="${fellow.id}">✅ Approve Sync</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  formsHtml += actionRequiredHtml;
  
  let filled = 0;
  let pending = 0;
  
  let listHtml = '';
  
  const filtered = getFilteredFellows();
  
  filtered.forEach(f => {
    let statusClass = 'tracker-item--pending';
    if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance === '') {
      f.finalAcceptance = 'No'; // Default to No if blank
    }
    let isFilled = f.finalAcceptance === 'Yes';
    
    if (isFilled) {
      statusClass = 'tracker-item--filled';
      filled++;
    } else {
      pending++;
    }
    
    // Check if we should display this item based on the active filter
    if (AppState.formFilter === 'filled' && !isFilled) return;
    if (AppState.formFilter === 'pending' && isFilled) return;
    
    
    const mHoc = (f.manualHocName || f.hocName) || '<span style="color:#EF4444;font-style:italic;" title="Missing HOC">Missing</span>';
    const mTshirt = f.tshirt || '<span style="color:#EF4444;font-style:italic;" title="Missing T-Shirt Size">Missing</span>';
    const mEmail = f.emailId || '<span style="color:#EF4444;font-style:italic;" title="Missing Email">Missing</span>';
    const mPhone = f.whatsappNo || '<span style="color:#EF4444;font-style:italic;" title="Missing Phone">Missing</span>';

    listHtml += `
      <tr class="${statusClass}" style="background: rgba(30,41,59,0.5); border-bottom: 1px solid rgba(148,163,184,0.1);">
        <td style="padding: 12px;">${escapeHTML(f.fellowName || 'Vacant')}</td>
        <td style="padding: 12px; font-size: 13px;">${mEmail}</td>
        <td style="padding: 12px; font-size: 13px;">${mPhone}</td>
        <td style="padding: 12px; font-size: 13px;">${escapeHTML(f.collegeName)}</td>
        <td style="padding: 12px; font-size: 13px;">${mHoc}</td>
        <td style="padding: 12px; font-size: 13px;">${mTshirt}</td>
        <td style="padding: 12px;">${renderBadge(f.finalAcceptance)}</td>
      </tr>
    `;
  });
  
  const filledOpacity = AppState.formFilter === 'filled' ? '1' : '0.6';
  const pendingOpacity = AppState.formFilter === 'pending' ? '1' : '0.6';
  const allOpacity = AppState.formFilter === 'all' ? '1' : '0.6';
  
  formsHtml += `
    <div class="stats-grid mb-24" style="grid-template-columns: 1fr 1fr 1fr;">
      <div class="stat-card stat-card--success" style="cursor:pointer; opacity:${filledOpacity}; transition: 0.2s;" onclick="setFormFilter('filled')">
        <div class="stat-card__icon">✅</div>
        <div class="stat-card__value">${filled}</div>
        <div class="stat-card__label">Forms Filled</div>
      </div>
      <div class="stat-card stat-card--warning" style="cursor:pointer; opacity:${pendingOpacity}; transition: 0.2s;" onclick="setFormFilter('pending')">
        <div class="stat-card__icon">⏳</div>
        <div class="stat-card__value">${pending}</div>
        <div class="stat-card__label">Pending Forms</div>
      </div>
      <div class="stat-card stat-card--info" style="cursor:pointer; opacity:${allOpacity}; transition: 0.2s;" onclick="setFormFilter('all')">
        <div class="stat-card__icon">📋</div>
        <div class="stat-card__value">${filled + pending}</div>
        <div class="stat-card__label">All Forms</div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header"><h3 class="card-title">${AppState.formFilter === 'all' ? 'All' : (AppState.formFilter === 'filled' ? 'Filled' : 'Pending')} Form Status</h3></div>
      <div class="card-body" style="max-height: 600px; overflow-y: auto;">
        <div class="table-responsive">
      <table class="table" style="width: 100%;">
        <thead>
          <tr>
            <th>Fellow Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>College</th>
            <th>HOC</th>
            <th>T-Shirt</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${listHtml}
        </tbody>
      </table>
   </div>
      </div>
    </div>
  `;
  
  return formsHtml;
}
function renderInstagram() { return '<div class="empty-state"><div class="empty-state__icon">📸</div><div class="empty-state__title">Section Removed</div></div>'; }

function renderAlerts() {
  const isAdm = AppState.currentUser.isAdmin;
  const myName = AppState.currentUser.name;

  let missingInfo = [];
  AppState.fellows.forEach(f => {
    if (!isAdm && f.pocAssigned !== myName) return;
    
    const mName = f.fellowName || ''; const mEmail = f.emailId || ''; const mPhone = f.whatsappNo || '';

    // If the fellow name is completely missing or 'No Fellow', we might alert it, but user wants it removed.
    // If they have no fellow assigned to a college yet (meaning it's just a blank slot), don't complain to POC about missing contact info.
    if (!mName || mName.trim() === '' || mName.toLowerCase() === 'unknown' || mName.toLowerCase() === 'n/a' || mName === '?') {
      // It's a vacant college. Skip alerts for vacant colleges.
      return; 
    }

    if (!mEmail || mEmail === 'N/A' || !mPhone || mPhone === 'N/A') {
      missingInfo.push({ id: f.id, college: f.collegeName, issue: 'Missing Contact Info (Email/Phone)', poc: f.pocAssigned });
    } else if (!f.city || f.city === 'N/A') {
      missingInfo.push({ id: f.id, college: f.collegeName, issue: 'Missing City', poc: f.pocAssigned });
    } else if (!f.clubPageLink || f.clubPageLink === 'N/A' || f.clubPageLink === '#N/A') {
      missingInfo.push({ id: f.id, college: f.collegeName, issue: 'Missing Club Page Link', poc: f.pocAssigned });
    } else if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance === '') {
      missingInfo.push({ id: f.id, college: f.collegeName, issue: 'Missing Final Acceptance Status', poc: f.pocAssigned });
    }
  });

  const missingHtml = missingInfo.length > 0 ? missingInfo.map(m => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding: 12px; border-bottom:1px solid rgba(148,163,184,0.1);">
      <div>
        <div style="font-weight:600; color:#F1F5F9;">${escapeHTML(m.college)}</div>
        <div style="font-size:12px; color:#EF4444;">${m.issue}</div>
      </div>
      <div style="display:flex; gap:10px; align-items:center;">
        <span style="font-size:12px; color:#94A3B8;">${m.poc}</span>
        <button class="btn btn--sm btn--primary" onclick="renderEditModal('${m.id}')">Edit</button>
      </div>
    </div>
  `).join('') : '<div style="padding: 20px; color: #94A3B8; text-align:center;">No missing information detected.</div>';

  const incomingReqs = AppState.pocTransfers.filter(t => t.toPoc === myName && t.status === 'pending');
  const incomingHtml = incomingReqs.length > 0 ? incomingReqs.map(t => {
    const f = AppState.fellows.find(x => x.id === t.fellowId);
    if (!f) return '';
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 12px; border:1px solid rgba(148,163,184,0.1); border-radius: 8px; margin-bottom:10px; background:rgba(15,23,42,0.5);">
        <div>
          <div style="font-weight:600; color:#F1F5F9;">${escapeHTML(f.fellowName || 'Unknown')} (${escapeHTML(f.collegeName)})</div>
          <div style="font-size:12px; color:#94A3B8;">Requested by: <strong style="color:#A78BFA">${t.fromPoc}</strong></div>
          <div style="font-size:12px; color:#94A3B8; font-style:italic;">Reason: "${escapeHTML(t.reason)}"</div>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn btn--sm btn--danger" onclick="window.rejectTransfer('${t.id}')">Reject</button>
          <button class="btn btn--sm btn--success" onclick="window.approveTransfer('${t.id}')">Approve</button>
        </div>
      </div>
    `;
  }).join('') : '<div style="padding: 20px; color: #94A3B8; text-align:center;">No pending transfer requests for you.</div>';

  const outgoingReqs = AppState.pocTransfers.filter(t => t.fromPoc === myName);
  const outgoingHtml = outgoingReqs.length > 0 ? outgoingReqs.map(t => {
    const f = AppState.fellows.find(x => x.id === t.fellowId);
    const fname = f ? f.fellowName || f.collegeName : 'Unknown';
    let statColor = '#94A3B8';
    if (t.status === 'approved') statColor = '#10B981';
    if (t.status === 'rejected') statColor = '#EF4444';
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding: 12px; border-bottom:1px solid rgba(148,163,184,0.1);">
        <div>
          <div style="font-weight:600; color:#F1F5F9;">${escapeHTML(fname)} &rarr; ${t.toPoc}</div>
          <div style="font-size:12px; color:#94A3B8;">Reason: "${escapeHTML(t.reason)}"</div>
        </div>
        <div style="font-size:12px; font-weight:bold; color:${statColor}; text-transform:uppercase;">
          ${t.status}
        </div>
      </div>
    `;
  }).join('') : '<div style="padding: 20px; color: #94A3B8; text-align:center;">You have not made any transfer requests.</div>';

  let adminLogHtml = '';
  if (isAdm) {
    const logs = AppState.pocTransfers.filter(t => t.status === 'approved' || t.status === 'rejected').sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    adminLogHtml = `
      <div class="card" style="margin-top: 20px;">
        <div class="card-header"><h3 class="card-title">Admin Log: All Transfers</h3></div>
        <div class="card-body" style="padding: 0; max-height:300px; overflow-y:auto;">
          ${logs.length > 0 ? logs.map(t => {
            const f = AppState.fellows.find(x => x.id === t.fellowId);
            const fname = f ? f.fellowName || f.collegeName : 'Unknown';
            return `
              <div style="padding:12px; border-bottom:1px solid rgba(148,163,184,0.1);">
                <div style="font-weight:600; color:#F1F5F9;">${escapeHTML(fname)}</div>
                <div style="font-size:12px; color:#94A3B8;">${t.fromPoc} &rarr; ${t.toPoc} | Status: ${t.status.toUpperCase()}</div>
                <div style="font-size:12px; color:#94A3B8; font-style:italic;">Reason: "${escapeHTML(t.reason)}"</div>
              </div>
            `;
          }).join('') : '<div style="padding: 20px; color: #94A3B8; text-align:center;">No completed transfers yet.</div>'}
        </div>
      </div>
    `;
  }

  const myFellowOptions = AppState.fellows
    .filter(f => f.pocAssigned === myName)
    .map(f => `<option value="${f.id}">${escapeHTML(f.fellowName || f.collegeName)}</option>`)
    .join('');
  const pocOptions = TEAM.filter(t => t.name !== myName && !t.isAdmin).map(t => `<option value="${t.name}">${t.name}</option>`).join('');

  return `
    <div class="fade-in">
      <header class="page-header">
        <div>
          <h1 class="page-title">Alerts & Transfers 🔔</h1>
          <p class="page-subtitle">Manage missing info and POC changes</p>
        </div>
      </header>
      
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; align-items:start;">
        <div>
          <div class="card" style="margin-bottom: 20px;">
            <div class="card-header"><h3 class="card-title text-danger">Missing Information</h3></div>
            <div class="card-body" style="padding: 0; max-height:300px; overflow-y:auto;">
              ${missingHtml}
            </div>
          </div>
          
          <div class="card">
            <div class="card-header"><h3 class="card-title text-warning">Incoming Transfer Requests</h3></div>
            <div class="card-body" style="max-height:300px; overflow-y:auto;">
              ${incomingHtml}
            </div>
          </div>
        </div>
        
        <div>
          <div class="card" style="margin-bottom: 20px;">
            <div class="card-header"><h3 class="card-title text-primary">Request POC Transfer</h3></div>
            <div class="card-body" style="max-height: 600px; overflow-y: auto;">
              ${myFellowOptions ? `
                <div class="form-group">
                  <label class="form-label">Select Fellow / College</label>
                  <select id="transferFellowId" class="form-select">${myFellowOptions}</select>
                </div>
                <div class="form-group">
                  <label class="form-label">Transfer To POC</label>
                  <select id="transferToPoc" class="form-select">${pocOptions}</select>
                </div>
                <div class="form-group">
                  <label class="form-label">Reason</label>
                  <input type="text" id="transferReason" class="form-input" placeholder="e.g. Workload distribution">
                </div>
                <button class="btn btn--primary w-100" id="btnSubmitTransfer">Submit Request</button>
              ` : '<div class="empty-state"><div class="empty-state__title">No fellows to transfer</div></div>'}
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3 class="card-title">My Transfer Requests</h3></div>
            <div class="card-body" style="padding: 0; max-height:200px; overflow-y:auto;">
              ${outgoingHtml}
            </div>
          </div>
          
          ${adminLogHtml}
        </div>
      </div>
    </div>
  `;
}

function renderFellowProfile(fellowId) {
    try {
      const fellow = AppState.fellows.find(x => x.id === fellowId);
      if (!fellow) return;
      const alumni = typeof findAlumniForFellow === 'function' ? findAlumniForFellow(fellow) : null;

    let dName = fellow.fellowName || '';
    if (!dName || dName.trim() === '') dName = '';
    
    const dCollege = fellow.collegeName || 'Unknown';
    const dCity = fellow.city || 'Unknown';
    const dState = fellow.state ? `, ${fellow.state}` : '';
    
    const dEmail = fellow.emailId || '';
    const dPhone = fellow.whatsappNo || '';
    const dInsta = fellow.instagram || '';

    let photoUrl = fellow.photoUrl || null;

    const poc = TEAM.find(t => t.name === fellow.pocAssigned) || TEAM[TEAM.length - 1];

    let photoHtml = '';
    
    const teamClass = poc.team ? ' team-ring--' + poc.team.toLowerCase() : '';
    if (photoUrl) {
      photoHtml = `<img src="${photoUrl}" referrerpolicy="no-referrer" class="profile-photo${teamClass}" onerror="this.outerHTML='<div class=&quot;profile-photo-placeholder${teamClass}&quot; style=&quot;background-color:${poc.color}&quot;>${dName.charAt(0).toUpperCase()}</div>'" />`;
    } else {
      photoHtml = `<div class="profile-photo-placeholder${teamClass}" style="background-color:${poc.color}">${dName.charAt(0).toUpperCase()}</div>`;
    }

    const parseFollowers = parseInt(fellow.followersCount) || 0;

    let clubHandle = fellow.clubPageLink || '';
    let clubUrl = '';
    if (clubHandle && clubHandle !== 'N/A' && clubHandle !== '#N/A' && clubHandle.trim() !== '') {
      if (clubHandle.includes('instagram.com/')) {
        clubUrl = clubHandle;
        if (!clubUrl.startsWith('http')) clubUrl = 'https://' + clubUrl;
        try {
          const urlObj = new URL(clubUrl);
          const path = urlObj.pathname.replace(/^\/|\/$/g, '');
          if (path) clubHandle = '@' + path.split('/')[0];
        } catch(e) {}
      } else if (clubHandle.startsWith('@')) {
        clubUrl = 'https://instagram.com/' + clubHandle.substring(1);
      } else {
        clubUrl = 'https://instagram.com/' + clubHandle;
        clubHandle = '@' + clubHandle;
      }
    } else {
      clubHandle = '';
    }

    const autoStrikes = (fellow._autoStrikes || []).map(s => `<span class="badge badge--${s.severity}">⚡ ${s.reason}</span>`).join(' ');

    const missingLabel = '<span style="color:#EF4444; font-size:12px; font-style:italic;">Not Provided</span>';

    const html = `
      <div class="modal-overlay fade-in" style="display:flex; align-items:flex-start; justify-content:center; overflow-y:auto; padding: 20px 0;">
        <div class="modal" style="width: 900px; max-width: 95%; padding: 0; max-height: 90vh; overflow-y: scroll; background: #0F172A; border: 1px solid rgba(148,163,184,0.1); position: relative; margin-top: 5vh; margin-bottom: 5vh;">
          <button id="closeProfileModalSticky" onclick="document.getElementById('modalContainer').innerHTML=''" style="position: sticky; top: 16px; right: 16px; float: right; background: #EF4444; color: white; padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); z-index: 100;">Exit Profile</button>
          <div class="profile-header">
            ${photoHtml}
            <div style="flex: 1;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  
<h2 class="profile-name ${dName === 'Unknown' ? 'text-danger' : ''}">#${fellow.displayId || '000'} - ${escapeHTML(dName)} ${renderStrikeDots(fellow.id)}</h2>
<div style="margin-top: 4px; margin-bottom: 8px; display: flex; gap: 8px; align-items: center;">
  <span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA; font-size:11px; padding: 4px 8px; white-space:nowrap; display:inline-block;">August Intake</span>
  ${poc.team ? `<span class="badge" style="background: ${poc.color}22; color: ${poc.color};">${poc.team}</span>` : ''}
</div>

                  <div class="profile-college">${escapeHTML(dCollege)}</div>
                  <div class="profile-location">📍 ${escapeHTML(dCity)}${escapeHTML(dState)}</div>
                  ${clubHandle ? `
                  <div style="margin-top: 12px; background: rgba(124,58,237,0.1); padding: 8px 12px; border-radius: 8px; display: inline-block; border: 1px solid rgba(124,58,237,0.2);">
                    <div style="font-weight: 600; color: #A78BFA; margin-bottom: 4px;">${escapeHTML(clubHandle)}</div>
                    <div style="display: flex; gap: 12px; font-size: 13px;">
                      <a href="${escapeHTML(clubUrl)}" target="_blank" style="color: #F1F5F9; text-decoration: none; display: flex; align-items: center; gap: 4px;"><span style="font-size: 11px;">🔗</span> View Profile</a>
                      <span style="color: #94A3B8; display: flex; align-items: center; gap: 4px;"><span style="font-size: 11px;">👥</span> ${parseFollowers.toLocaleString()} followers</span>
                    </div>
                  </div>
                  ` : ''}
                </div>
                <div style="text-align:right;">
                  <div style="margin-bottom:10px;">${renderBadge(fellow.fellowStatus)}</div>
                  <div style="display:flex; align-items:center; gap:8px; justify-content:flex-end;">
                    <span style="font-size:12px; color:#94A3B8;">POC:</span>
                    ${renderAvatar(poc.name, poc.color, 'sm', poc.team)}
                    <span style="font-size:14px; font-weight:600; color:#F1F5F9;">${escapeHTML(poc.name)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="profile-stats">
            <div class="profile-stat">
              <div class="profile-stat__value">${parseFollowers.toLocaleString()}</div>
              <div class="profile-stat__label">📱 Followers</div>
            </div>
            <div class="profile-stat">
              <div class="profile-stat__value">${escapeHTML(fellow.reelsPostedWeek1 || '0')}</div>
              <div class="profile-stat__label">🎬 Reels W1</div>
            </div>
            <div class="profile-stat">
              <div class="profile-stat__value">${escapeHTML(fellow.contentPiecesPosted || '0')}</div>
              <div class="profile-stat__label">📝 Content Pieces</div>
            </div>
            <div class="profile-stat">
              <div class="profile-stat__value" style="font-size: 16px; display:flex; align-items:center; justify-content:center; height:100%;">${renderBadge(fellow.clubPageActivity)}</div>
              <div class="profile-stat__label">Activity</div>
            </div>
          </div>

          <div class="profile-grid">
            <div class="card" style="background: rgba(30,41,59,0.5); margin:0;">
              <div class="card-header"><h3 class="card-title">Basic Details</h3></div>
              <div class="card-body" style="padding-top:0;">
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Email</div>
                  <div class="profile-detail-value">${dEmail ? `<a href="mailto:${escapeHTML(dEmail)}">${escapeHTML(dEmail)}</a>` : missingLabel}</div>
                </div>
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Phone / WhatsApp</div>
                  <div class="profile-detail-value">${dPhone ? `<a href="tel:${escapeHTML(dPhone)}">${escapeHTML(dPhone)}</a>` : missingLabel}</div>
                </div>
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Personal Instagram</div>
                  <div class="profile-detail-value">
                    ${dInsta ? `<a href="${escapeHTML(dInsta.startsWith('http') ? dInsta : 'https://instagram.com/' + dInsta.replace('@',''))}" target="_blank">View Profile ↗</a>` : missingLabel}
                  </div>
                </div>
                ${true ? `
                <div class="profile-detail-row">
                  <div class="profile-detail-label">DOB</div>
                  <div class="profile-detail-value">${escapeHTML(fellow.dob || '-')}</div>
                </div>
                <div class="profile-detail-row">
                  <div class="profile-detail-label">T-Shirt Size</div>
                  <div class="profile-detail-value"><span class="badge badge--neutral">${escapeHTML(fellow.tshirt || '-')}</span></div>
                </div>
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Address</div>
                  <div class="profile-detail-value" style="font-size:12px;">${escapeHTML(fellow.address || '-')}</div>
                </div>
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Auditorium Capacity</div>
                  <div class="profile-detail-value">${escapeHTML(fellow.capacity || '-')}</div>
                </div>
                ` : ''}
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Source</div>
                  <div class="profile-detail-value">${escapeHTML(fellow.whereTheyComeFrom || '-')}</div>
                </div>
              </div>
            </div>

            <div class="card" style="background: rgba(30,41,59,0.5); margin:0;">
              <div class="card-header"><h3 class="card-title">Club Page & Operations</h3></div>
              <div class="card-body" style="padding-top:0;">
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Club Instagram Link</div>
                  <div class="profile-detail-value">
                    ${fellow.clubPageLink ? `<a href="${escapeHTML(fellow.clubPageLink)}" target="_blank">View Profile ↗</a>` : '-'}
                  </div>
                </div>
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Final Acceptance</div>
                  <div class="profile-detail-value">${renderBadge(fellow.finalAcceptance)}</div>
                </div>
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Club Made</div>
                  <div class="profile-detail-value">${renderBadge(fellow.clubMade)}</div>
                </div>
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Club Page Launched</div>
                  <div class="profile-detail-value">${renderBadge(fellow.clubPageLaunched)}</div>
                </div>
                </div>
            </div>
          </div>

          <div style="margin: 20px 24px; padding: 20px; border-radius: 12px; background: rgba(30,41,59,0.5); border: 1px solid rgba(59,130,246,0.1);">
            <h3 style="color:#F1F5F9; font-size:16px; margin:0 0 15px 0;">Core Team</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
              <div style="background: rgba(15,23,42,0.6); padding: 12px; border-radius: 8px;">
                <div style="font-size: 11px; color:#64748B; margin-bottom:4px; text-transform:uppercase;">Head of Content</div>
                <div style="font-size: 14px; font-weight:600; color:#E2E8F0;">${escapeHTML(fellow.manualHocName || fellow.hocName || 'Not Assigned')}</div>
                ${(fellow.manualHocName || fellow.hocName) ? `
                <div style="font-size: 12px; margin-top:4px;"><a style="color:#94A3B8;" href="mailto:${escapeHTML(fellow.manualHocEmail || fellow.hocEmail || '')}">${escapeHTML(fellow.manualHocEmail || fellow.hocEmail || '-')}</a></div>
                <div style="font-size: 12px; margin-top:2px;"><a style="color:#94A3B8;" href="tel:${escapeHTML(fellow.manualHocPhone || fellow.hocPhone || '')}">${escapeHTML(fellow.manualHocPhone || fellow.hocPhone || '-')}</a></div>
                ` : '<div style="font-size:12px; color:#64748B; font-style:italic;">Can be updated in Edit Tab</div>'}
              </div>
              <div style="background: rgba(15,23,42,0.6); padding: 12px; border-radius: 8px;">
                <div style="font-size: 11px; color:#64748B; margin-bottom:4px; text-transform:uppercase;">Head of Operations</div>
                <div style="font-size: 14px; font-weight:600; color:#E2E8F0;">${escapeHTML(fellow.manualHooName || fellow.hooName || 'Not Assigned')}</div>
                ${(fellow.manualHooName || fellow.hooName) ? `
                <div style="font-size: 12px; margin-top:4px;"><a style="color:#94A3B8;" href="mailto:${escapeHTML(fellow.manualHooEmail || fellow.hooEmail || '')}">${escapeHTML(fellow.manualHooEmail || fellow.hooEmail || '-')}</a></div>
                <div style="font-size: 12px; margin-top:2px;"><a style="color:#94A3B8;" href="tel:${escapeHTML(fellow.manualHooPhone || fellow.hooPhone || '')}">${escapeHTML(fellow.manualHooPhone || fellow.hooPhone || '-')}</a></div>
                ` : '<div style="font-size:12px; color:#64748B; font-style:italic;">Can be updated in Edit Tab</div>'}
              </div>
              <div style="background: rgba(15,23,42,0.6); padding: 12px; border-radius: 8px;">
                <div style="font-size: 11px; color:#64748B; margin-bottom:4px; text-transform:uppercase;">Faculty Advisor</div>
                <div style="font-size: 14px; font-weight:600; color:#E2E8F0;">${escapeHTML(fellow.manualFaName || fellow.faName || 'Not Assigned')}</div>
                ${(fellow.manualFaName || fellow.faName) ? `
                <div style="font-size: 12px; margin-top:4px;"><a style="color:#94A3B8;" href="mailto:${escapeHTML(fellow.manualFaEmail || fellow.faEmail || '')}">${escapeHTML(fellow.manualFaEmail || fellow.faEmail || '-')}</a></div>
                <div style="font-size: 12px; margin-top:2px;"><a style="color:#94A3B8;" href="tel:${escapeHTML(fellow.manualFaPhone || fellow.faPhone || '')}">${escapeHTML(fellow.manualFaPhone || fellow.faPhone || '-')}</a></div>
                ` : '<div style="font-size:12px; color:#64748B; font-style:italic;">Can be updated in Edit Tab</div>'}
              </div>
            </div>
          </div>

          <div style="margin: 20px 24px; padding: 20px; border-radius: 12px; background: rgba(30,41,59,0.5); border: 1px solid rgba(16,185,129,0.1);">
            <h3 style="color:#F1F5F9; font-size:16px; margin:0 0 15px 0;">Alumni / Handover Details</h3>
            ${alumni ? `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
              <div>
                <div style="color:#94A3B8; font-size:12px;">Previous Fellow</div>
                <div style="color:#E2E8F0; font-size:14px; font-weight:500;">${escapeHTML(alumni.alumniName)}</div>
                <div style="margin-top:5px; font-size:13px;"><a style="color:#94A3B8;" href="mailto:${escapeHTML(alumni.alumniEmail)}">${escapeHTML(alumni.alumniEmail)}</a></div>
                <div style="margin-top:2px; font-size:13px;"><a style="color:#94A3B8;" href="tel:${escapeHTML(alumni.alumniPhone)}">${escapeHTML(alumni.alumniPhone)}</a></div>
              </div>
              <div style="text-align:right;">
                <div style="color:#94A3B8; font-size:12px; margin-bottom:5px;">Handover Preferences</div>
                <div style="display:flex; gap:5px; justify-content:flex-end; flex-wrap:wrap;">
                  ${alumni.hadSummit === 'Yes' ? renderBadge('Had Summit', 'success') : renderBadge('No Summit', 'danger')}
                  ${alumni.wantToBeContacted === 'Yes' ? renderBadge('Wants Contact', 'primary') : ''}
                  ${alumni.joinAlumniWhatsApp === 'Yes' ? renderBadge('Joined WhatsApp', 'info') : ''}
                  ${alumni.workWithUnder25 === 'Yes' ? renderBadge('Future Work', 'warning') : ''}
                </div>
                ${alumni.nominatedFellowVideo ? `<div style="margin-top:10px;"><a href="${escapeHTML(alumni.nominatedFellowVideo)}" target="_blank" class="btn btn--sm btn--primary">Watch Intro Video</a></div>` : ''}
              </div>
            </div>
            ${alumni.reasonForHandover ? `<div style="margin-top:15px; padding-top:15px; border-top:1px solid rgba(148,163,184,0.1); font-style:italic; color:#94A3B8; font-size:13px;">"${escapeHTML(alumni.reasonForHandover)}"</div>` : ''}
            ` : `
            <div class="empty-state" style="padding: 20px 0;">
              <div class="empty-state__title" style="font-size: 14px; color: #94A3B8; font-weight: 500;">No Alumni Details Available</div>
              <div class="empty-state__text" style="font-size: 12px; margin-top: 4px;">Alumni information will appear here once the previous fellow fills out the handover form.</div>
            </div>
            `}
          </div>

          <div class="profile-strikes">
            <h3 style="color:#F1F5F9; font-size:16px; margin-bottom:12px; margin-top:0;">Strikes & Infractions</h3>
            <div style="background:rgba(30,41,59,0.5); border-radius:12px; padding:16px; border:1px solid rgba(148,163,184,0.1);">
              <div style="margin-bottom:10px;">
                <span style="color:#94A3B8; font-size:13px; font-weight:500; display:inline-block; width:120px;">Auto-Strikes:</span>
                ${autoStrikes || '<span style="color:#64748B; font-size:13px;">None</span>'}
              </div>
              <div style="margin-bottom:10px;">
                <span style="color:#94A3B8; font-size:13px; font-weight:500; display:inline-block; width:120px;">Manual Strike 1:</span>
                <span style="color:#F1F5F9; font-size:13px;">${escapeHTML(fellow.strike1 || 'None')} ${fellow.statusOfStrike1 ? `(${escapeHTML(fellow.statusOfStrike1)})` : ''}</span>
              </div>
              <div>
                <span style="color:#94A3B8; font-size:13px; font-weight:500; display:inline-block; width:120px;">Manual Strike 2:</span>
                <span style="color:#F1F5F9; font-size:13px;">${escapeHTML(fellow.strike2 || 'None')}</span>
              </div>
            </div>
          </div>

          <div class="profile-comments">
            <h3 style="color:#F1F5F9; font-size:16px; margin-bottom:12px; margin-top:0;">Comments</h3>
            <div class="profile-comments__text">
              ${escapeHTML(fellow.comments || 'No comments available for this fellow.')}
            </div>
          </div>

          <div class="modal-footer flex flex-between" style="border-top:1px solid rgba(148,163,184,0.1); padding:20px 32px; background:rgba(15,23,42,0.8);">
            <button class="btn btn--ghost" id="closeProfileModal">Close</button>
            ${(AppState.currentUser.isAdmin || AppState.currentUser.name === fellow.pocAssigned) ? `<button class="btn btn--primary" id="editFromProfileModal" data-id="${fellow.id}">✏️ Edit Fellow</button>` : ''}
          </div>
        </div>
      </div>
    `;

    const mc = document.getElementById('modalContainer');
    mc.innerHTML = html;

    document.getElementById('closeProfileModal').onclick = () => mc.innerHTML = '';
    const editBtn = document.getElementById('editFromProfileModal');
    if (editBtn) {
      editBtn.onclick = (e) => {
        mc.innerHTML = '';
        renderEditModal(e.target.dataset.id);
      };
    }
  } catch (err) {
    console.error("Profile Render Error: ", err);
    alert("Error loading profile: " + err.message);
  }
}

function renderCurrentView() {
  switch(AppState.currentView) {
    case 'dashboard': return renderDashboard();
    case 'my-fellows': return renderMyFellows();
    case 'all-fellows': return renderAllFellows();
    case 'strikes': return renderStrikes();
    case 'forms': return renderForms();
    case 'instagram': return renderInstagram();
    case 'alerts': return renderAlerts();
    case 'requests': return renderFellowRequests();
    default: return renderDashboard();
  }
}

function renderFellowRequests() {
  const isAdm = AppState.currentUser.isAdmin;
  const myFellows = AppState.fellows.filter(f => f.pocAssigned === AppState.currentUser.name);
  
  let html = `
    <div class="fade-in">
      <header class="page-header">
        <div>
          <h1 class="page-title">Fellow Requests</h1>
          <p class="page-subtitle">${isAdm ? 'Approve or reject requests from POCs' : 'Request to add, remove, or replace your fellows'}</p>
        </div>
      </header>
  `;
  
  if (!isAdm) {
    const fellowOptions = myFellows.map(f => `<option value="${escapeHTML(f.id)}">${escapeHTML(f.collegeName)} - ${escapeHTML(f.fellowName)}</option>`).join('');
    html += `
      <div class="card" style="margin-bottom:24px; max-width:600px;">
        <div class="card-header"><h3 class="card-title">New Request</h3></div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">Request Type</label>
            <select id="freqType" class="form-select" onchange="
              const t = this.value;
              document.getElementById('freqCollegeBlock').style.display = (t==='Add') ? 'block' : 'none';
              document.getElementById('freqFellowBlock').style.display = (t==='Remove' || t==='Replace') ? 'block' : 'none';
              document.getElementById('freqNewNameBlock').style.display = (t==='Add' || t==='Replace') ? 'block' : 'none';
            ">
              <option value="Add">Add New Fellow</option>
              <option value="Remove">Remove Fellow</option>
              <option value="Replace">Replace Fellow</option>
            </select>
          </div>
          <div class="form-group" id="freqCollegeBlock">
            <label class="form-label">College Name</label>
            <input type="text" id="freqCollege" class="form-input" placeholder="e.g. Under25 Christ Kengeri">
          </div>
          <div class="form-group" id="freqFellowBlock" style="display:none;">
            <label class="form-label">Select Fellow (for Remove/Replace)</label>
            <select id="freqFellowId" class="form-select">${fellowOptions}</select>
          </div>
          <div class="form-group" id="freqNewNameBlock">
            <label class="form-label">New Fellow Name</label>
            <input type="text" id="freqNewName" class="form-input" placeholder="e.g. John Doe">
          </div>
          <div class="form-group">
            <label class="form-label">Reason</label>
            <input type="text" id="freqReason" class="form-input" placeholder="Why are you making this request?">
          </div>
          <button class="btn btn--primary w-100" onclick="submitFellowRequest()">Submit Request</button>
        </div>
      </div>
    `;
  }
  
  // List Requests
  const requests = isAdm ? AppState.fellowRequests : AppState.fellowRequests.filter(r => r.requestedBy === AppState.currentUser.name);
  
  if (requests.length === 0) {
    html += `<div class="empty-state"><div class="empty-state__title">No requests found</div></div>`;
  } else {
    const rows = requests.map(r => {
      let statusBadge = '';
      if (r.status === 'pending') statusBadge = '<span class="badge badge--warning">Pending</span>';
      else if (r.status === 'approved') statusBadge = '<span class="badge badge--success">Approved</span>';
      else statusBadge = '<span class="badge badge--danger">Rejected</span>';
      
      const details = r.type === 'Add' ? `College: ${escapeHTML(r.college)}<br>New: ${escapeHTML(r.newFellow)}` :
                      r.type === 'Remove' ? `Target: ${escapeHTML(r.fellowName)}<br>College: ${escapeHTML(r.college)}` :
                      `Target: ${escapeHTML(r.fellowName)}<br>New: ${escapeHTML(r.newFellow)}`;
                      
      return `
        <tr>
          <td><span class="badge badge--${r.type === 'Add' ? 'success' : r.type === 'Remove' ? 'danger' : 'info'}">${r.type}</span></td>
          <td>${details}</td>
          <td>${escapeHTML(r.reason)}</td>
          <td>${escapeHTML(r.requestedBy)}</td>
          <td>${statusBadge} ${r.approvedBy ? `<div style="font-size:10px; color:#94a3b8; margin-top:4px;">by ${escapeHTML(r.approvedBy)}</div>` : ''}</td>
          <td>
            ${(isAdm && r.status === 'pending') ? `
              <button class="btn btn--icon text-success" onclick="approveFellowRequest('${r.id}')" title="Approve">✅</button>
              <button class="btn btn--icon text-danger" onclick="rejectFellowRequest('${r.id}')" title="Reject">❌</button>
            ` : ''}
          </td>
        </tr>
      `;
    }).join('');
    
    html += `
      <div class="card">
        <div class="card-header"><h3 class="card-title">Request History</h3></div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Details</th>
                <th>Reason</th>
                <th>Requested By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
    `;
  }
  
  html += `</div>`;
  return html;
}


function navigate(view) {
  AppState.currentView = view;
  AppState.searchQuery = '';
  const searchInput = document.getElementById('searchFellows');
  if (searchInput) searchInput.value = '';
  render();
}

function renderEditModal(fellowId) {
  const f = AppState.fellows.find(f => f.id === fellowId);
  if (!f) return;
  
  const modalHTML = `
    <div class="modal-overlay" id="editModalOverlay">
      <div class="modal" style="width: 700px;">
        <div class="modal-header">
          <h2 class="modal-title">Edit Fellow: ${escapeHTML(f.fellowName || f.collegeName)}</h2>
          <button class="modal-close" onclick="closeModal()">✖</button>
        </div>
        <div class="modal-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            ${FIELD_KEYS.map(k => {
              const label = FIELD_LABELS[k] || k;
              if (k === 'pocAssigned') {
                return `
                  <div class="form-group">
                    <label class="form-label">${label}</label>
                    <select class="form-select" id="edit_${k}">
                      ${TEAM.map(t => `<option value="${t.name}" ${f[k] === t.name ? 'selected' : ''}>${t.name}</option>`).join('')}
                    </select>
                  </div>
                `;
              }
              if (k === 'fellowStatus' || k === 'clubPageActivity' || k === 'finalAcceptance' || k === 'clubPageLaunched' || k === 'clubMade') {
                return `
                  <div class="form-group">
                    <label class="form-label">${label}</label>
                    <select class="form-select" id="edit_${k}">
                      <option value="Active" ${f[k] === 'Active' ? 'selected' : ''}>Active</option>
                      <option value="Inactive" ${f[k] === 'Inactive' ? 'selected' : ''}>Inactive</option>
                      <option value="Yes" ${f[k] === 'Yes' ? 'selected' : ''}>Yes</option>
                      <option value="No" ${f[k] === 'No' ? 'selected' : ''}>No</option>
                      <option value="On Hold" ${f[k] === 'On Hold' ? 'selected' : ''}>On Hold</option>
                      <option value="Ghosted" ${f[k] === 'Ghosted' ? 'selected' : ''}>Ghosted</option>
                      <option value="Dropped Out" ${f[k] === 'Dropped Out' ? 'selected' : ''}>Dropped Out</option>
                      <option value="N/A" ${f[k] === 'N/A' || !f[k] ? 'selected' : ''}>N/A</option>
                    </select>
                  </div>
                `;
              }
              return `
                <div class="form-group">
                  <label class="form-label">${label}</label>
                  <input type="text" class="form-input" id="edit_${k}" value="${escapeHTML(f[k] || '')}" />
                </div>
              `;
            }).join('')}
            <div class="form-group">
              <label class="form-label">Strike 1</label>
              <input type="text" class="form-input" id="edit_strike1" value="${escapeHTML(f.strike1 || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Strike 2</label>
              <input type="text" class="form-input" id="edit_strike2" value="${escapeHTML(f.strike2 || '')}" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn--ghost" onclick="closeModal()">Cancel</button>
          <button class="btn btn--primary" onclick="saveFellowData('${f.id}')">Save Changes</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modalContainer').innerHTML = modalHTML;
}

function closeModal() {
  document.getElementById('modalContainer').innerHTML = '';
}


// Now actively hooked up
async function syncFellowToSupabase(fellow) {
  try {
    const payload = {
      id: fellow.id,
      fellowname: fellow.fellowName,
      collegename: fellow.collegeName,
      city: fellow.city,
      pocassigned: fellow.pocAssigned,
      fellowstatus: fellow.fellowStatus,
      clubpageactivity: fellow.clubPageActivity,
      
      strike1: fellow.strike1,
      statusofstrike1: fellow.statusOfStrike1,
      strike2: fellow.strike2,
      strike3: fellow.strike3,
      email: fellow.email,
      instagram: fellow.instagram,
      dob: fellow.dob,
      state: fellow.state,
      capacity: fellow.capacity,
      address: fellow.address,
      tshirt: fellow.tshirt,
      hocname: fellow.hocName,
      hocphone: fellow.hocPhone,
      hocemail: fellow.hocEmail,
      hooname: fellow.hooName,
      hooemail: fellow.hooEmail,
      hoophone: fellow.hooPhone,
      faname: fellow.faName,
      faemail: fellow.faEmail,
      faphone: fellow.faPhone,
      photourl: fellow.photoUrl,
      intakestatus: fellow.intakeStatus,
      nomination: fellow.nomination,
      nominatedfellowname: fellow.nominatedFellowName,
      nominatedfellownumber: fellow.nominatedFellowNumber,
      nominatedfellowemail: fellow.nominatedFellowEmail,
      joinalumniwhatsapp: fellow.joinAlumniWhatsApp,
      workwithunder25: fellow.workWithUnder25,
      reasonforhandover: fellow.reasonForHandover,
      nominatedfellowvideo: fellow.nominatedFellowVideo,
      comments: fellow.comments
    };

    
    

    const res = await fetch(`${SUPABASE_URL}/rest/v1/fellows?id=eq.${fellow.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      console.error('Failed to sync to Supabase:', await res.text());
      showToast('Database Sync Error', 'error');
    }
  } catch(e) {
    console.error('Network error syncing to Supabase:', e);
  }
}

function saveFellowData(fellowId) {
  const f = AppState.fellows.find(f => f.id === fellowId);
  if (!f) return;
  
  let changed = false;
  
  FIELD_KEYS.concat(['strike1', 'strike2']).forEach(k => {
    const input = document.getElementById('edit_' + k);
    if (input) {
      const newVal = input.value.trim();
      if (f[k] !== newVal) {
        logChange(f.id, k, f[k], newVal);
        f[k] = newVal;
        changed = true;
      }
    }
  });
  
  if (changed) {
    runAutoStrikes();
    saveFellows();
    showToast('Changes saved successfully', 'success');
  }
  
  closeModal();
  render();
}



function bindEvents() {
  // Navigation
    const dbBtn = document.getElementById('downloadDbBtn');
  if (dbBtn) {
    dbBtn.addEventListener('click', () => {
      if (!AppState.fellows || !AppState.fellows.length) return;
      
      const keys = Object.keys(AppState.fellows[0]);
      const csvContent = [
        keys.join(','),
        ...AppState.fellows.map(f => {
          // Merge FAF data for export priority
          const acc = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(f) : null;
          const merged = { ...f };
          if (acc) {
            if (acc.college) merged.collegeName = acc.college;
            if (acc.fullName) merged.fellowName = acc.fullName;
            if (acc.phone) merged.whatsappNo = acc.phone;
            if (acc.email) merged.emailId = acc.email;
          }
          return keys.map(k => {
            let val = merged[k] === null || merged[k] === undefined ? '' : String(merged[k]);
            return '"' + val.replace(/"/g, '""') + '"';
          }).join(',')
        })
      ].join('');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'u25_database_export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Database downloaded', 'success');
    });
  }
  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
      const view = e.currentTarget.dataset.view;
      navigate(view);
    });
  });
  
  // Logout
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) btnLogout.addEventListener('click', logout);
  

  const changePwdBtn = document.getElementById('changePwdBtn');
  if (changePwdBtn) {
    changePwdBtn.addEventListener('click', () => {
      const currentPwd = prompt('Enter your CURRENT password to verify:');
      if (!currentPwd) return;
      
      const me = TEAM.find(t => t.name === AppState.currentUser.name);
      if (currentPwd.trim() !== (me.password || '').trim()) {
        showToast('Incorrect current password!', 'error');
        return;
      }
      
      const newPwd = prompt('Enter your NEW password:');
      if (!newPwd || newPwd.trim() === '') return;
      
      const newPwdConfirm = prompt('Confirm your NEW password:');
      if (newPwd !== newPwdConfirm) {
        showToast('Passwords do not match!', 'error');
        return;
      }
      
      // Save to Supabase
      me.password = newPwd;
      fetch(`${SUPABASE_URL}/rest/v1/team_users?name=eq.${me.name}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPwd })
      }).then(res => {
        if (res.ok) showToast('Password changed successfully!', 'success');
        else showToast('Failed to change password in DB', 'error');
      });
    });
  }

  // Search
  const searchInput = document.getElementById('searchFellows');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      // Debounce render
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(render, 300);
    });
    searchInput.focus(); // keep focus
  }
  
  // Dropdown Filters
  document.querySelectorAll('select.form-select[data-filter-type]').forEach(select => {
    select.addEventListener('change', (e) => {
      const type = e.target.dataset.filterType;
      const value = e.target.value;
      if (type === 'poc') AppState.filterPOC = value;
      else if (type === 'status') AppState.filterStatus = value;
      else if (type === 'city') AppState.filterCity = value;
      else if (type === 'activity') AppState.filterActivity = value;
      render();
    });
  });

  // Sorting
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', (e) => {
      const field = e.target.dataset.sort;
      if (AppState.sortField === field) {
        AppState.sortDirection = AppState.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        AppState.sortField = field;
        AppState.sortDirection = 'asc';
      }
      render();
    });
  });
  
  // Action Buttons
  const btnExport = document.getElementById('btnExport');
  if (btnExport) btnExport.addEventListener('click', exportCSV);
  
  const btnViewGrid = document.getElementById('btnViewGrid');
  if (btnViewGrid) {
    btnViewGrid.addEventListener('click', () => {
      AppState.allFellowsViewMode = 'grid';
      render();
    });
  }

  const btnViewSheet = document.getElementById('btnViewSheet');
  if (btnViewSheet) {
    btnViewSheet.addEventListener('click', () => {
      AppState.allFellowsViewMode = 'sheet';
      render();
    });
  }

  const btnMyViewGrid = document.getElementById('btnMyViewGrid');
  if (btnMyViewGrid) {
    btnMyViewGrid.addEventListener('click', () => {
      AppState.myFellowsViewMode = 'grid';
      render();
    });
  }

  const btnMyViewSheet = document.getElementById('btnMyViewSheet');
  if (btnMyViewSheet) {
    btnMyViewSheet.addEventListener('click', () => {
      AppState.myFellowsViewMode = 'sheet';
      render();
    });
  }
  
  const importFile = document.getElementById('importFile');
  if (importFile) importFile.addEventListener('change', (e) => {
    if (e.target.files.length > 0) importCSV(e.target.files[0]);
  });
  
  const btnAdd = document.getElementById('btnAddFellow');
  if (btnAdd) btnAdd.addEventListener('click', () => {
    const defaultData = {};
    FIELD_KEYS.forEach(k => defaultData[k] = '');
    defaultData.pocAssigned = AppState.currentUser.isAdmin ? 'Admin' : AppState.currentUser.name;
    defaultData.fellowStatus = 'Active';
    
    defaultData.id = generateDeterministicId(defaultData.emailId, defaultData.fellowName, defaultData.collegeName);
    AppState.fellows.unshift(defaultData);
    runAutoStrikes();
    saveFellows();
    render();
    renderEditModal(defaultData.id); // open edit immediately
  });

  // Transfer Submit
  const btnSubmitTransfer = document.getElementById('btnSubmitTransfer');
  if (btnSubmitTransfer) {
    btnSubmitTransfer.addEventListener('click', () => {
      const fid = document.getElementById('transferFellowId').value;
      const toPoc = document.getElementById('transferToPoc').value;
      const reason = document.getElementById('transferReason').value;
      if (!fid || !toPoc || !reason) {
        showToast('Please fill all transfer request fields', 'error');
        return;
      }
      AppState.pocTransfers.push({
        id: 'req_' + Date.now(),
        fellowId: fid,
        fromPoc: AppState.currentUser.name,
        toPoc: toPoc,
        reason: reason,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
      savePocTransfers();
      showToast('Transfer request sent!', 'success');
      render();
    });
  }

  // Global methods for inline onclick
  window.submitFellowRequest = () => {
    const type = document.getElementById('freqType').value;
    const college = document.getElementById('freqCollege').value;
    const fellowId = document.getElementById('freqFellowId').value;
    const newName = document.getElementById('freqNewName').value;
    const reason = document.getElementById('freqReason').value;
    
    if (!reason) {
      showToast('Please provide a reason', 'error');
      return;
    }
    
    let cName = college;
    let fName = newName;
    
    if (type === 'Remove' || type === 'Replace') {
      const existing = AppState.fellows.find(f => f.id === fellowId);
      if (!existing) return showToast('Please select a fellow', 'error');
      cName = existing.collegeName;
      fName = existing.fellowName;
    }
    if (type === 'Add' && (!cName || !newName)) return showToast('Fill all fields', 'error');
    if (type === 'Replace' && !newName) return showToast('Provide new fellow name', 'error');

    AppState.fellowRequests.unshift({
      id: 'req_' + Date.now(),
      type,
      college: cName,
      fellowName: fName,
      newFellow: newName,
      reason,
      fellowId: (type === 'Remove' || type === 'Replace') ? fellowId : null,
      requestedBy: AppState.currentUser.name,
      status: 'pending',
      timestamp: new Date().toISOString()
    });
    
    saveFellowRequests();
    showToast('Request submitted to Admin', 'success');
    render();
  };
  
  window.approveFellowRequest = (id) => {
    const req = AppState.fellowRequests.find(r => r.id === id);
    if (!req) return;
    
    if (req.type === 'Add') {
      const f = {};
      FIELD_KEYS.forEach(k => f[k] = '');
      f.id = 'f_' + Date.now();
      f.collegeName = req.college;
      f.fellowName = req.newFellow;
      f.pocAssigned = req.requestedBy;
      f.fellowStatus = 'Active';
      AppState.fellows.unshift(f);
      logChange(f.id, 'Creation', '', 'Added via request');
    } else if (req.type === 'Remove' || req.type === 'Replace') {
      // Physically delete as requested by user
      AppState.fellows = AppState.fellows.filter(f => f.id !== req.fellowId);
      
      if (req.type === 'Replace') {
        const f = {};
        FIELD_KEYS.forEach(k => f[k] = '');
        f.id = 'f_' + Date.now();
        f.collegeName = req.college;
        f.fellowName = req.newFellow;
        f.pocAssigned = req.requestedBy;
        f.fellowStatus = 'Active';
        AppState.fellows.unshift(f);
        logChange(f.id, 'Creation', '', 'Replaced fellow via request');
      }
    }
    
    req.status = 'approved';
    req.approvedBy = AppState.currentUser.name;
      savePocTransfers();
      showToast('Transfer approved', 'success');
      render();
    }
  };

  window.rejectTransfer = (id) => {
    const req = AppState.pocTransfers.find(t => t.id === id);
    if (req) {
      req.status = 'rejected';
      savePocTransfers();
      showToast('Transfer rejected', 'info');
      render();
    }
  };
  
  // Table row actions
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      deleteFellow(e.currentTarget.dataset.id);
    });
  });
  
  document.querySelectorAll('.btn-edit-full').forEach(btn => {
    btn.addEventListener('click', (e) => {
      renderEditModal(e.currentTarget.dataset.id);
    });
  });

  document.querySelectorAll('.btn-view-profile').forEach(btn => {
    btn.addEventListener('click', (e) => {
      renderFellowProfile(e.currentTarget.dataset.id);
    });
  });
  
  document.querySelectorAll('.fellow-name-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      renderFellowProfile(e.currentTarget.dataset.id);
    });
  });
  
  
  // Form Tracker Approve All
  const btnApproveAll = document.getElementById('btn-approve-all-faf');
  if (btnApproveAll) {
    btnApproveAll.addEventListener('click', () => {
      const btns = document.querySelectorAll('.btn-approve-faf');
      btns.forEach(btn => {
        const id = btn.dataset.id;
        const fellow = AppState.fellows.find(f => f.id === id);
        if(fellow) { 
          fellow.finalAcceptance = 'Yes'; 
          logChange(id, 'finalAcceptance', 'No', 'Yes'); 
          
          // Merge FAF data on approval
          const acc = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(fellow, true) : null;
          if (acc) {
            if (!fellow.fellowName || fellow.fellowName === 'N/A' || fellow.fellowName.trim() === '') fellow.fellowName = acc.fullName;
            if (!fellow.emailId || fellow.emailId === 'N/A' || fellow.emailId.trim() === '') fellow.emailId = acc.email;
            if (!fellow.whatsappNo || fellow.whatsappNo === 'N/A' || fellow.whatsappNo.trim() === '') fellow.whatsappNo = acc.phone;
            if (!fellow.collegeName || fellow.collegeName === 'N/A' || fellow.collegeName.trim() === '') fellow.collegeName = acc.college;
            fellow.dob = acc.dob;
            fellow.address = acc.address;
            fellow.tshirt = acc.tshirt;
          }
        }
      });
      if (btns.length > 0) {
        runAutoStrikes();
        saveFellows();
        showToast('All new acceptances approved!', 'success');
        render();
      }
    });
  }

  // Form Tracker Approve FAF Sync button
  document.querySelectorAll('.btn-approve-faf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      updateFellow(e.currentTarget.dataset.id, 'finalAcceptance', 'Yes');
      showToast('Form status synced', 'success');
      render();
    });
  });

  // Inline editing (simple text)
  document.querySelectorAll('.editable').forEach(td => {
    td.addEventListener('click', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return; // already editing
      
      const id = e.currentTarget.dataset.id;
      const field = e.currentTarget.dataset.field;
      const fellow = AppState.fellows.find(f => f.id === id);
      if (!fellow) return;
      
      const currentVal = fellow[field] || '';
      
      let input;
      if (field === 'fellowStatus') {
        input = document.createElement('select');
        STATUS_OPTIONS.forEach(o => {
          const opt = document.createElement('option');
          opt.value = o; opt.text = o;
          if (o === currentVal) opt.selected = true;
          input.appendChild(opt);
        });
      } else if (field === 'finalAcceptance' || field === 'clubPageLaunched') {
        input = document.createElement('select');
        YES_NO_OPTIONS.forEach(o => {
          const opt = document.createElement('option');
          opt.value = o; opt.text = o;
          if (o === currentVal) opt.selected = true;
          input.appendChild(opt);
        });
      } else if (field === 'clubPageActivity') {
        input = document.createElement('select');
        ACTIVITY_OPTIONS.forEach(o => {
          const opt = document.createElement('option');
          opt.value = o; opt.text = o;
          if (o === currentVal) opt.selected = true;
          input.appendChild(opt);
        });
      } else if (field === 'pocAssigned') {
        input = document.createElement('select');
        TEAM.filter(t=>t.name!=='Admin').forEach(t => {
          const opt = document.createElement('option');
          opt.value = t.name; opt.text = t.name;
          if (t.name === currentVal) opt.selected = true;
          input.appendChild(opt);
        });
      } else {
        input = document.createElement('input');
        input.type = 'text';
        input.value = currentVal;
      }
      
      input.className = 'form-input';
      input.style.width = '100%';
      input.style.minWidth = '100px';
      input.style.padding = '4px';
      
      e.currentTarget.innerHTML = '';
      e.currentTarget.appendChild(input);
      input.focus();
      
      const save = () => {
        if (input.value !== currentVal) {
          updateFellow(id, field, input.value);
        } else {
          render(); // just redraw
        }
      };
      
      input.addEventListener('blur', save);
      input.addEventListener('keypress', (ev) => {
        if (ev.key === 'Enter') {
          input.blur();
        }
      });
    });
  });
  
  // Strike rules toggles
  document.querySelectorAll('.rule-toggle').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const ruleId = e.target.dataset.rule;
      AppState.strikeRules[ruleId] = e.target.checked;
      runAutoStrikes();
      render();
    });
  });
  
  // Form tracker toggle
  document.querySelectorAll('.btn-mark-form').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const val = e.currentTarget.dataset.val;
      updateFellow(id, 'finalAcceptance', val);
    });
  });


window.setFormFilter = function(filter) {
  AppState.formFilter = filter;
  render();
};


function render() {
  let nextDisplayId = 1;
  AppState.fellows.forEach(f => {
    if (f.displayId) {
      const num = parseInt(f.displayId, 10);
      if (num >= nextDisplayId) nextDisplayId = num + 1;
    }
  });
  let idsAssigned = false;
  AppState.fellows.forEach(f => {
    if (!f.displayId) {
      f.displayId = String(nextDisplayId++).padStart(3, '0');
      idsAssigned = true;
    }
  });
  if (idsAssigned) saveFellows();

  
  if (AppState.fellows) {
    let changed = false;
    AppState.fellows.forEach(f => {
      ['clubRecruitmentCampaign'].forEach(k => {
        if (k in f) {
          delete f[k];
          changed = true;
        }
      });
      if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance.trim() === '') {
        f.finalAcceptance = 'No';
        changed = true;
      }
      const oldActivity = f.clubPageActivity;
      f.clubPageActivity = mapClubPageActivity(f.clubPageActivity);
      if (oldActivity !== f.clubPageActivity) changed = true;
    });
    if (changed) saveFellows();
  }


  // HOTFIX: Auto-restore Aviral Bhatt's strike
  if (AppState.strikeRecords && AppState.fellows) {
    let changed = false;
    AppState.strikeRecords.forEach(rec => {
      const fellow = AppState.fellows.find(f => f.id === rec.fellowId);
      if (fellow && fellow.fellowName && fellow.fellowName.includes('Aviral Bhatt')) {
        rec.strikes.forEach(strike => {
          if (strike.reason && strike.reason.includes('Not filled insight form') && strike.removed) {
            strike.removed = false;
            changed = true;
          }
        });
      }
    });
    if (changed) saveStrikeRecords();
  }

  if (!AppState.currentUser) {
    renderLogin();
    return;
  }
  
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="app-layout">
      ${renderSidebar()}
      <main class="main-content">
        ${renderCurrentView()}
      </main>
    </div>
  `;
  
  bindEvents();
  
  if (AppState.currentView === 'dashboard') {
    setTimeout(renderCharts, 50); // slight delay to ensure canvas is in DOM
  }
}


// =============================================
// SECTION 10: INITIALIZATION
// =============================================


function mergeFafDataOnce() {
  if (!AppState.fellows) return;
  AppState.fellows.forEach(f => {
    // Determine if it's a vacant slot BEFORE matching
    const originalName = (f.fellowName || '').trim();
    if (originalName === '' || originalName.toLowerCase() === 'n/a' || originalName === '?') {
       f.isVacant = true;
    } else {
       f.isVacant = false;
    }

    const acc = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(f, true) : null;
    if (acc) {
       if (!f.fellowName || f.fellowName.trim() === '' || f.fellowName.toLowerCase() === 'unknown' || f.fellowName === 'N/A') {
         f.fellowName = acc.fullName || f.fellowName;
       }
       if (!f.emailId || f.emailId.trim() === '' || f.emailId === 'N/A') {
         f.emailId = acc.email || f.emailId;
       }
       if (!f.whatsappNo || f.whatsappNo.trim() === '' || f.whatsappNo === 'N/A') {
         f.whatsappNo = acc.phone || f.whatsappNo;
       }
       if (!f.intakeStatus && acc.intake) {
         f.intakeStatus = acc.intake;
       }
       if (acc.photo) {
         f.photoUrl = getDriveImageUrl(acc.photo);
       }

       f.capacity = acc.capacity || f.capacity || '';
       f.faName = acc.faName || f.faName || '';
       f.faEmail = acc.faEmail || f.faEmail || '';
       f.faPhone = acc.faPhone || f.faPhone || '';
       f.hocName = acc.hocName || f.hocName || '';
       f.hocEmail = acc.hocEmail || f.hocEmail || '';
       f.hocPhone = acc.hocPhone || f.hocPhone || '';
       f.hooName = acc.hooName || f.hooName || '';
       f.hooEmail = acc.hooEmail || f.hooEmail || '';
       f.hooPhone = acc.hooPhone || f.hooPhone || '';
       f.state = acc.state || f.state || '';
       f.city = acc.city || f.city || '';

       if (f.fellowName && f.fellowName.trim() !== '' && f.fellowName.toLowerCase() !== 'n/a') {
         f.isVacant = false;
       }
    }
    
    // Fallback Alumni Photo
    if (!f.photoUrl) {
       const alumni = typeof findAlumniForFellow === 'function' ? findAlumniForFellow(f) : null;
       if (alumni && alumni.nominatedFellowPhoto) {
          f.photoUrl = getDriveImageUrl(alumni.nominatedFellowPhoto);
       }
    }
    
    // Fallback ID Generation if missing
    if (!f.displayId) {
      AppState.fellowIdCounter = (AppState.fellowIdCounter || 0) + 1;
      f.displayId = String(AppState.fellowIdCounter).padStart(3, '0');
    }
  });
}

async function init() {
  // Check if we need to migrate to new data source
  const dataVersion = localStorage.getItem('under25_data_version');
  if (dataVersion !== 'v2') {
    // Clear old strike data for fresh import
    localStorage.removeItem('under25_strike_phase');
    localStorage.removeItem('under25_strike_records');
    localStorage.removeItem('under25_strike_reviews');
    localStorage.removeItem('under25_fellows');
    localStorage.setItem('under25_data_version', 'v2');
    await syncFromSheets();
  } else {
    // Load from cache, with option to re-sync
    const savedFellows = loadFellows();
    if (savedFellows) { AppState.fellows = savedFellows; await fetchAdditionalDataFromSheets(); mergeFafDataOnce(); }
    else await syncFromSheets();
  }

  // Add CSS styles for strike toggle switch if missing
  if (!document.getElementById('dynamic-styles')) {
    const style = document.createElement('style');
    style.id = 'dynamic-styles';
    style.innerHTML = `
      .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
      .switch input { opacity: 0; width: 0; height: 0; }
      .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
      .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 2px; bottom: 2px; background-color: white; transition: .4s; }
      input:checked + .slider { background-color: #10B981; }
      input:checked + .slider:before { transform: translateX(20px); }
      .slider.round { border-radius: 20px; }
      .slider.round:before { border-radius: 50%; }
      .profile-header { position:relative; padding:32px; background:linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.15)); border-radius:16px 16px 0 0; display:flex; gap:24px; align-items:center; }
      .profile-photo { width:120px; height:120px; border-radius:16px; object-fit:cover; border:3px solid rgba(124,58,237,0.5); box-shadow:0 8px 24px rgba(0,0,0,0.3); }
      .profile-photo-placeholder { width:120px; height:120px; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:48px; font-weight:800; color:white; box-shadow:0 8px 24px rgba(0,0,0,0.3); }
      .profile-name { font-size:28px; font-weight:800; color:#F1F5F9; margin:0; }
      .profile-college { font-size:16px; color:#94A3B8; margin-top:4px; }
      .profile-location { font-size:14px; color:#64748B; margin-top:4px; display:flex; align-items:center; gap:4px; }
      .profile-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; padding:20px 32px; }
      .profile-stat { text-align:center; padding:16px; background:rgba(30,41,59,0.8); border-radius:12px; border:1px solid rgba(148,163,184,0.1); }
      .profile-stat__value { font-size:24px; font-weight:800; color:#F1F5F9; }
      .profile-stat__label { font-size:11px; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; margin-top:4px; }
      .profile-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; padding:0 32px 32px; }
      .profile-detail-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(148,163,184,0.1); }
      .profile-detail-label { font-size:13px; color:#64748B; font-weight:500; }
      .profile-detail-value { font-size:13px; color:#F1F5F9; font-weight:600; text-align:right; max-width:60%; }
      .profile-detail-value a { color:#A78BFA; text-decoration:none; }
      .profile-detail-value a:hover { text-decoration:underline; }
      .alumni-card { background:linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.08)); border:1px solid rgba(16,185,129,0.2); border-radius:16px; padding:24px; margin:0 32px 24px; }
      .alumni-header { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
      .alumni-name { font-size:18px; font-weight:700; color:#10B981; }
      .alumni-label { font-size:11px; color:#64748B; text-transform:uppercase; letter-spacing:1px; }
      .alumni-quote { font-style:italic; color:#94A3B8; padding:12px 16px; border-left:3px solid #10B981; background:rgba(16,185,129,0.05); border-radius:0 8px 8px 0; margin-top:12px; font-size:13px; line-height:1.6; }
      .profile-strikes { padding:0 32px 24px; }
      .profile-comments { padding:0 32px 24px; }
      .profile-comments__text { background:rgba(51,65,85,0.5); padding:16px; border-radius:12px; color:#94A3B8; font-size:14px; line-height:1.6; font-style:italic; }
    `;
    document.head.appendChild(style);
  }

  const saved = loadFellows();
  if (saved && saved.length > 0) {
    AppState.fellows = saved;
  }
  
  AppState.changeLog = loadChangeLog() || [];
  AppState.pocTransfers = loadPocTransfers();
  AppState.fellowRequests = loadFellowRequests();
  AppState.strikePhase = loadStrikePhase();
  AppState.strikeRecords = loadStrikeRecords();
  AppState.strikeReviews = loadStrikeReviews();
  AppState.removalRequests = loadRemovalRequests();
  
  const session = sessionStorage.getItem('under25_session');
  if (session) {
    try {
      AppState.currentUser = JSON.parse(session);
    } catch(e) {}
  }
  
  runAutoStrikes();
  loadNominations();
  loadAcceptances();
  render();
  
  // Auto-load CSV if no data exists
  if (AppState.fellows.length === 0) {
    autoLoadCSV();
  }
}

async function autoLoadCSV() {
  try {
    const response = await fetch('Fellowship 26-27 Tracker - Final Fellowship Tracker.csv');
    if (!response.ok) throw new Error('CSV not found');
    const csvText = await response.text();
    const parsed = parseCSV(csvText);
    if (parsed.length > 0) {
      AppState.fellows = parsed;
      runAutoStrikes();
      saveFellows();
      render();
      showToast(`Auto-loaded ${parsed.length} fellows from tracker!`, 'success');
    }
  } catch (err) {
    console.log('Auto-load failed, waiting for manual import:', err);
    // Show manual import option after login if auto-load fails
    if (AppState.currentUser) {
      showImportModal();
    }
  }
}

function showImportModal() {
  const mc = document.getElementById('modalContainer');
  if (!mc) return;
  mc.innerHTML = `
    <div class="modal-overlay fade-in" style="display:flex; align-items:flex-start; justify-content:center; overflow-y:auto; padding: 20px 0;">
      <div class="modal" style="width: 400px; text-align: center;">
        <div class="modal-body">
          <div style="font-size: 3rem; margin-bottom: 10px;">👋</div>
          <h2>Welcome to Ops Dashboard!</h2>
          <p style="color: #64748b; margin-bottom: 20px;">Import the CSV tracker to get started.</p>
          
          <button class="btn btn--ghost w-100" style="margin-top: 10px;" id="btnCloseWelcome">Skip for now</button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('welcomeImportFile').addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      importCSV(e.target.files[0]);
      mc.innerHTML = '';
    }
  });
  
  document.getElementById('btnCloseWelcome').onclick = () => {
    mc.innerHTML = '';
  };
}

// Start app
document.addEventListener('DOMContentLoaded', init);


function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast toast--' + type;
  toast.innerHTML = '<div>' + message + '</div><button class="toast-close" onclick="this.parentElement.remove()">&times;</button>';
  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 3000);
}


function runAutoStrikes() {
  if (!AppState.fellows) return;
  AppState.fellows.forEach(fellow => {
    fellow._autoStrikes = evaluateStrikes(fellow);
  });
}

function evaluateStrikes(fellow) {
  const strikes = [];
  if (!AppState.strikeRules) return strikes;
  if (fellow.fellowStatus === 'Dropped Out') return strikes;
  
  if (AppState.strikeRules.ruleGhosting !== false && fellow.fellowStatus === 'Ghosted') {
    strikes.push({ reason: 'Ghosting', severity: 'danger' });
    return strikes;
  }
  
  if (fellow.fellowStatus === 'Inactive') return strikes;

  if (AppState.strikeRules.rule1 && (fellow.finalAcceptance === 'No' || fellow.finalAcceptance === '')) {
    strikes.push({ reason: 'Final Acceptance Form', severity: 'warning' });
  }
  
  
    if (AppState.strikeRules.rule2 && fellow.finalAcceptance === 'Yes' && (fellow.clubPageLaunched === 'No' || fellow.clubPageLaunched === '')) {
    strikes.push({ reason: 'Club Page Launch', severity: 'warning' });
  }

  if (AppState.strikeRules.rule3 && fellow.clubPageLaunched === 'Yes' && fellow.clubPageActivity === 'Inactive') {
    strikes.push({ reason: 'Page Inactive', severity: 'danger' });
  }
  return strikes;
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
      
      <div style="margin-top: auto; border-top: 1px solid rgba(148, 163, 184, 0.1); padding: 20px 16px;">
        <div style="font-size: 11px; color: #94A3B8; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 12px;">Logged in as</div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          ${renderAvatar(AppState.currentUser.name, AppState.currentUser.color, 'sm', AppState.currentUser.team)}
          <div>
            <div style="font-weight: 600; color: #F1F5F9; font-size: 14px;">${escapeHTML(AppState.currentUser.name)}</div>
            <div style="font-size: 12px; color: ${AppState.currentUser.color};">${escapeHTML(AppState.currentUser.team)}</div>
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div class="nav-item" id="downloadDbBtn" style="color: #10B981; padding: 8px 10px; cursor: pointer;">
            <span class="nav-icon" style="font-size: 14px;">⬇️</span><span class="nav-label" style="font-size: 13px;">Download DB</span>
          </div>
          <div class="nav-item" id="changePwdBtn" style="color: #F59E0B; padding: 8px 10px; cursor: pointer;">
            <span class="nav-icon" style="font-size: 14px;">🔑</span><span class="nav-label" style="font-size: 13px;">Change Password</span>
          </div>
          <div class="nav-item" id="btnLogout" style="color: #EF4444; padding: 8px 10px; cursor: pointer;">
            <span class="nav-icon" style="font-size: 14px;">🚪</span><span class="nav-label" style="font-size: 13px;">Logout</span>
          </div>
        </div>
      </div>
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
  if (user) {
    const myFellowsCheck = fellows.filter(f => f.pocAssigned === user.name);
    if (true) {
    const myFellows = fellows.filter(f => f.pocAssigned === user.name);
    const myStatusCounts = {};
    myFellows.forEach(f => { myStatusCounts[f.fellowStatus] = (myStatusCounts[f.fellowStatus] || 0) + 1; });
    const myStatusData = Object.keys(myStatusCounts).map(s => ({ label: s, value: myStatusCounts[s], color: statusColors[s] || '#CBD5E1' }));
    renderDonutChart('myStatusChart', myStatusData);
    renderLegend('myStatusLegend', myStatusData);
    }
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

function login(username, pwd) {
  const user = TEAM.find(t => t.name === username);
  if (!user) return;
  if (pwd === user.password) {
    AppState.currentUser = user;
    AppState.currentView = 'dashboard';
    showToast(`Welcome back, ${user.name}!`, 'success');
    render();
  } else {
    showToast('Incorrect password', 'error');
  }
}

function calculateHealthScore(fellow) {
  let score = 0;
  if (fellow.finalAcceptance === 'Yes') score += 15;
  
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



function renderMassAddModal() {
  const modalHTML = `
    <div class="modal-overlay" id="massAddModalOverlay">
      <div class="modal" style="width: 900px; max-width: 95vw;">
        <div class="modal-header">
          <h2 class="modal-title">Mass Add Fellows</h2>
          <button class="modal-close" onclick="document.getElementById('massAddModalOverlay').remove()">?</button>
        </div>
        <div class="modal-body" style="overflow-x: auto;">
          <div style="display:flex; gap: 15px; margin-bottom: 20px;">
            <div class="form-group" style="flex:1;">
              <label class="form-label">Number of Fellows to Add</label>
              <input type="number" id="massAddCount" class="form-input" min="1" max="100" value="5">
            </div>
            <div class="form-group" style="flex:1;">
              <label class="form-label">Intake Label</label>
              <input type="text" id="massAddIntake" class="form-input" placeholder="e.g. Intake 2" value="Intake 2">
            </div>
            <div style="flex:1; display:flex; align-items:flex-end; padding-bottom:15px;">
              <button class="btn btn--secondary" onclick="generateMassAddGrid()">Generate Grid</button>
            </div>
          </div>
          <div id="massAddGridContainer"></div>
        </div>
        <div class="modal-footer" style="margin-top:20px; border-top:1px solid #334155; padding-top:15px; text-align:right;">
          <button class="btn btn--primary" onclick="saveMassAdd()">Save Fellows</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  generateMassAddGrid();
}

function generateMassAddGrid() {
  const count = parseInt(document.getElementById('massAddCount').value) || 5;
  const intake = document.getElementById('massAddIntake').value || '';
  
  let gridHtml = `
    <table class="table" style="width: 100%; min-width: 1200px;">
      <thead>
        <tr>
          <th>College Name</th>
          <th>Fellow Name</th>
          <th>WhatsApp No.</th>
          <th>Email ID</th>
          <th>City</th>
          <th>POC Assigned</th>
          <th>Status</th>
          <th>Final Acc.</th>
        </tr>
      </thead>

      
      <datalist id="dl-poc">
        ${TEAM.map(t => `<option value="${t.name}"></option>`).join('')}
      </datalist>

      <datalist id="dl-status">
        <option value="Active"></option>
        <option value="Inactive"></option>
        <option value="Dropped Out"></option>
        <option value="Ghosted"></option>
      </datalist>
      <datalist id="dl-faf">
        <option value="Yes"></option>
        <option value="No"></option>
      </datalist>

      <tbody id="massAddTbody">
  `;
  
  for (let i = 0; i < count; i++) {
    gridHtml += `
      <tr class="mass-add-row">
        <td><input type="text" class="form-input ma-col" onpaste="handleMassAddPaste(event, this)" placeholder="College"></td>
        <td><input type="text" class="form-input ma-name" placeholder="Name"></td>
        <td><input type="text" class="form-input ma-phone" placeholder="Phone"></td>
        <td><input type="text" class="form-input ma-email" placeholder="Email"></td>
        <td><select class="form-select ma-city"><option value="">Select City</option>${Array.from(new Set(AppState.fellows.map(f => f.city).filter(Boolean))).sort().map(c => `<option value="\${c}">\${c}</option>`).join('')}</select></td>
        <td>
          
          <select class="form-select ma-poc">${TEAM.map(t => `<option value="\${t.name}">\${t.name}</option>`).join('')}</select>
        </td>
        <td>
          <select class="form-select ma-status">${['Active', 'Ghosted', 'On Hold', 'Dropped Out'].map(s => `<option value="\${s}">\${s}</option>`).join('')}</select>

        </td>
        <td>
          <input type="text" list="dl-faf" class="form-input ma-faf" placeholder="Final Acc." value="No">
        </td>
      </tr>
    `;
  }
  
  gridHtml += `</tbody></table>`;
  document.getElementById('massAddGridContainer').innerHTML = gridHtml;
  
  // Attach paste handler to all inputs in the grid
  const inputs = document.getElementById('massAddGridContainer').querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('paste', function(e) {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text');
      const rows = text.split(/\r?/).filter(r => r.trim());
      
      const targetRowTr = this.closest('tr');
      const allTrs = Array.from(targetRowTr.parentNode.children);
      const startRowIndex = allTrs.indexOf(targetRowTr);
      const startColIndex = Array.from(targetRowTr.children).indexOf(this.closest('td'));
      
      rows.forEach((row, rIdx) => {
        const cols = row.split('\t');
        if (startRowIndex + rIdx < allTrs.length) {
          const tr = allTrs[startRowIndex + rIdx];
          cols.forEach((colData, cIdx) => {
            if (startColIndex + cIdx < tr.children.length) {
              const inputElement = tr.children[startColIndex + cIdx].querySelector('input');
              if (inputElement) {
                inputElement.value = colData.trim();
              }
            }
          });
        }
      });
    });
  });
}

function saveMassAdd() {
  const rows = document.querySelectorAll('.mass-add-row');
  const intake = document.getElementById('massAddIntake').value || 'Intake';
  let addedCount = 0;
  
  rows.forEach((row, i) => {
    const col = row.querySelector('.ma-col').value.trim();
    const name = row.querySelector('.ma-name').value.trim();
    const email = row.querySelector('.ma-email').value.trim();
    
    if (col || name || email) {
      // Deterministic ID Hash
      const str = (email + name + col).toLowerCase().replace(/[^a-z0-9]/g, '');
      let hash = 0;
      for (let j = 0; j < str.length; j++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(j);
        hash = hash & hash;
      }
      const newId = 'f_' + Math.abs(hash) + '_' + Date.now().toString().slice(-4); // fallback if exact same
      
      const fellow = {
        id: newId,
        intakeStatus: intake,
        collegeName: col,
        fellowName: name,
        whatsappNo: row.querySelector('.ma-phone').value.trim(),
        emailId: email,
        city: row.querySelector('.ma-city').value.trim(),
        pocAssigned: row.querySelector('.ma-poc').value,
        fellowStatus: row.querySelector('.ma-status').value,
        finalAcceptance: row.querySelector('.ma-faf').value,
        clubPageActivity: 'N/A'
      };
      
      AppState.fellows.push(fellow);
      logChange(newId, 'Creation', '', 'Added via Mass Add');
      addedCount++;
    }
  });
  
  if (addedCount > 0) {
    saveFellows();
    runAutoStrikes();
    render();
    showToast(`Successfully added ${addedCount} fellows!`, 'success');
  }
  
  document.getElementById('massAddModalOverlay').remove();
}

// End Mass Add Logic

window.AppState = AppState;

window.approveAllFaf = function() {
  const btns = document.querySelectorAll('.btn-approve-faf');
  let approved = 0;
  btns.forEach(btn => {
    const id = btn.dataset.id;
    const fellow = AppState.fellows.find(f => f.id === id);
    if(fellow) { 
      fellow.finalAcceptance = 'Yes'; 
      logChange(id, 'finalAcceptance', 'No', 'Yes'); 
      
      const acc = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(fellow, true) : null;
      if (acc) {
        if (!fellow.fellowName || fellow.fellowName === 'N/A' || fellow.fellowName.trim() === '') fellow.fellowName = acc.fullName;
        if (!fellow.emailId || fellow.emailId === 'N/A' || fellow.emailId.trim() === '') fellow.emailId = acc.email;
        if (!fellow.whatsappNo || fellow.whatsappNo === 'N/A' || fellow.whatsappNo.trim() === '') fellow.whatsappNo = acc.phone;
        if (!fellow.collegeName || fellow.collegeName === 'N/A' || fellow.collegeName.trim() === '') fellow.collegeName = acc.college;
      }
      approved++;
    }
  });
  if (approved > 0) {
    if (typeof runAutoStrikes === 'function') runAutoStrikes();
    saveFellows();
    showToast(approved + ' acceptances approved!', 'success');
    render();
  }
};


function handleMassAddPaste(e, inputElem) {
  e.preventDefault();
  const paste = (e.clipboardData || window.clipboardData).getData('text');
  const rows = paste.split(/\r\n|\n|\r/);
  
  const tr = inputElem.closest('tr');
  const tbody = tr.parentElement;
  const startRowIndex = Array.from(tbody.children).indexOf(tr);
  
  rows.forEach((rowStr, i) => {
    if (!rowStr.trim()) return;
    const cols = rowStr.split('\t');
    const targetTr = tbody.children[startRowIndex + i];
    if (targetTr) {
      const inputs = targetTr.querySelectorAll('input, select');
      if (cols[0]) inputs[0].value = cols[0]; // College
      if (cols[1]) inputs[1].value = cols[1]; // Name
      if (cols[2]) inputs[2].value = cols[2]; // Phone
      if (cols[3]) inputs[3].value = cols[3]; // Email
      if (cols[4]) inputs[4].value = cols[4]; // City
      if (cols[5]) inputs[5].value = cols[5]; // POC
      if (cols[6]) inputs[6].value = cols[6]; // Status
      if (cols[7]) inputs[7].value = cols[7]; // FAF
    }
  });
}
