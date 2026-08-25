const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost' });

// Overwrite init so it doesn't run automatically and swallow stack traces
dom.window.eval(appJs + '\n\nwindow.myTestRender = function() { AppState.currentUser = TEAM[0]; renderDashboard(); };');

try {
  dom.window.myTestRender();
  console.log('Success');
} catch (e) {
  console.log('Error stack:', e.stack);
}
