const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetRender = `function renderAdminStrikes() {`;
const replaceRender = `function renderAdminStrikes() {
  // HOTFIX: Auto-restore Aviral Bhatt's strike before rendering
  if (AppState.strikeRecords && AppState.fellows) {
    AppState.strikeRecords.forEach(rec => {
      const fellow = AppState.fellows.find(f => f.id === rec.fellowId);
      if (fellow && fellow.fellowName && fellow.fellowName.includes('Aviral Bhatt')) {
        rec.strikes.forEach(strike => {
          if (strike.reason && strike.reason.includes('Not filled insight form') && strike.removed) {
            strike.removed = false;
            saveStrikeRecords();
          }
        });
      }
    });
  }
`;

if (code.includes(targetRender)) {
  code = code.replace(targetRender, replaceRender);
  fs.writeFileSync('app.js', code);
  console.log('Injected hotfix directly into renderAdminStrikes!');
} else {
  console.log('Could not find renderAdminStrikes function');
}
