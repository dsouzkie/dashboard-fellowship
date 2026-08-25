const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const oldMatch = `
        const match = AppState.acceptances.find(a => {
          const fafName = a.fullName.toLowerCase().trim();
          const fafEmail = a.email.toLowerCase().trim();
          const normalize = s => s.replace(/[^a-z0-9]/g, '');
          const normFaf = normalize(fafName);
          const normFellow = normalize(fellowName);
          
          return (fafEmail && fafEmail === fellowEmail) || 
                 (fafName && fellowName && (fafName.includes(fellowName) || fellowName.includes(fafName))) ||
                 (normFaf && normFellow && (normFaf.includes(normFellow) || normFellow.includes(normFaf)));
        });`;

const newMatch = `
        const match = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(fellow, true) : null;
`;

app = app.replace(oldMatch.trim(), newMatch.trim());

fs.writeFileSync('app.js', app);
console.log('Fixed Hrithikesh Matcher');
