const fs = require('fs');

let appCode = fs.readFileSync('app.js', 'utf8');
appCode = 'const window = { addEventListener: () => {} }; const document = { addEventListener: () => {}, getElementById: () => null };' + appCode;
// Remove const declarations to make them global
appCode = appCode.replace(/const AppState =/g, 'global.AppState =');
appCode = appCode.replace(/const TEAM =/g, 'global.TEAM =');
eval(appCode);

async function check() {
  const tText = await fetch('https://docs.google.com/spreadsheets/d/10BSyslWloYekTr5UEkVeUCgBv94iuLmMwZIyjD9Xto4/gviz/tq?tqx=out:csv&sheet=Tracker').then(r=>r.text());
  global.AppState.fellows = parseCSV(tText);
  
  const fText = await fetch('https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=FAF').then(r=>r.text());
  global.AppState.acceptances = parseAcceptanceCSV(fText);

  const missing = ['greeshmaa','karan kumar','ch arjun','dinesh singh','nupur','kalpesh','navani g','sanchita patra','prathush rao','hridya','maanya','piyush','abdul hannan','piyush gupta', 'gopal singh'];
  
  console.log('--- TRACKER vs FAF ---');
  for (let m of missing) {
    const trackerF = global.AppState.fellows.find(f => f.fellowName && f.fellowName.toLowerCase().includes(m.toLowerCase()));
    if (trackerF) {
      console.log('Found in Tracker: ' + trackerF.fellowName + ' | College: ' + trackerF.collegeName);
      
      const exactMatch = findAcceptanceForFellow(trackerF);
      if (exactMatch) {
         console.log('  -> MATCH FOUND: ' + exactMatch.fullName);
      } else {
         const fuzzy = global.AppState.acceptances.filter(a => a.fullName.toLowerCase().includes(m.toLowerCase()) || m.toLowerCase().includes(a.fullName.toLowerCase()));
         if (fuzzy.length) {
           console.log('  -> POTENTIAL FAF MATCHES (Name overlap):');
           fuzzy.forEach(a => console.log('       FAF Name: "' + a.fullName + '" | FAF College: "' + a.college + '"'));
         } else {
           console.log('  -> NO MATCH IN FAF AT ALL');
         }
      }
    } else {
      console.log('NOT in Tracker: ' + m);
    }
  }
}
check();
