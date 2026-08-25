const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const SUPABASE_CONSTANTS = `
const SUPABASE_URL = 'https://ylqerlvtelexijthiuuu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YMPDWgP7LCipfPp-wId45Q_ngK5Slp0';
`;

// Insert constants near the top
const constIdx = code.indexOf('const TRACKER_SHEET_URL');
code = code.substring(0, constIdx) + SUPABASE_CONSTANTS + '\n' + code.substring(constIdx);

// Replace loadData logic
const oldLoadData = `async function loadData() {
  try {
    const cached = loadFellows();
    if (cached) {
      AppState.fellows = cached;
      AppState.pocTransfers = loadPocTransfers();
      AppState.fellowRequests = loadFellowRequests();
    } else {
      await refreshDataFromSheets();
    }
  } catch (err) {
    console.error('Error loading data:', err);
    showToast('Failed to load data', 'error');
  }
}`;

const newLoadData = `async function loadData() {
  try {
    showLoading();
    const res = await fetch(\`\${SUPABASE_URL}/rest/v1/fellows?select=*\`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': \`Bearer \${SUPABASE_KEY}\` }
    });
    if (!res.ok) throw new Error('Failed to fetch from Supabase');
    const data = await res.json();
    
    // Map lowercase DB columns back to camelCase frontend keys
    AppState.fellows = data.map(dbRow => ({
      id: dbRow.id,
      fellowName: dbRow.fellowname,
      collegeName: dbRow.collegename,
      city: dbRow.city,
      pocAssigned: dbRow.pocassigned,
      fellowStatus: dbRow.fellowstatus,
      clubPageActivity: dbRow.clubpageactivity,
      clubPageLaunched: dbRow.clubpagelaunched,
      strike1: dbRow.strike1,
      statusOfStrike1: dbRow.statusofstrike1,
      strike2: dbRow.strike2,
      strike3: dbRow.strike3,
      email: dbRow.email,
      instagram: dbRow.instagram,
      dob: dbRow.dob,
      state: dbRow.state,
      capacity: dbRow.capacity,
      address: dbRow.address,
      tshirt: dbRow.tshirt,
      hocName: dbRow.hocname,
      hocPhone: dbRow.hocphone,
      hocEmail: dbRow.hocemail,
      hooName: dbRow.hooname,
      hooEmail: dbRow.hooemail,
      hooPhone: dbRow.hoophone,
      faName: dbRow.faname,
      faEmail: dbRow.faemail,
      faPhone: dbRow.faphone,
      photoUrl: dbRow.photourl,
      intakeStatus: dbRow.intakestatus,
      nomination: dbRow.nomination,
      nominatedFellowName: dbRow.nominatedfellowname,
      nominatedFellowNumber: dbRow.nominatedfellownumber,
      nominatedFellowEmail: dbRow.nominatedfellowemail,
      joinAlumniWhatsApp: dbRow.joinalumniwhatsapp,
      workWithUnder25: dbRow.workwithunder25,
      reasonForHandover: dbRow.reasonforhandover,
      nominatedFellowVideo: dbRow.nominatedfellowvideo,
      comments: dbRow.comments
    }));
    
    // We don't need Google Sheets fallback anymore for fellows!
    // Just mock acceptances and alumni so findAcceptanceForFellow doesn't crash, 
    // since we already merged all the data directly into the fellow object itself!
    AppState.acceptances = AppState.fellows.map(f => ({
      fullName: f.fellowName, college: f.collegeName, email: f.email, photo: f.photoUrl,
      faName: f.faName, faPhone: f.faPhone, faEmail: f.faEmail
    }));
    AppState.alumniList = AppState.fellows.map(f => ({
      college: f.collegeName, nomination: f.nomination, nominatedFellowVideo: f.nominatedFellowVideo,
      reasonForHandover: f.reasonForHandover, joinAlumniWhatsApp: f.joinAlumniWhatsApp, workWithUnder25: f.workWithUnder25
    }));
    
    AppState.pocTransfers = loadPocTransfers();
    AppState.fellowRequests = loadFellowRequests();
    
    hideLoading();
  } catch (err) {
    console.error('Error loading data:', err);
    showToast('Failed to load data', 'error');
    hideLoading();
  }
}`;

code = code.replace(oldLoadData, newLoadData);

// Now change `saveFellows()` to literally do nothing since we will save directly in the edit form
const oldSaveFellows = `function saveFellows() {
  localStorage.setItem('under25_fellows', JSON.stringify(AppState.fellows));
}`;
const newSaveFellows = `function saveFellows() {
  // Deprecated - we save directly to Supabase now
}`;
code = code.replace(oldSaveFellows, newSaveFellows);

// Update refreshDataBtn
const oldRefresh = `document.getElementById('refreshDataBtn').addEventListener('click', async () => {
  await refreshDataFromSheets();
  render();
});`;
const newRefresh = `document.getElementById('refreshDataBtn').addEventListener('click', async () => {
  await loadData();
  render();
});`;
code = code.replace(oldRefresh, newRefresh);

fs.writeFileSync('app.js', code);
console.log('App.js patched for Supabase Loading');
