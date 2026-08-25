const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Give Surya Admin Privilege
app = app.replace(
  "{ name: 'Surya', color: '#F97316', password: 'under25surya', team: 'Amber' }",
  "{ name: 'Surya', color: '#F97316', password: 'under25surya', isAdmin: true, team: 'Amber' }"
);

// 2. Restore Scrolling in Forms
app = app.replace(
  /function renderForms\(\) \{[\s\S]*?<div class="card-body">/m,
  (match) => match.replace('<div class="card-body">', '<div class="card-body" style="max-height: 600px; overflow-y: auto;">')
);

// 3. Restore Scrolling in Strikes Master List
app = app.replace(
  /function renderStrikes\(\) \{[\s\S]*?<div class="card-body" style="padding:0;">/m,
  (match) => match.replace('<div class="card-body" style="padding:0;">', '<div class="card-body" style="padding:0; max-height: 600px; overflow-y: auto;">')
);

// 4. Also fix the "No Fellow" showing up.
// Why did "No Fellow" show up? Probably because of default empty entries being created when the app loaded or was clicked on mass add.
// In getFilteredFellows, we filter them out:
app = app.replace(
  "return fn !== 'no fellow' && fn !== '?';",
  "return fn !== 'no fellow' && fn !== '?' && fn !== '' && fn !== 'n/a';"
);

// 5. Restore CH Arjun / existing fellow PFP fallback!
// In renderFellowProfile:
const pfpTarget = `    let photoUrl = '';
    if (acceptance && acceptance.photo) {
      photoUrl = getDriveImageUrl(acceptance.photo);
    }`;
const pfpReplacement = `    let photoUrl = '';
    if (acceptance && acceptance.photo) {
      photoUrl = getDriveImageUrl(acceptance.photo);
    } else if (alumni && alumni.nominatedFellowPhoto) {
      // Fallback for existing fellows who haven't filled FAF
      photoUrl = getDriveImageUrl(alumni.nominatedFellowPhoto);
    }`;
app = app.replace(pfpTarget, pfpReplacement);

fs.writeFileSync('app.js', app);
