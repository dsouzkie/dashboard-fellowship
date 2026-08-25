const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const targetRender = `function render() {`;
const replaceRender = `function render() {
  // HOTFIX: Auto-restore Aviral Bhatt's strike
  if (AppState.strikeRecords && AppState.fellows) {
    let changed = false;
    AppState.strikeRecords.forEach(rec => {
      const fellow = AppState.fellows.find(f => f.id === rec.fellowId);
      if (fellow && fellow.fellowName && fellow.fellowName.includes('Aviral Bhatt')) {
        rec.strikes.forEach(strike => {
          if (strike.reason && strike.reason.includes('Not filled insight form') && strike.removed) {
            strike.removed = false;
            changed = true;
          }
        });
      }
    });
    if (changed) saveStrikeRecords();
  }
`;

if (code.includes(targetRender)) {
  code = code.replace(targetRender, replaceRender);
  fs.writeFileSync('app.js', code);
  console.log('Injected hotfix directly into render()!');
} else {
  console.log('Could not find render function');
}
