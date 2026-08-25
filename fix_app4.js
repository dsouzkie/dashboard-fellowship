const fs = require('fs');
let text = fs.readFileSync('app.js', 'utf8');

const bindEventsOriginal = `function bindEvents() {
  // Navigation`;

const bindEventsNew = `function bindEvents() {
  // Filter Dropdowns
  document.querySelectorAll('select[data-filter-type]').forEach(select => {
    select.addEventListener('change', (e) => {
      const type = e.target.dataset.filterType;
      const val = e.target.value;
      if (type === 'poc') AppState.filterPOC = val;
      else if (type === 'status') AppState.filterStatus = val;
      else if (type === 'city') AppState.filterCity = val;
      else if (type === 'activity') AppState.filterActivity = val;
      else if (type === 'launched') AppState.filterLaunched = val;
      render();
    });
  });

  // Navigation`;

text = text.replace(bindEventsOriginal, bindEventsNew);

// Also modify empty states to say "No fellows found" if they are currently "You have no assigned fellows"
text = text.replace(
  `'<div class="empty-state" style="grid-column: 1/-1;"><div class="empty-state__title">You have no assigned fellows</div></div>'`,
  `'<div class="empty-state" style="grid-column: 1/-1;"><div class="empty-state__title">No fellows found</div></div>'`
);

fs.writeFileSync('app.js', text, 'utf8');
console.log('Fixed bindEvents for filters');
