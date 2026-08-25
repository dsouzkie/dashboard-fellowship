const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Add removalRequests state
app = app.replace(
  `strikeReviews: [],      // { pocName: 'pending'|'approved' }`,
  `strikeReviews: [],      // { pocName: 'pending'|'approved' }\n  removalRequests: [],    // [{ id, fellowId, strikeId, requestedBy, reason, status: 'pending'|'approved'|'rejected' }]`
);

app = app.replace(
  `function loadStrikeReviews() { const s = localStorage.getItem('under25_strike_reviews'); return s ? JSON.parse(s) : {}; }`,
  `function loadStrikeReviews() { const s = localStorage.getItem('under25_strike_reviews'); return s ? JSON.parse(s) : {}; }\nfunction loadRemovalRequests() { const s = localStorage.getItem('under25_removal_requests'); return s ? JSON.parse(s) : []; }`
);

app = app.replace(
  `function saveStrikeReviews() { localStorage.setItem('under25_strike_reviews', JSON.stringify(AppState.strikeReviews)); }`,
  `function saveStrikeReviews() { localStorage.setItem('under25_strike_reviews', JSON.stringify(AppState.strikeReviews)); }\nfunction saveRemovalRequests() { localStorage.setItem('under25_removal_requests', JSON.stringify(AppState.removalRequests)); }`
);

app = app.replace(
  `AppState.strikeReviews = loadStrikeReviews();`,
  `AppState.strikeReviews = loadStrikeReviews();\n  AppState.removalRequests = loadRemovalRequests();`
);


// 2. Add strike dots to grid view
// In renderMyFellows (Grid view):
// We need to inject ${renderStrikeDots(f.id)} after the fellow name.
const gridNameSearch = `<h3 style="margin:0;font-size:1.1rem;color:#F1F5F9;">\${escapeHTML(f.fellowName)}</h3>`;
if (app.includes(gridNameSearch)) {
  app = app.replace(gridNameSearch, `<h3 style="margin:0;font-size:1.1rem;color:#F1F5F9;display:flex;align-items:center;gap:6px;">\${escapeHTML(f.fellowName)} \${renderStrikeDots(f.id)}</h3>`);
}


// 3. Add strike dots to fellow profile popup
const profileNameSearch = `<h2 style="margin:0;font-size:1.8rem;color:#F1F5F9;">\${escapeHTML(fellow.fellowName)}</h2>`;
if (app.includes(profileNameSearch)) {
  app = app.replace(profileNameSearch, `<h2 style="margin:0;font-size:1.8rem;color:#F1F5F9;display:flex;align-items:center;gap:8px;">\${escapeHTML(fellow.fellowName)} \${renderStrikeDots(fellow.id)}</h2>`);
}


