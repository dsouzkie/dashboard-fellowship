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
    
    // Strict Match
    if (fName && fafName && fCollege && fafCollege) {
      if (fName === fafName && fCollege === fafCollege) return true;
      
      const nameMatch = fName.includes(fafName) || fafName.includes(fName);
      
      const fColWords = fCollege.split(/[^a-z0-9]/).filter(w => w.length > 3);
      const fafColWords = fafCollege.split(/[^a-z0-9]/).filter(w => w.length > 3);
      
      const colOverlap = fColWords.some(w => fafColWords.includes(w)) || 
                         fafColWords.some(w => fColWords.includes(w)) ||
                         fCollege.includes(fafCollege) || fafCollege.includes(fCollege);
                         
      if (nameMatch && colOverlap) return true;
      
      // Allow name-only match if the name is somewhat unique and > 5 chars
      // This helps with "Greeshma Wasnik" vs "Greeshma Wasnik" where college is "ADYPU" vs "Ajeenkya DY Patil"
      if (fName === fafName && fName.length > 5) return true;
    }
    
    if (fEmail && fafEmail && fEmail === fafEmail) return true;
    if (fPhone && fafPhone && fPhone.length >= 10 && fafPhone.includes(fPhone.slice(-10))) return true;
    
    return false;
  }) || null;
}`;

const lines = code.split('\n');
const start = lines.findIndex(l => l.includes('function findAcceptanceForFellow(fellow) {'));
const end = lines.findIndex((l, i) => i > start && l.includes('function getDriveImageUrl(driveLink)'));
if (start > -1 && end > -1) {
  lines.splice(start, end - start, updatedFindAcceptance);
  code = lines.join('\n');
  fs.writeFileSync('app.js', code);
}
