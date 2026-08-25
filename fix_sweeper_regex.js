const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /if \(!f\.finalAcceptance \|\| f\.finalAcceptance === 'N\/A' \|\| f\.finalAcceptance\.trim\(\) === ''\) \{\s*f\.finalAcceptance = 'No';\s*changed = true;\s*\}/,
  `if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance.trim() === '') {
        f.finalAcceptance = 'No';
        changed = true;
      }
      const oldActivity = f.clubPageActivity;
      f.clubPageActivity = mapClubPageActivity(f.clubPageActivity);
      if (oldActivity !== f.clubPageActivity) changed = true;`
);

fs.writeFileSync('app.js', app);
