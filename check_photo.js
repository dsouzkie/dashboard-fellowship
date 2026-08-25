const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');

// Find profile modal photo style
const profileIdx = code.indexOf('class="profile-photo');
console.log('=== PROFILE MODAL photo ===');
console.log(code.substring(profileIdx - 50, profileIdx + 400));

// Find CSS for .profile-photo
const cssIdx = code.indexOf('.profile-photo {');
if (cssIdx > -1) console.log('\n=== CSS .profile-photo ===\n' + code.substring(cssIdx, cssIdx + 300));