// 4. Update renderStrikes() entirely
const newRenderStrikes = `
function requestStrikeRemoval(fellowId, strikeId) {
  const reason = prompt("Reason for requesting strike removal:");
  if (!reason) return;
  const req = {
    id: 'req_' + Date.now() + Math.random().toString(36).substr(2,5),
    fellowId,
    strikeId,
    requestedBy: AppState.currentUser.name,
    reason,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  AppState.removalRequests.push(req);
  saveRemovalRequests();
  logChange(fellowId, 'strikeRemovalRequest', 'Requested', reason);
  render();
}

function adminApproveRemoval(reqId) {
  const req = AppState.removalRequests.find(r => r.id === reqId);
  if (!req) return;
  const rec = AppState.strikeRecords.find(r => r.fellowId === req.fellowId);
  if (rec) {
    const s = rec.strikes.find(x => x.id === req.strikeId);
    if (s) {
      s.removed = true;
      s.removedAt = new Date().toISOString();
      s.removedBy = AppState.currentUser.name;
    }
  }
  req.status = 'approved';
  saveStrikeRecords();
  saveRemovalRequests();
  logChange(req.fellowId, 'strikeRemoved', 'Active', 'Removed via POC request');
  render();
}

function adminRejectRemoval(reqId) {
  const req = AppState.removalRequests.find(r => r.id === reqId);
  if (req) {
    req.status = 'rejected';
    saveRemovalRequests();
    render();
  }
}

function adminDirectRemove(fellowId, strikeId) {
  if (!confirm("Are you sure you want to directly remove this strike?")) return;
  const rec = AppState.strikeRecords.find(r => r.fellowId === fellowId);
  if (rec) {
    const s = rec.strikes.find(x => x.id === strikeId);
    if (s) {
      s.removed = true;
      s.removedAt = new Date().toISOString();
      s.removedBy = AppState.currentUser.name;
      saveStrikeRecords();
      logChange(fellowId, 'strikeRemoved', 'Active', 'Removed directly by Admin');
      render();
    }
  }
}

function renderStrikes() {
  const user = AppState.currentUser;
  const isAdmin = user && user.isAdmin;
  const phase = AppState.strikePhase;

  // --- POC VIEW ---
  if (!isAdmin) {
    let html = \`<header class="page-header" style="margin-bottom:20px;">
      <h1 class="page-title">⚡ Strike Management</h1>
      <p class="page-subtitle">\${phase.active ? '🔴 STRIKE PHASE ACTIVE — Please review your fellows.' : 'Strike history and active strikes for your fellows.'}</p>
    </header>\`;

    const myFellows = getFilteredFellows(user.name);
    
    if (phase.active) {
      const isApproved = AppState.strikeReviews[user.name] === 'approved';
      
      if (isApproved) {
        html += \`<div class="card" style="padding:40px;text-align:center;border-top:4px solid #10B981;">
          <div style="font-size:3rem;margin-bottom:10px;">✅</div>
          <h3>Reviews Submitted</h3>
          <p style="color:#94A3B8;">Thank you. Your strike reviews have been sent to the admins.</p>
        </div>\`;
        return html;
      }

      html += \`<div class="card" style="border: 2px solid #EF4444; background: rgba(239,68,68,0.1); padding:16px; margin-bottom:20px;">
        <h3 style="color:#EF4444;margin:0 0 10px 0;">Action Required: Review Auto-Strikes</h3>
        <p style="margin:0;font-size:0.9rem;">Review the suggested strikes below. Approve or reject each one, then submit your final review.</p>
      </div>\`;

      const evaluateResult = evaluateStrikes();
      const myAlerts = evaluateResult.filter(a => myFellows.some(f => f.id === a.fellowId));

      if (myAlerts.length === 0) {
        html += \`<div class="card" style="padding:30px;text-align:center;">
          <p>No auto-strikes detected for your fellows.</p>
          <button class="btn btn--primary" onclick="submitStrikeReview()">Confirm & Submit Empty Review</button>
        </div>\`;
      } else {
        html += \`<div style="display:flex;flex-direction:column;gap:16px;margin-bottom:20px;">\`;
        myAlerts.forEach(alert => {
          const f = myFellows.find(x => x.id === alert.fellowId);
          html += \`<div class="card" style="padding:16px;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
              <div>
                <h4 style="margin:0 0 4px 0;">\${escapeHTML(f.fellowName)} \${renderStrikeDots(f.id)}</h4>
                <div style="color:#94A3B8;font-size:0.85rem;margin-bottom:12px;">\${escapeHTML(f.collegeName)}</div>
                
                <div style="background:rgba(239,68,68,0.1);border-left:3px solid #EF4444;padding:8px 12px;margin-bottom:12px;">
                  <strong style="color:#EF4444;">Auto-detected:</strong> \${alert.reasons.join(', ')}
                </div>
              </div>
              <div style="display:flex;gap:8px;" id="strike-actions-\${f.id}">
                <button class="btn btn--primary" onclick="pocDecideStrike('\${f.id}', '\${alert.reasons.join(', ')}', 'approve')" style="background:#10B981;">✓ Approve</button>
                <button class="btn btn--ghost" onclick="pocDecideStrike('\${f.id}', '\${alert.reasons.join(', ')}', 'reject')">✗ Reject</button>
              </div>
            </div>
          </div>\`;
        });
        html += \`</div>
        <div style="text-align:right;">
          <button class="btn btn--primary" style="padding:12px 24px;font-size:1.1rem;" onclick="submitStrikeReview()">Submit All Reviews</button>
        </div>\`;
      }
    } else {
      // Phase is OFF - Show current active strikes and allow removal requests
      let activeStrikesCount = 0;
      let strikesListHtml = \`<div style="display:flex;flex-direction:column;gap:12px;">\`;
      
      myFellows.forEach(f => {
        const rec = AppState.strikeRecords.find(r => r.fellowId === f.id);
        if (rec) {
          const activeS = rec.strikes.filter(s => !s.removed);
          activeS.forEach(s => {
            activeStrikesCount++;
            const hasPendingRequest = AppState.removalRequests.some(r => r.strikeId === s.id && r.status === 'pending');
            
            strikesListHtml += \`<div class="card" style="padding:12px;display:flex;justify-content:space-between;align-items:center;border-left:3px solid #F59E0B;">
              <div>
                <h4 style="margin:0 0 4px 0;">\${escapeHTML(f.fellowName)} \${renderStrikeDots(f.id)}</h4>
                <div style="font-size:0.85rem;color:#94A3B8;">Reason: \${escapeHTML(s.reason)} (Phase: \${s.phase})</div>
              </div>
              <div>
                \${hasPendingRequest 
                  ? \`<span class="badge badge--warning">Removal Requested ⏳</span>\`
                  : \`<button class="btn btn--sm btn--ghost" onclick="requestStrikeRemoval('\${f.id}', '\${s.id}')">Request Removal</button>\`}
              </div>
            </div>\`;
          });
        }
      });
      strikesListHtml += \`</div>\`;

      if (activeStrikesCount === 0) {
        html += \`<div class="card" style="padding:40px;text-align:center;">
          <div style="font-size:2rem;margin-bottom:10px;">✨</div>
          <h3 style="color:#94A3B8;">No active strikes for your fellows.</h3>
        </div>\`;
      } else {
        html += strikesListHtml;
      }
    }
    return html;
  }

  // --- ADMIN VIEW ---
  const POCS = TEAM.filter(t => !t.isAdmin);
  let pocProgressHtml = \`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;">\`;
  let pendingCount = 0;
  
  POCS.forEach(p => {
    const isApp = AppState.strikeReviews[p.name] === 'approved';
    if (!isApp) pendingCount++;
    pocProgressHtml += \`<div style="padding:6px 12px;border-radius:20px;font-size:0.85rem;background:\${isApp ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)'};color:\${isApp ? '#10B981' : '#94A3B8'};border:1px solid \${isApp ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.2)'}">
      \${isApp ? '✓' : '⏳'} \${p.name}
    </div>\`;
  });
  pocProgressHtml += \`</div>\`;

  let html = \`<header class="page-header" style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <h1 class="page-title">⚡ Admin Strike Master</h1>
      <p class="page-subtitle">Manage strike phases, approve removals, and send emails.</p>
    </div>
    <div>
      \${phase.active 
        ? \`<button class="btn" style="background:#EF4444;color:white;padding:10px 20px;" onclick="toggleStrikePhase(false)">🛑 End Strike Phase</button>\` 
        : \`<button class="btn" style="background:#10B981;color:white;padding:10px 20px;" onclick="toggleStrikePhase(true)">🚀 Start New Strike Phase</button>\`}
    </div>
  </header>\`;

  // SECTION A: ACTIVE STRIKE PHASE (Giving Strikes)
  if (phase.active) {
    html += \`<div class="card" style="margin-bottom:30px;border: 2px solid #3B82F6;">
      <div class="card-header"><h2 class="card-title" style="color:#3B82F6;">Current Phase: \${phase.id}</h2></div>
      <div class="card-body" style="padding:20px;">
        <h3 style="margin:0 0 10px 0;font-size:0.9rem;text-transform:uppercase;color:#94A3B8;">POC Submission Status</h3>
        \${pocProgressHtml}\`;

    // Gather emails for POCs that HAVE submitted
    let pendingEmails = [];
    AppState.strikeRecords.forEach(rec => {
      const fellow = AppState.fellows.find(f => f.id === rec.fellowId);
      if (fellow && AppState.strikeReviews[fellow.pocAssigned] === 'approved') {
        rec.strikes.filter(s => s.phase === phase.id && !s.emailSent && !s.removed).forEach(s => {
          pendingEmails.push({ type: 'strike', fellow, strike: s });
        });
      }
    });

    if (pendingEmails.length > 0) {
      html += \`<h3 style="margin:20px 0 10px 0;font-size:0.9rem;text-transform:uppercase;color:#94A3B8;">Pending Emails (Grouped by Reason)</h3>\`;
      
      const emailsByReason = {};
      pendingEmails.forEach(item => {
        const r = item.strike.reason;
        if (!emailsByReason[r]) emailsByReason[r] = [];
        emailsByReason[r].push(item);
      });

      Object.entries(emailsByReason).forEach(([reason, items]) => {
        html += \`<h4 style="margin:16px 0 8px 0;color:#F1F5F9;border-bottom:1px solid rgba(148,163,184,0.1);padding-bottom:4px;">\${escapeHTML(reason)} (\${items.length} emails)</h4>
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">\`;
        
        items.forEach(item => {
          const body = generateStrikeEmailBody(item.fellow, item.strike.reason, STRIKE_REASONS_MAP[item.strike.reason] || item.strike.reason);
          html += \`<div class="card" style="padding:16px;background:rgba(15,23,42,0.5);">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
              <div>
                <strong>To:</strong> \${escapeHTML(item.fellow.fellowName)} (\${escapeHTML(item.fellow.emailId)}) <br>
                <strong>POC:</strong> \${escapeHTML(item.fellow.pocAssigned)}
              </div>
              <button class="btn btn--sm btn--primary" onclick="markStrikeEmailSent('\${item.fellow.id}', '\${item.strike.id}')">✓ Mark as Sent</button>
            </div>
            <textarea readonly style="width:100%;height:150px;background:#0F172A;color:#94A3B8;border:1px solid #1E293B;padding:12px;border-radius:6px;font-family:monospace;font-size:0.85rem;">\${escapeHTML(body)}</textarea>
          </div>\`;
        });
        html += \`</div>\`;
      });
    } else {
      if (pendingCount === 0) {
        html += \`<div style="padding:20px;background:rgba(16,185,129,0.1);color:#10B981;border-radius:8px;text-align:center;">All emails for this phase have been sent!</div>\`;
      } else {
        html += \`<div style="padding:20px;background:rgba(148,163,184,0.1);color:#94A3B8;border-radius:8px;text-align:center;">Waiting for more POCs to submit to generate their emails...</div>\`;
      }
    }
    
    html += \`</div></div>\`;
  }

  // SECTION B: STRIKE MANAGEMENT & REMOVALS
  html += \`<div class="card" style="margin-bottom:30px;">
    <div class="card-header"><h2 class="card-title">Strike Management & Removals</h2></div>
    <div class="card-body" style="padding:20px;">\`;

  // 1. Pending Removal Requests
  const pendingRequests = AppState.removalRequests.filter(r => r.status === 'pending');
  if (pendingRequests.length > 0) {
    html += \`<h3 style="color:#F59E0B;margin:0 0 10px 0;">Pending Removal Requests from POCs</h3>
    <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:30px;">\`;
    pendingRequests.forEach(req => {
      const f = AppState.fellows.find(x => x.id === req.fellowId);
      const rec = AppState.strikeRecords.find(r => r.fellowId === req.fellowId);
      const strike = rec ? rec.strikes.find(s => s.id === req.strikeId) : null;
      
      html += \`<div class="card" style="padding:12px;border-left:3px solid #F59E0B;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h4 style="margin:0 0 4px 0;">\${f ? escapeHTML(f.fellowName) : 'Unknown Fellow'} <span style="font-size:0.85rem;color:#94A3B8;font-weight:normal;">(Requested by \${escapeHTML(req.requestedBy)})</span></h4>
          <div style="font-size:0.85rem;color:#94A3B8;"><strong>Original Strike:</strong> \${strike ? escapeHTML(strike.reason) : 'Unknown'}</div>
          <div style="font-size:0.9rem;color:#F1F5F9;margin-top:4px;"><strong>POC Reason:</strong> "\${escapeHTML(req.reason)}"</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn--primary" onclick="adminApproveRemoval('\${req.id}')" style="background:#10B981;">✓ Approve</button>
          <button class="btn btn--ghost" onclick="adminRejectRemoval('\${req.id}')">✗ Reject</button>
        </div>
      </div>\`;
    });
    html += \`</div>\`;
  }

  // 2. All Active Strikes Master List
  html += \`<h3 style="margin:0 0 10px 0;color:#F1F5F9;">All Active Strikes Master List</h3>\`;
  
  let allActiveHtml = \`<table class="data-table">
    <thead>
      <tr>
        <th>Fellow</th>
        <th>POC</th>
        <th>Active Strikes</th>
        <th>Reasons</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>\`;
  
  let totalActiveStrikes = 0;
  AppState.strikeRecords.forEach(rec => {
    const activeStrikes = rec.strikes.filter(s => !s.removed);
    if (activeStrikes.length > 0) {
      const f = AppState.fellows.find(x => x.id === rec.fellowId);
      if (f) {
        totalActiveStrikes += activeStrikes.length;
        allActiveHtml += \`<tr>
          <td>\${escapeHTML(f.fellowName)} \${renderStrikeDots(f.id)}</td>
          <td>\${escapeHTML(f.pocAssigned)}</td>
          <td>\${activeStrikes.length}</td>
          <td>
            <ul style="margin:0;padding-left:16px;font-size:0.85rem;color:#94A3B8;">
              \${activeStrikes.map(s => \`<li>\${escapeHTML(s.reason)} (Phase \${s.phase})</li>\`).join('')}
            </ul>
          </td>
          <td>
            <div style="display:flex;flex-direction:column;gap:4px;">
              \${activeStrikes.map(s => \`
                <button class="btn btn--sm btn--ghost" onclick="adminDirectRemove('\${f.id}', '\${s.id}')" style="color:#EF4444;border-color:rgba(239,68,68,0.3);font-size:10px;">Remove: \${escapeHTML(s.reason).substring(0,10)}...</button>
              \`).join('')}
            </div>
          </td>
        </tr>\`;
      }
    }
  });
  allActiveHtml += \`</tbody></table>\`;

  if (totalActiveStrikes === 0) {
    html += \`<p style="color:#94A3B8;">There are zero active strikes in the system.</p>\`;
  } else {
    html += \`<div class="table-container">\${allActiveHtml}</div>\`;
  }

  html += \`</div></div>\`;
  
  return html;
}
`;

app = app.replace(/function renderStrikes\(\) {[\s\S]*?\n\}/m, newRenderStrikes);

fs.writeFileSync('app.js', app, 'utf8');
console.log('Strikes system updated completely.');
