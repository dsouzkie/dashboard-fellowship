const fs = require('fs');
let code = fs.readFileSync('test_login.js', 'utf8');

// Strip mock wrapper
const mockEnd = code.indexOf('global.fetch = async () => ({ ok: true, text: async () => \'\' });\n');
if (mockEnd > -1) code = code.substring(mockEnd + 67);
const mockBottom = code.lastIndexOf('setTimeout(() => {\n  global.AppState.selectedTeamUser');
if (mockBottom > -1) code = code.substring(0, mockBottom);

code = code.replace(/global\.AppState =/g, 'const AppState =');
code = code.replace(/global\.TEAM =/g, 'const TEAM =');
if (!code.startsWith('w')) code = 'w' + code;

// ============================================================
// PATCH 1: parseAcceptanceCSV - add all FAF fields
// ============================================================
code = code.replace(
  `      email: row[8] || '',
      instagram: row[9] || '',
      photo: row[30] || ''`,
  `      email: row[8] || '',
      instagram: row[9] || '',
      dob: row[10] || '',
      state: row[11] || '',
      capacity: row[12] || '',
      address: row[13] || '',
      tshirt: row[14] || '',
      hocName: row[15] || '',
      hocPhone: row[16] || '',
      hocEmail: row[17] || '',
      hooName: row[18] || '',
      hooEmail: row[19] || '',
      hooPhone: row[20] || '',
      photo: row[30] || ''`
);

// ============================================================
// PATCH 2: Fix "August Intake Intake" in profile modal badge
// ============================================================
code = code.replace(
  `  \${fellow.intakeStatus ? \`<span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA;">\${escapeHTML(fellow.intakeStatus)} Intake</span>\` : ''}`,
  `  \${fellow.intakeStatus ? \`<span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA; font-size:9px; padding: 2px 6px; white-space:nowrap;">\${escapeHTML(fellow.intakeStatus.replace(/\\s*intake\\s*\$/i,''))} Intake</span>\` : ''}`
);

// ============================================================
// PATCH 3: Fix fellow card photo height (in myFellows grid)
// - Make photo 200px tall so full face is visible
// - Move tag outside of h3 to avoid truncation
// ============================================================
const oldCardCode = `      const photoHtml = photoUrl 
        ? \`<img src="\${photoUrl}" referrerpolicy="no-referrer" style="width: 100%; height: 160px; object-fit: cover; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};" onerror="this.src=''; this.outerHTML='<div style=\\\\'width:100%; height:160px; display:flex; align-items:center; justify-content:center; background:#1E293B; font-size:40px; color:#94A3B8; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};\\\\'>
\${escapeHTML(displayName.charAt(0))}</div>'"\` />\`
        : \`<div style="width: 100%; height: 160px; display: flex; align-items: center; justify-content: center; background: #1E293B; font-size: 40px; color: #94A3B8; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};">\${escapeHTML(displayName.charAt(0))}</div>\`;
        
      return \`
        <div class="card" style="cursor: pointer; transition: transform 0.2s;" onclick="renderFellowProfile('\${f.id}')" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          \${photoHtml}
          <div style="padding: 12px 15px;">
            <div style="display:flex; align-items:flex-start; gap:6px; flex-wrap:wrap; margin-bottom:5px;">
              <h3 style="margin: 0; font-size: 15px; color: #F1F5F9;">\${escapeHTML(displayName)} \${renderStrikeDots(f.id)}</h3>
              \${f.intakeStatus ? \`<span class="intake-badge--\${f.intakeStatus === 'August Intake' ? 'august' : 'existing'}" style="font-size:9px; padding:1px 5px; white-space:nowrap; flex-shrink:0;">\${f.intakeStatus === 'August Intake' ? 'Aug Intake' : 'Existing'}</span>\` : ""}
            </div>
            <div style="font-size: 13px; color: #94A3B8; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${escapeHTML(displayCollege)}</div>
            <div>\${renderBadge(f.fellowStatus)}</div>
          </div>
        </div>
      \`;
    }).join('');`;

if (code.includes(oldCardCode)) {
  const newCardCode = `      const photoHtml = photoUrl 
        ? \`<img src="\${photoUrl}" referrerpolicy="no-referrer" style="width: 100%; height: 200px; object-fit: cover; object-position: top; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div style="width: 100%; height: 200px; display: none; align-items: center; justify-content: center; background: #1E293B; font-size: 40px; color: #94A3B8; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};">\${escapeHTML(displayName.charAt(0))}</div>\`
        : \`<div style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; background: #1E293B; font-size: 40px; color: #94A3B8; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};">\${escapeHTML(displayName.charAt(0))}</div>\`;
        
      return \`
        <div class="card" style="cursor: pointer; transition: transform 0.2s;" onclick="renderFellowProfile('\${f.id}')" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          \${photoHtml}
          <div style="padding: 12px 15px;">
            <div style="display:flex; align-items:flex-start; gap:5px; flex-wrap:wrap; margin-bottom:4px;">
              <h3 style="margin: 0; font-size: 14px; color: #F1F5F9;">\${escapeHTML(displayName)} \${renderStrikeDots(f.id)}</h3>
              \${f.intakeStatus ? \`<span class="intake-badge--\${f.intakeStatus === 'August Intake' ? 'august' : 'existing'}" style="font-size:8px; padding:1px 4px; white-space:nowrap; flex-shrink:0;">\${f.intakeStatus === 'August Intake' ? 'Aug Intake' : 'Existing'}</span>\` : ""}
            </div>
            <div style="font-size: 12px; color: #94A3B8; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${escapeHTML(displayCollege)}</div>
            <div>\${renderBadge(f.fellowStatus)}</div>
          </div>
        </div>
      \`;
    }).join('');`;
  code = code.replace(oldCardCode, newCardCode);
  console.log('Patched fellow cards!');
} else {
  console.log('Card code not found - checking what is there...');
  const idx = code.indexOf('height: 160px; object-fit: cover');
  if (idx > -1) {
    console.log('Found 160px at index:', idx);
    console.log(code.substring(idx - 100, idx + 200));
  }
}

