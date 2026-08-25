const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const replacements = [
  // 1. Remove from renderAllFellows table configs
  { old: "{ label: 'Page Launched', field: 'clubPageLaunched' },", new: "" },
  { old: "{ label: 'First Reel', field: 'firstReelPosted' },", new: "" },
  { old: "{ label: 'WhatsApp Group', field: 'whatsappGroupAdded' },", new: "" },

  // 2. Remove from dashboard KPI cards
  { 
    old: "${iCard('??','Pages Launched', launchRate+'%', fellows.filter(f=>f.clubPageLaunched==='Yes').length+' of '+total+' clubs', '#10B981')}",
    new: "" 
  },
  
  // 3. Remove filter logic
  {
    old: `  if (AppState.filterLaunched !== 'all') {
    filtered = filtered.filter(f => f.clubPageLaunched === AppState.filterLaunched);
  }`,
    new: ""
  },
  
  // 4. Remove from table cells
  {
    old: `<td class="\${editableClass}" data-id="\${f.id}" data-field="clubPageLaunched">\${renderBadge(f.clubPageLaunched)}</td>`,
    new: ""
  },
  {
    old: `<th data-sort="clubPageLaunched">Launched \${AppState.sortField === 'clubPageLaunched' ? (AppState.sortDirection === 'asc' ? ' ' : ' ') : ''}</th>`,
    new: ""
  },

  // 5. Remove whatsapp from profile detail (was missed)
  {
    old: `<div class="profile-detail-value">\${renderBadge(fellow.whatsappGroupAdded)}</div>`,
    new: ""
  },
  
  // 6. Fix Edit Fellow modal conditional (just remove the variables from the IF statement)
  {
    old: "if (k === 'fellowStatus' || k === 'clubPageActivity' || k === 'finalAcceptance' || k === 'clubPageLaunched' || k === 'clubMade' || k === 'firstReelPosted' || k === 'mtf')",
    new: "if (k === 'fellowStatus' || k === 'clubPageActivity' || k === 'finalAcceptance' || k === 'clubMade')"
  },
  
  // 7. Remove from updateFellow body mapping
  { old: "clubpagelaunched: fellow.clubPageLaunched,", new: "" },
  
  // 8. Remove from inline edit field mapping
  {
    old: "} else if (field === 'finalAcceptance' || field === 'clubPageLaunched') {",
    new: "} else if (field === 'finalAcceptance') {"
  },
  
  // 9. Fix AutoStrike Rule 2
  {
    old: `  if (AppState.strikeRules.rule2 && fellow.finalAcceptance === 'Yes' && (fellow.clubPageLaunched === 'No' || fellow.clubPageLaunched === '')) {
    strikes.push({ reason: 'Club Page Launch', severity: 'warning' });
  }`,
    new: ""
  }
];

replacements.forEach(r => {
  // Use replace with string (not regex) to safely replace exactly what's there
  // Using a while loop to replace all occurrences if there are multiples
  while(app.includes(r.old)) {
    app = app.replace(r.old, r.new);
  }
});

fs.writeFileSync('app.js', app);
console.log('Fixed lingering inconsistencies.');
