
const jsdom = require('jsdom');
const fs = require('fs');
const { window } = new jsdom.JSDOM('<!DOCTYPE html><html><body><div id="toast-container"></div><div id="app"></div><div id="modalContainer"></div></body></html>');
global.window = window;
global.document = window.document;
global.sessionStorage = { getItem:()=>null, setItem:()=>{} };
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};
global.fetch = fetch;
global.navigator = { clipboard: { writeText: async () => {} } };

let code = fs.readFileSync('app.js', 'utf8');
code = code.replace("document.addEventListener('DOMContentLoaded', init);", "");

eval(code);

init().then(() => {
  setTimeout(() => {
    console.log('--- SAMPLE TYPES ---');
    const types = Array.from(new Set(AppState.nominations.map(n => n.type)));
    console.log(types);
    process.exit(0);
  }, 3000);
});
