const fs = require('fs');
let text = fs.readFileSync('app.js', 'utf8');

const regex = /<div class="ig-metric__label">Reels \(W1\)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;

const newHTML = `<div class="ig-metric__label">Reels (W1)</div>
            </div>
          </div>
          <div style="margin-top: 15px; text-align: center;">
            <button class="btn btn--sm btn--secondary" style="width:100%; justify-content:center;" onclick="handleInstagramFetch('\${f.id}', '\${f.clubPageLink}')" id="btn-ig-fetch-\${f.id}">🔄 Fetch Live Stats</button>
          </div>
        </div>
      </div>`;

text = text.replace(regex, newHTML);
fs.writeFileSync('app.js', text, 'utf8');
console.log('Added button to renderInstagram');
