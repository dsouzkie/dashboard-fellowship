const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const oldBtn = `<button class="btn btn--secondary" onclick="syncFromSheets()">?? Refresh Data</button>`;
const newBtn = `<button class="btn btn--secondary" onclick="renderMassAddModal()">? Mass Add</button>`;
app = app.replace(oldBtn, newBtn);

const oldAdd = `FIELD_KEYS.forEach(k => defaultData[k] = '');
    defaultData.pocAssigned = AppState.currentUser.isAdmin ? 'Admin' : AppState.currentUser.name;
    defaultData.fellowStatus = 'Active';`;

const newAdd = `FIELD_KEYS.forEach(k => defaultData[k] = '');
    defaultData.pocAssigned = AppState.currentUser.isAdmin ? 'Admin' : AppState.currentUser.name;
    defaultData.fellowStatus = 'Active';
    defaultData.finalAcceptance = 'No';`;

app = app.replace(oldAdd, newAdd);

// One-time sweep function
const sweep = `
function render() {
  if (AppState.fellows) {
    let changed = false;
    AppState.fellows.forEach(f => {
      if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance.trim() === '') {
        f.finalAcceptance = 'No';
        changed = true;
      }
    });
    if (changed) saveFellows();
  }
`;
app = app.replace('function render() {', sweep);

fs.writeFileSync('app.js', app);
console.log('Fixed defaults and button');
