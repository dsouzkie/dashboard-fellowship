const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const badLine = 'this.outerHTML=\\'<div class=\\'profile-photo-placeholder${teamClass}\\' style=\\'background-color:${poc.color}\\'>${dName.charAt(0).toUpperCase()}</div>\\'';
const fixedLine = 'this.outerHTML=\\'<div class=&quot;profile-photo-placeholder${teamClass}&quot; style=&quot;background-color:${poc.color}&quot;>${dName.charAt(0).toUpperCase()}</div>\\'';

code = code.replace(badLine, fixedLine);

// There's another place where getDriveImageUrl was used? No, only in renderFellowProfile.
// Let's also use regex just in case
code = code.replace(/onerror="this\.outerHTML='<div class=\\'profile-photo-placeholder(.*?)\\' style=\\'background-color:(.*?)\\'>(.*?)<\/div>'"/g, 'onerror="this.outerHTML=\\'<div class=&quot;profile-photo-placeholder$1&quot; style=&quot;background-color:$2&quot;>$3</div>\\'"');

fs.writeFileSync('app.js', code);
console.log('Fixed onerror handler');
