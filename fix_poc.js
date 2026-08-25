const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// I need to inject `const poc = TEAM.find(t => t.name === f.pocAssigned) || TEAM[0];`
// and then use it in the POC HTML.

const replaceCard = (match) => {
  return `const teamColor = TEAM_COLORS[f.team]?.primary || '#7C3AED';
      const poc = TEAM.find(t => t.name === f.pocAssigned) || TEAM[TEAM.length - 1]; // fallback
      
      const photoHtml = photoUrl 
        ? \`<img src="\${photoUrl}" referrerpolicy="no-referrer" style="width: 100%; height: 280px; object-fit: cover; object-position: top; border-bottom: 3px solid \${teamColor};" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div style="width:100%; height:280px; display:none; align-items:center; justify-content:center; background:#1E293B; font-size:60px; font-weight:800; color:\${teamColor}; border-bottom:3px solid \${teamColor};">\${escapeHTML(displayName.charAt(0))}</div>\`
        : \`<div style="width:100%; height:280px; display:flex; align-items:center; justify-content:center; background:#1E293B; font-size:60px; font-weight:800; color:\${teamColor}; border-bottom:3px solid \${teamColor};">\${escapeHTML(displayName.charAt(0))}</div>\`;
        
      const pocHtml = f.pocAssigned ? \`<div style="display:flex; align-items:center; justify-content:center; gap:6px; margin-bottom:8px; padding:4px 8px; background:rgba(255,255,255,0.03); border-radius:20px; display:inline-flex;">\${renderAvatar(poc.name, poc.color, 'sm', poc.team)}<span style="font-size:11px; color:#E2E8F0; font-weight:600;">\${escapeHTML(f.pocAssigned)}</span></div>\` : '';
      
      return \`
        <div class="card" style="cursor: pointer; transition: transform 0.2s; overflow:hidden;" onclick="renderFellowProfile('\${f.id}')" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          \${photoHtml}
          <div style="padding: 16px;">
            \${pocHtml}
            <h3 style="margin: 0 0 6px 0; font-size: 18px; color: #F1F5F9; word-break: break-word;">\${escapeHTML(displayName)} \${renderStrikeDots(f.id)}</h3>
            <div style="font-size: 14px; color: #94A3B8; margin-bottom: 12px; word-break: break-word;">\${escapeHTML(displayCollege)}</div>
            <div style="display:flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap;">
              \${renderBadge(f.fellowStatus)}
              \${f.intakeStatus ? \`<span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA; font-size:11px; padding: 4px 8px; white-space:nowrap;">\${escapeHTML(f.intakeStatus.replace(/\\s*intake\\s*$/i,''))} Intake</span>\` : ""}
            </div>
          </div>
        </div>
      \`;`;
};

// Update for both My Fellows and All Fellows. 
// I previously replaced the photo block in both to be identical. Let's find them.
const regex = /const teamColor = TEAM_COLORS\[f\.team\]\?\.primary \|\| '#7C3AED';[\s\S]*?return `\s*<div class="card"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*`;/g;

let matches = code.match(regex);
if (matches) {
  console.log(`Found ${matches.length} matches to replace.`);
  code = code.replace(regex, replaceCard);
} else {
  console.log('No matches found for card generation block.');
}

fs.writeFileSync('app.js', code);
