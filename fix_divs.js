const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(/<div class="profile-detail-row">\s*<div class="profile-detail-row">\s*<div class="profile-detail-row">\s*<div class="profile-detail-label">WhatsApp Group Added<\/div>\s*<\/div>\s*<div class="profile-detail-row">\s*<div class="profile-detail-row">\s*/g, '');

fs.writeFileSync('app.js', app);
