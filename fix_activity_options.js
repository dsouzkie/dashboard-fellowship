const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. In renderFellowEditModal, extract clubPageActivity and fellowStatus to have their own correct selects.
const oldSelectBlock = `              if (k === 'fellowStatus' || k === 'clubPageActivity' || k === 'finalAcceptance' || k === 'clubMade') {
                return \`
                  <div class="form-group">
                    <label class="form-label">\${label}</label>
                    <select class="form-select" id="edit_\${k}">
                      <option value="Active" \${f[k] === 'Active' ? 'selected' : ''}>Active</option>
                      <option value="Inactive" \${f[k] === 'Inactive' ? 'selected' : ''}>Inactive</option>
                      <option value="Yes" \${f[k] === 'Yes' ? 'selected' : ''}>Yes</option>
                      <option value="No" \${f[k] === 'No' ? 'selected' : ''}>No</option>
                      <option value="On Hold" \${f[k] === 'On Hold' ? 'selected' : ''}>On Hold</option>
                      <option value="Ghosted" \${f[k] === 'Ghosted' ? 'selected' : ''}>Ghosted</option>
                      <option value="Dropped Out" \${f[k] === 'Dropped Out' ? 'selected' : ''}>Dropped Out</option>
                      <option value="N/A" \${f[k] === 'N/A' || !f[k] ? 'selected' : ''}>N/A</option>
                    </select>
                  </div>
                \`;
              }`;

const newSelectBlock = `              if (k === 'clubPageActivity') {
                return \`
                  <div class="form-group">
                    <label class="form-label">\${label}</label>
                    <select class="form-select" id="edit_\${k}">
                      \${ACTIVITY_OPTIONS.map(o => \`<option value="\${o}" \${f[k] === o ? 'selected' : ''}>\${o}</option>\`).join('')}
                    </select>
                  </div>
                \`;
              }
              if (k === 'fellowStatus') {
                return \`
                  <div class="form-group">
                    <label class="form-label">\${label}</label>
                    <select class="form-select" id="edit_\${k}">
                      \${['Active', 'Ghosted', 'Dropped Out', 'On Hold'].map(o => \`<option value="\${o}" \${f[k] === o ? 'selected' : ''}>\${o}</option>\`).join('')}
                    </select>
                  </div>
                \`;
              }
              if (k === 'finalAcceptance' || k === 'clubMade') {
                return \`
                  <div class="form-group">
                    <label class="form-label">\${label}</label>
                    <select class="form-select" id="edit_\${k}">
                      \${YES_NO_OPTIONS.map(o => \`<option value="\${o}" \${f[k] === o ? 'selected' : ''}>\${o || 'N/A'}</option>\`).join('')}
                    </select>
                  </div>
                \`;
              }`;

app = app.replace(oldSelectBlock, newSelectBlock);

// 2. Add sweeping function in render() to map bad values
const mapFunction = `
function mapClubPageActivity(val) {
  if (!val) return 'Not Set Up';
  const s = val.toString().toLowerCase().trim();
  if (s === 'active' || s.includes('launched') && !s.includes('not launched')) return 'Active';
  if (s === 'inactive') return 'Inactive';
  if (s.includes('management') || s.includes('restraint')) return 'Management Restraint';
  if (s.includes('not launched') || s.includes('not set up') || s.includes('credentials') || s.includes('mtf') || s.includes('dp')) return 'Not Set Up';
  
  // fallback for things like 'yes', 'no'
  if (s === 'yes') return 'Active';
  if (s === 'no') return 'Not Set Up';
  
  return 'Not Set Up';
}
`;

// Insert the helper function somewhere, e.g., before parseCSV
app = app.replace('function parseCSV', mapFunction + '\nfunction parseCSV');

// 3. Inject it into the sweep that runs in render()
const oldSweep = `      if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance.trim() === '') {
        f.finalAcceptance = 'No';
        changed = true;
      }`;
const newSweep = `      if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance.trim() === '') {
        f.finalAcceptance = 'No';
        changed = true;
      }
      const oldActivity = f.clubPageActivity;
      f.clubPageActivity = mapClubPageActivity(f.clubPageActivity);
      if (oldActivity !== f.clubPageActivity) changed = true;
`;

app = app.replace(oldSweep, newSweep);

fs.writeFileSync('app.js', app);
console.log('Fixed Activity Options');
