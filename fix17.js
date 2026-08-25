const fs = require('fs');
let code = fs.readFileSync('app.js', 'utf8');

const missingCharts = `
function renderDonutChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) - 10;
  
  ctx.clearRect(0, 0, width, height);
  
  let total = 0;
  for(let i = 0; i < data.length; i++) {
    total += data[i].value;
  }
  
  if (total === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 15;
    ctx.stroke();
    return;
  }
  
  let startAngle = -0.5 * Math.PI;
  for(let i = 0; i < data.length; i++) {
    const item = data[i];
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.strokeStyle = item.color || '#3b82f6';
    ctx.lineWidth = 15;
    ctx.stroke();
    startAngle += sliceAngle;
  }
}

function renderLegend(elementId, data) {
  const el = document.getElementById(elementId);
  if(!el) return;
  el.innerHTML = data.map(d =>
    \`<div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#94A3B8;">\`+
    \`<div style="width:10px;height:10px;border-radius:50%;background:\${d.color};flex-shrink:0;"></div>\`+
    \`\${escapeHTML(d.label)} (\${d.value})</div>\`
  ).join('');
}

function renderBarChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 20;
  
  ctx.clearRect(0, 0, width, height);
  if(!data || !data.length) return;
  
  let maxVal = 0;
  data.forEach(d => { if(d.value > maxVal) maxVal = d.value; });
  if (maxVal === 0) maxVal = 1;
  
  const barWidth = (width - padding*2) / data.length;
  
  data.forEach((item, i) => {
    const barHeight = (item.value / maxVal) * (height - padding*2 - 20);
    const x = padding + (i * barWidth) + (barWidth * 0.1);
    const y = height - padding - barHeight;
    const w = barWidth * 0.8;
    
    ctx.fillStyle = item.color || '#3b82f6';
    ctx.beginPath();
    ctx.roundRect(x, y, w, barHeight, [4, 4, 0, 0]);
    ctx.fill();
    
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label.substring(0,5), x + w/2, height - padding + 15);
    
    ctx.fillStyle = '#F1F5F9';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(item.value, x + w/2, y - 5);
  });
}

function renderCharts() {
  if (AppState.currentView !== 'dashboard') return;
  const fellows = AppState.fellows;
  const statusColors = {
    'Active': '#10B981', 'Ghosted': '#64748B', 'On Hold': '#F59E0B',
    'Dropped Out': '#EF4444', 'Not Yet Started': '#3B82F6', 'Inactive': '#94A3B8'
  };

  const statusCounts = {};
  fellows.forEach(f => { statusCounts[f.fellowStatus] = (statusCounts[f.fellowStatus] || 0) + 1; });
  const statusData = Object.keys(statusCounts).map(s => ({ label: s, value: statusCounts[s], color: statusColors[s] || '#CBD5E1' }));
  renderDonutChart('statusChart', statusData);
  renderLegend('statusLegend', statusData);

  const activityColors = { 'Active': '#10B981', 'Inactive': '#64748B', 'Not Set Up': '#EF4444', 'Management Restraint': '#F59E0B' };
  const activityCounts = {};
  fellows.forEach(f => { const a = f.clubPageActivity || 'Not Set Up'; activityCounts[a] = (activityCounts[a] || 0) + 1; });
  const activityData = Object.keys(activityCounts).map(a => ({ label: a, value: activityCounts[a], color: activityColors[a] || '#CBD5E1' }));
  renderDonutChart('clubHealthChart', activityData);
  renderLegend('clubHealthLegend', activityData);

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
`;

if (!code.includes('function renderCharts() {')) {
  code = code + '\n' + missingCharts;
  fs.writeFileSync('app.js', code);
}
