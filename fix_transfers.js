const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const expected = `    req.status = 'approved';
    req.approvedBy = AppState.currentUser.name;
      savePocTransfers();`;

const fixed = `    req.status = 'approved';
    req.approvedBy = AppState.currentUser.name;
    saveFellowRequests();
    saveFellows();
    showToast('Request Approved & Dashboard Updated', 'success');
    render();
  };
  
  window.rejectFellowRequest = (id) => {
    const req = AppState.fellowRequests.find(r => r.id === id);
    if (req) {
      req.status = 'rejected';
      req.approvedBy = AppState.currentUser.name;
      saveFellowRequests();
      showToast('Request Rejected', 'info');
      render();
    }
  };

  window.approveTransfer = (id) => {
    const req = AppState.pocTransfers.find(t => t.id === id);
    if (req) {
      req.status = 'approved';
      const fellow = AppState.fellows.find(f => f.id === req.fellowId);
      if (fellow) {
        logChange(fellow.id, 'pocAssigned', fellow.pocAssigned, req.toPoc);
        
        if (AppState.strikePhase && AppState.strikePhase.active) {
            const phaseId = AppState.strikePhase.phaseId;
            if (AppState.strikeReviews[phaseId] && AppState.strikeReviews[phaseId][fellow.pocAssigned] && AppState.strikeReviews[phaseId][fellow.pocAssigned][fellow.id]) {
                if (!AppState.strikeReviews[phaseId][req.toPoc]) AppState.strikeReviews[phaseId][req.toPoc] = {};
                AppState.strikeReviews[phaseId][req.toPoc][fellow.id] = AppState.strikeReviews[phaseId][fellow.pocAssigned][fellow.id];
                delete AppState.strikeReviews[phaseId][fellow.pocAssigned][fellow.id];
                if (typeof saveStrikeReviews === 'function') saveStrikeReviews();
            }
        }

        fellow.pocAssigned = req.toPoc;
        saveFellows();
      }
      savePocTransfers();`;

app = app.replace(expected, fixed);
fs.writeFileSync('app.js', app);
console.log('Fixed deleted lines');
