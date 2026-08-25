const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const errorHandler = `
window.onerror = function(msg, url, lineNo, columnNo, error) {
  const errDiv = document.createElement('div');
  errDiv.style.position = 'fixed';
  errDiv.style.top = '0';
  errDiv.style.left = '0';
  errDiv.style.width = '100%';
  errDiv.style.background = 'red';
  errDiv.style.color = 'white';
  errDiv.style.zIndex = '999999';
  errDiv.style.padding = '20px';
  errDiv.style.fontFamily = 'monospace';
  errDiv.innerHTML = '<h3>CRITICAL ERROR</h3>' + 
    '<p>' + msg + '</p>' + 
    '<p>Line: ' + lineNo + ':' + columnNo + '</p>' + 
    '<pre>' + (error && error.stack ? error.stack : '') + '</pre>';
  document.body.appendChild(errDiv);
  return false;
};
`;

if (!app.includes('window.onerror')) {
  app = errorHandler + '\n' + app;
  fs.writeFileSync('app.js', app, 'utf8');
  console.log('Error handler injected.');
} else {
  console.log('Error handler already exists.');
}
