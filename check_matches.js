const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');
code = code.replace(/const AppState =/g, 'global.AppState =');
code = code.replace(/const TEAM =/g, 'global.TEAM =');

const mock = `
global.window = { addEventListener: () => {} };
global.document = { addEventListener: () => {}, getElementById: () => null };
`;

eval(mock + code);

async function run() {
  const t = await fetch('https://docs.google.com/spreadsheets/d/10BSyslWloYekTr5UEkVeUCgBv94iuLmMwZIyjD9Xto4/gviz/tq?tqx=out:csv&sheet=Tracker').then(r=>r.text());
  global.AppState.fellows = parseCSV(t);
  const fText = await fetch('https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=FAF').then(r=>r.text());
  global.AppState.acceptances = parseAcceptanceCSV(fText);

  const p = global.AppState.fellows.find(f => f.fellowName && f.fellowName.includes('Gopalsing'));
  if (p) {
    const match = findAcceptanceForFellow(p);
    console.log('Piyush Rajput Match:', match ? match.fullName : 'NONE');
  }
  
  const g = global.AppState.fellows.find(f => f.fellowName && f.fellowName.includes('Greeshma'));
  if (g) {
    const gMatch = findAcceptanceForFellow(g);
    console.log('Greeshma Match:', gMatch ? gMatch.fullName : 'NONE');
  }
}
run();
