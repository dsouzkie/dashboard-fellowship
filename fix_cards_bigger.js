const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// 1. Fix the card layout: make it banner again (250px tall), and fix text truncation and duplicate tags.

const cardBlockRegex = /const photoHtml = photoUrl \s*\? `<div style="display:flex; justify-content:center; padding:20px 20px 0;"><img src="\$\{photoUrl\}" referrerpolicy="no-referrer" style="width:120px; height:120px; border-radius:16px; object-fit:cover; object-position:top; border:3px solid \$\{teamColor\}; box-shadow:0 8px 24px rgba\(0,0,0,0\.3\);" onerror="this\.style\.display='none'; this\.nextSibling\.style\.display='flex';" \/><div style="width:120px; height:120px; border-radius:16px; display:none; align-items:center; justify-content:center; background:\$\{teamColor\}22; font-size:40px; font-weight:800; color:\$\{teamColor\}; border:3px solid \$\{teamColor\};">\$\{escapeHTML\(displayName\.charAt\(0\)\)\}<\/div><\/div>`\s*: `<div style="display:flex; justify-content:center; padding:20px 20px 0;"><div style="width:120px; height:120px; border-radius:16px; display:flex; align-items:center; justify-content:center; background:\$\{teamColor\}22; font-size:40px; font-weight:800; color:\$\{teamColor\}; border:3px solid \$\{teamColor\}; box-shadow:0 8px 24px rgba\(0,0,0,0\.3\);">\$\{escapeHTML\(displayName\.charAt\(0\)\)\}<\/div><\/div>`;\s*return `\s*<div class="card" style="cursor: pointer; transition: transform 0\.2s;" onclick="renderFellowProfile\('\$\{f\.id\}'\)" onmouseover="this\.style\.transform='translateY\(-4px\)'" onmouseout="this\.style\.transform='translateY\(0\)'">\s*\$\{photoHtml\}\s*<div style="padding: 14px 15px; text-align:center;">\s*<h3 style="margin: 0 0 5px 0; font-size: 16px; color: #F1F5F9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\$\{escapeHTML\(displayName\)\} \$\{renderStrikeDots\(f\.id\)\} \$\{f\.intakeStatus \? `<span class="intake-badge--\$\{f\.intakeStatus === 'August Intake' \? 'august' : 'existing'\}" style="margin-left:6px; font-size:10px">\$\{f\.intakeStatus === 'August Intake' \? 'Aug' : 'Existing'\}<\/span>` : ""\}<\/h3>\s*<div style="font-size: 13px; color: #94A3B8; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\$\{escapeHTML\(displayCollege\)\}<\/div>\s*<div style="display:flex; align-items:center; justify-content:center; gap:6px; flex-wrap:wrap;">\$\{renderBadge\(f\.fellowStatus\)\} \$\{f\.intakeStatus \? `<span class="intake-badge--\$\{f\.intakeStatus === 'August Intake' \? 'august' : 'existing'\}" style="font-size:9px; padding:2px 5px;">\$\{f\.intakeStatus === 'August Intake' \? 'Aug Intake' : 'Existing'\}<\/span>` : ""\}<\/div>\s*<\/div>\s*<\/div>\s*`;/g;

const newCardBlock = `const photoHtml = photoUrl 
        ? \`<img src="\${photoUrl}" referrerpolicy="no-referrer" style="width: 100%; height: 280px; object-fit: cover; object-position: top; border-bottom: 3px solid \${teamColor};" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div style="width:100%; height:280px; display:none; align-items:center; justify-content:center; background:#1E293B; font-size:60px; font-weight:800; color:\${teamColor}; border-bottom:3px solid \${teamColor};">\${escapeHTML(displayName.charAt(0))}</div>\`
        : \`<div style="width:100%; height:280px; display:flex; align-items:center; justify-content:center; background:#1E293B; font-size:60px; font-weight:800; color:\${teamColor}; border-bottom:3px solid \${teamColor};">\${escapeHTML(displayName.charAt(0))}</div>\`;
        
      return \`
        <div class="card" style="cursor: pointer; transition: transform 0.2s; overflow: hidden;" onclick="renderFellowProfile('\${f.id}')" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          \${photoHtml}
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 6px 0; font-size: 18px; color: #F1F5F9; word-break: break-word;">\${escapeHTML(displayName)} \${renderStrikeDots(f.id)}</h3>
            <div style="font-size: 14px; color: #94A3B8; margin-bottom: 12px; word-break: break-word;">\${escapeHTML(displayCollege)}</div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">\${renderBadge(f.fellowStatus)} \${f.intakeStatus ? \`<span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA; font-size:11px; padding: 4px 8px; white-space:nowrap;">\${escapeHTML(f.intakeStatus.replace(/\\s*intake\\s*$/i,''))} Intake</span>\` : ""}</div>
          </div>
        </div>
      \`;`;

