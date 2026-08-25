// Strike System Builder - injects full strike management system into app.js
const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// ================================================================
// PART 1: Add strike state + helpers to AppState (after fellowRequests: [])
// ================================================================
app = app.replace(
  `  fellowRequests: []\r\n};`,
  `  fellowRequests: [],
  strikePhase: null,      // { phaseId, active, startedBy, startedAt, pocApprovals:{}, emailsSent }
  strikeRecords: [],      // [{ fellowId, strikes:[{id,reason,phase,approvedBy,approvedAt,emailSent,removed,removedAt,removedBy}] }]
  strikeReviews: {}       // { [phaseId]: { [pocName]: { [fellowId]: { suggested:[reasons], decisions:{reason:bool}, removeIds:[] } } } }
};`
);

// ================================================================
// PART 2: Add save/load helpers after loadFellowRequests()
// ================================================================
app = app.replace(
  `function saveChangeLog()`,
  `function saveStrikePhase() { localStorage.setItem('under25_strike_phase', JSON.stringify(AppState.strikePhase)); }
function loadStrikePhase() { const s = localStorage.getItem('under25_strike_phase'); return s ? JSON.parse(s) : null; }
function saveStrikeRecords() { localStorage.setItem('under25_strike_records', JSON.stringify(AppState.strikeRecords)); }
function loadStrikeRecords() { const s = localStorage.getItem('under25_strike_records'); return s ? JSON.parse(s) : []; }
function saveStrikeReviews() { localStorage.setItem('under25_strike_reviews', JSON.stringify(AppState.strikeReviews)); }
function loadStrikeReviews() { const s = localStorage.getItem('under25_strike_reviews'); return s ? JSON.parse(s) : {}; }

function getActiveStrikeCount(fellowId) {
  const rec = AppState.strikeRecords.find(r => r.fellowId === fellowId);
  if (!rec) return 0;
  return rec.strikes.filter(s => !s.removed).length;
}

function getStrikeRecord(fellowId) {
  let rec = AppState.strikeRecords.find(r => r.fellowId === fellowId);
  if (!rec) { rec = { fellowId, strikes: [] }; AppState.strikeRecords.push(rec); }
  return rec;
}

function renderStrikeDots(fellowId) {
  const count = getActiveStrikeCount(fellowId);
  if (count === 0) return '';
  const colors = ['#F59E0B','#F97316','#EF4444'];
  return Array.from({length: Math.min(count,3)}, (_,i) =>
    \`<span title="\${i+1} strike" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:\${colors[i]||'#EF4444'};margin-left:2px;vertical-align:middle;"></span>\`
  ).join('');
}

function generateStrikeEmailBody(fellow, reason, strikeSentence) {
  const poc = TEAM.find(t => t.name === fellow.pocAssigned);
  const ordinals = ['first','second','third'];
  const count = getActiveStrikeCount(fellow.id);
  const ordinal = ordinals[Math.min(count,3)-1] || 'next';
  const template = {
    subject: \`Under25 Fellowship — Strike \${count} | \${escapeHTML(fellow.collegeName)}\`,
    body: \`Dear Fellow,

This is your \${ordinal} strike for \${reason}.

\${strikeSentence}

At this point, we need you to treat this as urgent.

If you have any questions or are facing issues, please reach out to your POC \${fellow.pocAssigned} or the Program Team immediately.

We genuinely want you in this journey with us — please take action right away.

Regards,
Team Under25\`
  };
  return template;
}

function generateRemovalEmailBody(fellow, reason) {
  return {
    subject: \`Under25 Fellowship — Strike Cleared | \${escapeHTML(fellow.collegeName)}\`,
    body: \`Dear Fellow,

We're writing to inform you that one of your strikes (\${reason}) has been reviewed and officially cleared from your record.

This reflects positively on your engagement with the Fellowship. Please continue to stay on track with your responsibilities.

If you have any questions, reach out to your POC \${fellow.pocAssigned}.

Regards,
Team Under25\`
  };
}

function saveChangeLog()`
);

