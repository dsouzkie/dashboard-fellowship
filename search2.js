const fs = require('fs');
const content = fs.readFileSync('c:/Users/chris/Downloads/dash/app.js', 'utf8');

const findTEAM = content.substring(content.indexOf('const TEAM ='), content.indexOf('const TEAM_COLORS ='));
console.log(findTEAM);

const findFaf = content.indexOf('parseFAF') !== -1 || content.indexOf('parseFaf') !== -1;
console.log('Faf found?', findFaf);

const findRenderProfile = content.substring(content.indexOf('function renderFellowProfile('), content.indexOf('function renderFellowProfile(') + 2500);
console.log(findRenderProfile);

const findUrls = content.substring(content.indexOf('const FAF_SHEET_URL'), content.indexOf('const FAF_SHEET_URL') + 200);
console.log(findUrls);

