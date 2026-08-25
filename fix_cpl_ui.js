const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Fix Edit Modal
app = app.replace(
  "if (k === 'fellowStatus' || k === 'clubPageActivity' || k === 'finalAcceptance' || k === 'clubMade') {",
  "if (k === 'fellowStatus' || k === 'clubPageActivity' || k === 'finalAcceptance' || k === 'clubPageLaunched' || k === 'clubMade') {"
);

// 2. Fix filter logic in getFilteredFellows
app = app.replace(
  "  if (AppState.filterActivity !== 'all') {\r\n    filtered = filtered.filter(f => f.clubPageActivity === AppState.filterActivity);\r\n  }",
  "  if (AppState.filterActivity !== 'all') {\n    filtered = filtered.filter(f => f.clubPageActivity === AppState.filterActivity);\n  }\n  if (AppState.filterLaunched && AppState.filterLaunched !== 'all') {\n    filtered = filtered.filter(f => f.clubPageLaunched === AppState.filterLaunched);\n  }"
);
app = app.replace(
  "  if (AppState.filterActivity !== 'all') {\n    filtered = filtered.filter(f => f.clubPageActivity === AppState.filterActivity);\n  }",
  "  if (AppState.filterActivity !== 'all') {\n    filtered = filtered.filter(f => f.clubPageActivity === AppState.filterActivity);\n  }\n  if (AppState.filterLaunched && AppState.filterLaunched !== 'all') {\n    filtered = filtered.filter(f => f.clubPageLaunched === AppState.filterLaunched);\n  }"
);

// 3. Fix Table headers in renderAllFellows
app = app.replace(
  "<th data-sort=\"finalAcceptance\">Form ${AppState.sortField === 'finalAcceptance' ? (AppState.sortDirection === 'asc' ? '+`' : '+\"') : ''}</th>",
  "<th data-sort=\"finalAcceptance\">Form ${AppState.sortField === 'finalAcceptance' ? (AppState.sortDirection === 'asc' ? '+`' : '+\"') : ''}</th>\n              <th data-sort=\"clubPageLaunched\">Launched ${AppState.sortField === 'clubPageLaunched' ? (AppState.sortDirection === 'asc' ? '+`' : '+\"') : ''}</th>"
);
app = app.replace(
  "<td class=\"${editableClass}\" data-id=\"${f.id}\" data-field=\"finalAcceptance\">${renderBadge(f.finalAcceptance)}</td>",
  "<td class=\"${editableClass}\" data-id=\"${f.id}\" data-field=\"finalAcceptance\">${renderBadge(f.finalAcceptance)}</td>\n          <td class=\"${editableClass}\" data-id=\"${f.id}\" data-field=\"clubPageLaunched\">${renderBadge(f.clubPageLaunched)}</td>"
);

// 4. Fix table headers in POC view
app = app.replace(
  "              <th data-sort=\"finalAcceptance\">Form ${AppState.sortField === 'finalAcceptance' ? (AppState.sortDirection === 'asc' ? ' ' : ' ') : ''}</th>\n              \n              <th>Strikes</th>",
  "              <th data-sort=\"finalAcceptance\">Form ${AppState.sortField === 'finalAcceptance' ? (AppState.sortDirection === 'asc' ? ' ' : ' ') : ''}</th>\n              <th data-sort=\"clubPageLaunched\">Launched ${AppState.sortField === 'clubPageLaunched' ? (AppState.sortDirection === 'asc' ? ' ' : ' ') : ''}</th>\n              <th>Strikes</th>"
);


fs.writeFileSync('app.js', app);
