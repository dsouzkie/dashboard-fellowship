const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const syncFunc = `
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
      clubpagelaunched: fellow.clubPageLaunched,
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

    const res = await fetch(\`\${SUPABASE_URL}/rest/v1/fellows?id=eq.\${fellow.id}\`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': \`Bearer \${SUPABASE_KEY}\`,
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
`;

// Insert the sync function just before saveFellowData
const insertIdx = code.indexOf('function saveFellowData');
code = code.substring(0, insertIdx) + syncFunc + '\n' + code.substring(insertIdx);

// Replace saveFellows() inside saveFellowData
const oldSaveFellowData = `  if (changed) {
    runAutoStrikes();
    saveFellows();
    showToast('Changes saved successfully', 'success');
  }`;
const newSaveFellowData = `  if (changed) {
    runAutoStrikes();
    syncFellowToSupabase(f);
    showToast('Changes saved successfully', 'success');
  }`;
code = code.replace(oldSaveFellowData, newSaveFellowData);

// Replace saveFellows() inside updateFellow
const oldUpdateFellow = `  logChange(id, field, oldValue, value);
  runAutoStrikes();
  saveFellows();
  
  // Re-render current view to reflect changes
  render();`;
const newUpdateFellow = `  logChange(id, field, oldValue, value);
  runAutoStrikes();
  syncFellowToSupabase(fellow);
  
  // Re-render current view to reflect changes
  render();`;
code = code.replace(oldUpdateFellow, newUpdateFellow);

// Also add download database button to the sidebar
const downloadHtml = `<div class="sidebar-menu">
      <div class="nav-item" data-view="dashboard">
        <span class="nav-icon">📊</span> Dashboard
      </div>
      <div class="nav-item" data-view="fellows">
        <span class="nav-icon">👥</span> All Fellows
      </div>
      <div class="nav-item" id="downloadDbBtn" style="color:#10B981;">
        <span class="nav-icon">⬇️</span> Download Database
      </div>
    </div>`;
code = code.replace(/<div class="sidebar-menu">[\s\S]*?<\/div>\s*<\/div>/, downloadHtml);

// Add event listener for downloadDbBtn in bindEvents()
const downloadLogic = `  const dbBtn = document.getElementById('downloadDbBtn');
  if (dbBtn) {
    dbBtn.addEventListener('click', () => {
      if (!AppState.fellows || !AppState.fellows.length) return;
      
      const keys = Object.keys(AppState.fellows[0]);
      const csvContent = [
        keys.join(','),
        ...AppState.fellows.map(f => keys.map(k => {
          let val = f[k] === null || f[k] === undefined ? '' : String(f[k]);
          return '"' + val.replace(/"/g, '""') + '"';
        }).join(','))
      ].join('\\n');
      
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
  }`;
  
const bindEventsIdx = code.indexOf('document.querySelectorAll(\'.nav-item\').forEach');
code = code.substring(0, bindEventsIdx) + downloadLogic + '\n  ' + code.substring(bindEventsIdx);

fs.writeFileSync('app.js', code);
console.log('App patched for Supabase Sync!');
