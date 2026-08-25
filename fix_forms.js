const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Add form filter state
if (!code.includes('formFilter:')) {
  code = code.replace(/AppState = \{/, "AppState = {\n  formFilter: 'all',");
}

// 2. Modify renderForms to support filtering
const oldRenderForms = \`
  filtered.forEach(f => {
    let statusClass = 'tracker-item--pending';
    if (f.finalAcceptance === 'Yes') {
      statusClass = 'tracker-item--filled';
      filled++;
    } else {
      pending++;
    }
    
    listHtml += \\\`
      <div class="tracker-item \${statusClass}">
        <div>
          <div class="tracker-item__name">\${escapeHTML(f.fellowName)}</div>
          <div class="tracker-item__meta">\${escapeHTML(f.collegeName)} &bull; \${escapeHTML(f.pocAssigned)}</div>
        </div>
        <div class="tracker-item__status">
          \${renderBadge(f.finalAcceptance)}
        </div>
      </div>
    \\\`;
  });
  
  formsHtml += \\\`
    <div class="stats-grid mb-24" style="grid-template-columns: 1fr 1fr">
      \${renderStatCard('✅', filled, 'Forms Filled', 'success')}
      \${renderStatCard('⏳', pending, 'Pending Forms', 'warning')}
    </div>
    
    <div class="card">
      <div class="card-header"><h3 class="card-title">All Form Status</h3></div>
      <div class="card-body">
        <div class="tracker-list">
          \${listHtml}
        </div>
      </div>
    </div>
  \\\`;
\`;

const newRenderForms = \`
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
    
    listHtml += \\\`
      <div class="tracker-item \${statusClass}">
        <div>
          <div class="tracker-item__name">\${escapeHTML(f.fellowName)}</div>
          <div class="tracker-item__meta">\${escapeHTML(f.collegeName)} &bull; \${escapeHTML(f.pocAssigned)}</div>
        </div>
        <div class="tracker-item__status">
          \${renderBadge(f.finalAcceptance)}
        </div>
      </div>
    \\\`;
  });
  
  const filledOpacity = AppState.formFilter === 'filled' ? '1' : '0.6';
  const pendingOpacity = AppState.formFilter === 'pending' ? '1' : '0.6';
  const allOpacity = AppState.formFilter === 'all' ? '1' : '0.6';
  
  formsHtml += \\\`
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
  \\\`;
\`;

code = code.replace(oldRenderForms, newRenderForms);

// 3. Add setFormFilter function
const setFormFilterLogic = \`
window.setFormFilter = function(filter) {
  AppState.formFilter = filter;
  render();
};
\`;

// Inject this right before the final render() function definition
const renderDefIdx = code.indexOf('function render() {');
code = code.substring(0, renderDefIdx) + setFormFilterLogic + '\\n' + code.substring(renderDefIdx);

// Also fix scrolling in New Acceptances
const oldNewAcceptancesBody = \`<div class="card-body">
          <div class="tracker-list">\`;
const newNewAcceptancesBody = \`<div class="card-body" style="max-height: 300px; overflow-y: auto;">
          <div class="tracker-list">\`;
code = code.replace(oldNewAcceptancesBody, newNewAcceptancesBody);

fs.writeFileSync('app.js', code);
console.log('Forms tracker patched with filters and scrolling!');
