const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Assign ID logic in render()
const renderTarget = `function render() {`;
const renderReplacement = `function render() {
  let nextDisplayId = 1;
  AppState.fellows.forEach(f => {
    if (f.displayId) {
      const num = parseInt(f.displayId, 10);
      if (num >= nextDisplayId) nextDisplayId = num + 1;
    }
  });
  let idsAssigned = false;
  AppState.fellows.forEach(f => {
    if (!f.displayId) {
      f.displayId = String(nextDisplayId++).padStart(3, '0');
      idsAssigned = true;
    }
  });
  if (idsAssigned) saveFellows();
`;
app = app.replace(renderTarget, renderReplacement);

// 2. Show ID in table links
const nameLinkTarget = /\$\{escapeHTML\(f\.fellowName\)\} \$\{renderStrikeDots\(f\.id\)\}/g;
const nameLinkReplacement = `#\${f.displayId || '000'} - \${escapeHTML(f.fellowName)} \${renderStrikeDots(f.id)}`;
app = app.replace(nameLinkTarget, nameLinkReplacement);

// 3. Show ID in grid cards
const gridCardTarget = /<div class="fellow-card__title">\$\{escapeHTML\(f\.fellowName\)\}<\/div>/g;
const gridCardReplacement = `<div class="fellow-card__title">#\${f.displayId || '000'} \${escapeHTML(f.fellowName)}</div>`;
app = app.replace(gridCardTarget, gridCardReplacement);

// 4. Show ID in Profile Modal
const profileTitleTarget = /<h2 style="margin:0; font-size:24px; color:#F1F5F9;">\$\{escapeHTML\(fellow\.fellowName\)\}<\/h2>/g;
const profileTitleReplacement = `<h2 style="margin:0; font-size:24px; color:#F1F5F9;">#\${fellow.displayId || '000'} - \${escapeHTML(fellow.fellowName)}</h2>`;
app = app.replace(profileTitleTarget, profileTitleReplacement);

fs.writeFileSync('app.js', app);
