const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Add mergeFafDataOnce function
const mergeFunc = `
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
`;

if (!app.includes('function mergeFafDataOnce')) {
  app = app.replace('async function init() {', mergeFunc + '\nasync function init() {');
}

// 2. Call mergeFafDataOnce in init() and syncFromSheets()
app = app.replace(
  /if \(savedFellows\) \{ AppState\.fellows = savedFellows; await fetchAdditionalDataFromSheets\(\); \}/,
  'if (savedFellows) { AppState.fellows = savedFellows; await fetchAdditionalDataFromSheets(); mergeFafDataOnce(); }'
);

app = app.replace(
  /if \(typeof fetchAdditionalDataFromSheets === 'function'\) \{ await fetchAdditionalDataFromSheets\(\); \}/,
  "if (typeof fetchAdditionalDataFromSheets === 'function') { await fetchAdditionalDataFromSheets(); }\n    mergeFafDataOnce();"
);

// 3. Remove Late Merging from Missing Info logic
app = app.replace(
  /const acc = typeof findAcceptanceForFellow === 'function' \? findAcceptanceForFellow\(f, true\) : null;\s+const mName = [^;]+;\s+const mEmail = [^;]+;\s+const mPhone = [^;]+;/m,
  "const mName = f.fellowName || ''; const mEmail = f.emailId || ''; const mPhone = f.whatsappNo || '';"
);
app = app.replace(
  /if \(!mName \|\| mName\.trim\(\) === '' \|\| mName\.toLowerCase\(\) === 'no fellow' \|\| mName\.toLowerCase\(\) === 'n\/a' \|\| mName === '\?'\) \{\s*\/\/ It's a vacant college\. Skip alerts for vacant colleges\.\s*return;\s*\}/m,
  "if (f.isVacant) return;"
);


// 4. Remove Late Merging from UI (Grid and Table)
// Table row mapping:
app = app.replace(
  /const acc = typeof findAcceptanceForFellow === 'function' \? findAcceptanceForFellow\(f, true\) : null;\s+const displayName = \(acc && acc\.fullName\) \|\| f\.fellowName \|\| 'Unknown';\s+const displayCollege = \(acc && acc\.college\) \|\| f\.collegeName \|\| 'Unknown';/g,
  "const displayName = f.fellowName || 'Unknown'; const displayCollege = f.collegeName || 'Unknown';"
);
// Photo URL in Grid/Table:
app = app.replace(
  /const photoUrl = \(acc && acc\.photo\) \? getDriveImageUrl\(acc\.photo\) : \(\(alumni && alumni\.nominatedFellowPhoto\) \? getDriveImageUrl\(alumni\.nominatedFellowPhoto\) : null\);/g,
  "const photoUrl = f.photoUrl || null;"
);
app = app.replace(
  /const photoUrl = \(acceptance && acceptance\.photo\) \? getDriveImageUrl\(acceptance\.photo\) : \(\(alumni && alumni\.nominatedFellowPhoto\) \? getDriveImageUrl\(alumni\.nominatedFellowPhoto\) : null\);/g,
  "const photoUrl = f.photoUrl || null;"
);

// Recent activity fixes
app = app.replace(
  /const acc = fellow \? \(typeof findAcceptanceForFellow === 'function' \? findAcceptanceForFellow\(fellow, true\) : null\) : null;\s+let fname = fellow \? \(\(acc && acc\.fullName\) \|\| fellow\.fellowName \|\| 'Unknown'\) : 'Unknown';\s+if \(fname\.toLowerCase\(\) === 'no fellow' \|\| fname === 'N\/A' \|\| fname === ''\) fname = 'Unknown';/g,
  "let fname = fellow ? (fellow.fellowName || 'Unknown') : 'Unknown'; if (fname === 'N/A' || fname === '') fname = 'Unknown';"
);

// renderFellowProfile fixes
app = app.replace(
  /let dName = \(acceptance && acceptance\.fullName\) \|\| fellow\.fellowName \|\| '';/g,
  "let dName = fellow.fellowName || '';"
);
app = app.replace(
  /const dCollege = \(acceptance && acceptance\.college\) \|\| fellow\.collegeName \|\| 'Unknown';/g,
  "const dCollege = fellow.collegeName || 'Unknown';"
);
app = app.replace(
  /const dCity = \(acceptance && acceptance\.city\) \|\| fellow\.city \|\| 'Unknown';/g,
  "const dCity = fellow.city || 'Unknown';"
);
app = app.replace(
  /const dState = \(acceptance && acceptance\.state\) \? `, \${acceptance\.state}` : \(fellow\.state \? `, \${fellow\.state}` : ''\);/g,
  "const dState = fellow.state ? `, ${fellow.state}` : '';"
);

fs.writeFileSync('app.js', app);
