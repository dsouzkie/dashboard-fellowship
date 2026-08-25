const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Gate findAcceptanceForFellow
const oldFindFAF = `function findAcceptanceForFellow(fellow) {
  if (!AppState.acceptances || !AppState.acceptances.length) return null;`;

const newFindFAF = `function findAcceptanceForFellow(fellow, force = false) {
  if (!force && fellow.finalAcceptance !== 'Yes') return null;
  if (!AppState.acceptances || !AppState.acceptances.length) return null;`;

app = app.replace(oldFindFAF, newFindFAF);

// 2. Change the approval script to use force = true
app = app.replace(/findAcceptanceForFellow\(fellow\)/g, 'findAcceptanceForFellow(fellow, true)');

// 3. Mark empty as "No" in renderForms
const oldRenderForms = `    let isFilled = f.finalAcceptance === 'Yes';
    
    if (isFilled) {
      statusClass = 'tracker-item--filled';
      filled++;
    } else {
      pending++;
    }`;

const newRenderForms = `    if (!f.finalAcceptance || f.finalAcceptance === 'N/A' || f.finalAcceptance === '') {
      f.finalAcceptance = 'No'; // Default to No if blank
    }
    let isFilled = f.finalAcceptance === 'Yes';
    
    if (isFilled) {
      statusClass = 'tracker-item--filled';
      filled++;
    } else {
      pending++;
    }`;

app = app.replace(oldRenderForms, newRenderForms);

fs.writeFileSync('app.js', app);
console.log('Fixed approval gating');
