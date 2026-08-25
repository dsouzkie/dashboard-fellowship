const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// ============================================================
// 1. Replace renderDashboard() with the new mega dashboard
// ============================================================

const oldRenderDashboard = app.substring(
  app.indexOf('function renderDashboard()'),
  app.indexOf('function getFilteredFellows(')
);

const newRenderDashboard = `function renderDashboard() {
  const fellows = AppState.fellows;
  const user = AppState.currentUser;
  const isAdmin = user && user.isAdmin;
  const POCS = TEAM.filter(t => !t.isAdmin);

  // ---- All Fellows Stats ----
  const total = fellows.length;
  const active = fellows.filter(f => f.fellowStatus === 'Active').length;
  const ghosted = fellows.filter(f => f.fellowStatus === 'Ghosted').length;
  const onHold = fellows.filter(f => f.fellowStatus === 'On Hold').length;
  const dropped = fellows.filter(f => f.fellowStatus === 'Dropped Out').length;
  const nys = fellows.filter(f => f.fellowStatus === 'Not Yet Started').length;
  const withStrikes = fellows.filter(f => f._autoStrikes && f._autoStrikes.length > 0).length;
  const twoStrikes = fellows.filter(f => f._autoStrikes && f._autoStrikes.length >= 2).length;
  const pageActive = fellows.filter(f => f.clubPageActivity === 'Active').length;
  const pageNotSetup = fellows.filter(f => f.clubPageActivity === 'Not Set Up').length;
  const accepted = fellows.filter(f => f.finalAcceptance === 'Yes').length;

  // ---- City Distribution ----
  const cityMap = {};
  fellows.forEach(f => {
    const city = (f.city || 'Unknown').trim();
    cityMap[city] = (cityMap[city] || 0) + 1;
  });
  const topCities = Object.entries(cityMap).sort((a,b)=>b[1]-a[1]).slice(0,10);

  // ---- POC Performance (exclude admins) ----
  const pocStats = {};
  POCS.forEach(p => { pocStats[p.name] = { total: 0, active: 0, ghosted: 0, strikes: 0, color: p.color }; });
  fellows.forEach(f => {
    if (pocStats[f.pocAssigned]) {
      pocStats[f.pocAssigned].total++;
      if (f.fellowStatus === 'Active') pocStats[f.pocAssigned].active++;
      if (f.fellowStatus === 'Ghosted') pocStats[f.pocAssigned].ghosted++;
      if (f._autoStrikes && f._autoStrikes.length > 0) pocStats[f.pocAssigned].strikes++;
    }
  });

  // ---- Inferences ----
  const mostActiveCity = topCities[0] ? topCities[0][0] : 'N/A';
  const mostGhostedPOC = POCS.map(p => ({ name: p.name, ghosted: pocStats[p.name]?.ghosted || 0 }))
    .sort((a,b)=>b.ghosted-a.ghosted)[0]?.name || 'N/A';
  const topFollowerFellow = fellows.filter(f => parseInt(f.followersCount) > 0)
    .sort((a,b) => parseInt(b.followersCount||0) - parseInt(a.followersCount||0))[0];
  const atRiskFellows = fellows.filter(f => f._autoStrikes && f._autoStrikes.length >= 2);
  const launchRate = total > 0 ? Math.round((fellows.filter(f=>f.clubPageLaunched==='Yes').length/total)*100) : 0;
  const perfectPOCs = POCS.filter(p => pocStats[p.name].total > 0 && pocStats[p.name].ghosted === 0).map(p=>p.name);

  // ---- My Fellows Stats (if not admin) ----
  const myFellows = isAdmin ? [] : fellows.filter(f => f.pocAssigned === user.name);
  const myTotal = myFellows.length;
  const myActive = myFellows.filter(f => f.fellowStatus === 'Active').length;
  const myGhosted = myFellows.filter(f => f.fellowStatus === 'Ghosted').length;
  const myStrikes = myFellows.filter(f => f._autoStrikes && f._autoStrikes.length > 0).length;
  const myLaunched = myFellows.filter(f => f.clubPageLaunched === 'Yes').length;
  const myActiveRate = myTotal > 0 ? Math.round((myActive/myTotal)*100) : 0;
  const allActiveRate = total > 0 ? Math.round((active/total)*100) : 0;

  // ---- Recent Activity ----
  const recentChanges = AppState.changeLog.slice(0, 5).map(log => {
    const fellow = fellows.find(f => f.id === log.fellowId);
    const fname = fellow ? fellow.fellowName : 'Unknown';
    const fieldLabel = FIELD_LABELS[log.field] || log.field;
    return \`
      <div style="padding:12px; border-bottom:1px solid rgba(148,163,184,0.1); font-size:0.85rem; display:flex; gap:12px; align-items:flex-start;">
        <div style="width:32px; height:32px; border-radius:50%; background:\${AppState.changeLog.find(c=>c.user===log.user) ? TEAM.find(t=>t.name===log.user)?.color||'#7C3AED' : '#7C3AED'}; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:800; color:white; flex-shrink:0;">\${log.user[0]}</div>
        <div>
          <span style="color:#F1F5F9;font-weight:600;">\${escapeHTML(log.user)}</span> updated <em style="color:#A78BFA;">\${escapeHTML(fname)}</em>'s <strong style="color:#94A3B8;">\${escapeHTML(fieldLabel)}</strong>
          <div style="margin-top:4px;"><span style="color:#EF4444;text-decoration:line-through;">\${escapeHTML(log.oldValue||'empty')}</span> → <span style="color:#10B981;">\${escapeHTML(log.newValue||'empty')}</span></div>
          <div style="font-size:0.75rem; color:#64748B; margin-top:2px;">\${new Date(log.timestamp).toLocaleString()}</div>
        </div>
      </div>
    \`;
  }).join('');

  return \`
    <div class="fade-in" style="padding-bottom:40px;">
      <!-- ============ ALL FELLOWS SECTION ============ -->
      <header class="page-header" style="margin-bottom:24px;">
        <div>
          <h1 class="page-title">📊 All Fellows Overview</h1>
          <p class="page-subtitle">Live metrics across all \${total} fellows · Updates automatically</p>
        </div>
      </header>

      <!-- Stat Cards Row 1 -->
      <div style="display:grid; grid-template-columns:repeat(6,1fr); gap:12px; margin-bottom:20px;">
        \${miniStatCard('👥', total, 'Total', '#7C3AED')}
        \${miniStatCard('✅', active, 'Active', '#10B981')}
        \${miniStatCard('👻', ghosted, 'Ghosted', '#64748B')}
        \${miniStatCard('⏸️', onHold, 'On Hold', '#F59E0B')}
        \${miniStatCard('❌', dropped, 'Dropped', '#EF4444')}
        \${miniStatCard('🆕', nys, 'Not Started', '#3B82F6')}
      </div>

      <!-- Inference / Insight Cards -->
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:24px;">
        \${insightCard('🔥', 'Most Fellows From', mostActiveCity, cityMap[mostActiveCity] + ' fellows', '#F59E0B')}
        \${insightCard('⚠️', 'Most Ghosted POC', mostGhostedPOC, pocStats[mostGhostedPOC]?.ghosted + ' ghosted', '#EF4444')}
        \${insightCard('📸', 'Top IG Club', topFollowerFellow ? topFollowerFellow.collegeName : 'N/A', topFollowerFellow ? parseInt(topFollowerFellow.followersCount||0).toLocaleString() + ' followers' : 'No data', '#EC4899')}
        \${insightCard('🚨', 'At Risk (2 Strikes)', twoStrikes + ' fellows', 'Need immediate attention', '#EF4444')}
        \${insightCard('🚀', 'Pages Launched', launchRate + '%', fellows.filter(f=>f.clubPageLaunched==='Yes').length + ' of ' + total + ' clubs', '#10B981')}
        \${insightCard('🏆', 'Zero Ghost POCs', perfectPOCs.length > 0 ? perfectPOCs.join(', ') : 'None yet', '100% active rate', '#7C3AED')}
      </div>

      <!-- Charts Grid -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
        <!-- Status Donut -->
        <div class="card">
          <div class="card-header"><h3 class="card-title">Fellow Status Breakdown</h3></div>
          <div class="card-body" style="padding:16px;">
            <canvas id="statusChart" width="380" height="220"></canvas>
            <div id="statusLegend" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; justify-content:center;"></div>
          </div>
        </div>

        <!-- City Bar -->
        <div class="card">
          <div class="card-header"><h3 class="card-title">Top Cities by Fellows</h3></div>
          <div class="card-body" style="padding:16px;">
            <div id="cityBars" style="display:flex; flex-direction:column; gap:8px;">
              \${topCities.map(([city, count]) => \`
                <div style="display:flex; align-items:center; gap:10px;">
                  <div style="width:110px; font-size:12px; color:#94A3B8; text-align:right; flex-shrink:0;">\${escapeHTML(city)}</div>
                  <div style="flex:1; background:rgba(148,163,184,0.1); border-radius:4px; height:22px; overflow:hidden;">
                    <div style="width:\${Math.round((count/topCities[0][1])*100)}%; background:linear-gradient(90deg, #7C3AED, #3B82F6); height:100%; border-radius:4px; display:flex; align-items:center; justify-content:flex-end; padding-right:8px; font-size:11px; color:white; font-weight:700;">\${count}</div>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
        <!-- POC Performance Grouped -->
        <div class="card">
          <div class="card-header"><h3 class="card-title">POC Performance (Active vs Ghosted)</h3></div>
          <div class="card-body" style="padding:16px;">
            <div style="display:flex; flex-direction:column; gap:10px;">
              \${POCS.map(p => {
                const s = pocStats[p.name];
                const activeW = s.total > 0 ? Math.round((s.active/s.total)*100) : 0;
                const ghostW = s.total > 0 ? Math.round((s.ghosted/s.total)*100) : 0;
                return \`
                  <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                      <span style="font-size:12px; color:#F1F5F9; font-weight:600;">\${p.name}</span>
                      <span style="font-size:11px; color:#64748B;">\${s.total} fellows · \${s.active} active · \${s.ghosted} ghosted</span>
                    </div>
                    <div style="display:flex; height:14px; border-radius:7px; overflow:hidden; background:rgba(148,163,184,0.1);">
                      <div style="width:\${activeW}%; background:#10B981;"></div>
                      <div style="width:\${ghostW}%; background:#64748B;"></div>
                    </div>
                  </div>
                \`;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Club Page Health -->
        <div class="card">
          <div class="card-header"><h3 class="card-title">Club Page Health</h3></div>
          <div class="card-body" style="padding:16px;">
            <canvas id="clubHealthChart" width="380" height="180"></canvas>
            <div id="clubHealthLegend" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; justify-content:center;"></div>
          </div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px;">
        <!-- Milestone Completion -->
        <div class="card">
          <div class="card-header"><h3 class="card-title">Milestone Completion Rates</h3></div>
          <div class="card-body" style="padding:16px;">
            <div style="display:flex; flex-direction:column; gap:10px;">
              \${[
                { label: 'Club Made', field: 'clubMade' },
                { label: 'Page Launched', field: 'clubPageLaunched' },
                { label: 'First Reel Posted', field: 'firstReelPosted' },
                { label: 'WhatsApp Group', field: 'whatsappGroupAdded' },
                { label: 'Final Acceptance', field: 'finalAcceptance' },
                { label: 'MTF', field: 'mtf' }
              ].map(m => {
                const count = fellows.filter(f => f[m.field] === 'Yes').length;
                const pct = total > 0 ? Math.round((count/total)*100) : 0;
                const color = pct >= 75 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444';
                return \`
                  <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:120px; font-size:12px; color:#94A3B8; flex-shrink:0;">\${m.label}</div>
                    <div style="flex:1; background:rgba(148,163,184,0.1); border-radius:4px; height:18px; overflow:hidden;">
                      <div style="width:\${pct}%; background:\${color}; height:100%; border-radius:4px; display:flex; align-items:center; padding-left:6px; font-size:10px; color:white; font-weight:700; transition:width 0.5s ease;">\${pct}%</div>
                    </div>
                    <div style="font-size:11px; color:#64748B; width:50px;">\${count}/\${total}</div>
                  </div>
                \`;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header"><h3 class="card-title">Recent Activity</h3></div>
          <div class="card-body" style="padding:0; max-height:280px; overflow-y:auto;">
            \${recentChanges || '<div style="padding:20px; text-align:center; color:#94A3B8;">No recent activity</div>'}
          </div>
        </div>
      </div>

      \${!isAdmin ? \`
      <!-- ============ MY FELLOWS SECTION ============ -->
      <div style="border-top:2px solid rgba(124,58,237,0.3); padding-top:32px; margin-top:8px;">
        <header style="margin-bottom:24px;">
          <h2 style="font-size:1.5rem; font-weight:800; color:#F1F5F9; margin:0;">👤 My Fellows — \${user.name}</h2>
          <p style="color:#64748B; margin-top:4px; font-size:0.9rem;">Your personal performance metrics</p>
        </header>

        <!-- My stat cards -->
        <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-bottom:20px;">
          \${miniStatCard('👥', myTotal, 'My Total', '#7C3AED')}
          \${miniStatCard('✅', myActive, 'My Active', '#10B981')}
          \${miniStatCard('👻', myGhosted, 'My Ghosted', '#64748B')}
          \${miniStatCard('⚡', myStrikes, 'With Strikes', '#F59E0B')}
          \${miniStatCard('🚀', myLaunched, 'Pages Launched', '#3B82F6')}
        </div>

        <!-- My rate vs team -->
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
          <div class="card">
            <div class="card-header"><h3 class="card-title">My Active Rate vs Team Avg</h3></div>
            <div class="card-body" style="padding:16px;">
              <div style="display:flex; flex-direction:column; gap:12px;">
                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span style="font-size:13px; color:#F1F5F9; font-weight:600;">My Rate</span>
                    <span style="font-size:13px; color:#10B981; font-weight:700;">\${myActiveRate}%</span>
                  </div>
                  <div style="background:rgba(148,163,184,0.1); border-radius:6px; height:20px; overflow:hidden;">
                    <div style="width:\${myActiveRate}%; background:\${myActiveRate >= allActiveRate ? '#10B981' : '#F59E0B'}; height:100%; border-radius:6px; transition:width 0.6s;"></div>
                  </div>
                </div>
                <div>
                  <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                    <span style="font-size:13px; color:#94A3B8;">Team Average</span>
                    <span style="font-size:13px; color:#94A3B8; font-weight:700;">\${allActiveRate}%</span>
                  </div>
                  <div style="background:rgba(148,163,184,0.1); border-radius:6px; height:20px; overflow:hidden;">
                    <div style="width:\${allActiveRate}%; background:#7C3AED; height:100%; border-radius:6px;"></div>
                  </div>
                </div>
                <div style="text-align:center; padding:8px; border-radius:8px; background:\${myActiveRate >= allActiveRate ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)'}; font-size:13px; color:\${myActiveRate >= allActiveRate ? '#10B981' : '#F59E0B'}; font-weight:600;">
                  \${myActiveRate >= allActiveRate ? '🏆 Above team average!' : '📈 Room to improve'}
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3 class="card-title">My Fellows Status</h3></div>
            <div class="card-body" style="padding:16px;">
              <canvas id="myStatusChart" width="300" height="180"></canvas>
              <div id="myStatusLegend" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; justify-content:center;"></div>
            </div>
          </div>
        </div>

        <!-- My fellows needing attention -->
        \${myFellows.filter(f => f.fellowStatus === 'Ghosted' || f.fellowStatus === 'On Hold' || (f._autoStrikes && f._autoStrikes.length >= 2)).length > 0 ? \`
        <div class="card" style="border:1px solid rgba(239,68,68,0.3); margin-bottom:16px;">
          <div class="card-header" style="background:rgba(239,68,68,0.05);">
            <h3 class="card-title" style="color:#EF4444;">🚨 Fellows Needing Attention</h3>
          </div>
          <div class="card-body" style="padding:12px;">
            <div style="display:flex; flex-direction:column; gap:8px;">
              \${myFellows.filter(f => f.fellowStatus === 'Ghosted' || f.fellowStatus === 'On Hold' || (f._autoStrikes && f._autoStrikes.length >= 2)).map(f => \`
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:rgba(239,68,68,0.05); border-radius:8px; cursor:pointer;" onclick="renderFellowProfile('\${f.id}')">
                  <div>
                    <div style="font-size:13px; color:#F1F5F9; font-weight:600;">\${escapeHTML(f.fellowName)}</div>
                    <div style="font-size:11px; color:#64748B;">\${escapeHTML(f.collegeName)}</div>
                  </div>
                  <div style="display:flex; gap:6px;">
                    \${f.fellowStatus === 'Ghosted' ? '<span style="background:rgba(100,116,139,0.2); color:#94A3B8; padding:3px 8px; border-radius:4px; font-size:11px;">Ghosted</span>' : ''}
                    \${f.fellowStatus === 'On Hold' ? '<span style="background:rgba(245,158,11,0.2); color:#F59E0B; padding:3px 8px; border-radius:4px; font-size:11px;">On Hold</span>' : ''}
                    \${f._autoStrikes && f._autoStrikes.length >= 2 ? '<span style="background:rgba(239,68,68,0.2); color:#EF4444; padding:3px 8px; border-radius:4px; font-size:11px;">2 Strikes</span>' : ''}
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>
        </div>
        \` : '<div class="card" style="border:1px solid rgba(16,185,129,0.3); margin-bottom:16px;"><div class="card-body" style="text-align:center; padding:20px; color:#10B981; font-weight:600;">🎉 All your fellows are in good standing!</div></div>'}
      </div>
      \` : ''}
    </div>
  \`;
}

function miniStatCard(icon, value, label, color) {
  return \`
    <div class="card" style="text-align:center; padding:16px 8px; border-top:3px solid \${color};">
      <div style="font-size:1.5rem;">\${icon}</div>
      <div style="font-size:1.8rem; font-weight:800; color:\${color}; line-height:1.2;">\${value}</div>
      <div style="font-size:11px; color:#64748B; margin-top:2px; text-transform:uppercase; letter-spacing:0.5px;">\${label}</div>
    </div>
  \`;
}

function insightCard(icon, title, value, sub, color) {
  return \`
    <div class="card" style="padding:16px; display:flex; gap:14px; align-items:center;">
      <div style="width:44px; height:44px; border-radius:12px; background:\${color}20; display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0;">\${icon}</div>
      <div style="min-width:0;">
        <div style="font-size:11px; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:2px;">\${title}</div>
        <div style="font-size:14px; font-weight:700; color:#F1F5F9; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">\${escapeHTML(String(value))}</div>
        <div style="font-size:11px; color:\${color}; margin-top:1px;">\${escapeHTML(String(sub))}</div>
      </div>
    </div>
  \`;
}

`;

