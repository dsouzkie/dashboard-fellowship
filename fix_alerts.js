const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Fix Admin Strike Master Current Phase
app = app.replace(
  /<h2 class="card-title" style="color:#3B82F6;">Current Phase: <\/h2>/g,
  '<h2 class="card-title" style="color:#3B82F6;">Current Phase: \\${escapeHTML(phase.name)}</h2>'
);

// 2. Fix the missingInfo logic to merge with FAF first
const missingInfoRegex = /let missingInfo = \[\];[\s\S]*?const missingHtml =/m;
const newMissingInfoLogic = `let missingInfo = [];
  AppState.fellows.forEach(f => {
    if (!isAdm && f.pocAssigned !== myName) return;
    
    const acc = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(f, true) : null;
    const mName = (acc && acc.fullName) || f.fellowName || '';
    const mEmail = (acc && acc.email) || f.emailId || '';
    const mPhone = (acc && acc.phone) || f.whatsappNo || '';

    // If the fellow name is completely missing or 'No Fellow', we might alert it, but user wants it removed.
    // If they have no fellow assigned to a college yet (meaning it's just a blank slot), don't complain to POC about missing contact info.
    if (!mName || mName.trim() === '' || mName.toLowerCase() === 'no fellow' || mName.toLowerCase() === 'n/a' || mName === '?') {
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

  const missingHtml =`;
app = app.replace(missingInfoRegex, newMissingInfoLogic);

// 3. Fix Recent Activity to merge FAF
const recentActivityRegex = /const fname = fellow \? fellow\.fellowName : 'Unknown';/g;
app = app.replace(recentActivityRegex, `const acc = fellow ? (typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(fellow, true) : null) : null;
    let fname = fellow ? ((acc && acc.fullName) || fellow.fellowName || 'Unknown') : 'Unknown';
    if (fname.toLowerCase() === 'no fellow' || fname === 'N/A' || fname === '') fname = 'Unknown';`);

// 4. Clean up "No Fellow" fallbacks in rendering
app = app.replace(/\|\| 'No Fellow'/g, "|| 'Unknown'");
app = app.replace(/\|\| 'No Name'/g, "|| 'Unknown'");
app = app.replace(/=== 'No Fellow'/g, "=== 'Unknown'");
app = app.replace(/!== 'no fellow'/g, "!== 'unknown'");
app = app.replace(/toLowerCase\(\) === 'no fellow'/g, "toLowerCase() === 'unknown'");


fs.writeFileSync('app.js', app);
