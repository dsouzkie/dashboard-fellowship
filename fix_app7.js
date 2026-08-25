const fs = require('fs');
let text = fs.readFileSync('app.js', 'utf8');

// 1. Add Refresh Button to the Dashboard and My Fellows/All Fellows Headers
// We will modify the HTML inside renderDashboard(), renderMyFellows(), and renderAllFellows()
text = text.replace(
  `<div>
          <h1 class="page-title">Dashboard</h1>`,
  `<div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h1 class="page-title">Dashboard</h1>
            <button class="btn btn--secondary btn-refresh-data" style="margin-left: 20px;">🔄 Refresh Live Data</button>
          </div>`
);

text = text.replace(
  `<div>
          <h1 class="page-title">My Fellows</h1>`,
  `<div>
          <div style="display:flex; align-items:center; gap: 15px;">
            <h1 class="page-title">My Fellows</h1>
            <button class="btn btn--secondary btn-refresh-data btn--sm">🔄 Refresh Live Data</button>
          </div>`
);

text = text.replace(
  `<div>
          <h1 class="page-title">All Fellows</h1>`,
  `<div>
          <div style="display:flex; align-items:center; gap: 15px;">
            <h1 class="page-title">All Fellows</h1>
            <button class="btn btn--secondary btn-refresh-data btn--sm">🔄 Refresh Live Data</button>
          </div>`
);

// 2. Add the API URL Constant at the top of the file
const scriptUrlInjection = `
// =============================================
// SECTION 1.5: API CONFIGURATION
// =============================================
let GOOGLE_APPS_SCRIPT_URL = ''; // WILL BE PROVIDED BY USER

`;
text = text.replace('// =============================================\n// SECTION 2:', scriptUrlInjection + '// =============================================\n// SECTION 2:');

// 3. Update sync functions: updateFellow, addFellow, deleteFellow
const updateFellowRegex = /function updateFellow\(id, field, value\) \{[\s\S]*?render\(\);\n\}/;
const newUpdateFellow = `async function updateFellow(id, field, value) {
  const fellow = AppState.fellows.find(f => f.id === id);
  if (!fellow) return;
  
  const oldValue = fellow[field];
  const originalCollegeName = fellow.collegeName;
  const originalFellowName = fellow.fellowName;
  
  fellow[field] = value;
  
  logChange(id, field, oldValue, value);
  runAutoStrikes();
  
  // Optimistic UI update
  render();
  
  if (GOOGLE_APPS_SCRIPT_URL) {
    showToast('Saving to Google Sheets...', 'info');
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'update',
          data: {
            fellow: fellow,
            originalCollegeName: field === 'collegeName' ? oldValue : originalCollegeName,
            originalFellowName: field === 'fellowName' ? oldValue : originalFellowName
          }
        })
      });
      showToast('Saved to Google Sheets!', 'success');
    } catch (err) {
      showToast('Failed to save to Google Sheets', 'error');
      console.error(err);
    }
  } else {
    saveFellows();
  }
}`;
text = text.replace(updateFellowRegex, newUpdateFellow);

const addFellowRegex = /function addFellow\(data\) \{[\s\S]*?showToast\('Fellow added successfully', 'success'\);\n\}/;
const newAddFellow = `async function addFellow(data) {
  data.id = 'f_' + Date.now();
  AppState.fellows.unshift(data);
  runAutoStrikes();
  render();
  
  if (GOOGLE_APPS_SCRIPT_URL) {
    showToast('Adding to Google Sheets...', 'info');
    try {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'add',
          data: { fellow: data }
        })
      });
      showToast('Fellow added to Google Sheets!', 'success');
    } catch (err) {
      showToast('Failed to add to Google Sheets', 'error');
      console.error(err);
    }
  } else {
    saveFellows();
    showToast('Fellow added locally', 'success');
  }
}`;
text = text.replace(addFellowRegex, newAddFellow);

const deleteFellowRegex = /function deleteFellow\(id\) \{[\s\S]*?showToast\('Fellow deleted', 'info'\);\n  \}\n\}/;
const newDeleteFellow = `async function deleteFellow(id) {
  if (confirm('Are you sure you want to delete this fellow? This will permanently delete the row from the Google Sheet.')) {
    const fellow = AppState.fellows.find(f => f.id === id);
    AppState.fellows = AppState.fellows.filter(f => f.id !== id);
    render();
    
    if (GOOGLE_APPS_SCRIPT_URL && fellow) {
      showToast('Deleting from Google Sheets...', 'info');
      try {
        await fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'delete',
            data: { fellow: fellow }
          })
        });
        showToast('Fellow deleted from Google Sheets', 'success');
      } catch (err) {
        showToast('Failed to delete from Google Sheets', 'error');
        console.error(err);
      }
    } else {
      saveFellows();
      showToast('Fellow deleted locally', 'info');
    }
  }
}`;
text = text.replace(deleteFellowRegex, newDeleteFellow);

// 4. Update loadFellows to fetch from Google Sheets CSV (using the public URL the user provided)
// The user provided: https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/edit?usp=sharing this link has the final dfellowship tracker its called tracker
// So the CSV URL is: https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=tracker

const loadFellowsOriginal = `function loadFellows() {
  const saved = localStorage.getItem('under25_fellows');
  return saved ? JSON.parse(saved) : null;
}`;

const loadFellowsNew = `async function fetchLiveFellows() {
  showToast('Fetching latest Tracker data...', 'info');
  try {
    const url = 'https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=tracker';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    const csvText = await response.text();
    const parsed = parseCSV(csvText);
    if (parsed.length > 0) {
      AppState.fellows = parsed;
      runAutoStrikes();
      render();
      showToast('Live Tracker data loaded!', 'success');
    }
  } catch(err) {
    console.error(err);
    showToast('Failed to fetch live Tracker data', 'error');
  }
}

function loadFellows() {
  const saved = localStorage.getItem('under25_fellows');
  return saved ? JSON.parse(saved) : null;
}`;

text = text.replace(loadFellowsOriginal, loadFellowsNew);

// 5. Add Refresh Button listener to bindEvents
const bindEventsOriginal = `function bindEvents() {
  // Navigation`;

const bindEventsNew = `function bindEvents() {
  // Refresh Data
  document.querySelectorAll('.btn-refresh-data').forEach(btn => {
    btn.addEventListener('click', async () => {
      btn.innerHTML = '⏳ Loading...';
      btn.disabled = true;
      await Promise.all([
        fetchLiveFellows(),
        loadNominations(),
        loadAcceptances()
      ]);
      btn.innerHTML = '🔄 Refresh Live Data';
      btn.disabled = false;
    });
  });

  // Navigation`;

text = text.replace(bindEventsOriginal, bindEventsNew);

fs.writeFileSync('app.js', text, 'utf8');
console.log('Successfully updated app.js for 2-way sync preparation');
