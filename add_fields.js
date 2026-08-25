const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const additionalFields = `
       f.capacity = acc.capacity || f.capacity || '';
       f.faName = acc.faName || f.faName || '';
       f.faEmail = acc.faEmail || f.faEmail || '';
       f.faPhone = acc.faPhone || f.faPhone || '';
       f.hocName = acc.hocName || f.hocName || '';
       f.hocEmail = acc.hocEmail || f.hocEmail || '';
       f.hocPhone = acc.hocPhone || f.hocPhone || '';
       f.hooName = acc.hooName || f.hooName || '';
       f.hooEmail = acc.hooEmail || f.hooEmail || '';
       f.hooPhone = acc.hooPhone || f.hooPhone || '';
       f.state = acc.state || f.state || '';
       f.city = acc.city || f.city || '';
`;

app = app.replace(
  'if (acc.photo) {\n         f.photoUrl = getDriveImageUrl(acc.photo);\n       }',
  'if (acc.photo) {\n         f.photoUrl = getDriveImageUrl(acc.photo);\n       }\n' + additionalFields
);

fs.writeFileSync('app.js', app);
