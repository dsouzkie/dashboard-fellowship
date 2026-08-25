const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Put Club Page Launched back into the Profile Grid under Club Made
const targetHtml = `<div class="profile-detail-row">
                  <div class="profile-detail-label">Club Made</div>
                  <div class="profile-detail-value">\${renderBadge(fellow.clubMade)}</div>
                </div>`;
const replacementHtml = `<div class="profile-detail-row">
                  <div class="profile-detail-label">Club Made</div>
                  <div class="profile-detail-value">\${renderBadge(fellow.clubMade)}</div>
                </div>
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Club Page Launched</div>
                  <div class="profile-detail-value">\${renderBadge(fellow.clubPageLaunched)}</div>
                </div>`;
app = app.replace(targetHtml, replacementHtml);

// 2. Fix the Sweeper so Activity actually maps
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
