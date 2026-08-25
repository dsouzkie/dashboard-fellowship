const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Update loadData to fetch team_users
const fetchTeamLogic = `
    const teamRes = await fetch(\`\${SUPABASE_URL}/rest/v1/team_users?select=*\`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': \`Bearer \${SUPABASE_KEY}\` }
    });
    if (teamRes.ok) {
      const dbTeam = await teamRes.json();
      if (dbTeam.length > 0) {
        // Overwrite the hardcoded TEAM array with fresh DB data
        TEAM.length = 0;
        dbTeam.forEach(t => TEAM.push({
          name: t.name,
          pwd: t.password,
          color: t.color,
          team: t.team
        }));
      }
    }
`;
const ldIdx = code.indexOf('const res = await fetch');
code = code.substring(0, ldIdx) + fetchTeamLogic + '\n    ' + code.substring(ldIdx);

// 2. Update Password Change Logic to save to Supabase
const targetPwd = `// Update locally for session
      me.pwd = newPwd;
      showToast('Password changed locally (Note: Hardcoded passwords in app.js will reset on refresh until moved to DB)', 'success');
      
      // We will implement DB sync in next step`;

const replacementPwd = `// Save to Supabase
      me.pwd = newPwd;
      fetch(\`\${SUPABASE_URL}/rest/v1/team_users?name=eq.\${me.name}\`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': \`Bearer \${SUPABASE_KEY}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPwd })
      }).then(res => {
        if (res.ok) showToast('Password changed successfully!', 'success');
        else showToast('Failed to change password in DB', 'error');
      });`;
code = code.replace(targetPwd, replacementPwd);

// 3. Add Admin Password view to Dashboard if currentUser is Admin
const dbIdx = code.indexOf('if (v === \'dashboard\') {');
const endDbIdx = code.indexOf('return `', dbIdx);

const adminHTML = `
      \${AppState.currentUser.name === 'Admin' ? \`
        <div class="card" style="margin-top: 24px;">
          <div class="card-header">
            <h2 class="card-title">🛡️ Admin: Team Passwords</h2>
          </div>
          <div class="card-body">
            <table class="data-table">
              <thead><tr><th>POC Name</th><th>Password</th><th>Team</th></tr></thead>
              <tbody>
                \${TEAM.map(t => \`
                  <tr>
                    <td><strong>\${t.name}</strong></td>
                    <td style="font-family: monospace; color: #F59E0B;">\${escapeHTML(t.pwd)}</td>
                    <td><span class="badge" style="background:\${t.color}22; color:\${t.color}">\${t.team}</span></td>
                  </tr>
                \`).join('')}
              </tbody>
            </table>
          </div>
        </div>
      \` : ''}
`;

const retIdx = code.indexOf('<div class="stats-grid">', endDbIdx);
code = code.substring(0, retIdx) + adminHTML + code.substring(retIdx);

fs.writeFileSync('app.js', code);
console.log('Admin password view and DB sync injected!');
