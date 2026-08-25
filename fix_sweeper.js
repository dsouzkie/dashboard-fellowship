const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const sweepTarget = `      if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance.trim() === '') {
        f.finalAcceptance = 'No';
        changed = true;
      }`;
const sweepReplacement = `      if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance.trim() === '') {
        f.finalAcceptance = 'No';
        changed = true;
      }
      
      const oldActivity = f.clubPageActivity;
      f.clubPageActivity = mapClubPageActivity(f.clubPageActivity);
      if (oldActivity !== f.clubPageActivity) changed = true;`;

app = app.replace(sweepTarget, sweepReplacement);

fs.writeFileSync('app.js', app);
