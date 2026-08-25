const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /<div class="profile-detail-row">\s*<div class="profile-detail-label">Club Made<\/div>\s*<div class="profile-detail-value">\$\{renderBadge\(fellow\.clubMade\)\}<\/div>\s*<\/div>/,
  `<div class="profile-detail-row">
                  <div class="profile-detail-label">Club Made</div>
                  <div class="profile-detail-value">\${renderBadge(fellow.clubMade)}</div>
                </div>
                <div class="profile-detail-row">
                  <div class="profile-detail-label">Club Page Launched</div>
                  <div class="profile-detail-value">\${renderBadge(fellow.clubPageLaunched)}</div>
                </div>`
);

fs.writeFileSync('app.js', app);