// Also do the same for allFellows grid (it likely has the same card code)
const oldCardCode2 = `      const photoHtml2 = photoUrl2
        ? \`<img src="\${photoUrl2}"`; // check if different variable names
if (!code.includes('photoUrl2')) {
  // The allFellows grid uses different variable names. Let's patch the 160px version there too.
  code = code.replace(
    /height: 160px; object-fit: cover; border-bottom: 3px solid/g,
    'height: 200px; object-fit: cover; object-position: top; border-bottom: 3px solid'
  );
  code = code.replace(
    /height: 160px; display: flex/g,
    'height: 200px; display: flex'
  );
  console.log('Patched all 160px -> 200px');
}

// ============================================================
// PATCH 4: Fix login function signature mismatch
// ============================================================
code = code.replace(
  `function login() {
  const pwd = document.getElementById('loginPassword').value;
  if (!AppState.selectedTeamUser) return;
  
  if (pwd === AppState.selectedTeamUser.password) {
    AppState.currentUser = AppState.selectedTeamUser;
    AppState.currentView = 'dashboard';
    showToast(\`Welcome back, \${AppState.currentUser.name}!\`, 'success');
    render();
  } else {
    showToast('Incorrect password', 'error');
  }
}`,
  `function login(username, pwd) {
  const user = TEAM.find(t => t.name === username);
  if (!user) return;
  if (pwd === user.password) {
    AppState.currentUser = user;
    AppState.currentView = 'dashboard';
    showToast(\`Welcome back, \${user.name}!\`, 'success');
    render();
  } else {
    showToast('Incorrect password', 'error');
  }
}`
);

// ============================================================
// PATCH 5: Filter out empty / "No Fellow" rows
// ============================================================
code = code.replace(
  '  const result = [];\n  for (let i = 1; i < rows.length; i++) {\n    const row = rows[i];',
  '  const result = [];\n  for (let i = 1; i < rows.length; i++) {\n    const row = rows[i];\n    if (!row[0] || row[0].trim() === \'\' || row[0].trim().toLowerCase() === \'no fellow\') continue;'
);
code = code.replace(
  '    if (!row[2]) continue;', 
  '    if (!row[2] || row[2].trim() === \'\' || row[2].trim().toLowerCase() === \'no fellow\') continue;'
);

// ============================================================
// PATCH 6: Fix onerror attribute quotes in profile photo
// ============================================================
code = code.replace(
  `onerror="this.outerHTML='<div class=\\'profile-photo-placeholder\${teamClass}\\' style=\\'background-color:\${poc.color}\\'>\${dName.charAt(0).toUpperCase()}</div>'"`,
  `onerror="this.outerHTML='<div class=&quot;profile-photo-placeholder\${teamClass}&quot; style=&quot;background-color:\${poc.color}&quot;>\${dName.charAt(0).toUpperCase()}</div>'"`
);

// ============================================================
// PATCH 7: findAcceptanceForFellow - improved fuzzy matching
// ============================================================
const updatedFindAcceptance = `function findAcceptanceForFellow(fellow) {
  if (!AppState.acceptances || !AppState.acceptances.length) return null;
  const fName = (fellow.fellowName || '').toLowerCase().trim();
  const fCollege = (fellow.collegeName || '').toLowerCase().trim();
  const fEmail = (fellow.emailId || '').toLowerCase().trim();
  const fPhone = String(fellow.whatsappNo || '').replace(/\\D/g, '');
  return AppState.acceptances.find(a => {
    const fafName = (a.fullName || '').toLowerCase().trim();
    const fafCollege = (a.college || '').toLowerCase().trim();
    const fafEmail = (a.email || '').toLowerCase().trim();
    const fafPhone = String(a.phone || '').replace(/\\D/g, '');
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
}`;

const s = code.indexOf('function findAcceptanceForFellow(fellow) {');
let e = code.indexOf('function ', s + 10);
if (s > -1 && e > -1) {
  code = code.substring(0, s) + updatedFindAcceptance + '\n\n' + code.substring(e);
  console.log('Patched findAcceptanceForFellow!');
}

fs.writeFileSync('app.js', code);
console.log('All patches applied! Length:', code.length);
