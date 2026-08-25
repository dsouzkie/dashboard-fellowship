const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const regex = /<span class="badge" style="background:\$\{TEAM_COLORS\[fellow\.team\]\?\.primary \|\| '#666'\};color:#000;font-size:12px;vertical-align:middle;margin-left:10px;">\$\{fellow\.team\}<\/span>/;
const replacement = `<span class="badge" style="background:\${TEAM_COLORS[fellow.team]?.primary || '#666'};color:#000;font-size:12px;vertical-align:middle;margin-left:10px;">\${fellow.team}</span> \${fellow.intakeStatus ? \`<span class="intake-badge--\${fellow.intakeStatus === 'August Intake' ? 'august' : 'existing'}" style="margin-left:6px; font-size:12px; vertical-align:middle;">\${fellow.intakeStatus}</span>\` : ""}`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('app.js', code);
}
