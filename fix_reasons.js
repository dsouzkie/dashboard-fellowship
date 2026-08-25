const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const targetHtml = `          myAtRisk.map(f =>
            \`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:rgba(239,68,68,0.05);border-radius:8px;cursor:pointer;" onclick="renderFellowProfile('\${f.id}')">\` +
            \`<div><div style="font-size:13px;color:#F1F5F9;font-weight:600;">\${escapeHTML(f.fellowName)}</div><div style="font-size:11px;color:#64748B;">\${escapeHTML(f.collegeName)}</div></div>\`+
            \`<div style="display:flex;gap:6px;">\`+
            (f.fellowStatus==='Ghosted'?'<span style="background:rgba(100,116,139,0.2);color:#94A3B8;padding:2px 7px;border-radius:4px;font-size:11px;">Ghosted</span>':'')+
            (f.fellowStatus==='On Hold'?'<span style="background:rgba(245,158,11,0.2);color:#F59E0B;padding:2px 7px;border-radius:4px;font-size:11px;">On Hold</span>':'')+
            (f._autoStrikes&&f._autoStrikes.length>=2?'<span style="background:rgba(239,68,68,0.2);color:#EF4444;padding:2px 7px;border-radius:4px;font-size:11px;">2 Strikes</span>':'')+
            \`</div></div>\`
          ).join('')+`;

const replacementHtml = `          myAtRisk.map(f => {
            const reasons = [];
            if (f.fellowStatus === 'Ghosted') reasons.push({t: 'Ghosted', c: '#94A3B8', bg: 'rgba(100,116,139,0.2)'});
            if (f.fellowStatus === 'On Hold') reasons.push({t: 'On Hold', c: '#F59E0B', bg: 'rgba(245,158,11,0.2)'});
            if (f.clubPageActivity === 'Management Restraint') reasons.push({t: 'Mgmt Restraint', c: '#F59E0B', bg: 'rgba(245,158,11,0.2)'});
            if (f.clubPageActivity === 'Inactive') reasons.push({t: 'Inactive Club', c: '#EF4444', bg: 'rgba(239,68,68,0.2)'});
            if (f.clubPageActivity === 'Not Set Up') reasons.push({t: 'Club Not Set Up', c: '#EF4444', bg: 'rgba(239,68,68,0.2)'});
            if (f.finalAcceptance !== 'Yes') reasons.push({t: 'No Form', c: '#F59E0B', bg: 'rgba(245,158,11,0.2)'});
            if (f._autoStrikes && f._autoStrikes.length > 0) reasons.push({t: f._autoStrikes.length + ' Strike(s)', c: '#EF4444', bg: 'rgba(239,68,68,0.2)'});
            
            return \`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:rgba(239,68,68,0.05);border-radius:8px;cursor:pointer;" onclick="renderFellowProfile('\${f.id}')">\` +
            \`<div><div style="font-size:13px;color:#F1F5F9;font-weight:600;">\${escapeHTML(f.fellowName)}</div><div style="font-size:11px;color:#64748B;">\${escapeHTML(f.collegeName)}</div></div>\`+
            \`<div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;max-width:50%;">\`+
            reasons.map(r => \`<span style="background:\${r.bg};color:\${r.c};padding:2px 6px;border-radius:4px;font-size:10px;white-space:nowrap;">\${r.t}</span>\`).join('') +
            \`</div></div>\`;
          }).join('')+`;

app = app.replace(targetHtml, replacementHtml);
fs.writeFileSync('app.js', app);
