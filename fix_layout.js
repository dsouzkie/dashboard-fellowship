const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const searchStart = '<div class="card">\n          <div class="card-header"><h3 class="card-title">Fellow Status Breakdown</h3></div>';
const searchEnd = '<!-- Charts row 3 -->';

const startIndex = app.indexOf(searchStart);
const endIndex = app.indexOf(searchEnd);

if (startIndex > -1 && endIndex > -1) {
  const newHTML = `        <div class="card">
          <div class="card-header"><h3 class="card-title">Fellow Status Breakdown</h3></div>
          <div class="card-body" style="padding:16px;">
            <canvas id="statusChart" width="380" height="200"></canvas>
            <div id="statusLegend" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;justify-content:center;"></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Top Cities by Fellows</h3></div>
          <div class="card-body" style="padding:16px;">
            <div style="display:flex;flex-direction:column;gap:10px;">
              \${Object.entries(cityMap).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([c, count]) => {
                const pct = total > 0 ? Math.round((count/total)*100) : 0;
                return \\\`<div>
                  <div style="display:flex;justify-content:space-between;font-size:12px;color:#F1F5F9;margin-bottom:3px;">
                    <span>\\\${escapeHTML(c)}</span><span style="color:#64748B;">\\\${count}</span>
                  </div>
                  <div style="height:6px;background:rgba(148,163,184,0.1);border-radius:3px;overflow:hidden;">
                    <div style="height:100%;background:#3B82F6;width:\\\${pct}%"></div>
                  </div>
                </div>\\\`;
              }).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Charts row 2 -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;">
        <div class="card">
          <div class="card-header"><h3 class="card-title">POC Performance (Active vs Ghosted)</h3></div>
          <div class="card-body" style="padding:16px;">
            <div style="display:flex;flex-direction:column;gap:10px;">
              \${POCS.map(p => {
                const s = pocStats[p.name];
                const aW = s.total > 0 ? Math.round((s.active/s.total)*100) : 0;
                const gW = s.total > 0 ? Math.round((s.ghosted/s.total)*100) : 0;
                return \\\`<div>\\\`+
                  \\\`<div style="display:flex;justify-content:space-between;margin-bottom:3px;">\\\`+
                  \\\`<span style="font-size:12px;color:#F1F5F9;font-weight:600;">\\\${escapeHTML(p.name)}</span>\\\`+
                  \\\`<span style="font-size:10px;color:#64748B;">\\\${s.total} total · \\\${s.active} active · \\\${s.ghosted} ghosted</span></div>\\\`+
                  \\\`<div style="display:flex;height:12px;border-radius:6px;overflow:hidden;background:rgba(148,163,184,0.1);">\\\`+
                  \\\`<div style="width:\\\${aW}%;background:#10B981;"></div>\\\`+
                  \\\`<div style="width:\\\${gW}%;background:#64748B;"></div></div></div>\\\`;
              }).join('')}
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Club Page Health</h3></div>
          <div class="card-body" style="padding:16px;">
            <canvas id="clubHealthChart" width="380" height="180"></canvas>
            <div id="clubHealthLegend" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;justify-content:center;"></div>
          </div>
        </div>
      </div>
      
      `;

  app = app.substring(0, startIndex) + newHTML + app.substring(endIndex);
  fs.writeFileSync('app.js', app, 'utf8');
  console.log('Fixed dashboard layout perfectly.');
} else {
  console.log('Could not find start or end index.');
}
