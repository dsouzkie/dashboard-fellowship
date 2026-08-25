const fs = require('fs');
let text = fs.readFileSync('app.js', 'utf8');

const startIdx = text.indexOf('function findAcceptanceForFellow(fellow) {');
const endIdx = text.indexOf('function getDriveImageUrl(driveLink) {');

if (startIdx !== -1 && endIdx !== -1) {
  const newFunction = `function findAcceptanceForFellow(fellow) {
  if (!AppState.acceptances || !AppState.acceptances.length) return null;
  
  const fName = (fellow.fellowName || '').toLowerCase().trim();
  const fEmail = (fellow.emailId || '').toLowerCase().trim();
  const fPhone = String(fellow.whatsappNo || '').replace(/\\D/g, '');
  const fCollege = (fellow.collegeName || '').toLowerCase().trim();
  
  return AppState.acceptances.find(a => {
    const fafName = (a.fullName || '').toLowerCase().trim();
    const fafEmail = (a.email || '').toLowerCase().trim();
    const fafPhone = String(a.phone || '').replace(/\\D/g, '');
    const fafCollege = (a.college || '').toLowerCase().trim();
    
    // Exact match on email or phone
    if (fEmail && fafEmail && fEmail === fafEmail) return true;
    if (fPhone && fafPhone && fPhone.length >= 10 && fafPhone.includes(fPhone.slice(-10))) return true;
    
    if (fName && fafName) {
       // Strict exact name match
       if (fName === fafName) return true;
       
       // College overlap check
       const collegeMatches = (fCollege && fafCollege && (fCollege.includes(fafCollege) || fafCollege.includes(fCollege)));
       
       // Substring or word match ONLY IF college matches, or name length is substantial and they share multiple words
       if (collegeMatches) {
         if (fafName.includes(fName) || fName.includes(fafName)) return true;
         const fWords = fName.split(' ').filter(w => w.length > 2);
         const fafWords = fafName.split(' ').filter(w => w.length > 2);
         for (const w of fWords) {
           if (fafWords.includes(w)) return true;
         }
       } else {
         // Without college match, be extremely strict: must share at least 2 words (e.g. first AND last name)
         const fWords = fName.split(' ').filter(w => w.length > 2);
         const fafWords = fafName.split(' ').filter(w => w.length > 2);
         let matches = 0;
         for (const w of fWords) {
           if (fafWords.includes(w)) matches++;
         }
         if (matches >= 2) return true;
       }
    }
    return false;
  }) || null;
}

`;
  
  text = text.substring(0, startIdx) + newFunction + text.substring(endIdx);
  fs.writeFileSync('app.js', text, 'utf8');
  console.log('Successfully replaced findAcceptanceForFellow');
} else {
  console.log('Could not find indices');
}
