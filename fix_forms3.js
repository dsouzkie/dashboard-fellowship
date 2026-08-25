const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

if (!code.includes('formFilter:')) {
  code = code.replace(/AppState = \{/, "AppState = {\n  formFilter: 'all',");
}

const startRenderForms = code.indexOf('function renderForms() {');
const endRenderForms = code.indexOf('function renderInstagram()', startRenderForms);
if (startRenderForms === -1 || endRenderForms === -1) {
  console.log('Could not find function bounds');
  process.exit(1);
}

const newRenderForms = `function renderForms() {
  let formsHtml = \`<div class="page-header">
    <div>
      <h2 class="page-title">Form Tracker</h2>
      <div class="page-subtitle">Track Final Acceptance form submissions</div>
    </div>
  </div>\`;
  
  let actionRequiredHtml = '';
  const actionableFellows = [];

  if (AppState.acceptances.length > 0) {
    AppState.fellows.forEach(fellow => {
      if (fellow.finalAcceptance !== 'Yes') {
        const fellowName = (fellow.fellowName || '').toLowerCase().trim();
        const fellowEmail = (fellow.emailId || '').toLowerCase().trim();
        
        if (!fellowName && !fellowEmail) return;

        const match = AppState.acceptances.find(a => {
          const fafName = a.fullName.toLowerCase().trim();
          const fafEmail = a.email.toLowerCase().trim();
          
          return (fafEmail && fafEmail === fellowEmail) || 
                 (fafName && fellowName && (fafName.includes(fellowName) || fellowName.includes(fafName)));
        });

        if (match && (AppState.currentUser.isAdmin || AppState.currentUser.name === fellow.pocAssigned)) {
          actionableFellows.push({ fellow, match });
        }
      }
    });
  }

  if (actionableFellows.length > 0) {
    actionRequiredHtml += \`
      <div class="card mb-24" style="border: 1px solid #10B981; background: linear-gradient(135deg, rgba(16,185,129,0.05), transparent);">
        <div class="card-header" style="border-bottom-color: rgba(16,185,129,0.2);">
          <h3 class="card-title" style="color: #10B981;">⚠️ Action Required: New Acceptances</h3>
        </div>
        <div class="card-body" style="max-height: 300px; overflow-y: auto;">
          <div class="tracker-list">
            \${actionableFellows.map(({fellow, match}) => \`
              <div class="tracker-item" style="border-left-color: #10B981; background: rgba(30,41,59,0.8);">
                <div style="flex: 1;">
                  <div class="tracker-item__name">\${escapeHTML(fellow.fellowName)} <span style="font-size:12px; font-weight:normal; color:#94A3B8;">(\${escapeHTML(fellow.collegeName)})</span></div>
                  <div class="tracker-item__meta">
                    Form Submitted By: <strong style="color:#F1F5F9">\${escapeHTML(match.fullName)}</strong> (\${escapeHTML(match.email)})
                  </div>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                  <div class="tracker-item__status">Currently: \${renderBadge(fellow.finalAcceptance)}</div>
                  <button class="btn btn--sm btn--primary btn-approve-faf" data-id="\${fellow.id}">✅ Approve Sync</button>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      </div>
    \`;
  }

  formsHtml += actionRequiredHtml;
  
  let filled = 0;
  let pending = 0;
  
  let listHtml = '';
  
  const filtered = getFilteredFellows();
  
  filtered.forEach(f => {
    let statusClass = 'tracker-item--pending';
    let isFilled = f.finalAcceptance === 'Yes';
    
    if (isFilled) {
      statusClass = 'tracker-item--filled';
      filled++;
    } else {
      pending++;
    }
    
    // Check if we should display this item based on the active filter
    if (AppState.formFilter === 'filled' && !isFilled) return;
    if (AppState.formFilter === 'pending' && isFilled) return;
    
    listHtml += \`
      <div class="tracker-item \${statusClass}">
        <div>
          <div class="tracker-item__name">\${escapeHTML(f.fellowName)}</div>
          <div class="tracker-item__meta">\${escapeHTML(f.collegeName)} &bull; \${escapeHTML(f.pocAssigned)}</div>
        </div>
        <div class="tracker-item__status">
          \${renderBadge(f.finalAcceptance)}
        </div>
      </div>
    \`;
  });
  
  const filledOpacity = AppState.formFilter === 'filled' ? '1' : '0.6';
  const pendingOpacity = AppState.formFilter === 'pending' ? '1' : '0.6';
  const allOpacity = AppState.formFilter === 'all' ? '1' : '0.6';
  
  formsHtml += \`
    <div class="stats-grid mb-24" style="grid-template-columns: 1fr 1fr 1fr;">
      <div class="stat-card stat-card--success" style="cursor:pointer; opacity:\${filledOpacity}; transition: 0.2s;" onclick="setFormFilter('filled')">
        <div class="stat-card__icon">✅</div>
        <div class="stat-card__value">\${filled}</div>
        <div class="stat-card__label">Forms Filled</div>
      </div>
      <div class="stat-card stat-card--warning" style="cursor:pointer; opacity:\${pendingOpacity}; transition: 0.2s;" onclick="setFormFilter('pending')">
        <div class="stat-card__icon">⏳</div>
        <div class="stat-card__value">\${pending}</div>
        <div class="stat-card__label">Pending Forms</div>
      </div>
      <div class="stat-card stat-card--info" style="cursor:pointer; opacity:\${allOpacity}; transition: 0.2s;" onclick="setFormFilter('all')">
        <div class="stat-card__icon">📋</div>
        <div class="stat-card__value">\${filled + pending}</div>
        <div class="stat-card__label">All Forms</div>
      </div>
    </div>
    
    <div class="card">
      <div class="card-header"><h3 class="card-title">\${AppState.formFilter === 'all' ? 'All' : (AppState.formFilter === 'filled' ? 'Filled' : 'Pending')} Form Status</h3></div>
      <div class="card-body" style="max-height: 600px; overflow-y: auto;">
        <div class="tracker-list">
          \${listHtml}
        </div>
      </div>
    </div>
  \`;
  
  return formsHtml;
}
`;

code = code.substring(0, startRenderForms) + newRenderForms + code.substring(endRenderForms);

if (!code.includes('setFormFilter = function')) {
  const setFormFilterLogic = `
window.setFormFilter = function(filter) {
  AppState.formFilter = filter;
  render();
};
`;
  const renderDefIdx = code.indexOf('function render() {');
  code = code.substring(0, renderDefIdx) + setFormFilterLogic + '\n' + code.substring(renderDefIdx);
}

fs.writeFileSync('app.js', code);
console.log('Replaced renderForms completely!');
