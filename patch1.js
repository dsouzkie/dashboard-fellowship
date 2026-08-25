const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(/const FIELD_KEYS = \[[\s\S]*?\];/, `const FIELD_KEYS = [
  'intakeStatus', 'collegeName', 'fellowName', 'whatsappNo', 'city', 'pocAssigned', 'team',
  'emailId', 'clubPageActivity', 'whereTheyComeFrom', 'finalAcceptance', 'clubPageLink',
  'followersCount', 'fellowStatus', 'clubMade', 'clubPageLaunched', 'firstReelPosted',
  'reelsPostedWeek1', 'reelsIn7Days7Posts', 'reelsPostedWeek2', 'whatsappGroupAdded', 'mtf',
  'contentPiecesPosted', 'clubRecruitmentCampaign', 'comments',
  'strike1', 'statusOfStrike1', 'strike2', 'statusOfStrike2', 'strike3',
  'manualHocName', 'manualHocEmail', 'manualHocPhone',
  'manualHooName', 'manualHooEmail', 'manualHooPhone',
  'manualFaName', 'manualFaEmail', 'manualFaPhone',
  'dob', 'tshirt', 'address'
];`);

app = app.replace(/manualFaPhone: 'FA Phone \(Manual\)'/, `manualFaPhone: 'FA Phone (Manual)',
  dob: 'Date of Birth (FAF)',
  tshirt: 'T-Shirt Size (FAF)',
  address: 'Address (FAF)'`);

fs.writeFileSync('app.js', app);
console.log('Patched fields');
