const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  '<h3 class="card-title" style="color: #10B981;">⚠️ Action Required: New Acceptances</h3>',
  '<div style="display:flex; justify-content:space-between; align-items:center;"><h3 class="card-title" style="color: #10B981; margin:0;">⚠️ Action Required: New Acceptances</h3><button class="btn btn--sm btn--primary" id="btn-approve-all-faf">✅ Approve All</button></div>'
);

const eventListenerCode = `
  // Form Tracker Approve All
  const btnApproveAll = document.getElementById('btn-approve-all-faf');
  if (btnApproveAll) {
    btnApproveAll.addEventListener('click', () => {
      const btns = document.querySelectorAll('.btn-approve-faf');
      btns.forEach(btn => {
        const id = btn.dataset.id;
        const fellow = AppState.fellows.find(f => f.id === id);
        if(fellow) { fellow.finalAcceptance = 'Yes'; logChange(id, 'finalAcceptance', 'No', 'Yes'); }
      });
      if (btns.length > 0) {
        runAutoStrikes();
        saveFellows();
        showToast('All new acceptances approved!', 'success');
        render();
      }
    });
  }
`;

app = app.replace('// Form Tracker Approve FAF Sync button', eventListenerCode + '\n  // Form Tracker Approve FAF Sync button');

fs.writeFileSync('app.js', app);
