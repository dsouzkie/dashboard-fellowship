const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Unhide the HTML section for admins who have fellows assigned
app = app.replace(
  /\\$\\{!isAdmin \\? \`\\s*<!-- MY FELLOWS SECTION -->/,
  `\${(!isAdmin || myTotal > 0) ? \`\n      <!-- MY FELLOWS SECTION -->`
);

// 2. Unhide the chart rendering for admins who have fellows assigned
app = app.replace(
  /if \(user && !user\.isAdmin\) \{/,
  `if (user && (!user.isAdmin || myTotal > 0)) {`
);

fs.writeFileSync('app.js', app);
