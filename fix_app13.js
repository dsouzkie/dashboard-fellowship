const fs = require('fs');
let text = fs.readFileSync('app.js', 'utf8');

const updatedApiConfig = `
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
    console.warn('Direct fetch failed (likely CORS). Trying via proxy...', error);
    try {
      const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);
      const proxyResponse = await fetch(proxyUrl, options);
      if (!proxyResponse.ok) throw new Error('Proxy API Error');
      const json = await proxyResponse.json();
      if (json && json.data) {
        return {
          followers: json.data.followers || 0,
          posts: json.data.medias || 0,
          following: json.data.following || 0
        };
      }
      return null;
    } catch (proxyError) {
      console.error('Proxy fetch also failed:', proxyError);
      return null;
    }
  }
}
`;

text = text.replace(/\/\/ =============================================\r?\n\/\/ SECTION 1\.6: RAPIDAPI CONFIGURATION[\s\S]*?async function fetchLiveInstagramStats[\s\S]*?}\r?\n\r?\n/m, updatedApiConfig + '\n');

fs.writeFileSync('app.js', text, 'utf8');
console.log('Successfully updated RapidAPI config with CORS proxy fallback');
