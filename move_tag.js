const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// Match 1 at 66792 and Match 3 at 75096 - these are in the card grid h3 tags
// They look like: ${escapeHTML(displayName)} ${renderStrikeDots(f.id)} ${f.intakeStatus ? `<span class="intake-badge--...

// We need to:
// 1. Remove the intake part from the h3
// 2. Add it next to renderBadge(f.fellowStatus) in the div below

// The pattern in the h3 is:
const h3Pattern = `} \${f.intakeStatus ? \`<span class="intake-badge--\${f.intakeStatus === 'August Intake' ? 'august' : 'existing'}" style="margin-left:6px; font-size:10px">\${f.intakeStatus === 'August Intake' ? 'Aug' : 'Existing'}</span>\` : ""}</h3>`;
const h3Replacement = `}</h3>`;

// The badge div pattern (right after the college div):
const badgePattern = `<div>\${renderBadge(f.fellowStatus)}</div>`;
const badgeReplacement = `<div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">\${renderBadge(f.fellowStatus)} \${f.intakeStatus ? \`<span class="intake-badge--\${f.intakeStatus === 'August Intake' ? 'august' : 'existing'}" style="font-size:9px; padding:2px 5px;">\${f.intakeStatus === 'August Intake' ? 'Aug Intake' : 'Existing'}</span>\` : ""}</div>`;

if (code.includes(h3Pattern)) {
  code = code.split(h3Pattern).join(h3Replacement);
  console.log('Removed intake from h3!');
} else {
  console.log('h3 pattern not found!');
}

if (code.includes(badgePattern)) {
  code = code.split(badgePattern).join(badgeReplacement);
  console.log('Added intake next to badge!');
} else {
  console.log('badge pattern not found!');
}

fs.writeFileSync('app.js', code);
