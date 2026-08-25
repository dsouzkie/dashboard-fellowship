const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

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
  fs.writeFileSync('app.js', code);
  console.log('Fixed findAcceptanceForFellow safely!');
} else {
  console.log('Could not find start/end bounds!');
}
