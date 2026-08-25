const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /<div class="card-header"><h3 class="card-title">\$\{AppState\.formFilter === 'all' \? 'All' : \(AppState\.formFilter === 'filled' \? 'Filled' : 'Pending'\)\} Form Status<\/h3><\/div>\s*<div class="card-body" style="">/g,
  `<div class="card-header"><h3 class="card-title">\${AppState.formFilter === 'all' ? 'All' : (AppState.formFilter === 'filled' ? 'Filled' : 'Pending')} Form Status</h3></div>
      <div class="card-body" style="max-height: 600px; overflow-y: auto;">`
);

app = app.replace(
  /<div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">\s*<h3 class="card-title">All Active Strikes Master List<\/h3>[\s\S]*?<\/div>\s*<div class="card-body" style="padding:0;">/g,
  (match) => match.replace('<div class="card-body" style="padding:0;">', '<div class="card-body" style="padding:0; max-height: 600px; overflow-y: auto;">')
);

fs.writeFileSync('app.js', app);
