const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Fix broken grid view
app = app.replace(/const acceptance = findAcceptanceForFellow\(f\);\s*const alumni = findAlumniForFellow\(f\);\s*const photoUrl = [^;]+;\s*const displayName = [^;]+;\s*const displayCollege = [^;]+;/g, 
  "const photoUrl = f.photoUrl || null; const displayName = f.fellowName || 'Unknown'; const displayCollege = f.collegeName || 'Unknown';");

// Fix broken renderFellowProfile fields
app = app.replace(/const dState = fellow\. \? `, \$\{acceptance\.state\}` : '';/g, "const dState = fellow.state ? `, ${fellow.state}` : '';");
app = app.replace(/const dEmail = fellow\. \|\| fellow\.emailId \|\| '';/g, "const dEmail = fellow.emailId || '';");
app = app.replace(/photoUrl = getDriveImageUrl\(acceptance\.photo\);/g, '');
app = app.replace(/\} else if \(alumni && alumni\.nominatedFellowPhoto\) \{\s*photoUrl = getDriveImageUrl\(alumni\.nominatedFellowPhoto\);/g, '');

// Clean up remaining broken HTML blocks in renderFellowProfile
app = app.replace(/\$\{escapeHTML\(fellow\.dob \|\| \(acceptance \? acceptance\.dob : '-'\)\)\}/g, "${escapeHTML(fellow.dob || '-')}");
app = app.replace(/\$\{escapeHTML\(fellow\.tshirt \|\| \(acceptance \? acceptance\.tshirt : '-'\)\)\}/g, "${escapeHTML(fellow.tshirt || '-')}");
app = app.replace(/\$\{escapeHTML\(fellow\.address \|\| \(acceptance \? acceptance\.address : '-'\)\)\}/g, "${escapeHTML(fellow.address || '-')}");
app = app.replace(/\$\{escapeHTML\(acceptance\.capacity \|\| '-'\)\}/g, "${escapeHTML(fellow.capacity || '-')}");
app = app.replace(/\$\{acceptance \? `/g, "${true ? `");

fs.writeFileSync('app.js', app);
