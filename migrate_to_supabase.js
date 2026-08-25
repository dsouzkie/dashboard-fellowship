const fs = require('fs');

const SUPABASE_URL = 'https://ylqerlvtelexijthiuuu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YMPDWgP7LCipfPp-wId45Q_ngK5Slp0';

const TRACKER_URL = 'https://docs.google.com/spreadsheets/d/10BSyslWloYekTr5UEkVeUCgBv94iuLmMwZIyjD9Xto4/gviz/tq?tqx=out:csv&sheet=Tracker';
const FAF_URL = 'https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=FAF';
const NOMINATION_URL = 'https://docs.google.com/spreadsheets/d/1BI30JqQ9qmPNF-noX1sFRdQ9R7Zemd3Sc5c3eAuoZ5k/gviz/tq?tqx=out:csv&sheet=nomination';

const FIELD_KEYS = ['timestamp', 'collegeName', 'fellowName', 'city', 'pocAssigned', 'fellowStatus', 'clubPageActivity', 'clubPageLaunched', 'strike1', 'statusOfStrike1', 'strike2', 'strike3'];

function basicCSVParse(csvText) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];
    if (char === '"' && insideQuotes && nextChar === '"') {
      currentCell += '"'; i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim()); currentCell = '';
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuotes) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c !== '')) rows.push(currentRow);
      currentRow = []; currentCell = '';
      if (char === '\r') i++;
    } else {
      currentCell += char;
    }
  }
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c !== '')) rows.push(currentRow);
  }
  return rows;
}

function findAcceptanceForFellow(fName, fCollege, fEmail, fPhone, acceptances) {
  if (!acceptances || !acceptances.length) return null;
  fName = (fName || '').toLowerCase().trim();
  fCollege = (fCollege || '').toLowerCase().trim();
  fEmail = (fEmail || '').toLowerCase().trim();
  fPhone = String(fPhone || '').replace(/\D/g, '');
  
  return acceptances.find(a => {
    const fafName = (a.faName_cmp || '').toLowerCase().trim(); // actually a.fullName is index 3
    const fafCollege = (a.faCollege_cmp || '').toLowerCase().trim(); // index 1
    const fafEmail = (a.faEmail_cmp || '').toLowerCase().trim(); // index 8
    const fafPhone = String(a.faPhone_cmp || '').replace(/\D/g, ''); // index 4
    
    if (fName && fafName && fCollege && fafCollege) {
      if (fName === fafName && fCollege === fafCollege) return true;
      const nameMatch = fName.includes(fafName) || fafName.includes(fName);
      if (nameMatch && (fCollege.includes(fafCollege) || fafCollege.includes(fCollege))) return true;
      if (fName === fafName && fName.length > 5) return true;
    }
    if (fEmail && fafEmail && fEmail === fafEmail) return true;
    if (fPhone && fafPhone && fPhone.length >= 10 && fafPhone.includes(fPhone.slice(-10))) return true;
    return false;
  }) || null;
}

