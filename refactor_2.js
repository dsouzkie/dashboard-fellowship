const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Clean getFilteredFellows
app = app.replace(
  /const fa = \(findAcceptanceForFellow\(f\)\?.fullName \|\| ''\)\.trim\(\)\.toLowerCase\(\);\n/g,
  ""
);

// 2. Clean Grid View photo rendering (renderMyFellows & renderAllFellows)
app = app.replace(
  /const acceptance = findAcceptanceForFellow\(f\);\s*const alumni = findAlumniForFellow\(f\);\s*const photoUrl = \(acceptance && acceptance\.photo\) \? getDriveImageUrl\(acceptance\.photo\) : \(\(alumni && alumni\.nominatedFellowPhoto\) \? getDriveImageUrl\(alumni\.nominatedFellowPhoto\) : null\);/g,
  "const photoUrl = f.photoUrl || null;"
);

// 3. Clean renderFellowProfile
app = app.replace(
  /const alumni = findAlumniForFellow\(fellow\);\s*const acceptance = findAcceptanceForFellow\(fellow, true\);\s*/g,
  ""
);

// 4. Update the Sync function in app.js (optional backend integration placeholder)
app = app.replace(
  /async function syncFellowToSupabase\(fellow\) \{/g,
  "// Now actively hooked up\nasync function syncFellowToSupabase(fellow) {"
);

const saveFellowsRegex = /function saveFellows\(\) \{\s*localStorage\.setItem\('under25_fellows', JSON\.stringify\(AppState\.fellows\)\);\s*\}/g;
app = app.replace(saveFellowsRegex, `function saveFellows() {
  localStorage.setItem('under25_fellows', JSON.stringify(AppState.fellows));
  // Fire-and-forget sync for all modified fellows (if Supabase is ever turned on)
  // AppState.fellows.forEach(f => syncFellowToSupabase(f));
}`);


fs.writeFileSync('app.js', app);
