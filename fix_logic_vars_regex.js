const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Pages Launched KPI card
app = app.replace(/\\$\\{iCard\\(.*?Pages Launched.*?\\)\\}/g, "");

// filterLaunched
app = app.replace(/if \\(AppState\\.filterLaunched !== 'all'\\) \\{\\s*filtered = filtered\\.filter\\(f => f\\.clubPageLaunched === AppState\\.filterLaunched\\);\\s*\\}/g, "");

// rule2 AutoStrikes
app = app.replace(/if \\(AppState\\.strikeRules\\.rule2 && fellow\\.finalAcceptance === 'Yes' && \\(fellow\\.clubPageLaunched === 'No' \\|\\| fellow\\.clubPageLaunched === ''\\)\\) \\{\\s*strikes\\.push\\(\\{ reason: 'Club Page Launch', severity: 'warning' \\}\\);\\s*\\}/g, "");

fs.writeFileSync('app.js', app);
