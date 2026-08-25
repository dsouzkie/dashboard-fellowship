const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const missingFunctions = `
function runAutoStrikes() {
  if (!AppState.fellows) return;
  AppState.fellows.forEach(fellow => {
    fellow._autoStrikes = evaluateStrikes(fellow);
  });
}

function evaluateStrikes(fellow) {
  const strikes = [];
  if (!AppState.strikeRules) return strikes;
  if (fellow.fellowStatus === 'Dropped Out') return strikes;
  
  if (AppState.strikeRules.ruleGhosting !== false && fellow.fellowStatus === 'Ghosted') {
    strikes.push({ reason: 'Ghosting', severity: 'danger' });
    return strikes;
  }
  
  if (fellow.fellowStatus === 'Inactive') return strikes;

  if (AppState.strikeRules.rule1 && (fellow.finalAcceptance === 'No' || fellow.finalAcceptance === '')) {
    strikes.push({ reason: 'Final Acceptance Form', severity: 'warning' });
  }
  
  if (AppState.strikeRules.rule2 && fellow.finalAcceptance === 'Yes' && (fellow.clubPageLaunched === 'No' || fellow.clubPageLaunched === '')) {
    strikes.push({ reason: 'Club Page Launch', severity: 'warning' });
  }
  
  if (AppState.strikeRules.rule3 && fellow.clubPageLaunched === 'Yes' && fellow.clubPageActivity === 'Inactive') {
    strikes.push({ reason: 'Page Inactive', severity: 'danger' });
  }
  return strikes;
}
`;

if (!code.includes('function runAutoStrikes()')) {
  // Insert before getDriveImageUrl
  code = code.replace('function getDriveImageUrl', missingFunctions + '\\nfunction getDriveImageUrl');
  fs.writeFileSync('app.js', code);
}
