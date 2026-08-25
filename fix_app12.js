const fs = require('fs');
let text = fs.readFileSync('app.js', 'utf8');

const apiConfigInjection = `
// =============================================
// SECTION 1.6: RAPIDAPI CONFIGURATION
// =============================================
const RAPIDAPI_KEY = '23dd73c72amshdf8f07e20d00698p11757ejsnbc029be99b6b';
const RAPIDAPI_HOST = 'instagram-scraper.p.rapidapi.com';

async function fetchLiveInstagramStats(username) {
  const url = \`https://\${RAPIDAPI_HOST}/scrapper/api/v1/instagram/profile/\${username}\`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-host': RAPIDAPI_HOST,
      'x-rapidapi-key': RAPIDAPI_KEY
    }
  };
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('API Error');
    const json = await response.json();
    if (json && json.data) {
      return {
        followers: json.data.followers || 0,
        posts: json.data.medias || 0,
        following: json.data.following || 0
      };
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

`;

text = text.replace(/\/\/ =============================================\r?\n\/\/ SECTION 2: STATE MANAGEMENT/, apiConfigInjection + '// =============================================\n// SECTION 2: STATE MANAGEMENT');

fs.writeFileSync('app.js', text, 'utf8');
console.log('Successfully injected missing RapidAPI config block');
