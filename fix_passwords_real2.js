const fs = require('fs');

const SUPABASE_URL = 'https://ylqerlvtelexijthiuuu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YMPDWgP7LCipfPp-wId45Q_ngK5Slp0';

const TEAM = [
  { name: 'Christy', color: '#EAB308', password: 'under25christy', isAdmin: true, team: 'Sapphire' },
  { name: 'Arjun', color: '#7C3AED', password: 'under25arjun', team: 'Jade' },
  { name: 'Harsh', color: '#EAB308', password: 'under25harsh', team: 'Sapphire' },
  { name: 'Kasis', color: '#F97316', password: 'under25kasis', team: 'Amber' },
  { name: 'Surya', color: '#F97316', password: 'under25surya', team: 'Amber' },
  { name: 'Urvi', color: '#10B981', password: 'under25urvi', team: 'Emerald' },
  { name: 'Vansh', color: '#EAB308', password: 'under25vansh', team: 'Sapphire' },
  { name: 'Kabir', color: '#10B981', password: 'under25kabir', isAdmin: true, team: 'Emerald' },
  { name: 'Ibadat', color: '#A3A3A3', password: 'under25ibadat', isAdmin: true, team: 'Gray' }
];

async function fixDB() {
  console.log('Clearing old users...');
  await fetch(SUPABASE_URL + '/rest/v1/team_users?name=not.is.null', {
    method: 'DELETE',
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
  });
  
  console.log('Inserting correct users...');
  const payload = TEAM.map(t => ({
    name: t.name,
    password: t.password,
    color: t.color,
    team: t.team || 'Unknown'
  }));
  
  const res = await fetch(SUPABASE_URL + '/rest/v1/team_users', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (res.ok) console.log('DB fixed!');
  else console.log('DB error', await res.text());
  
  // Now patch app.js
  let code = fs.readFileSync('app.js', 'utf8');
  
  code = code.replace(/pwd: t\.password,/g, 'password: t.password,');
  code = code.replace(/me\.pwd/g, 'me.password');
  code = code.replace(/t\.pwd/g, 't.password');
  
  const newLoginRender = `async function renderLogin() {
  try {
    const teamRes = await fetch('${SUPABASE_URL}/rest/v1/team_users?select=*', {
      headers: { 'apikey': '${SUPABASE_KEY}', 'Authorization': 'Bearer ${SUPABASE_KEY}' }
    });
    if (teamRes.ok) {
      const dbTeam = await teamRes.json();
      if (dbTeam.length > 0) {
        TEAM.length = 0;
        dbTeam.forEach(t => TEAM.push({
          name: t.name,
          password: t.password,
          color: t.color,
          team: t.team,
          isAdmin: ['Christy', 'Kabir', 'Ibadat'].includes(t.name)
        }));
      }
    }
  } catch(e) { console.error('Failed to load team', e); }
  `;
  
  if(code.includes('function renderLogin() {')) {
    code = code.replace('function renderLogin() {', newLoginRender);
  }
  
  // Remove the old fetch team logic in loadData
  const oldFetchTeam = `const teamRes = await fetch(\`\${SUPABASE_URL}/rest/v1/team_users?select=*\`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': \`Bearer \${SUPABASE_KEY}\` }
    });
    if (teamRes.ok) {
      const dbTeam = await teamRes.json();
      if (dbTeam.length > 0) {
        // Overwrite the hardcoded TEAM array with fresh DB data
        TEAM.length = 0;
        dbTeam.forEach(t => TEAM.push({
          name: t.name,
          password: t.password,
          color: t.color,
          team: t.team
        }));
      }
    }`;
  code = code.replace(oldFetchTeam, '');
  
  fs.writeFileSync('app.js', code);
  console.log('App.js patched!');
}

fixDB();