// ================================================================
// PART 3: Load strike data in init() - after other loads
// ================================================================
app = app.replace(
  `AppState.fellowRequests = loadFellowRequests();`,
  `AppState.fellowRequests = loadFellowRequests();
  AppState.strikePhase = loadStrikePhase();
  AppState.strikeRecords = loadStrikeRecords();
  AppState.strikeReviews = loadStrikeReviews();`
);

// ================================================================
// PART 4: Inject strike dots into All Fellows table rows
// We look for the fellow name rendering in the table
// ================================================================
// (We'll handle this via renderStrikeDots in the table render)

// ================================================================
// PART 5: Replace renderStrikes() entirely
// ================================================================
const oldRenderStrikes = app.substring(
  app.indexOf('function renderStrikes()'),
  app.indexOf('function renderForms()')
);

const newRenderStrikes = `function renderStrikes() {
  const user = AppState.currentUser;
  const isAdmin = user && user.isAdmin;
  const phase = AppState.strikePhase;
  const POCS = TEAM.filter(t => !t.isAdmin);
  const fellows = AppState.fellows;
  const STRIKE_REASONS_MAP = {
    'Fellow Ghosted': 'not responding to communications and going silent (ghosting)',
    'Final Acceptance Form': 'not filling out the Under25 Fellowship Final Acceptance Form',
    'Club Page Launch': 'not launching their club page despite completing the acceptance form',
    'Page Inactive': 'having an inactive club page — no posts or engagement in the expected window',
    'No Reels Posted': 'not posting their first reel after the club page was launched'
  };

  // Get current phase review data
  const phaseId = phase ? phase.phaseId : null;
  const myReviews = (phaseId && AppState.strikeReviews[phaseId] && AppState.strikeReviews[phaseId][user.name]) || {};
  const pocSubmitted = phase && phase.pocApprovals && phase.pocApprovals[user.name] === 'approved';
  const allPOCsApproved = phase && POCS.every(p => phase.pocApprovals && phase.pocApprovals[p.name] === 'approved');
  const pendingPOCs = POCS.filter(p => !phase || !phase.pocApprovals || phase.pocApprovals[p.name] !== 'approved');

  // ---- ADMIN VIEW ----
  if (isAdmin) {
    // Collect all approved strike decisions + email data
    let approvedEmailRows = '';
    let removalEmailRows = '';
    if (phase && allPOCsApproved && !phase.emailsSent) {
      // Build email table from approved reviews
      const rows = [];
      POCS.forEach(poc => {
        const pocReviews = AppState.strikeReviews[phaseId] && AppState.strikeReviews[phaseId][poc.name] || {};
        Object.entries(pocReviews).forEach(([fid, rev]) => {
          const fellow = fellows.find(f => f.id === fid);
          if (!fellow) return;
          // Approved new strikes
          Object.entries(rev.decisions || {}).forEach(([reason, approved]) => {
            if (approved) {
              const count = getActiveStrikeCount(fid) + 1;
              const email = generateStrikeEmailBody(fellow, reason, STRIKE_REASONS_MAP[reason] || reason);
              rows.push({ type: 'strike', fellow, reason, count, email, poc: poc.name });
            }
          });
          // Approved removals
          (rev.removeIds || []).forEach(sid => {
            const rec = AppState.strikeRecords.find(r => r.fellowId === fid);
            const strike = rec && rec.strikes.find(s => s.id === sid);
            if (strike && !strike.removed) {
              const rem = generateRemovalEmailBody(fellow, strike.reason);
              rows.push({ type: 'removal', fellow, reason: strike.reason, strikeId: sid, email: rem, poc: poc.name });
            }
          });
        });
      });

      approvedEmailRows = rows.filter(r => r.type === 'strike').map((r, idx) =>
        \`<div style="border:1px solid rgba(239,68,68,0.3);border-radius:10px;padding:16px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div>
              <div style="font-size:14px;font-weight:700;color:#F1F5F9;">\${escapeHTML(r.fellow.fellowName)} — \${escapeHTML(r.fellow.collegeName)}</div>
              <div style="font-size:11px;color:#64748B;">Strike #\${r.count} · Reason: \${escapeHTML(r.reason)} · POC: \${r.poc}</div>
            </div>
            <div style="display:flex;gap:8px;">
              <button onclick="copyEmailToClipboard('strike_email_\${idx}')" class="btn btn--sm btn--ghost">📋 Copy Email</button>
              <button onclick="markEmailSent('strike','\${r.fellow.id}','\${escapeHTML(r.reason)}','\${phaseId}')" class="btn btn--sm btn--primary" \${phase.sentStrikes && phase.sentStrikes[r.fellow.id+r.reason] ? 'disabled style=\\"opacity:0.5\\"' : ''}>
                \${phase.sentStrikes && phase.sentStrikes[r.fellow.id+r.reason] ? '✓ Sent' : '✉️ Mark Sent'}
              </button>
            </div>
          </div>
          <div id="strike_email_\${idx}" style="background:rgba(15,23,42,0.5);border-radius:8px;padding:12px;font-family:monospace;font-size:12px;color:#94A3B8;white-space:pre-wrap;max-height:140px;overflow-y:auto;">\${escapeHTML('To: ' + (r.fellow.emailId||'[fellow email]') + '\\nSubject: ' + r.email.subject + '\\n\\n' + r.email.body)}</div>
        </div>\`
      ).join('');

      removalEmailRows = rows.filter(r => r.type === 'removal').map((r, idx) =>
        \`<div style="border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:16px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div>
              <div style="font-size:14px;font-weight:700;color:#F1F5F9;">\${escapeHTML(r.fellow.fellowName)} — \${escapeHTML(r.fellow.collegeName)}</div>
              <div style="font-size:11px;color:#64748B;">Strike Cleared · Reason: \${escapeHTML(r.reason)} · POC: \${r.poc}</div>
            </div>
            <div style="display:flex;gap:8px;">
              <button onclick="copyEmailToClipboard('removal_email_\${idx}')" class="btn btn--sm btn--ghost">📋 Copy Email</button>
              <button onclick="markEmailSent('removal','\${r.fellow.id}','\${r.strikeId}','\${phaseId}')" class="btn btn--sm btn--success" \${phase.sentRemovals && phase.sentRemovals[r.strikeId] ? 'disabled style=\\"opacity:0.5\\"' : ''}>
                \${phase.sentRemovals && phase.sentRemovals[r.strikeId] ? '✓ Sent' : '✉️ Mark Sent'}
              </button>
            </div>
          </div>
          <div id="removal_email_\${idx}" style="background:rgba(15,23,42,0.5);border-radius:8px;padding:12px;font-family:monospace;font-size:12px;color:#94A3B8;white-space:pre-wrap;max-height:140px;overflow-y:auto;">\${escapeHTML('To: ' + (r.fellow.emailId||'[fellow email]') + '\\nSubject: ' + r.email.subject + '\\n\\n' + r.email.body)}</div>
        </div>\`
      ).join('');
    }

    // All fellows strike summary table
    const allStrikeRows = fellows.filter(f => getActiveStrikeCount(f.id) > 0).map(f => {
      const count = getActiveStrikeCount(f.id);
      const rec = AppState.strikeRecords.find(r => r.fellowId === f.id);
      const active = rec ? rec.strikes.filter(s => !s.removed) : [];
      return \`<tr>
        <td>\${escapeHTML(f.fellowName)}\${renderStrikeDots(f.id)}</td>
        <td><div style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">\${escapeHTML(f.collegeName)}</div></td>
        <td>\${escapeHTML(f.pocAssigned)}</td>
        <td>\${active.map(s=>\`<span style="background:rgba(239,68,68,0.15);color:#EF4444;padding:2px 6px;border-radius:4px;font-size:11px;margin-right:3px;">\${escapeHTML(s.reason)}</span>\`).join('')}</td>
        <td style="font-weight:700;color:\${count>=3?'#EF4444':count===2?'#F97316':'#F59E0B'};">\${count}</td>
        <td>\${escapeHTML(active[0] ? new Date(active[active.length-1].approvedAt).toLocaleDateString() : '-')}</td>
      </tr>\`;
    }).join('');

    // POC notification status (which POCs have been notified of their fellows' strikes this phase)
    const pocNotifyStatus = phase && phase.pocNotified ? phase.pocNotified : {};

    return \`<div class="fade-in">
      <header class="page-header" style="margin-bottom:20px;">
        <div>
          <h1 class="page-title">⚡ Strike Center</h1>
          <p class="page-subtitle">Phase-based strike management · Admin view</p>
        </div>
      </header>

      <!-- Phase Control -->
      <div class="card" style="margin-bottom:20px;border:\${phase && phase.active ? '2px solid #EF4444' : '2px solid rgba(148,163,184,0.2)'};">
        <div class="card-body" style="padding:20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
            <div>
              <div style="font-size:1.1rem;font-weight:700;color:#F1F5F9;">
                \${phase && phase.active ? '🔴 Strike Phase Active' : '⚫ No Active Strike Phase'}
              </div>
              \${phase && phase.active ? \`<div style="font-size:12px;color:#94A3B8;margin-top:4px;">Started by \${phase.startedBy} on \${new Date(phase.startedAt).toLocaleString()}</div>\` : '<div style="font-size:12px;color:#64748B;margin-top:4px;">Start a phase to trigger POC reviews</div>'}
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">
              \${!(phase && phase.active) ? \`<button onclick="startStrikePhase()" class="btn btn--primary btn--sm" style="background:#EF4444;border-color:#EF4444;">🚀 Start Strike Phase</button>\` : ''}
              \${phase && phase.active && !phase.emailsSent ? \`<button onclick="endStrikePhase()" class="btn btn--ghost btn--sm">Stop Phase</button>\` : ''}
              \${phase && phase.active && allPOCsApproved && !phase.emailsSent ? \`<button onclick="markAllEmailsSent()" class="btn btn--success btn--sm">✅ Mark Phase Complete</button>\` : ''}
            </div>
          </div>

          \${phase && phase.active ? \`
          <!-- POC Approval Status -->
          <div style="margin-top:16px;border-top:1px solid rgba(148,163,184,0.1);padding-top:16px;">
            <div style="font-size:12px;color:#94A3B8;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;">POC Approval Status</div>
            <div style="display:flex;flex-wrap:wrap;gap:10px;">
              \${POCS.map(p => {
                const approved = phase.pocApprovals && phase.pocApprovals[p.name] === 'approved';
                return \`<div style="display:flex;align-items:center;gap:6px;padding:6px 12px;border-radius:8px;background:\${approved?'rgba(16,185,129,0.1)':'rgba(245,158,11,0.08)'};">
                  <div style="width:8px;height:8px;border-radius:50%;background:\${approved?'#10B981':'#F59E0B'};"></div>
                  <span style="font-size:12px;color:\${approved?'#10B981':'#F59E0B'};font-weight:600;">\${p.name}</span>
                  <span style="font-size:10px;color:#64748B;">\${approved?'Approved':'Pending'}</span>
                </div>\`;
              }).join('')}
            </div>
            \${allPOCsApproved ? '<div style="margin-top:12px;padding:10px;border-radius:8px;background:rgba(16,185,129,0.1);font-size:13px;color:#10B981;font-weight:600;">✅ All POCs have submitted — review emails below and send them manually, then mark as sent.</div>' : \`<div style="margin-top:12px;font-size:12px;color:#64748B;">Waiting for: \${pendingPOCs.map(p=>p.name).join(', ')}</div>\`}
          </div>\` : ''}
        </div>
      </div>

      \${approvedEmailRows || removalEmailRows ? \`
      <!-- Email Dashboard -->
      <div style="display:grid;grid-template-columns:\${removalEmailRows?'1fr 1fr':'1fr'};gap:16px;margin-bottom:20px;">
        \${approvedEmailRows ? \`<div class="card">
          <div class="card-header" style="background:rgba(239,68,68,0.05);">
            <h3 class="card-title" style="color:#EF4444;">📧 Strike Emails to Send</h3>
          </div>
          <div class="card-body" style="padding:16px;max-height:500px;overflow-y:auto;">\${approvedEmailRows}</div>
        </div>\` : ''}
        \${removalEmailRows ? \`<div class="card">
          <div class="card-header" style="background:rgba(16,185,129,0.05);">
            <h3 class="card-title" style="color:#10B981;">📧 Strike Cleared Emails</h3>
          </div>
          <div class="card-body" style="padding:16px;max-height:500px;overflow-y:auto;">\${removalEmailRows}</div>
        </div>\` : ''}
      </div>\` : ''}

      <!-- All Strikes Table -->
      <div class="card">
        <div class="card-header"><h3 class="card-title">All Fellows with Active Strikes</h3></div>
        <div class="table-container">
          <table class="data-table">
            <thead><tr><th>Fellow</th><th>College</th><th>POC</th><th>Reasons</th><th>Count</th><th>Last Strike</th></tr></thead>
            <tbody>\${allStrikeRows || '<tr><td colspan="6" style="text-align:center;color:#64748B;padding:20px;">No active strikes recorded</td></tr>'}</tbody>
          </table>
        </div>
      </div>
    </div>\`;
  }

  // ---- POC VIEW ----
  const myFellows = fellows.filter(f => f.pocAssigned === user.name);

  // Build auto-detected strikes for each fellow
  const autoStrikesByFellow = {};
  myFellows.forEach(f => {
    autoStrikesByFellow[f.id] = evaluateStrikes(f).map(s => s.reason);
  });

  const pocCards = myFellows.map(f => {
    const currentCount = getActiveStrikeCount(f.id);
    const rec = AppState.strikeRecords.find(r => r.fellowId === f.id);
    const activeStrikes = rec ? rec.strikes.filter(s => !s.removed) : [];
    const auto = autoStrikesByFellow[f.id] || [];
    const myReview = myReviews[f.id] || { decisions: {}, removeIds: [] };
    const hasAnything = auto.length > 0 || activeStrikes.length > 0;
    if (!hasAnything && currentCount === 0) return '';

    return \`<div class="card" style="margin-bottom:14px;border:\${currentCount>=2?'1px solid rgba(239,68,68,0.3)':currentCount===1?'1px solid rgba(245,158,11,0.3)':'1px solid rgba(148,163,184,0.1)'};">
      <div class="card-body" style="padding:16px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
          <div>
            <div style="font-size:14px;font-weight:700;color:#F1F5F9;">\${escapeHTML(f.fellowName)} \${renderStrikeDots(f.id)}</div>
            <div style="font-size:11px;color:#64748B;">\${escapeHTML(f.collegeName)} · \${escapeHTML(f.city || '')} · Status: \${escapeHTML(f.fellowStatus)}</div>
          </div>
          <div style="font-size:12px;color:\${currentCount>=2?'#EF4444':currentCount===1?'#F97316':'#64748B'};font-weight:700;">\${currentCount} active strike\${currentCount!==1?'s':''}</div>
        </div>

        \${auto.length > 0 && phase && phase.active && !pocSubmitted ? \`
        <div style="margin-bottom:12px;">
          <div style="font-size:11px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">⚡ Auto-Detected This Phase</div>
          \${auto.map(reason => {
            const dec = myReview.decisions ? myReview.decisions[reason] : undefined;
            return \`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(239,68,68,0.07);border-radius:8px;margin-bottom:6px;">
              <span style="font-size:12px;color:#F1F5F9;">\${escapeHTML(reason)}</span>
              <div style="display:flex;gap:6px;">
                <button onclick="setStrikeDecision('\${f.id}','\${reason}',true)" class="btn btn--sm" style="padding:3px 10px;font-size:11px;background:\${dec===true?'#10B981':'rgba(16,185,129,0.15)'};color:\${dec===true?'white':'#10B981'};border:1px solid #10B981;">✓ Approve</button>
                <button onclick="setStrikeDecision('\${f.id}','\${reason}',false)" class="btn btn--sm" style="padding:3px 10px;font-size:11px;background:\${dec===false?'#64748B':'rgba(100,116,139,0.15)'};color:\${dec===false?'white':'#94A3B8'};border:1px solid #475569;">✗ Reject</button>
              </div>
            </div>\`;
          }).join('')}
        </div>\` : (auto.length > 0 ? \`<div style="font-size:12px;color:#64748B;margin-bottom:10px;">\${auto.length} auto-strike(s) detected — review during an active phase.</div>\` : '')}

        \${activeStrikes.length > 0 && phase && phase.active && !pocSubmitted ? \`
        <div>
          <div style="font-size:11px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">📌 Remove Existing Strikes</div>
          \${activeStrikes.map(s => {
            const removing = myReview.removeIds && myReview.removeIds.includes(s.id);
            return \`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:rgba(15,23,42,0.4);border-radius:8px;margin-bottom:6px;">
              <span style="font-size:12px;color:#94A3B8;">\${escapeHTML(s.reason)} <span style="color:#475569;">(added \${new Date(s.approvedAt).toLocaleDateString()})</span></span>
              <button onclick="toggleStrikeRemoval('\${f.id}','\${s.id}')" class="btn btn--sm" style="padding:3px 10px;font-size:11px;background:\${removing?'rgba(16,185,129,0.2)':'rgba(148,163,184,0.1)'};color:\${removing?'#10B981':'#64748B'};border:1px solid \${removing?'#10B981':'#475569'};">
                \${removing ? '✓ Mark for Removal' : '🗑 Remove'}
              </button>
            </div>\`;
          }).join('')}
        </div>\` : ''}

        \${activeStrikes.length > 0 && !(phase && phase.active) ? \`
        <div style="font-size:11px;color:#64748B;border-top:1px solid rgba(148,163,184,0.1);padding-top:8px;margin-top:4px;">
          Active strikes: \${activeStrikes.map(s=>\`<span style="background:rgba(239,68,68,0.1);color:#EF4444;padding:2px 6px;border-radius:4px;font-size:10px;margin-right:3px;">\${escapeHTML(s.reason)}</span>\`).join('')}
        </div>\` : ''}
      </div>
    </div>\`;
  }).filter(Boolean).join('');

  return \`<div class="fade-in">
    <header class="page-header" style="margin-bottom:20px;">
      <div>
        <h1 class="page-title">⚡ My Strike Reviews</h1>
        <p class="page-subtitle">Review and approve strikes for your fellows</p>
      </div>
    </header>

    \${phase && phase.active && !pocSubmitted ? \`
    <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:12px;padding:16px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <div style="font-size:14px;font-weight:700;color:#EF4444;">🔴 Strike Phase Active</div>
        <div style="font-size:12px;color:#94A3B8;margin-top:2px;">Review all your fellows below and submit your approvals. You cannot change after submitting.</div>
      </div>
      <button onclick="submitPOCReview()" class="btn btn--primary btn--sm" style="background:#EF4444;border-color:#EF4444;white-space:nowrap;">Submit All Reviews</button>
    </div>\` : ''}

    \${phase && phase.active && pocSubmitted ? \`
    <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.3);border-radius:12px;padding:16px;margin-bottom:20px;">
      <div style="font-size:14px;font-weight:700;color:#10B981;">✅ Reviews Submitted</div>
      <div style="font-size:12px;color:#94A3B8;margin-top:2px;">Your approvals have been submitted. Waiting for admins to finalize and send emails.</div>
    </div>\` : ''}

    \${!phase || !phase.active ? \`
    <div style="background:rgba(148,163,184,0.05);border:1px solid rgba(148,163,184,0.15);border-radius:12px;padding:16px;margin-bottom:20px;">
      <div style="font-size:13px;color:#64748B;">No strike phase is currently active. Your fellow records are shown below. When admins start a phase, you'll see a prompt here to review and approve strikes.</div>
    </div>\` : ''}

    \${pocCards || '<div class="card"><div class="card-body" style="text-align:center;padding:30px;color:#64748B;">No strikes detected for any of your fellows right now. 🎉</div></div>'}
  </div>\`;
}

// ================================================================
// STRIKE SYSTEM ACTION HANDLERS
// ================================================================

function startStrikePhase() {
  if (AppState.strikePhase && AppState.strikePhase.active) return showToast('Phase already active', 'warning');
  const phaseId = 'phase_' + Date.now();
  AppState.strikePhase = {
    phaseId,
    active: true,
    startedBy: AppState.currentUser.name,
    startedAt: new Date().toISOString(),
    pocApprovals: {},
    emailsSent: false,
    sentStrikes: {},
    sentRemovals: {},
    pocNotified: {}
  };
  // Init reviews for this phase
  AppState.strikeReviews[phaseId] = {};
  saveStrikePhase();
  saveStrikeReviews();
  render();
  showToast('Strike phase started! POCs will now see review requests.', 'success');
}

function endStrikePhase() {
  if (!AppState.strikePhase) return;
  AppState.strikePhase.active = false;
  saveStrikePhase();
  render();
  showToast('Strike phase ended.', 'info');
}

function setStrikeDecision(fellowId, reason, approved) {
  const phase = AppState.strikePhase;
  if (!phase || !phase.active) return;
  const phaseId = phase.phaseId;
  const pocName = AppState.currentUser.name;
  if (!AppState.strikeReviews[phaseId]) AppState.strikeReviews[phaseId] = {};
  if (!AppState.strikeReviews[phaseId][pocName]) AppState.strikeReviews[phaseId][pocName] = {};
  if (!AppState.strikeReviews[phaseId][pocName][fellowId]) AppState.strikeReviews[phaseId][pocName][fellowId] = { decisions: {}, removeIds: [] };
  AppState.strikeReviews[phaseId][pocName][fellowId].decisions[reason] = approved;
  saveStrikeReviews();
  render();
}

function toggleStrikeRemoval(fellowId, strikeId) {
  const phase = AppState.strikePhase;
  if (!phase || !phase.active) return;
  const phaseId = phase.phaseId;
  const pocName = AppState.currentUser.name;
  if (!AppState.strikeReviews[phaseId]) AppState.strikeReviews[phaseId] = {};
  if (!AppState.strikeReviews[phaseId][pocName]) AppState.strikeReviews[phaseId][pocName] = {};
  if (!AppState.strikeReviews[phaseId][pocName][fellowId]) AppState.strikeReviews[phaseId][pocName][fellowId] = { decisions: {}, removeIds: [] };
  const removeIds = AppState.strikeReviews[phaseId][pocName][fellowId].removeIds;
  const idx = removeIds.indexOf(strikeId);
  if (idx >= 0) removeIds.splice(idx, 1); else removeIds.push(strikeId);
  saveStrikeReviews();
  render();
}

function submitPOCReview() {
  const phase = AppState.strikePhase;
  const pocName = AppState.currentUser.name;
  if (!phase || !phase.active) return showToast('No active phase', 'warning');
  const phaseId = phase.phaseId;
  const myFellows = AppState.fellows.filter(f => f.pocAssigned === pocName);
  const myReviews = AppState.strikeReviews[phaseId] && AppState.strikeReviews[phaseId][pocName] || {};
  // Check all auto-detected strikes have a decision
  for (const f of myFellows) {
    const auto = evaluateStrikes(f).map(s => s.reason);
    for (const reason of auto) {
      const dec = myReviews[f.id] && myReviews[f.id].decisions && myReviews[f.id].decisions[reason];
      if (dec === undefined) {
        return showToast(\`Please approve or reject "\${reason}" for \${f.fellowName} before submitting.\`, 'warning');
      }
    }
  }
  if (!AppState.strikePhase.pocApprovals) AppState.strikePhase.pocApprovals = {};
  AppState.strikePhase.pocApprovals[pocName] = 'approved';
  saveStrikePhase();
  render();
  showToast('Reviews submitted! ✅ Admins will now be notified.', 'success');
}

function markEmailSent(type, fellowId, reasonOrStrikeId, phaseId) {
  const phase = AppState.strikePhase;
  if (!phase) return;
  if (type === 'strike') {
    if (!phase.sentStrikes) phase.sentStrikes = {};
    phase.sentStrikes[fellowId + reasonOrStrikeId] = true;
    // Commit the strike to the fellow's record
    const POCS = TEAM.filter(t => !t.isAdmin);
    let reason = reasonOrStrikeId;
    POCS.forEach(poc => {
      const rev = AppState.strikeReviews[phaseId] && AppState.strikeReviews[phaseId][poc.name] && AppState.strikeReviews[phaseId][poc.name][fellowId];
      if (rev && rev.decisions && rev.decisions[reason] === true) {
        const rec = getStrikeRecord(fellowId);
        rec.strikes.push({
          id: 's_' + Date.now() + '_' + Math.random().toString(36).substr(2,5),
          reason,
          phase: phaseId,
          approvedBy: poc.name,
          approvedAt: new Date().toISOString(),
          emailSent: true,
          removed: false,
          removedAt: null,
          removedBy: null
        });
      }
    });
    saveStrikeRecords();
    // Notify POC
    const fellow = AppState.fellows.find(f => f.id === fellowId);
    if (fellow) {
      if (!phase.pocNotified) phase.pocNotified = {};
      if (!phase.pocNotified[fellow.pocAssigned]) phase.pocNotified[fellow.pocAssigned] = [];
      phase.pocNotified[fellow.pocAssigned].push({ fellowId, reason, type: 'struck' });
    }
  } else if (type === 'removal') {
    const strikeId = reasonOrStrikeId;
    if (!phase.sentRemovals) phase.sentRemovals = {};
    phase.sentRemovals[strikeId] = true;
    // Commit removal
    AppState.strikeRecords.forEach(rec => {
      const s = rec.strikes.find(st => st.id === strikeId);
      if (s) {
        s.removed = true;
        s.removedAt = new Date().toISOString();
        s.removedBy = AppState.currentUser.name;
      }
    });
    saveStrikeRecords();
    const fellow = AppState.fellows.find(f => {
      const rec = AppState.strikeRecords.find(r => r.fellowId === f.id);
      return rec && rec.strikes.some(s => s.id === strikeId);
    });
    if (fellow) {
      if (!phase.pocNotified) phase.pocNotified = {};
      if (!phase.pocNotified[fellow.pocAssigned]) phase.pocNotified[fellow.pocAssigned] = [];
      phase.pocNotified[fellow.pocAssigned].push({ fellowId: fellow.id, type: 'cleared', strikeId });
    }
  }
  saveStrikePhase();
  runAutoStrikes();
  render();
  showToast('Marked as sent ✅', 'success');
}

function markAllEmailsSent() {
  if (!AppState.strikePhase) return;
  AppState.strikePhase.emailsSent = true;
  AppState.strikePhase.active = false;
  saveStrikePhase();
  runAutoStrikes();
  render();
  showToast('Phase complete! All strike emails marked as sent.', 'success');
}

function copyEmailToClipboard(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => showToast('Email copied to clipboard! 📋', 'success'));
}

`;

app = app.replace(oldRenderStrikes, newRenderStrikes);

fs.writeFileSync('app.js', app, 'utf8');
console.log('Strike system injected. Length:', app.length);
