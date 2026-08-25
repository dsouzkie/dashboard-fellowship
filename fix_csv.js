const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const correctMapping = `
      if (!row[2] || row[2].trim() === '' || row[2].trim().toLowerCase() === 'unknown') continue;
      
      result.push({
        timestamp: row[0] || '',
        email: row[1] || '',
        fullName: row[2] || '',
        phone: row[3] || '',
        instagram: row[4] || '',
        dob: row[5] || '',
        college: row[6] || '',
        city: row[7] || '',
        state: row[8] || '',
        capacity: row[9] || '',
        address: row[10] || '',
        tshirt: row[11] || '',
        hocName: row[12] || '',
        hocEmail: row[13] || '',
        hocPhone: row[14] || '',
        hooName: row[15] || '',
        hooEmail: row[16] || '',
        hooPhone: row[17] || '',
        faName: row[18] || '',
        faEmail: row[19] || '',
        faPhone: row[20] || '',
        photo: row[29] || '',
        video: row[30] || ''
      });
`;

app = app.replace(
  /if \(!row\[3\].*?continue; \/\/ Full Name is at index 3[\s\S]*?photo: row\[30\] \|\| ''\n\s*\}\);\n/m,
  correctMapping
);

fs.writeFileSync('app.js', app);
