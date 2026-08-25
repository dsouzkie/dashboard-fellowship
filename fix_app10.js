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

text = text.replace('// =============================================\n// SECTION 2:', apiConfigInjection + '// =============================================\n// SECTION 2:');

// Now add the button in renderFellowProfile
const profileClubPageRegex = /<div style="font-size:12px; color:#94A3B8; margin-bottom:5px;">Followers<\/div>\s*<div style="font-size:20px; font-weight:700; color:#F1F5F9;">([^<]+)<\/div>/;

const newProfileClubPage = `<div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <div style="font-size:12px; color:#94A3B8; margin-bottom:5px;">Followers</div>
                      <div style="font-size:20px; font-weight:700; color:#F1F5F9;">$1</div>
                    </div>
                    <button class="btn btn--sm btn--secondary" onclick="handleInstagramFetch('\${fellow.id}', '\${clubUrl}')" id="btn-ig-fetch-\${fellow.id}">🔄 Fetch Live</button>
                  </div>`;

text = text.replace(profileClubPageRegex, newProfileClubPage);

// Add the global handleInstagramFetch function
const handleIgFunction = `
window.handleInstagramFetch = async function(fellowId, clubUrl) {
  if (!clubUrl || clubUrl.trim() === '') {
    showToast('No valid Instagram URL found', 'error');
    return;
  }
  
  // Extract username
  let username = '';
  if (clubUrl.includes('instagram.com/')) {
    try {
      const urlObj = new URL(clubUrl.startsWith('http') ? clubUrl : 'https://' + clubUrl);
      username = urlObj.pathname.replace(/^\\/|\\/$/g, '').split('/')[0];
    } catch(e) {}
  } else if (clubUrl.startsWith('@')) {
    username = clubUrl.substring(1);
  } else {
    username = clubUrl;
  }
  
  if (!username) {
    showToast('Could not parse Instagram username', 'error');
    return;
  }
  
  const btn = document.getElementById('btn-ig-fetch-' + fellowId);
  if (btn) {
    btn.innerHTML = '⏳ Fetching...';
    btn.disabled = true;
  }
  
  showToast('Fetching live stats for @' + username + '...', 'info');
  
  const stats = await fetchLiveInstagramStats(username);
  
  if (stats) {
    showToast('Success! ' + stats.followers + ' followers found.', 'success');
    updateFellow(fellowId, 'followersCount', stats.followers);
    updateFellow(fellowId, 'contentPiecesPosted', stats.posts);
    
    // The UI will re-render automatically, closing the modal or updating it.
    // If the modal was closed by render(), we can optionally re-open it:
    setTimeout(() => {
       renderFellowProfile(fellowId);
    }, 100);
  } else {
    showToast('Failed to fetch Instagram stats. They may be private or invalid.', 'error');
    if (btn) {
      btn.innerHTML = '🔄 Fetch Live';
      btn.disabled = false;
    }
  }
};
`;

text = text.replace('function renderFellowProfile(fellowId) {', handleIgFunction + '\nfunction renderFellowProfile(fellowId) {');


fs.writeFileSync('app.js', text, 'utf8');
console.log('Successfully injected RapidAPI Instagram integration');
