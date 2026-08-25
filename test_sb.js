const SUPABASE_URL = 'https://ylqerlvtelexijthiuuu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YMPDWgP7LCipfPp-wId45Q_ngK5Slp0';

async function testSupabase() {
  console.log('Testing Supabase connection...');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/fellows?select=*&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log('Success! Connection works. Data:', data);
    } else {
      const text = await res.text();
      console.error('Error connecting:', res.status, text);
    }
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}

testSupabase();
