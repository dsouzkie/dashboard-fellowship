async function main() {
  const r = await fetch('https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=FAF');
  const t = await r.text();

  function parseCSVFull(text) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let insideQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      if (char === '"' && insideQuotes && nextChar === '"') { currentCell += '"'; i++; }
      else if (char === '"') { insideQuotes = !insideQuotes; }
      else if (char === ',' && !insideQuotes) { currentRow.push(currentCell.trim()); currentCell = ''; }
      else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c !== '')) rows.push(currentRow);
        currentRow = [];
        currentCell = '';
        if (char === '\r') i++;
      } else { currentCell += char; }
    }
    if (currentCell !== '' || currentRow.length > 0) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c !== '')) rows.push(currentRow);
    }
    return rows;
  }

  const rows = parseCSVFull(t);
  console.log('Total rows:', rows.length);
  console.log('Header row:');
  rows[0].forEach((c, i) => console.log(i + ': ' + c.substring(0, 60)));
  
  console.log('\n\nFirst data row:');
  if (rows[1]) rows[1].forEach((c, i) => { if (c) console.log(i + ': ' + c.substring(0, 70)); });
}
main();
