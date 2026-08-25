const fs = require('fs');
fetch('https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=FAF')
  .then(r => r.text())
  .then(t => {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let insideQuotes = false;
    for (let i = 0; i < t.length; i++) {
      const char = t[i], nextChar = t[i + 1];
      if (char === '"' && insideQuotes && nextChar === '"') { currentCell += '"'; i++; }
      else if (char === '"') insideQuotes = !insideQuotes;
      else if (char === ',' && !insideQuotes) { currentRow.push(currentCell.trim()); currentCell = ''; }
      else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c !== '')) rows.push(currentRow);
        currentRow = []; currentCell = '';
        if (char === '\r') i++;
        break; 
      } else currentCell += char;
    }
    console.log(rows[0].map((c, i) => i + ': ' + c).join('\n'));
  });
