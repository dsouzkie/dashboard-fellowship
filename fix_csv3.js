const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const regex = /if \(!row\[2\] \|\| row\[2\].trim\(\) === '' \|\| row\[2\].trim\(\).toLowerCase\(\) === 'unknown'\) continue;[\s\S]*?video: row\[30\] \|\| ''\s*\}\);/m;

const correctMapping = `if (!row[3] || row[3].trim() === '' || row[3].trim().toLowerCase() === 'unknown') continue; // Full Name is at index 3
      
      result.push({
        timestamp: row[0] || '',
        college: row[1] || '',
        city: row[2] || '',
        fullName: row[3] || '',
        phone: row[4] || '',
        faName: row[5] || '',
        faEmail: row[6] || '',
        faPhone: row[7] || '',
        email: row[8] || '',
        instagram: row[9] || '',
        dob: row[10] || '',
        state: row[11] || '',
        capacity: row[12] || '',
        address: row[13] || '',
        tshirt: row[14] || '',
        hocName: row[15] || '',
        hocPhone: row[16] || '',
        hocEmail: row[17] || '',
        hooName: row[18] || '',
        hooEmail: row[19] || '',
        hooPhone: row[20] || '',
        photo: row[30] || ''
      });`;

app = app.replace(regex, correctMapping);
fs.writeFileSync('app.js', app);
