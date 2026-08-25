const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const badHtml = `<div class="profile-detail-row">
                  
                <div class="profile-detail-row">
                  
                <div class="profile-detail-row">
                  <div class="profile-detail-label">WhatsApp Group Added</div>
                  
                </div>
                <div class="profile-detail-row">
                  
                <div class="profile-detail-row">
                  
              </div>
            </div>
          </div>`;

const goodHtml = `              </div>
            </div>
          </div>`;

app = app.replace(badHtml, goodHtml);

fs.writeFileSync('app.js', app);