async function run() {
  console.log('Fetching Google Sheets...');
  const [tRes, fRes, nRes] = await Promise.all([
    fetch(TRACKER_URL), fetch(FAF_URL), fetch(NOMINATION_URL)
  ]);
  
  const tText = await tRes.text();
  const fText = await fRes.text();
  const nText = await nRes.text();
  
  console.log('Parsing Tracker...');
  const tRows = basicCSVParse(tText);
  const fellows = [];
  for (let i = 1; i < tRows.length; i++) {
    const row = tRows[i];
    if (!row[1]) continue;
    const fellowName = (row[2] || '').trim();
    if (!fellowName || fellowName.toLowerCase() === 'no fellow' || fellowName === '?') continue;
    
    const fellow = {};
    FIELD_KEYS.forEach((k, idx) => fellow[k] = row[idx] || '');
    fellow.id = 'f_' + Date.now() + '_' + i;
    
    // Intake status calculation
    fellow.intakeStatus = 'Existing';
    if (fellow.timestamp) {
      const parts = fellow.timestamp.split('/');
      if (parts.length >= 2) {
        const month = parseInt(parts[1], 10);
        if (month >= 8) fellow.intakeStatus = 'August Intake';
      }
    }
    
    fellows.push(fellow);
  }
  
  console.log('Parsing FAF...');
  const fRows = basicCSVParse(fText);
  const acceptances = [];
  for (let i = 1; i < fRows.length; i++) {
    const row = fRows[i];
    if (!row[3] || row[3].trim() === '' || row[3].trim().toLowerCase() === 'no fellow') continue;
    acceptances.push({
      faCollege_cmp: row[1],
      faName_cmp: row[3],
      faPhone_cmp: row[4],
      faEmail_cmp: row[8],
      
      collegeName: row[1] || '',
      city: row[2] || '',
      fellowName: row[3] || '',
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
      photoUrl: row[30] || ''
    });
  }
  
  console.log('Parsing Nominations...');
  const nRows = basicCSVParse(nText);
  const alumniList = [];
  for (let i = 1; i < nRows.length; i++) {
    const row = nRows[i];
    if (!row[1]) continue;
    alumniList.push({
      alCollege_cmp: row[1],
      
      nomination: row[12] || '',
      nominatedFellowName: row[13] || '',
      nominatedFellowNumber: row[14] || '',
      nominatedFellowEmail: row[15] || '',
      joinAlumniWhatsApp: row[18] || '',
      workWithUnder25: row[19] || '',
      reasonForHandover: row[10] || '',
      nominatedFellowVideo: row[16] || ''
    });
  }
  
  console.log('Merging Data...');
  const mergedData = fellows.map(f => {
    const acc = findAcceptanceForFellow(f.fellowName, f.collegeName, '', '', acceptances);
    const alu = alumniList.find(a => {
       const ac = (a.alCollege_cmp || '').toLowerCase().trim();
       const fc = (f.collegeName || '').toLowerCase().trim();
       return ac && fc && (ac.includes(fc) || fc.includes(ac));
    });
    
    return {
      id: f.id,
      fellowname: acc ? acc.fellowName : f.fellowName,
      collegename: acc ? acc.collegeName : f.collegeName,
      city: acc ? acc.city : f.city,
      pocassigned: f.pocAssigned,
      fellowstatus: f.fellowStatus,
      clubpageactivity: f.clubPageActivity,
      clubpagelaunched: f.clubPageLaunched,
      strike1: f.strike1,
      statusofstrike1: f.statusOfStrike1,
      strike2: f.strike2,
      strike3: f.strike3,
      
      email: acc ? acc.email : '',
      instagram: acc ? acc.instagram : '',
      dob: acc ? acc.dob : '',
      state: acc ? acc.state : '',
      capacity: acc ? acc.capacity : '',
      address: acc ? acc.address : '',
      tshirt: acc ? acc.tshirt : '',
      hocname: acc ? acc.hocName : '',
      hocphone: acc ? acc.hocPhone : '',
      hocemail: acc ? acc.hocEmail : '',
      hooname: acc ? acc.hooName : '',
      hooemail: acc ? acc.hooEmail : '',
      hoophone: acc ? acc.hooPhone : '',
      faname: acc ? acc.faName : '',
      faemail: acc ? acc.faEmail : '',
      faphone: acc ? acc.faPhone : '',
      photourl: acc ? acc.photoUrl : '',
      intakestatus: f.intakeStatus,
      
      nomination: alu ? alu.nomination : '',
      nominatedfellowname: alu ? alu.nominatedFellowName : '',
      nominatedfellownumber: alu ? alu.nominatedFellowNumber : '',
      nominatedfellowemail: alu ? alu.nominatedFellowEmail : '',
      joinalumniwhatsapp: alu ? alu.joinAlumniWhatsApp : '',
      workwithunder25: alu ? alu.workWithUnder25 : '',
      reasonforhandover: alu ? alu.reasonForHandover : '',
      nominatedfellowvideo: alu ? alu.nominatedFellowVideo : '',
      comments: ''
    };
  });
  
  console.log(`Ready to insert ${mergedData.length} records to Supabase.`);
  
  // Insert in batches
  const batchSize = 100;
  for (let i = 0; i < mergedData.length; i += batchSize) {
    const batch = mergedData.slice(i, i + batchSize);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/fellows`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(batch)
    });
    
    if (res.ok) {
      console.log(`Inserted batch ${i / batchSize + 1}`);
    } else {
      console.error(`Failed batch ${i / batchSize + 1}:`, res.status, await res.text());
    }
  }
  
  console.log('Migration Complete!');
}

run();
