
const jsdom = require('jsdom');
const fs = require('fs');
const { window } = new jsdom.JSDOM('<!DOCTYPE html><html><body><div id="toast-container"></div><div id="app"></div><div id="modalContainer"></div></body></html>');
global.window = window;
global.document = window.document;
global.sessionStorage = { getItem:()=>null, setItem:()=>{} }; global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};
global.fetch = fetch;
global.navigator = { clipboard: { writeText: async () => {} } };

let code = fs.readFileSync('app.js', 'utf8');

// replace addEventListener for DOMContentLoaded
code = code.replace("document.addEventListener('DOMContentLoaded', init);", "");

eval(code);

init().then(() => {
  setTimeout(() => {
    console.log('--- SAMPLE FELLOW ---');
    console.log(AppState.fellows[0]);
    console.log('--- SAMPLE NOMINATION ---');
    console.log(AppState.nominations[0]);
    
    // Test match
    console.log('--- MATCHING TEST ---');
    for (let i = 0; i < Math.min(10, AppState.fellows.length); i++) {
       const f = AppState.fellows[i];
       const alumni = findAlumniForFellow(f);
       console.log('Fellow:', f.fellowName, '| Matched:', alumni ? alumni.nominatedFellowName : 'NULL');
    }
    
    process.exit(0);
  }, 2000);
});
