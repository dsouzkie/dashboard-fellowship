const fs = require('fs');
let text = fs.readFileSync('app.js', 'utf8');

const igUpdaterUrl = "const IG_UPDATER_URL = 'https://script.google.com/macros/s/AKfycbx0TGEY2yTfRvcfQpRbBRZ55Y9HTIG2MrCtJD-HUrd8ILrBRTAaLrWpcoE_206JnQg/exec';\n";

text = text.replace('const GOOGLE_APPS_SCRIPT_URL = \'\';', 'const GOOGLE_APPS_SCRIPT_URL = \'\';\n' + igUpdaterUrl);

// Add to AppState
text = text.replace('nominations: [],', 'nominations: [],\n  instagramStats: [],');

// Add CSV Parser for IG Stats
const igParser = `
function parseIgStatsCSV(csvText) {
  const rows = [];
  const lines = csvText.split(/\\r?\\n/);
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    let inQuotes = false;
    let current = '';
    const cols = [];
    for (let char of line) {
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        cols.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    cols.push(current);
    
    // ['Timestamp', 'College Name', 'Fellow Name', 'Instagram Handle', 'Followers', 'Following', 'Total Posts']
    if (cols.length >= 7) {
      rows.push({
        timestamp: cols[0] ? cols[0].replace(/^"|"$/g, '').trim() : '',
        collegeName: cols[1] ? cols[1].replace(/^"|"$/g, '').trim() : '',
        fellowName: cols[2] ? cols[2].replace(/^"|"$/g, '').trim() : '',
        handle: cols[3] ? cols[3].replace(/^"|"$/g, '').trim() : '',
        followers: parseInt(cols[4] ? cols[4].replace(/^"|"$/g, '').trim() : '0') || 0,
        following: parseInt(cols[5] ? cols[5].replace(/^"|"$/g, '').trim() : '0') || 0,
        posts: parseInt(cols[6] ? cols[6].replace(/^"|"$/g, '').trim() : '0') || 0
      });
    }
  }
  return rows;
}

async function loadInstagramStats() {
  try {
    const url = 'https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=Instagram_Live_Stats';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const csvText = await response.text();
    // If it returns HTML (e.g. sheet doesn't exist), it will fail parsing gracefully
    if (csvText.startsWith('<!DOCTYPE html>')) {
      console.log('Instagram_Live_Stats sheet not found or not created yet');
      AppState.instagramStats = [];
      return;
    }
    AppState.instagramStats = parseIgStatsCSV(csvText);
    console.log(\`Loaded \${AppState.instagramStats.length} IG stats rows\`);
  } catch (err) {
    console.log('Could not load IG stats:', err);
  }
}

function getIgStatsForFellow(fellow) {
  if (!AppState.instagramStats.length) return null;
  // Match by college name or fellow name
  const match = AppState.instagramStats.find(s => 
    s.collegeName.toLowerCase() === (fellow.collegeName || '').toLowerCase() ||
    (s.fellowName && fellow.fellowName && s.fellowName.toLowerCase() === fellow.fellowName.toLowerCase())
  );
  return match || null;
}

window.triggerBulkIgUpdate = async function() {
  const btn = document.getElementById('btn-bulk-ig');
  if (btn) {
    btn.innerHTML = '⏳ Telling Google to fetch... (this takes ~1 min)';
    btn.disabled = true;
  }
  showToast('Sent trigger to Google Apps Script. Please wait...', 'info');
  
  try {
    const response = await fetch(IG_UPDATER_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'updateInstagramStats' })
    });
    
    const result = await response.json();
    if (result.status === 'success') {
      showToast('Google successfully fetched all stats! Downloading now...', 'success');
      // Re-download the newly populated sheet
      await loadInstagramStats();
      render();
    } else {
      showToast('Error from Google Script: ' + result.message, 'error');
      if (btn) {
        btn.innerHTML = '☁️ Trigger Google Sheet IG Update (Bulk)';
        btn.disabled = false;
      }
    }
  } catch (error) {
    showToast('Failed to contact Google Apps Script. Is the URL correct?', 'error');
    console.error(error);
    if (btn) {
      btn.innerHTML = '☁️ Trigger Google Sheet IG Update (Bulk)';
      btn.disabled = false;
    }
  }
};
`;

// Insert after loadAcceptances
text = text.replace('async function loadAcceptances() {', igParser + '\nasync function loadAcceptances() {');

// Update init() and bindEvents() to call loadInstagramStats
text = text.replace('loadNominations();\n    loadAcceptances();\n  }, 100);', 'loadNominations();\n    loadAcceptances();\n    loadInstagramStats();\n  }, 100);');
text = text.replace('loadNominations(),\n        loadAcceptances()\n      ]);', 'loadNominations(),\n        loadAcceptances(),\n        loadInstagramStats()\n      ]);');


