const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Update renderMyFellows
app = app.replace(
  `const autoStrikes = (f._autoStrikes || []).map(s => \`<span class="strike-dot strike-dot--\${s.severity}" title="\${s.reason}"></span>\`).join('');
      const manual1 = f.strike1 && f.strike1 !== 'N/A' && f.strike1 !== '' ? \`<span class="strike-dot strike-dot--danger" title="\${f.strike1}"></span>\` : '';
      const manual2 = f.strike2 && f.strike2 !== 'N/A' && f.strike2 !== '' ? \`<span class="strike-dot strike-dot--danger" title="\${f.strike2}"></span>\` : '';`,
  `// strikes now handled by renderStrikeDots`
);

app = app.replace(
  `<td><a href="#" class="fellow-name-link" data-id="\${f.id}" style="color:#A78BFA; text-decoration:none; font-weight:600; cursor:pointer;">\${escapeHTML(f.fellowName)}</a></td>`,
  `<td><a href="#" class="fellow-name-link" data-id="\${f.id}" style="color:#A78BFA; text-decoration:none; font-weight:600; cursor:pointer;">\${escapeHTML(f.fellowName)} \${renderStrikeDots(f.id)}</a></td>`
);

app = app.replace(
  `<td class="strike-cell">\${autoStrikes}\${manual1}\${manual2}</td>`,
  ``
);

app = app.replace(
  `<h3 style="margin: 0 0 5px 0; font-size: 16px; color: #F1F5F9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${escapeHTML(displayName)}</h3>`,
  `<h3 style="margin: 0 0 5px 0; font-size: 16px; color: #F1F5F9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${escapeHTML(displayName)} \${renderStrikeDots(f.id)}</h3>`
);

app = app.replace(
  `<th data-sort="clubPageLaunched">Launched \${AppState.sortField === 'clubPageLaunched' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th>Strikes</th>
              <th>Actions</th>`,
  `<th data-sort="clubPageLaunched">Launched \${AppState.sortField === 'clubPageLaunched' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th>Actions</th>`
);

// 2. Update renderAllFellows
app = app.replace(
  `const autoStrikes = (f._autoStrikes || []).map(s => \`<span class="strike-dot strike-dot--\${s.severity}" title="\${s.reason}"></span>\`).join('');
      const manual1 = f.strike1 && f.strike1 !== 'N/A' && f.strike1 !== '' ? \`<span class="strike-dot strike-dot--danger" title="\${f.strike1}"></span>\` : '';
      const manual2 = f.strike2 && f.strike2 !== 'N/A' && f.strike2 !== '' ? \`<span class="strike-dot strike-dot--danger" title="\${f.strike2}"></span>\` : '';`,
  `// strikes now handled by renderStrikeDots`
);

app = app.replace(
  `<td><a href="#" class="fellow-name-link" data-id="\${f.id}" style="color:#A78BFA; text-decoration:none; font-weight:600; cursor:pointer;">\${escapeHTML(f.fellowName)}</a></td>`,
  `<td><a href="#" class="fellow-name-link" data-id="\${f.id}" style="color:#A78BFA; text-decoration:none; font-weight:600; cursor:pointer;">\${escapeHTML(f.fellowName)} \${renderStrikeDots(f.id)}</a></td>`
);

app = app.replace(
  `<td class="strike-cell">\${autoStrikes}\${manual1}\${manual2}</td>`,
  ``
);

app = app.replace(
  `<h3 style="margin: 0 0 5px 0; font-size: 16px; color: #F1F5F9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${escapeHTML(displayName)}</h3>`,
  `<h3 style="margin: 0 0 5px 0; font-size: 16px; color: #F1F5F9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${escapeHTML(displayName)} \${renderStrikeDots(f.id)}</h3>`
);

app = app.replace(
  `<th data-sort="clubPageLaunched">Launched \${AppState.sortField === 'clubPageLaunched' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th>Strikes</th>
              <th>Actions</th>`,
  `<th data-sort="clubPageLaunched">Launched \${AppState.sortField === 'clubPageLaunched' ? (AppState.sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th>Actions</th>`
);

// 3. Add 3-strike alert to renderDashboard
const alertHTML = `
      <!-- 3-Strike Alert -->
      \${fellows.filter(f => getActiveStrikeCount(f.id) >= 3).length > 0 ? \`
        <div class="card" style="border: 2px solid #EF4444; margin-bottom: 20px; background: rgba(239, 68, 68, 0.1);">
          <div class="card-body" style="padding: 16px;">
            <div style="display: flex; gap: 12px; align-items: flex-start;">
              <div style="font-size: 1.5rem;">🚨</div>
              <div>
                <h3 style="color: #EF4444; margin: 0 0 8px 0; font-size: 1.1rem;">Fellows with 3+ Strikes (Action Required)</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  \${fellows.filter(f => getActiveStrikeCount(f.id) >= 3).map(f => \`
                    <button onclick="renderFellowProfile('\${f.id}')" class="btn btn--sm" style="background: rgba(239, 68, 68, 0.2); color: #EF4444; border: 1px solid #EF4444;">
                      \${escapeHTML(f.fellowName)}
                    </button>
                  \`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      \` : ''}
`;

app = app.replace(
  `<div class="fade-in" style="padding-bottom:40px;">
      <header class="page-header" style="margin-bottom:20px;">`,
  `<div class="fade-in" style="padding-bottom:40px;">
      <header class="page-header" style="margin-bottom:20px;">`
); // Let's find a better hook

app = app.replace(
  `<div class="fade-in" style="padding-bottom:40px;">`,
  `<div class="fade-in" style="padding-bottom:40px;">` + alertHTML
);

fs.writeFileSync('app.js', app, 'utf8');
console.log('Tables and dashboard updated.');
