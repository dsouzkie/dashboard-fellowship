const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');

// Find card HTML
const cardIdx = code.indexOf('const teamColor = TEAM_COLORS');
if (cardIdx > -1) {
  console.log('=== CARD HTML ===');
  console.log(code.substring(cardIdx, cardIdx + 1500));
}

// Find strike info in renderFellowProfile
const profileIdx = code.indexOf('Strikes & Infractions');
if (profileIdx > -1) {
  console.log('\n=== STRIKE PROFILE INFO ===');
  console.log(code.substring(profileIdx - 200, profileIdx + 1000));
}
