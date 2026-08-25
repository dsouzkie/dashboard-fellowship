const fs = require('fs');

const fafCsv = fs.readFileSync('faf.csv', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');
const trackerCsv = fs.readFileSync('Fellowship 26-27 Tracker - Final Fellowship Tracker.csv', 'utf8');

// evaluate everything up to window.AppState in app.js
const sandbox = {
  window: {},
  document: { addEventListener: () => {} },
  localStorage: { getItem: () => null, setItem: () => {} },
  console: console
};

const vm = require('vm');
vm.createContext(sandbox);

try {
  vm.runInContext(appJs + '\n window.AppState = AppState; window.parseAcceptanceCSV = parseAcceptanceCSV; window.parseCSV = parseCSV; window.findAcceptanceForFellow = findAcceptanceForFellow; window.mergeFafDataOnce = mergeFafDataOnce;', sandbox);
  
  sandbox.AppState.acceptances = sandbox.window.parseAcceptanceCSV(fafCsv);
  console.log("Parsed FAF count:", sandbox.AppState.acceptances.length);
  
  sandbox.AppState.fellows = sandbox.window.parseCSV(trackerCsv);
  console.log("Parsed Tracker count:", sandbox.AppState.fellows.length);
  
  sandbox.window.mergeFafDataOnce();
  
  const greeshma = sandbox.AppState.fellows.find(f => (f.fellowName||'').toLowerCase().includes('greeshma'));
  console.log("Greeshma photoUrl:", greeshma ? greeshma.photoUrl : 'Not found');
  console.log("Greeshma hocName:", greeshma ? greeshma.hocName : 'Not found');
  
} catch(e) {
  console.log("Error in sandbox:", e);
}