// Modify renderInstagram
// Replace individual button with bulk button, and use getIgStatsForFellow
const renderIgRegex = /function renderInstagram\(\) {[\s\S]*?const avg = withLinks\.length \? Math\.round\(totalFollowers \/ withLinks\.length\) : 0;/;

const newRenderIg = `function renderInstagram() {
  const withLinks = AppState.fellows.filter(f => f.clubPageLink && f.clubPageLink.trim() !== '');
  
  let totalFollowers = 0;
  let activePages = 0;
  
  const cards = withLinks.map(f => {
    // Check if we have live stats in the new sheet
    const liveStats = getIgStatsForFellow(f);
    
    let followers = liveStats ? liveStats.followers : (parseInt(f.followersCount) || 0);
    let posts = liveStats ? liveStats.posts : (parseInt(f.contentPiecesPosted) || 0);
    let following = liveStats ? liveStats.following : 0;
    
    totalFollowers += followers;
    if (f.clubPageActivity === 'Active') activePages++;
    
    let handle = 'Instagram Page';
    try {
      if (f.clubPageLink.includes('instagram.com/')) {
        const parts = f.clubPageLink.split('instagram.com/');
        handle = '@' + parts[1].split('/')[0].split('?')[0];
      }
    } catch(e){}
    
    const poc = TEAM.find(t => t.name === f.pocAssigned) || TEAM[TEAM.length-1];
    
    // Status text if live stats found
    const lastUpdated = liveStats ? \`<div style="font-size:10px; color:#10B981; margin-top:4px;">✓ Live data loaded</div>\` : \`<div style="font-size:10px; color:#F59E0B; margin-top:4px;">⚠ Manual data (Run Bulk Update)</div>\`;

    return \`
      <div class="card">
        <div class="card-body">
          <div class="flex flex-between" style="margin-bottom: 10px;">
            \${renderBadge(f.clubPageActivity)}
            \${renderAvatar(poc.name, poc.color, 'sm')}
          </div>
          <h3 class="card-title truncate" title="\${escapeHTML(f.collegeName)}">\${escapeHTML(f.collegeName)}</h3>
          <div style="color: #3b82f6; font-size: 0.9rem; margin-bottom: 15px;">
            <a href="\${escapeHTML(f.clubPageLink)}" target="_blank" style="text-decoration:none; color:inherit;">📸 \${escapeHTML(handle)} ↗</a>
            \${lastUpdated}
          </div>
          
          <div class="ig-metric">
            <span class="ig-metric__icon">👥</span>
            <div>
              <div class="ig-metric__value">\${followers.toLocaleString()}</div>
              <div class="ig-metric__label">Followers</div>
            </div>
          </div>
          
          <div class="flex gap-12 mt-8">
            <div class="ig-metric">
              <span class="ig-metric__icon">📝</span>
              <div>
                <div class="ig-metric__value">\${posts.toLocaleString()}</div>
                <div class="ig-metric__label">Posts</div>
              </div>
            </div>
            <div class="ig-metric">
              <span class="ig-metric__icon">🔄</span>
              <div>
                <div class="ig-metric__value">\${following.toLocaleString()}</div>
                <div class="ig-metric__label">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    \`;
  }).join('');
  
  const avg = withLinks.length ? Math.round(totalFollowers / withLinks.length) : 0;`;

text = text.replace(renderIgRegex, newRenderIg);

const renderIgHeaderRegex = /<header class="page-header">\s*<div>\s*<h1 class="page-title">Instagram Overview 📸<\/h1>\s*<p class="page-subtitle">Track club page metrics and activity<\/p>\s*<\/div>\s*<\/header>/;

const newRenderIgHeader = `<header class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1 class="page-title">Instagram Overview 📸</h1>
          <p class="page-subtitle">Track club page metrics and activity</p>
        </div>
        <div>
          <button id="btn-bulk-ig" class="btn btn--primary" onclick="triggerBulkIgUpdate()">☁️ Trigger Google Sheet IG Update (Bulk)</button>
        </div>
      </header>`;

text = text.replace(renderIgHeaderRegex, newRenderIgHeader);

// Update Fellow Profile Modal to also show the bulk data and remove individual button
const profileStatsRegex = /<div style="display:flex; justify-content:space-between; align-items:center;">\s*<div>\s*<div style="font-size:12px; color:#94A3B8; margin-bottom:5px;">Followers<\/div>\s*<div style="font-size:20px; font-weight:700; color:#F1F5F9;">([^<]+)<\/div>\s*<\/div>\s*<button class="btn btn--sm btn--secondary" onclick="handleInstagramFetch\('[^']+', '[^']+'\)" id="btn-ig-fetch-[^"]+">🔄 Fetch Live<\/button>\s*<\/div>/;

text = text.replace(profileStatsRegex, `<div>
                      <div style="font-size:12px; color:#94A3B8; margin-bottom:5px;">Followers</div>
                      <div style="font-size:20px; font-weight:700; color:#F1F5F9;">$1</div>
                    </div>`);

// Inject the getIgStatsForFellow lookup inside renderFellowProfile to override numbers
const profileLookupInjection = `
  const liveStats = getIgStatsForFellow(fellow);
  const displayFollowers = liveStats ? liveStats.followers : (parseInt(fellow.followersCount) || 0);
  const displayPosts = liveStats ? liveStats.posts : (parseInt(fellow.contentPiecesPosted) || 0);
  const liveStatsNote = liveStats ? '<span style="color:#10B981; font-size:10px; margin-left:8px;">✓ Live</span>' : '';
`;
text = text.replace('const clubUrl = fellow.clubPageLink;', 'const clubUrl = fellow.clubPageLink;\n' + profileLookupInjection);

text = text.replace(/<div class="profile-stat__value">([^<]+)<\/div>\s*<div class="profile-stat__label">Followers Count<\/div>/, `<div class="profile-stat__value">\${displayFollowers.toLocaleString()}\${liveStatsNote}</div>\n        <div class="profile-stat__label">Followers Count</div>`);

text = text.replace(/<div style="font-size:20px; font-weight:700; color:#F1F5F9;">\${escapeHTML\(fellow\.followersCount \|\| '0'\)}<\/div>/, `<div style="font-size:20px; font-weight:700; color:#F1F5F9;">\${displayFollowers.toLocaleString()}\${liveStatsNote}</div>`);


fs.writeFileSync('app.js', text, 'utf8');
console.log('Successfully injected Bulk IG Updater logic');
