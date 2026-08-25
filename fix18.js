const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

// Fix TEAM array colors
code = code.replace(
  "{ name: 'Kasis', color: '#10B981', password: 'under25kasis', team: 'Amber' }",
  "{ name: 'Kasis', color: '#F97316', password: 'under25kasis', team: 'Amber' }"
);
code = code.replace(
  "{ name: 'Christy', color: '#06B6D4', password: 'under25christy', isAdmin: true, team: 'Sapphire' }",
  "{ name: 'Christy', color: '#EAB308', password: 'under25christy', isAdmin: true, team: 'Sapphire' }"
);

// In renderFellowProfile, add Intake Tag, Team Name, and Team Ring to the profile photo
const profileHeaderRegex = /<h2 class="profile-name[^>]*>\$\{escapeHTML\(dName\)\}<\/h2>/;
const intakeTagHtml = `
<h2 class="profile-name \${dName === 'No Fellow' ? 'text-danger' : ''}">\${escapeHTML(dName)}</h2>
<div style="margin-top: 4px; margin-bottom: 8px; display: flex; gap: 8px; align-items: center;">
  \${fellow.intakeStatus ? \`<span class="badge" style="background: rgba(124,58,237,0.15); color: #A78BFA;">\${escapeHTML(fellow.intakeStatus)} Intake</span>\` : ''}
  \${poc.team ? \`<span class="badge" style="background: \${poc.color}22; color: \${poc.color};">\${poc.team}</span>\` : ''}
</div>
`;
code = code.replace(profileHeaderRegex, intakeTagHtml);

// Fix photoHtml in renderFellowProfile to include team ring
const photoHtmlRegex = /if \(photoUrl\) \{[\s\S]*?\} else \{[\s\S]*?\}/;
const newPhotoHtml = `
    const teamClass = poc.team ? ' team-ring--' + poc.team.toLowerCase() : '';
    if (photoUrl) {
      photoHtml = \`<img src="\${photoUrl}" referrerpolicy="no-referrer" class="profile-photo\${teamClass}" onerror="this.outerHTML='<div class=\\'profile-photo-placeholder\${teamClass}\\' style=\\'background-color:\${poc.color}\\'>\${dName.charAt(0).toUpperCase()}</div>'" />\`;
    } else {
      photoHtml = \`<div class="profile-photo-placeholder\${teamClass}" style="background-color:\${poc.color}">\${dName.charAt(0).toUpperCase()}</div>\`;
    }
`;
code = code.replace(photoHtmlRegex, newPhotoHtml);

fs.writeFileSync('app.js', code);
