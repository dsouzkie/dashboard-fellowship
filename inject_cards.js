const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// Find where we need to inject the card generation back
// The issue is the } else { block was removed. Let me find the spot
const marker = '    `;\n\n    contentHtml = `\n      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">';

if (!code.includes('const cardsHtml = myFellows.map')) {
  // Need to inject the card generation block back before contentHtml in myFellows grid
  const insertBefore = '    contentHtml = `\n      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px;">';
  const insertBefore2 = code.indexOf(insertBefore);
  
  if (insertBefore2 > -1) {
    const cardCode = `  } else {
    const cardsHtml = myFellows.map(f => {
      const acceptance = findAcceptanceForFellow(f);
      const alumni = findAlumniForFellow(f);
      const photoUrl = (acceptance && acceptance.photo) ? getDriveImageUrl(acceptance.photo) : null;
      const displayName = (acceptance && acceptance.fullName) || f.fellowName || 'No Fellow';
      const displayCollege = (acceptance && acceptance.college) || f.collegeName || 'Unknown';
      
      const photoHtml = photoUrl 
        ? \`<img src="\${photoUrl}" referrerpolicy="no-referrer" style="width: 100%; height: 200px; object-fit: cover; object-position: top; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div style="width: 100%; height: 200px; display: none; align-items: center; justify-content: center; background: #1E293B; font-size: 40px; color: #94A3B8; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};">\${escapeHTML(displayName.charAt(0))}</div>\`
        : \`<div style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; background: #1E293B; font-size: 40px; color: #94A3B8; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};">\${escapeHTML(displayName.charAt(0))}</div>\`;
        
      return \`
        <div class="card" style="cursor: pointer; transition: transform 0.2s;" onclick="renderFellowProfile('\${f.id}')" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          \${photoHtml}
          <div style="padding: 12px 15px;">
            <div style="display:flex; align-items:flex-start; gap:5px; flex-wrap:wrap; margin-bottom:4px;">
              <h3 style="margin: 0; font-size: 14px; color: #F1F5F9;">\${escapeHTML(displayName)} \${renderStrikeDots(f.id)}</h3>
              \${f.intakeStatus ? \`<span class="intake-badge--\${f.intakeStatus === 'August Intake' ? 'august' : 'existing'}" style="font-size:8px; padding:1px 4px; white-space:nowrap; flex-shrink:0; vertical-align:middle;">\${f.intakeStatus === 'August Intake' ? 'Aug Intake' : 'Existing'}</span>\` : ""}
            </div>
            <div style="font-size: 12px; color: #94A3B8; margin-bottom: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\${escapeHTML(displayCollege)}</div>
            <div>\${renderBadge(f.fellowStatus)}</div>
          </div>
        </div>
      \`;
    }).join('');
`;
    code = code.substring(0, insertBefore2) + cardCode + '\n' + code.substring(insertBefore2);
    fs.writeFileSync('app.js', code);
    console.log('Injected card code!');
  } else {
    console.log('Could not find insertion point');
  }
} else {
  console.log('Card code already exists');
}
