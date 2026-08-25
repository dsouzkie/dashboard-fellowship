const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Fix New Acceptances Scrolling
app = app.replace(
  '<div class="card-body" style="">',
  '<div class="card-body" style="max-height: 250px; overflow-y: auto;">'
);

// 2. Add Club Page Launched to Missing Information
const missingTarget = `} else if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance === '') {
        missingInfo.push({ id: f.id, college: f.collegeName, issue: 'Missing Final Acceptance Status', poc: f.pocAssigned });
      }`;
const missingReplacement = `} else if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance === '') {
        missingInfo.push({ id: f.id, college: f.collegeName, issue: 'Missing Final Acceptance Status', poc: f.pocAssigned });
      } else if (!f.clubPageLaunched || f.clubPageLaunched === 'N/A') {
        missingInfo.push({ id: f.id, college: f.collegeName, issue: 'Missing Club Page Launched', poc: f.pocAssigned });
      }`;
app = app.replace(missingTarget, missingReplacement);

// 3. Improve Matching Logic for findAcceptanceForFellow
// Replace the old nameMatch logic
const nameMatchTarget = `        const normalize = s => s.replace(/[^a-z0-9]/g, '');
        const nameMatch = fName.includes(fafName) || fafName.includes(fName) || normalize(fName).includes(normalize(fafName)) || normalize(fafName).includes(normalize(fName));`;
const nameMatchReplacement = `        const normalize = s => s.replace(/[^a-z0-9]/g, '');
        
        // Split names into words and check if any word > 3 chars matches (e.g. "Arjun" matches "CHENNAMANENI ARJUN")
        const fNameWords = fName.split(/[^a-z0-9]/).filter(w => w.length > 3);
        const fafNameWords = fafName.split(/[^a-z0-9]/).filter(w => w.length > 3);
        const wordOverlap = fNameWords.some(w => fafNameWords.includes(w)) || fafNameWords.some(w => fNameWords.includes(w));
        
        const nameMatch = wordOverlap || fName.includes(fafName) || fafName.includes(fName) || normalize(fName).includes(normalize(fafName)) || normalize(fafName).includes(normalize(fName));`;
app = app.replace(nameMatchTarget, nameMatchReplacement);

fs.writeFileSync('app.js', app);
