const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Mass Add Datalists
const datalists = `
      <datalist id="dl-status">
        <option value="Active"></option>
        <option value="Inactive"></option>
        <option value="Dropped Out"></option>
        <option value="Ghosted"></option>
      </datalist>
      <datalist id="dl-faf">
        <option value="Yes"></option>
        <option value="No"></option>
      </datalist>
`;

app = app.replace('      <tbody id="massAddTbody">', datalists + '\n      <tbody id="massAddTbody">');

app = app.replace(/<select class="form-select ma-poc">[\s\S]*?<\/select>/, `<input type="text" list="dl-poc" class="form-input ma-poc" placeholder="POC">`);
// Wait, I need to dynamically generate dl-poc or just add it to datalists.
// TEAM is a variable.

const datalists2 = `
      <datalist id="dl-poc">
        \${TEAM.map(t => \`<option value="\${t.name}"></option>\`).join('')}
      </datalist>
`;
app = app.replace('<datalist id="dl-status">', datalists2 + '\n      <datalist id="dl-status">');

app = app.replace(/<select class="form-select ma-status">[\s\S]*?<\/select>/g, `<input type="text" list="dl-status" class="form-input ma-status" placeholder="Status" value="Active">`);
app = app.replace(/<select class="form-select ma-faf">[\s\S]*?<\/select>/g, `<input type="text" list="dl-faf" class="form-input ma-faf" placeholder="Final Acc." value="No">`);

// 2. Cursor Bug - use selection save in the searchInput
const oldSearch = `
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      // Debounce render
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(render, 300);
    });
`;

const newSearch = `
    searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      // Debounce render
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => {
        render();
        const newSearch = document.getElementById('searchFellows');
        if (newSearch) {
          newSearch.focus();
          try { newSearch.setSelectionRange(start, end); } catch(e){}
        }
      }, 300);
    });
`;
app = app.replace(oldSearch.trim(), newSearch.trim());


// 3. Download CSV Priority FAF
const oldCSV = `
      const keys = Object.keys(AppState.fellows[0]);
      const csvContent = [
        keys.join(','),
        ...AppState.fellows.map(f => keys.map(k => {
          let val = f[k] === null || f[k] === undefined ? '' : String(f[k]);
          return '"' + val.replace(/"/g, '""') + '"';
        }).join(','))
      ].join('\\n');
`;

const newCSV = `
      const keys = Object.keys(AppState.fellows[0]);
      const csvContent = [
        keys.join(','),
        ...AppState.fellows.map(f => {
          // Merge FAF data for export priority
          const acc = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(f) : null;
          const merged = { ...f };
          if (acc) {
            if (acc.college) merged.collegeName = acc.college;
            if (acc.fullName) merged.fellowName = acc.fullName;
            if (acc.phone) merged.whatsappNo = acc.phone;
            if (acc.email) merged.emailId = acc.email;
          }
          return keys.map(k => {
            let val = merged[k] === null || merged[k] === undefined ? '' : String(merged[k]);
            return '"' + val.replace(/"/g, '""') + '"';
          }).join(',')
        })
      ].join('\\n');
`;

app = app.replace(oldCSV.trim(), newCSV.trim());


fs.writeFileSync('app.js', app);
console.log('UX issues fixed');
