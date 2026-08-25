const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const regex = /const acceptance = findAcceptanceForFellow\(f\);\s*const photoUrl = \(acceptance && acceptance\.photo\) \? getDriveImageUrl\(acceptance\.photo\) : null;/g;

const replacement = `const acceptance = findAcceptanceForFellow(f);
      const alumni = findAlumniForFellow(f);
      const photoUrl = (alumni && alumni.nominatedFellowPhoto) ? getDriveImageUrl(alumni.nominatedFellowPhoto) : ((acceptance && acceptance.photo) ? getDriveImageUrl(acceptance.photo) : null);`;

code = code.replace(regex, replacement);

fs.writeFileSync('app.js', code);
