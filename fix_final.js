const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// The pattern to match is the card HTML generation in both grids.
// It starts with `const teamColor = TEAM_COLORS[f.team]?.primary || '#7C3AED';`
// and ends with `</div>\n      \`;`
// There are TWO occurrences (My Fellows and All Fellows).

const replaceCard = (match) => {
  return `const teamColor = TEAM_COLORS[f.team]?.primary || '#7C3AED';
      const photoHtml = photoUrl 
        ? \`<img src="\${photoUrl}" referrerpolicy="no-referrer" style="width:100%; height:250px; object-fit:cover; object-position:top; border-bottom:3px solid \${teamColor};" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div style="width:100%; height:250px; display:none; align-items:center; justify-content:center; background:\${teamColor}22; font-size:60px; font-weight:800; color:\${teamColor}; border-bottom:3px solid \${teamColor};">\${escapeHTML(displayName.charAt(0))}</div>\`
        : \`<div style="width:100%; height:250px; display:flex; align-items:center; justify-content:center; background:\${teamColor}22; font-size:60px; font-weight:800; color:\${teamColor}; border-bottom:3px solid \${teamColor};">\${escapeHTML(displayName.charAt(0))}</div>\`;
        
      const pocHtml = f.pocAssigned ? \`<div style="font-size:11px; color:\${teamColor}; margin-bottom:4px; font-weight:600; text-transform:uppercase;">POC: \${escapeHTML(f.pocAssigned)}</div>\` : '';
      
      return \`
        <div class="card" style="cursor: pointer; transition: transform 0.2s; overflow:hidden;" onclick="renderFellowProfile('\${f.id}')" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          \${photoHtml}
          <div style="padding: 16px;">
            \${pocHtml}
            <h3 style="margin: 0 0 6px 0; font-size: 18px; color: #F1F5F9; word-wrap: break-word;">\${escapeHTML(displayName)} \${renderStrikeDots(f.id)}</h3>
            <div style="font-size: 14px; color: #94A3B8; margin-bottom: 12px; word-wrap: break-word;">\${escapeHTML(displayCollege)}</div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              \${renderBadge(f.fellowStatus)}
              \${f.intakeStatus ? \`<span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA; font-size:11px; padding: 4px 8px; white-space:nowrap;">\${escapeHTML(f.intakeStatus.replace(/\\s*intake\\s*$/i,''))} Intake</span>\` : ""}
            </div>
          </div>
        </div>
      \`;`;
};

// Regex to capture the entire block of code that generates photoHtml and the return string.
const regex = /const teamColor = TEAM_COLORS\[f\.team\]\?\.primary \|\| '#7C3AED';\s*const photoHtml = photoUrl[^`]*`[^`]*`\s*: `[^`]*`;[\s\S]*?return `[\s\S]*?<\/div>\s*`;/g;

let matches = code.match(regex);
if (matches) {
  console.log(`Found ${matches.length} matches to replace.`);
  code = code.replace(regex, replaceCard);
} else {
  console.log('No matches found for card generation block.');
}

// Ensure strikes are visible. The issue might be that modal doesn't have overflow-y properly set or has a max-height that clips.
// Let's modify the modal wrapper.
const modalRegex = /<div class="modal" style="width: 900px; max-width: 95%; padding: 0; max-height: 90vh; overflow-y: auto; background: #0F172A; border: 1px solid rgba\(148,163,184,0\.1\); position: relative;">/;
const newModalStyle = `<div class="modal" style="width: 900px; max-width: 95%; padding: 0; max-height: 90vh; overflow-y: scroll; background: #0F172A; border: 1px solid rgba(148,163,184,0.1); position: relative; margin-top: 5vh; margin-bottom: 5vh;">`;

if (code.match(modalRegex)) {
  code = code.replace(modalRegex, newModalStyle);
  console.log('Patched modal scroll style.');
}

// Let's also check if `.modal-overlay` itself needs scrolling.
const overlayRegex = /<div class="modal-overlay fade-in">/g;
const newOverlayStyle = `<div class="modal-overlay fade-in" style="display:flex; align-items:flex-start; justify-content:center; overflow-y:auto; padding: 20px 0;">`;

if (code.match(overlayRegex)) {
  code = code.replace(overlayRegex, newOverlayStyle);
  console.log('Patched modal overlay flex style to allow scrolling.');
}

fs.writeFileSync('app.js', code);
