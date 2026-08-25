const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Remove from FIELD_KEYS array
const fieldsToRemove = ['clubPageLaunched', 'firstReelPosted', 'whatsappGroupAdded', 'mtf', 'clubRecruitmentCampaign'];
const regexFieldKeys = /const FIELD_KEYS = \[([\s\S]*?)\];/;
const match = app.match(regexFieldKeys);
if (match) {
  let keysStr = match[1];
  fieldsToRemove.forEach(f => {
    keysStr = keysStr.replace(new RegExp(\`'\\s*\${f}\\s*',?\\s*\`, 'g'), '');
  });
  app = app.replace(regexFieldKeys, \`const FIELD_KEYS = [\${keysStr}];\`);
}

// 2. Remove from FIELD_LABELS object
fieldsToRemove.forEach(f => {
  app = app.replace(new RegExp(\`\\s*\${f}:\\s*'[^']*',?\\r?\\n\`, 'g'), '\\n');
});

// 3. Clean up evaluateAutoStrikes
app = app.replace(
  /if \(AppState\.strikeRules\.rule2 && fellow\.finalAcceptance === 'Yes' && \(fellow\.clubPageLaunched === 'No' || fellow\.clubPageLaunched === ''\)\) \{\s*strikes\.push\(\{ reason: 'Club Page Launch', severity: 'warning' \}\);\s*\}/,
  ''
);

app = app.replace(
  /if \(AppState\.strikeRules\.rule3 && fellow\.clubPageLaunched === 'Yes' && fellow\.clubPageActivity === 'Inactive'\)/,
  \`if (AppState.strikeRules.rule3 && fellow.finalAcceptance === 'Yes' && fellow.clubPageActivity === 'Inactive')\`
);

// 4. Remove from calculateScore
app = app.replace(/if \(fellow\.clubPageLaunched === 'Yes'\) score \+= 15;/g, '');
app = app.replace(/if \(fellow\.firstReelPosted === 'Yes'\) score \+= 10;/g, '');
app = app.replace(/if \(fellow\.whatsappGroupAdded === 'Yes'\) score \+= 10;/g, '');

// 5. Remove KPI card logic (launchRate)
app = app.replace(
  /const launchRate = total > 0 \? Math\.round\(\(fellows\.filter\(f => f\.clubPageLaunched === 'Yes'\)\.length \/ total\) \* 100\) : 0;/g,
  ''
);
app = app.replace(
  /const myLaunched = myFellows\.filter\(f => f\.clubPageLaunched === 'Yes'\)\.length;/g,
  ''
);

// 6. Remove HTML rendering of the KPI card
app = app.replace(
  /.*Pages Launched.*launchRate.*\n/g,
  ''
);

// 7. Remove from Filters
app = app.replace(/<div class="form-group">\s*<label class="form-label">Club Page Launched:<\/label>[\s\S]*?<\/select>\s*<\/div>/, '');

// 8. Remove from Profile details
app = app.replace(/<div class="profile-detail-label">Club Page Launched<\/div>[\s\S]*?<\/div>\s*<\/div>/, '');
app = app.replace(/<div class="profile-detail-label">First Reel Posted<\/div>[\s\S]*?<\/div>\s*<\/div>/, '');
app = app.replace(/<div class="profile-detail-label">WhatsApp Group<\/div>[\s\S]*?<\/div>\s*<\/div>/, '');
app = app.replace(/<div class="profile-detail-label">MTF Status<\/div>[\s\S]*?<\/div>\s*<\/div>/, '');
app = app.replace(/<div class="profile-detail-label">Recruitment Campaign<\/div>[\s\S]*?<\/div>\s*<\/div>/, '');

// 9. Remove from fetchTracker mapping
fieldsToRemove.forEach(f => {
  app = app.replace(new RegExp(\`\\s*\${f}:\\s*getIdx\\([^)]+\\),?\\r?\\n\`, 'g'), '\\n');
});
app = app.replace(/clubPageLaunched: row\[cols\.clubPageLaunched\] \|\| '',/g, '');
app = app.replace(/firstReelPosted: row\[cols\.firstReelPosted\] \|\| '',/g, '');
app = app.replace(/whatsappGroupAdded: row\[cols\.whatsappGroupAdded\] \|\| '',/g, '');
app = app.replace(/mtf: row\[cols\.mtf\] \|\| '',/g, '');
app = app.replace(/clubRecruitmentCampaign: row\[cols\.clubRecruitmentCampaign\] \|\| '',/g, '');

// 10. Mass Add removal (Wait, clubPageLaunched was in mass add grid?)
// Yes, there was a column for clubPageLaunched in mass add. I'll just remove the strings.
app = app.replace(/<th>Club Page Launched<\/th>/g, '');
app = app.replace(/<td class="editable" data-id="[^"]+" data-field="clubPageLaunched">[^<]+<\/td>/g, '');
app = app.replace(/<td class="" data-id="[^"]+" data-field="clubPageLaunched">[^<]+<\/td>/g, '');

// Actually, in the table header, 'Launched' was a sort column
app = app.replace(/<th data-sort="clubPageLaunched">Launched.*<\/th>/g, '');

// 11. Run a DB sweep to delete from localStorage
const sweepScript = \`
  if (AppState.fellows) {
    let changed = false;
    AppState.fellows.forEach(f => {
      ['clubPageLaunched', 'firstReelPosted', 'whatsappGroupAdded', 'mtf', 'clubRecruitmentCampaign'].forEach(k => {
        if (k in f) {
          delete f[k];
          changed = true;
        }
      });
      if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance.trim() === '') {
        f.finalAcceptance = 'No';
        changed = true;
      }
    });
    if (changed) saveFellows();
  }
\`;

app = app.replace(/if \(AppState\.fellows\) \{\s*let changed = false;\s*AppState\.fellows\.forEach\(f => \{[\s\S]*?if \(changed\) saveFellows\(\);\s*\}/, sweepScript);

fs.writeFileSync('app.js', app);
console.log('Removed deprecated fields from all locations');
