const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// Replace the card photo HTML in BOTH grid renders (myFellows and allFellows)
// Old: full-width 200px banner
// New: centered square 120x120 like the profile modal, with team color border

// Pattern 1 - photoUrl img (200px banner)
const oldImgBanner = `? \`<img src="\${photoUrl}" referrerpolicy="no-referrer" style="width: 100%; height: 200px; object-fit: cover; object-position: top; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};" onerror="this.src=''; this.outerHTML='<div style=\\\\'width:100%; height:160px; display:flex; align-items:center; justify-content:center; background:#1E293B; font-size:40px; color:#94A3B8; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};\\\\'>
\${escapeHTML(displayName.charAt(0))}</div>'"\``;

const newImgSquare = `? \`<div style="display:flex; justify-content:center; padding:20px 20px 0;"><img src="\${photoUrl}" referrerpolicy="no-referrer" style="width:120px; height:120px; border-radius:16px; object-fit:cover; object-position:top; border:3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(124,58,237,0.5)'}; box-shadow:0 8px 24px rgba(0,0,0,0.3);" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div style="width:120px; height:120px; border-radius:16px; display:none; align-items:center; justify-content:center; background:\${TEAM_COLORS[f.team]?.primary || '#7C3AED'}22; font-size:40px; font-weight:800; color:\${TEAM_COLORS[f.team]?.primary || '#A78BFA'}; border:3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(124,58,237,0.5)'};">\${escapeHTML(displayName.charAt(0))}</div></div>\``;

if (code.includes(oldImgBanner)) {
  code = code.split(oldImgBanner).join(newImgSquare);
  console.log('Patched banner -> square for photoUrl img!');
} else {
  console.log('img banner pattern not found, trying alternative...');
  // Try to find the 200px version
  const idx = code.indexOf('height: 200px; object-fit: cover; object-position: top;');
  if (idx > -1) {
    console.log('Found 200px at:', idx);
    console.log(code.substring(idx - 200, idx + 100));
  }
}

// Pattern 2 - no photo placeholder (200px banner)
const oldPlaceholderBanner = `\`: \`<div style="width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; background: #1E293B; font-size: 40px; color: #94A3B8; border-bottom: 3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(148,163,184,0.1)'};">\${escapeHTML(displayName.charAt(0))}</div>\``;

const newPlaceholderSquare = `\`: \`<div style="display:flex; justify-content:center; padding:20px 20px 0;"><div style="width:120px; height:120px; border-radius:16px; display:flex; align-items:center; justify-content:center; background:\${TEAM_COLORS[f.team]?.primary || '#7C3AED'}22; font-size:40px; font-weight:800; color:\${TEAM_COLORS[f.team]?.primary || '#A78BFA'}; border:3px solid \${TEAM_COLORS[f.team]?.primary || 'rgba(124,58,237,0.5)'};">\${escapeHTML(displayName.charAt(0))}</div></div>\``;

if (code.includes(oldPlaceholderBanner)) {
  code = code.split(oldPlaceholderBanner).join(newPlaceholderSquare);
  console.log('Patched placeholder banner -> square!');
} else {
  console.log('placeholder banner pattern not found');
  // Show what we have
  const idx2 = code.indexOf('height: 200px; display: flex');
  if (idx2 > -1) {
    console.log('Found 200px display:flex at:', idx2);
    console.log(code.substring(idx2 - 50, idx2 + 150));
  }
}

fs.writeFileSync('app.js', code);
