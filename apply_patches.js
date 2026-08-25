const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Fix empty rows
code = code.replace(
  '  const result = [];\n  for (let i = 1; i < rows.length; i++) {\n    const row = rows[i];',
  '  const result = [];\n  for (let i = 1; i < rows.length; i++) {\n    const row = rows[i];\n    if (!row[0] || row[0].trim() === \'\' || row[0].trim().toLowerCase() === \'no fellow\') continue;'
);

code = code.replace(
  '    if (!row[2]) continue;', 
  '    if (!row[2] || row[2].trim() === \'\' || row[2].trim().toLowerCase() === \'no fellow\') continue;'
);

// 2. Fix onerror
code = code.replace(
  `onerror="this.outerHTML='<div class=\\'profile-photo-placeholder\${teamClass}\\' style=\\'background-color:\${poc.color}\\'>\${dName.charAt(0).toUpperCase()}</div>'"`,
  `onerror="this.outerHTML='<div class=&quot;profile-photo-placeholder\${teamClass}&quot; style=&quot;background-color:\${poc.color}&quot;>\${dName.charAt(0).toUpperCase()}</div>'"`
);

// 3. Fix findAcceptanceForFellow
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
const e = code.indexOf('function getDriveImageUrl(driveLink)');
if (s > -1 && e > -1) {
  code = code.substring(0, s) + updatedFindAcceptance + '\n\n' + code.substring(e);
}

fs.writeFileSync('app.js', code);
console.log('Applied all patches successfully!');
