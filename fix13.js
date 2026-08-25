const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const newFindAcceptance = `function findAcceptanceForFellow(fellow) {
  if (!AppState.acceptances || !AppState.acceptances.length) return null;
  
  const fName = (fellow.fellowName || '').toLowerCase().trim();
  const fCollege = (fellow.collegeName || '').toLowerCase().trim();
  
  return AppState.acceptances.find(a => {
    const fafName = (a.fullName || '').toLowerCase().trim();
    const fafCollege = (a.college || '').toLowerCase().trim();
    
    // Exact match on Name and College
    if (fName && fafName && fCollege && fafCollege) {
      if (fName === fafName && fCollege === fafCollege) return true;
      
      // Fuzzy name and fuzzy college
      const nameMatch = fName.includes(fafName) || fafName.includes(fName);
      const collegeMatch = fCollege.includes(fafCollege) || fafCollege.includes(fCollege);
      if (nameMatch && collegeMatch) return true;
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

// Replace findAcceptanceForFellow
const lines = code.split('\n');
const start = lines.findIndex(l => l.includes('function findAcceptanceForFellow(fellow) {'));
const end = lines.findIndex((l, i) => i > start && l === '}');
if (start > -1 && end > -1) {
  lines.splice(start, end - start + 1, newFindAcceptance);
  code = lines.join('\n');
}

// Fix photo rendering in Grid View to ONLY use acceptance
const regexGrid = /const photoUrl = \(alumni && alumni\.nominatedFellowPhoto\) \? getDriveImageUrl\(alumni\.nominatedFellowPhoto\) : \(\(acceptance && acceptance\.photo\) \? getDriveImageUrl\(acceptance\.photo\) : null\);/g;
code = code.replace(regexGrid, 'const photoUrl = (acceptance && acceptance.photo) ? getDriveImageUrl(acceptance.photo) : null;');

// Fix photo rendering in renderFellowProfile to ONLY use acceptance
// In renderFellowProfile:
// photoUrl = getDriveImageUrl(acceptance.photo);
// photoUrl = getDriveImageUrl(alumni.nominatedFellowPhoto);
code = code.replace(/photoUrl = getDriveImageUrl\(alumni\.nominatedFellowPhoto\);/g, '// photoUrl = getDriveImageUrl(alumni.nominatedFellowPhoto); // User requested only FAF photo');

fs.writeFileSync('app.js', code);