// For All Fellows grid
const cardBlockRegex2 = /const photoHtml2 = photoUrl2 \s*\? `<div style="display:flex; justify-content:center; padding:20px 20px 0;"><img src="\$\{photoUrl2\}" referrerpolicy="no-referrer" style="width:120px; height:120px; border-radius:16px; object-fit:cover; object-position:top; border:3px solid \$\{teamColor\}; box-shadow:0 8px 24px rgba\(0,0,0,0\.3\);" onerror="this\.style\.display='none'; this\.nextSibling\.style\.display='flex';" \/><div style="width:120px; height:120px; border-radius:16px; display:none; align-items:center; justify-content:center; background:\$\{teamColor\}22; font-size:40px; font-weight:800; color:\$\{teamColor\}; border:3px solid \$\{teamColor\};">\$\{escapeHTML\(displayName2\.charAt\(0\)\)\}<\/div><\/div>`\s*: `<div style="display:flex; justify-content:center; padding:20px 20px 0;"><div style="width:120px; height:120px; border-radius:16px; display:flex; align-items:center; justify-content:center; background:\$\{teamColor\}22; font-size:40px; font-weight:800; color:\$\{teamColor\}; border:3px solid \$\{teamColor\}; box-shadow:0 8px 24px rgba\(0,0,0,0\.3\);">\$\{escapeHTML\(displayName2\.charAt\(0\)\)\}<\/div><\/div>`;\s*return `\s*<div class="card" style="cursor: pointer; transition: transform 0\.2s;" onclick="renderFellowProfile\('\$\{f\.id\}'\)" onmouseover="this\.style\.transform='translateY\(-4px\)'" onmouseout="this\.style\.transform='translateY\(0\)'">\s*\$\{photoHtml2\}\s*<div style="padding: 14px 15px; text-align:center;">\s*<h3 style="margin: 0 0 5px 0; font-size: 16px; color: #F1F5F9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\$\{escapeHTML\(displayName2\)\} \$\{renderStrikeDots\(f\.id\)\} \$\{f\.intakeStatus \? `<span class="intake-badge--\$\{f\.intakeStatus === 'August Intake' \? 'august' : 'existing'\}" style="margin-left:6px; font-size:10px">\$\{f\.intakeStatus === 'August Intake' \? 'Aug' : 'Existing'\}<\/span>` : ""\}<\/h3>\s*<div style="font-size: 13px; color: #94A3B8; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\$\{escapeHTML\(displayCollege2\)\}<\/div>\s*<div style="display:flex; align-items:center; justify-content:center; gap:6px; flex-wrap:wrap;">\$\{renderBadge\(f\.fellowStatus\)\} \$\{f\.intakeStatus \? `<span class="intake-badge--\$\{f\.intakeStatus === 'August Intake' \? 'august' : 'existing'\}" style="font-size:9px; padding:2px 5px;">\$\{f\.intakeStatus === 'August Intake' \? 'Aug Intake' : 'Existing'\}<\/span>` : ""\}<\/div>\s*<\/div>\s*<\/div>\s*`;/g;

const newCardBlock2 = `const photoHtml2 = photoUrl2 
        ? \`<img src="\${photoUrl2}" referrerpolicy="no-referrer" style="width: 100%; height: 280px; object-fit: cover; object-position: top; border-bottom: 3px solid \${teamColor};" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" /><div style="width:100%; height:280px; display:none; align-items:center; justify-content:center; background:#1E293B; font-size:60px; font-weight:800; color:\${teamColor}; border-bottom:3px solid \${teamColor};">\${escapeHTML(displayName2.charAt(0))}</div>\`
        : \`<div style="width:100%; height:280px; display:flex; align-items:center; justify-content:center; background:#1E293B; font-size:60px; font-weight:800; color:\${teamColor}; border-bottom:3px solid \${teamColor};">\${escapeHTML(displayName2.charAt(0))}</div>\`;
        
      return \`
        <div class="card" style="cursor: pointer; transition: transform 0.2s; overflow: hidden;" onclick="renderFellowProfile('\${f.id}')" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
          \${photoHtml2}
          <div style="padding: 16px;">
            <h3 style="margin: 0 0 6px 0; font-size: 18px; color: #F1F5F9; word-break: break-word;">\${escapeHTML(displayName2)} \${renderStrikeDots(f.id)}</h3>
            <div style="font-size: 14px; color: #94A3B8; margin-bottom: 12px; word-break: break-word;">\${escapeHTML(displayCollege2)}</div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">\${renderBadge(f.fellowStatus)} \${f.intakeStatus ? \`<span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA; font-size:11px; padding: 4px 8px; white-space:nowrap;">\${escapeHTML(f.intakeStatus.replace(/\\s*intake\\s*$/i,''))} Intake</span>\` : ""}</div>
          </div>
        </div>
      \`;`;

let replaced = false;
if (code.match(cardBlockRegex)) {
  code = code.replace(cardBlockRegex, newCardBlock);
  console.log('Fixed My Fellows grid cards.');
  replaced = true;
} else {
  console.log('Could not find My Fellows card block.');
}

if (code.match(cardBlockRegex2)) {
  code = code.replace(cardBlockRegex2, newCardBlock2);
  console.log('Fixed All Fellows grid cards.');
  replaced = true;
} else {
  console.log('Could not find All Fellows card block.');
}

// Ensure the profile modal is actually scrolling and Strikes are visible.
// I see `<div class="modal" style="width: 900px; max-width: 95%; padding: 0; max-height: 90vh; overflow-y: auto;`
// That should scroll. Let's make sure `.profile-strikes` doesn't have a stray display:none or something.
const strikeHtml = `<div class="profile-strikes">
            <h3 style="color:#F1F5F9; font-size:16px; margin-bottom:12px; margin-top:0;">Strikes & Infractions</h3>`;

if (code.includes(strikeHtml)) {
  console.log("Strikes HTML found.");
}

fs.writeFileSync('app.js', code);
