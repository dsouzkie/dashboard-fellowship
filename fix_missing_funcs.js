const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const missingFuncs = `
function pocDecideStrike(fellowId, reasonStr, action) {
  if (!window._tempReviews) window._tempReviews = {};
  if (!window._tempReviews[fellowId]) window._tempReviews[fellowId] = {};
  
  window._tempReviews[fellowId][reasonStr] = action;
  
  const container = document.getElementById('strike-actions-' + fellowId);
  if (container) {
    if (action === 'approve') {
      container.innerHTML = '<span style="color:#10B981;font-weight:700;">✓ Approved</span>';
    } else {
      container.innerHTML = '<span style="color:#94A3B8;font-weight:700;">✗ Rejected</span>';
    }
  }
}

function submitStrikeReview() {
  if (!confirm("Are you sure you want to submit? This cannot be undone.")) return;
  const user = AppState.currentUser;
  
  if (window._tempReviews) {
    Object.entries(window._tempReviews).forEach(([fid, decisions]) => {
      Object.entries(decisions).forEach(([reason, action]) => {
        if (action === 'approve') {
          const rec = AppState.strikeRecords.find(r => r.fellowId === fid);
          if (!rec) {
            AppState.strikeRecords.push({ fellowId: fid, strikes: [] });
          }
          const realRec = AppState.strikeRecords.find(r => r.fellowId === fid);
          realRec.strikes.push({
            id: 'str_' + Date.now() + Math.random().toString(36).substr(2,5),
            reason: reason,
            phase: AppState.strikePhase.id,
            approvedBy: user.name,
            approvedAt: new Date().toISOString(),
            emailSent: false,
            removed: false
          });
        }
      });
    });
  }
  
  AppState.strikeReviews[user.name] = 'approved';
  saveStrikeRecords();
  saveStrikeReviews();
  window._tempReviews = {};
  render();
}

function markStrikeEmailSent(fellowId, strikeId) {
  const rec = AppState.strikeRecords.find(r => r.fellowId === fellowId);
  if (rec) {
    const s = rec.strikes.find(x => x.id === strikeId);
    if (s) {
      s.emailSent = true;
      saveStrikeRecords();
      render();
    }
  }
}
`;

if (!app.includes('function pocDecideStrike')) {
  app = app.replace('function renderStrikes() {', missingFuncs + '\nfunction renderStrikes() {');
  fs.writeFileSync('app.js', app, 'utf8');
  console.log('Restored missing strike handler functions.');
} else {
  console.log('Functions already exist.');
}
