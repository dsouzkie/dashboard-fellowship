const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const updatedFindAcceptance = `function findAcceptanceForFellow(fellow) {
  if (!AppState.acceptances || !AppState.acceptances.length) return null;
  
  const fName = (fellow.fellowName || '').toLowerCase().trim();
  const fCollege = (fellow.collegeName || '').toLowerCase().trim();
  
  return AppState.acceptances.find(a => {
    const fafName = (a.fullName || '').toLowerCase().trim();
    const fafCollege = (a.college || '').toLowerCase().trim();
    
    // Strict Match
    if (fName && fafName && fCollege && fafCollege) {
      if (fName === fafName && fCollege === fafCollege) return true;
      
      const nameMatch = fName.includes(fafName) || fafName.includes(fName);
      
      // Token overlap for college (e.g. "banglore" vs "bangalore")
      const fColWords = fCollege.split(/[^a-z0-9]/).filter(w => w.length > 3);
      const fafColWords = fafCollege.split(/[^a-z0-9]/).filter(w => w.length > 3);
      
      const colOverlap = fColWords.some(w => fafColWords.includes(w)) || 
                         fafColWords.some(w => fColWords.includes(w)) ||
                         fCollege.includes(fafCollege) || fafCollege.includes(fCollege);
                         
      if (nameMatch && colOverlap) return true;
      
      // Very loose match for edge cases where the name is distinct and overlaps significantly
      const nWords = fName.split(/[^a-z0-9]/).filter(w => w.length > 2);
      const nFafWords = fafName.split(/[^a-z0-9]/).filter(w => w.length > 2);
      let nMatches = 0;
      for (const w of nWords) { if (nFafWords.includes(w)) nMatches++; }
      if (nMatches > 0 && colOverlap) return true;
    }
    
    // Fallback to old matching logic just in case
    const fEmail = (fellow.emailId || '').toLowerCase().trim();
    const fPhone = String(fellow.whatsappNo || '').replace(/\\D/g, '');
    const fafEmail = (a.email || '').toLowerCase().trim();
    const fafPhone = String(a.phone || '').replace(/\\D/g, '');
    if (fEmail && fafEmail && fEmail === fafEmail) return true;
    if (fPhone && fafPhone && fPhone.length >= 10 && fafPhone.includes(fPhone.slice(-10))) return true;
    
    return false;
  }) || null;
}`;

const lines = code.split('\n');
const start = lines.findIndex(l => l.includes('function findAcceptanceForFellow(fellow) {'));
const end = lines.findIndex((l, i) => i > start && l.includes('function renderStatCard'));
if (start > -1 && end > -1) {
  lines.splice(start, end - start, updatedFindAcceptance);
  code = lines.join('\n');
  fs.writeFileSync('app.js', code);
} else {
  console.log('Failed to find bounds for findAcceptanceForFellow');
}
