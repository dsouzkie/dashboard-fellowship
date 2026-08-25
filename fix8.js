const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Fix renderLogin
code = code.replace(/\$\{renderAvatar\(t\.name, t\.color, 'lg'\)\}/g, "${renderAvatar(t.name, t.color, 'lg', t.team)}");

// 2. Fix login password section avatar
code = code.replace(/renderAvatar\(teamMember\.name, teamMember\.color, 'sm'\)/g, "renderAvatar(teamMember.name, teamMember.color, 'sm', teamMember.team)");

// 3. Fix other avatar calls involving 'poc'
code = code.replace(/\$\{renderAvatar\(poc\.name, poc\.color, 'sm'\)\}/g, "${renderAvatar(poc.name, poc.color, 'sm', poc.team)}");

// 4. Add Team badge in Fellow Profile
// Let's find where the fellow name is rendered in the profile modal
const fellowNamePattern = /<h2 style="margin: 0; font-size: 24px;">\$\{fellow\.fellowName\}<\/h2>/;
const teamBadgeHTML = '<h2 style="margin: 0; font-size: 24px;">${fellow.fellowName} ' + 
  '${fellow.team ? `<span class="badge" style="background:${TEAM_COLORS[fellow.team]?.primary || \'#666\'};color:#000;font-size:12px;vertical-align:middle;margin-left:10px;">${fellow.team}</span>` : ""}</h2>';
code = code.replace(fellowNamePattern, teamBadgeHTML);

fs.writeFileSync('app.js', code);
