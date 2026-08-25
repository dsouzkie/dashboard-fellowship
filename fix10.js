const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Add intake badge to list view (after fellowName)
// <td><a href="#" class="fellow-name-link"...>${escapeHTML(f.fellowName)} ${renderStrikeDots(f.id)}</a></td>
code = code.replace(/<td><a href="#" class="fellow-name-link"([^>]+)>\$\{escapeHTML\(f\.fellowName\)\} \$\{renderStrikeDots\(f\.id\)\}<\/a><\/td>/g, '<td><a href="#" class="fellow-name-link"$1>${escapeHTML(f.fellowName)} ${renderStrikeDots(f.id)}</a> ${f.intakeStatus ? `<span class="intake-badge--${f.intakeStatus === \'August Intake\' ? \'august\' : \'existing\'}" style="margin-left:8px">${f.intakeStatus === \'August Intake\' ? \'Aug Intake\' : \'Existing\'}</span>` : ""}</td>');

// 2. Add team ring border to the Grid Card avatar image!
// <img src="${photoUrl}" referrerpolicy="no-referrer" style="width: 100%; height: 160px; object-fit: cover; border-bottom: 1px solid rgba(148,163,184,0.1);"
code = code.replace(/border-bottom: 1px solid rgba\(148,163,184,0\.1\);/g, 'border-bottom: 3px solid ${TEAM_COLORS[f.team]?.primary || \'rgba(148,163,184,0.1)\'};');

// 3. Add intake badge to grid view (below fellowName)
// <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #F1F5F9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(displayName)} ${renderStrikeDots(f.id)}</h3>
code = code.replace(/<h3 style="margin: 0 0 5px 0; font-size: 16px; color: #F1F5F9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\$\{escapeHTML\(displayName\)\} \$\{renderStrikeDots\(f\.id\)\}<\/h3>/g, '<h3 style="margin: 0 0 5px 0; font-size: 16px; color: #F1F5F9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(displayName)} ${renderStrikeDots(f.id)} ${f.intakeStatus ? `<span class="intake-badge--${f.intakeStatus === \'August Intake\' ? \'august\' : \'existing\'}" style="margin-left:6px; font-size:10px">${f.intakeStatus === \'August Intake\' ? \'Aug\' : \'Existing\'}</span>` : ""}</h3>');

fs.writeFileSync('app.js', code);