app = app.replace(oldRenderDashboard, newRenderDashboard);

// ============================================================
// 2. Replace renderCharts() with the new chart rendering
// ============================================================
const oldRenderCharts = app.substring(
  app.indexOf('function renderCharts()'),
  app.indexOf('// =============================================\n// SECTION 7:')
);

const newRenderCharts = `function renderCharts() {
  if (AppState.currentView !== 'dashboard') return;
  const fellows = AppState.fellows;
  const POCS = TEAM.filter(t => !t.isAdmin);

  // ---- Status Donut ----
  const statusColors = {
    'Active': '#10B981', 'Ghosted': '#64748B', 'On Hold': '#F59E0B',
    'Dropped Out': '#EF4444', 'Not Yet Started': '#3B82F6', 'Inactive': '#94A3B8'
  };
  const statusCounts = {};
  fellows.forEach(f => { statusCounts[f.fellowStatus] = (statusCounts[f.fellowStatus] || 0) + 1; });
  const statusData = Object.keys(statusCounts).map(s => ({ label: s, value: statusCounts[s], color: statusColors[s] || '#CBD5E1' }));
  renderDonutChart('statusChart', statusData);
  renderLegend('statusLegend', statusData);

  // ---- Club Health Donut ----
  const activityColors = { 'Active': '#10B981', 'Inactive': '#64748B', 'Not Set Up': '#EF4444', 'Management Restraint': '#F59E0B' };
  const activityCounts = {};
  fellows.forEach(f => { activityCounts[f.clubPageActivity || 'Not Set Up'] = (activityCounts[f.clubPageActivity || 'Not Set Up'] || 0) + 1; });
  const activityData = Object.keys(activityCounts).map(a => ({ label: a, value: activityCounts[a], color: activityColors[a] || '#CBD5E1' }));
  renderDonutChart('clubHealthChart', activityData);
  renderLegend('clubHealthLegend', activityData);

  // ---- My Fellows Status Donut (if visible) ----
  const user = AppState.currentUser;
  if (user && !user.isAdmin) {
    const myFellows = fellows.filter(f => f.pocAssigned === user.name);
    const myStatusCounts = {};
    myFellows.forEach(f => { myStatusCounts[f.fellowStatus] = (myStatusCounts[f.fellowStatus] || 0) + 1; });
    const myStatusData = Object.keys(myStatusCounts).map(s => ({ label: s, value: myStatusCounts[s], color: statusColors[s] || '#CBD5E1' }));
    renderDonutChart('myStatusChart', myStatusData);
    renderLegend('myStatusLegend', myStatusData);
  }
}

function renderDonutChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const outerR = Math.min(cx, cy) - 10;
  const innerR = outerR * 0.55;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  ctx.clearRect(0, 0, W, H);
  let angle = -Math.PI / 2;
  data.forEach(item => {
    const slice = (item.value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, angle, angle + slice);
    ctx.arc(cx, cy, innerR, angle + slice, angle, true);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();
    angle += slice;
  });
  // Center label
  ctx.fillStyle = '#F1F5F9';
  ctx.font = 'bold 22px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(total, cx, cy - 8);
  ctx.font = '11px Inter, sans-serif';
  ctx.fillStyle = '#64748B';
  ctx.fillText('total', cx, cy + 12);
}

function renderLegend(containerId, data) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = data.map(d => \`
    <div style="display:flex; align-items:center; gap:5px; font-size:11px; color:#94A3B8;">
      <div style="width:10px; height:10px; border-radius:50%; background:\${d.color}; flex-shrink:0;"></div>
      \${escapeHTML(d.label)} (\${d.value})
    </div>
  \`).join('');
}

`;

app = app.replace(oldRenderCharts, newRenderCharts);

fs.writeFileSync('app.js', app, 'utf8');
console.log('Dashboard rebuilt successfully!');
