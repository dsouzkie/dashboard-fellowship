const fs = require('fs');

try {
  let content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

  // 1. Add Christy to TEAM
  if (!content.includes("'Christy'")) {
    const christyObj = "  { name: 'Christy', color: '#06B6D4', password: 'under25christy', isAdmin: true, team: 'Sapphire' },\n";
    content = content.replace("const TEAM = [", "const TEAM = [\n" + christyObj);
  }

  // 2. Improve the fellow profile modal exit button
  if (!content.includes('id="closeProfileModalSticky"')) {
    content = content.replace(
      '<div class="modal" style="width: 900px; max-width: 95%; padding: 0; max-height: 90vh; overflow-y: auto; background: #0F172A; border: 1px solid rgba(148,163,184,0.1);">',
      '<div class="modal" style="width: 900px; max-width: 95%; padding: 0; max-height: 90vh; overflow-y: auto; background: #0F172A; border: 1px solid rgba(148,163,184,0.1); position: relative;">\n          <button id="closeProfileModalSticky" onclick="document.getElementById(\\'modalContainer\\').innerHTML=\\'\\'" style="position: sticky; top: 16px; right: 16px; float: right; background: #EF4444; color: white; padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); z-index: 100;">Exit Profile</button>'
    );
  }

  // 3. Live fetch and merge FAF and Nomination data
  const fetchFunc = `
async function fetchAdditionalDataFromSheets() {
  try {
    const fafResponse = await fetch('https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=faf');
    const fafText = await fafResponse.text();
    if (typeof parseAcceptanceCSV === 'function') {
      AppState.acceptances = parseAcceptanceCSV(fafText);
    } else if (typeof parseFafCSV === 'function') {
      AppState.acceptances = parseFafCSV(fafText);
    }

    const nomResponse = await fetch('https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=nomination');
    const nomText = await nomResponse.text();
    if (typeof parseNominationCSV === 'function') {
      AppState.nominations = parseNominationCSV(nomText);
    }
    
    console.log('Fetched additional data successfully.');
  } catch (err) {
    console.error('Error fetching additional data:', err);
  }
}
`;
  if (!content.includes('fetchAdditionalDataFromSheets')) {
    // Add before syncFromSheets
    content = content.replace('async function syncFromSheets() {', fetchFunc + '\nasync function syncFromSheets() {');
    
    // Add the call inside syncFromSheets before render()
    content = content.replace('runAutoStrikes();\n  render();', 'if (typeof fetchAdditionalDataFromSheets === \\'function\\') {\\n    await fetchAdditionalDataFromSheets();\\n  }\\n  runAutoStrikes();\\n  render();');
  }

  // 4. Convert getDriveImageUrl to use /uc?id=
  if (content.includes('thumbnail?id=')) {
    content = content.replace(
      'return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w800`;',
      'return `https://drive.google.com/uc?id=${match[1]}`;'
    );
  }

  fs.writeFileSync('c:/Users/chris/Downloads/dash/app.js', content, 'utf8');
  console.log('Successfully updated app.js');
} catch (e) {
  console.error('Error updating app.js', e);
}
