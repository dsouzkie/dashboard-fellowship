const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const oldAtRisk = `const myAtRisk = myFellows.filter(f => f.fellowStatus === 'Ghosted' || f.fellowStatus === 'On Hold' || (f._autoStrikes && f._autoStrikes.length >= 2));`;
const newAtRisk = `const myAtRisk = myFellows.filter(f => 
  f.fellowStatus === 'Ghosted' || 
  f.fellowStatus === 'On Hold' || 
  f.clubPageActivity === 'Management Restraint' || 
  f.clubPageActivity === 'Inactive' || 
  f.clubPageActivity === 'Not Set Up' || 
  f.finalAcceptance !== 'Yes' || 
  (f._autoStrikes && f._autoStrikes.length > 0)
);`;

app = app.replace(oldAtRisk, newAtRisk);

const oldAtRiskHtml = `          myAtRisk.map(f =>
            \`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:rgba(239,68,68,0.05);border-radius:8px;cursor:pointer;" onclick="renderFellowProfile('\${f.id}')">\` +
            \`<div><div style="font-size:13px;color:#F1F5F9;font-weight:600;">\${escapeHTML(f.fellowName)}</div><div style="font-size:11px;color:#64748B;">\${escapeHTML(f.collegeName)}</div></div>\`+
            \`<div style="display:flex;gap:6px;">\`+
            (f.fellowStatus==='Ghosted'?'<span style="background:rgba(100,116,139,0.2);color:#94A3B8;padding:2px 7px;border-radius:4px;font-size:11px;">Ghosted</span>':'')+
            (f.fellowStatus==='On Hold'?'<span style="background:rgba(245,158,11,0.2);color:#F59E0B;padding:2px 7px;border-radius:4px;font-size:11px;">On Hold</span>':'')+
            (f._autoStrikes&&f._autoStrikes.length>=2?'<span style="background:rgba(239,68,68,0.2);color:#EF4444;padding:2px 7px;border-radius:4px;font-size:11px;">2 Strikes</span>':'')+
            \`</div></div>\`
          ).join('')+`;

const newAtRiskHtml = `          myAtRisk.map(f =>
            \`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:rgba(239,68,68,0.05);border-radius:8px;cursor:pointer;" onclick="renderFellowProfile('\${f.id}')">\` +
            \`<div style="flex-shrink:0;margin-right:10px;"><div style="font-size:13px;color:#F1F5F9;font-weight:600;">\${escapeHTML(f.fellowName)}</div><div style="font-size:11px;color:#64748B;max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">\${escapeHTML(f.collegeName)}</div></div>\`+
            \`<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;">\`+
            (f.fellowStatus==='Ghosted'?'<span style="background:rgba(100,116,139,0.2);color:#94A3B8;padding:2px 6px;border-radius:4px;font-size:10px;">Ghosted</span>':'')+
            (f.fellowStatus==='On Hold'?'<span style="background:rgba(245,158,11,0.2);color:#F59E0B;padding:2px 6px;border-radius:4px;font-size:10px;">On Hold</span>':'')+
            (f.clubPageActivity==='Management Restraint'?'<span style="background:rgba(245,158,11,0.2);color:#F59E0B;padding:2px 6px;border-radius:4px;font-size:10px;">Restrained</span>':'')+
            (f.clubPageActivity==='Inactive'?'<span style="background:rgba(239,68,68,0.2);color:#EF4444;padding:2px 6px;border-radius:4px;font-size:10px;">Inactive</span>':'')+
            (f.clubPageActivity==='Not Set Up'?'<span style="background:rgba(239,68,68,0.2);color:#EF4444;padding:2px 6px;border-radius:4px;font-size:10px;">No Page</span>':'')+
            (f.finalAcceptance!=='Yes'?'<span style="background:rgba(239,68,68,0.2);color:#EF4444;padding:2px 6px;border-radius:4px;font-size:10px;">No Form</span>':'')+
            (f._autoStrikes&&f._autoStrikes.length>0?'<span style="background:rgba(239,68,68,0.2);color:#EF4444;padding:2px 6px;border-radius:4px;font-size:10px;">' + f._autoStrikes.length + ' Strike(s)</span>':'')+
            \`</div></div>\`
          ).join('')+`;

app = app.replace(oldAtRiskHtml, newAtRiskHtml);

fs.writeFileSync('app.js', app);
console.log('Fixed Fellows Needing Attention');
