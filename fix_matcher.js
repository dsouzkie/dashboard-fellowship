const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Rewrite findAcceptanceForFellow
const oldFuncRegex = /function findAcceptanceForFellow\(fellow, force = false\) \{[\s\S]*?return false;\s*\}\) \|\| null;\s*\}/;

const newFunc = `function findAcceptanceForFellow(fellow, force = false) {
  if (!force && fellow.finalAcceptance !== 'Yes') return null;
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
    
    // 1. Exact Email Match
    if (fEmail && fafEmail && fEmail === fafEmail) return true;
    
    // 2. Exact Phone Match (last 10 digits)
    if (fPhone && fafPhone && fPhone.length >= 10 && fafPhone.length >= 10 && fPhone.slice(-10) === fafPhone.slice(-10)) return true;
    
    // 3. Name & College Match
    if (fName && fafName && fCollege && fafCollege) {
      if (fName === fafName && fCollege === fafCollege) return true;
      
      const fNameWords = fName.split(/[^a-z0-9]/).filter(w => w.length > 2);
      const fafNameWords = fafName.split(/[^a-z0-9]/).filter(w => w.length > 2);
      const nameWordOverlap = fNameWords.some(w => fafNameWords.includes(w)) || fafNameWords.some(w => fNameWords.includes(w));
      
      const fColWords = fCollege.split(/[^a-z0-9]/).filter(w => w.length > 3);
      const fafColWords = fafCollege.split(/[^a-z0-9]/).filter(w => w.length > 3);
      const colOverlap = fColWords.some(w => fafColWords.includes(w)) || fafColWords.some(w => fColWords.includes(w));
      
      if (nameWordOverlap && colOverlap) return true;
    }
    return false;
  }) || null;
}`;

app = app.replace(oldFuncRegex, newFunc);
fs.writeFileSync('app.js', app);
