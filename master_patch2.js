const fs = require('fs');

// Start fresh from the clean backup and apply ALL patches at once
let code = fs.readFileSync('test_login.js', 'utf8');

// Strip mock
const mockEnd = code.indexOf('global.fetch = async () => ({ ok: true, text: async () => \'\' });\n');
if (mockEnd > -1) code = code.substring(mockEnd + 67);
const mockBottom = code.lastIndexOf('setTimeout(() => {\n  global.AppState.selectedTeamUser');
if (mockBottom > -1) code = code.substring(0, mockBottom);
code = code.replace(/global\.AppState =/g, 'const AppState =');
code = code.replace(/global\.TEAM =/g, 'const TEAM =');
if (!code.startsWith('w')) code = 'w' + code;

// 1. parseAcceptanceCSV - add all FAF fields
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

// 2. Filter No Fellow in parseCSV (Tracker)
code = code.replace(
  '    if (!row[1]) continue; // Skip empty rows without collegeName',
  '    if (!row[1]) continue; // Skip empty rows without collegeName\n    const fellowName = (row[2] || \'\').trim();\n    if (!fellowName || fellowName.toLowerCase() === \'no fellow\') continue;'
);

// 3. Filter No Fellow in parseAcceptanceCSV
code = code.replace(
  '    if (!row[3]) continue; // Full Name is at index 3',
  '    if (!row[3] || row[3].trim() === \'\' || row[3].trim().toLowerCase() === \'no fellow\') continue; // Full Name is at index 3'
);

// 4. Fix "August Intake Intake" in profile modal
code = code.replace(
  `  \${fellow.intakeStatus ? \`<span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA;">\${escapeHTML(fellow.intakeStatus)} Intake</span>\` : ''}`,
  `  \${fellow.intakeStatus ? \`<span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA; font-size:9px; padding: 2px 6px; white-space:nowrap;">\${escapeHTML(fellow.intakeStatus.replace(/\\s*intake\\s*\$/i,''))} Intake</span>\` : ''}`
);

// 5. Fix onerror attribute
code = code.replace(
  `onerror="this.outerHTML='<div class=\\'profile-photo-placeholder\${teamClass}\\' style=\\'background-color:\${poc.color}\\'>\${dName.charAt(0).toUpperCase()}</div>'"`,
  `onerror="this.outerHTML='<div class=&quot;profile-photo-placeholder\${teamClass}&quot; style=&quot;background-color:\${poc.color}&quot;>\${dName.charAt(0).toUpperCase()}</div>'"`
);

// 6. Fix findAcceptanceForFellow
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
const fs1 = code.indexOf('function findAcceptanceForFellow(fellow) {');
const fe1 = code.indexOf('function ', fs1 + 10);
if (fs1 > -1 && fe1 > -1) code = code.substring(0, fs1) + updatedFindAcceptance + '\n\n' + code.substring(fe1);

// 7. Fix login signature
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

// 8. Move intake tag from h3 to bottom badge row in BOTH grid cards
code = code.replace(
  /\}\${f\.intakeStatus \? `<span class="intake-badge--\${f\.intakeStatus === 'August Intake' \? 'august' : 'existing'}" style="margin-left:6px; font-size:10px">\${f\.intakeStatus === 'August Intake' \? 'Aug' : 'Existing'}<\/span>` : ""}<\/h3>/g,
  `}</h3>`
);
code = code.replace(
  /<div>\${renderBadge\(f\.fellowStatus\)}<\/div>/g,
  `<div style="display:flex; align-items:center; justify-content:center; gap:6px; flex-wrap:wrap;">\${renderBadge(f.fellowStatus)} \${f.intakeStatus ? \`<span class="intake-badge--\${f.intakeStatus === 'August Intake' ? 'august' : 'existing'}" style="font-size:9px; padding:2px 5px;">\${f.intakeStatus === 'August Intake' ? 'Aug Intake' : 'Existing'}</span>\` : ""}</div>`
);

// 9. Replace banner photo with centered square 120x120 matching profile modal
// Also center the card text
code = code.replace(
  /const photoHtml = photoUrl \r?\n        \? `<img src="\$\{photoUrl\}" referrerpolicy="no-referrer" style="width: 100%; height: (?:160|200)px; object-fit: cover;[^`]+`\r?\n        : `<div style="width: 100%; height: (?:160|200)px;[^`]+`;\r?\n/g,
  `const teamColor = TEAM_COLORS[f.team]?.primary || '#7C3AED';
      const photoHtml = photoUrl 
        ? \`<div style="display:flex; justify-content:center; padding:20px 20px 0;"><img src="\${photoUrl}" referrerpolicy="no-referrer" style="width:120px; height:120px; border-radius:16px; object-fit:cover; object-position:top; border:3px solid \${teamColor}; box-shadow:0 8px 24px rgba(0,0,0,0.3);" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div style="width:120px; height:120px; border-radius:16px; display:none; align-items:center; justify-content:center; background:\${teamColor}22; font-size:40px; font-weight:800; color:\${teamColor}; border:3px solid \${teamColor};">\${escapeHTML(displayName.charAt(0))}</div></div>\`
        : \`<div style="display:flex; justify-content:center; padding:20px 20px 0;"><div style="width:120px; height:120px; border-radius:16px; display:flex; align-items:center; justify-content:center; background:\${teamColor}22; font-size:40px; font-weight:800; color:\${teamColor}; border:3px solid \${teamColor}; box-shadow:0 8px 24px rgba(0,0,0,0.3);">\${escapeHTML(displayName.charAt(0))}</div></div>\`;
`
);

// Also center the padding div in the cards
code = code.replace(/<div style="padding: 15px;">/g, '<div style="padding: 14px 15px; text-align:center;">');
code = code.replace(/<div style="padding: 12px 15px;">/g, '<div style="padding: 12px 15px; text-align:center;">');

fs.writeFileSync('app.js', code);
console.log('All patches applied! Length:', code.length);
