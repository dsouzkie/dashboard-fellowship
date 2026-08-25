const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Update Grid Card photo rendering to include alumni fallback
const targetPhotoUrl = /const photoUrl = \(acceptance && acceptance\.photo\) \? getDriveImageUrl\(acceptance\.photo\) : null;/g;
const replacementPhotoUrl = `const photoUrl = (acceptance && acceptance.photo) ? getDriveImageUrl(acceptance.photo) : (alumni && alumni.nominatedFellowPhoto ? getDriveImageUrl(alumni.nominatedFellowPhoto) : null);`;

app = app.replace(targetPhotoUrl, replacementPhotoUrl);

// Update Profile photo rendering to include alumni fallback
const profilePhotoTarget = /let photoUrl = null;\s*if \(acceptance && acceptance\.photo\) \{\s*photoUrl = getDriveImageUrl\(acceptance\.photo\);\s*\} else if \(alumni && alumni\.nominatedFellowPhoto\) \{\s*\/\/ photoUrl = getDriveImageUrl\(alumni\.nominatedFellowPhoto\); \/\/ User requested only FAF photo\s*\}/;
const profilePhotoReplacement = `let photoUrl = null;
    if (acceptance && acceptance.photo) {
      photoUrl = getDriveImageUrl(acceptance.photo);
    } else if (alumni && alumni.nominatedFellowPhoto) {
      photoUrl = getDriveImageUrl(alumni.nominatedFellowPhoto);
    }`;

app = app.replace(profilePhotoTarget, profilePhotoReplacement);

fs.writeFileSync('app.js', app);
