const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');
const injection = `window.addEventListener('unhandledrejection', function(event) {
  const errDiv = document.createElement('div');
  errDiv.style.position = 'fixed';
  errDiv.style.top = '0';
  errDiv.style.left = '0';
  errDiv.style.width = '100%';
  errDiv.style.background = 'orange';
  errDiv.style.color = 'black';
  errDiv.style.zIndex = '999999';
  errDiv.style.padding = '20px';
  errDiv.innerHTML = '<h3>UNHANDLED PROMISE REJECTION</h3><p>' + (event.reason ? event.reason.message || event.reason : 'Unknown') + '</p><pre>' + (event.reason && event.reason.stack ? event.reason.stack : '') + '</pre>';
  document.body.appendChild(errDiv);
});\n`;
if (!code.includes('UNHANDLED PROMISE REJECTION')) {
  fs.writeFileSync('app.js', injection + code);
}
