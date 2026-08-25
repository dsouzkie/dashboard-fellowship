const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
window.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
window.FileReader = class {};
global.window = window;
global.document = window.document;
global.navigator = { clipboard: { writeText: () => Promise.resolve() } };

const appCode = fs.readFileSync('app.js', 'utf8');
try {
  window.eval(appCode);
  window.eval(`
    AppState.currentUser = { name: "Chris", isAdmin: true, team: "Red" };
    AppState.fellows = [
      { id: 'f_1', fellowName: 'Test', pocAssigned: 'Chris', finalAcceptance: 'Yes', clubPageLaunched: 'No' }
    ];
    AppState.currentView = 'tracker';
    render();
    console.log("Rendered successfully");
    renderFellowProfile('f_1');
    console.log("Profile successfully rendered");
    
    // Simulate clicks on all buttons
    document.querySelectorAll('button').forEach(btn => {
      try { btn.click(); } catch (e) { console.error("Click error on", btn.outerHTML, e); }
    });
    console.log("All clicks completed");
  `);
} catch (e) {
  console.error("Caught error:", e);
}
