const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const regex = /<h3 style="color:#F1F5F9; font-size:16px; margin:0 0 15px 0;">Core Team<\/h3>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

const newBlock = `<h3 style="color:#F1F5F9; font-size:16px; margin:0 0 15px 0;">Core Team</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
              <div style="background: rgba(15,23,42,0.6); padding: 12px; border-radius: 8px;">
                <div style="font-size: 11px; color:#64748B; margin-bottom:4px; text-transform:uppercase;">Head of Content</div>
                <div style="font-size: 14px; font-weight:600; color:#E2E8F0;">\${escapeHTML(fellow.manualHocName || fellow.hocName || 'Not Assigned')}</div>
                \${(fellow.manualHocName || fellow.hocName) ? \`
                <div style="font-size: 12px; margin-top:4px;"><a style="color:#94A3B8;" href="mailto:\${escapeHTML(fellow.manualHocEmail || fellow.hocEmail || '')}">\${escapeHTML(fellow.manualHocEmail || fellow.hocEmail || '-')}</a></div>
                <div style="font-size: 12px; margin-top:2px;"><a style="color:#94A3B8;" href="tel:\${escapeHTML(fellow.manualHocPhone || fellow.hocPhone || '')}">\${escapeHTML(fellow.manualHocPhone || fellow.hocPhone || '-')}</a></div>
                \` : '<div style="font-size:12px; color:#64748B; font-style:italic;">Can be updated in Edit Tab</div>'}
              </div>
              <div style="background: rgba(15,23,42,0.6); padding: 12px; border-radius: 8px;">
                <div style="font-size: 11px; color:#64748B; margin-bottom:4px; text-transform:uppercase;">Head of Operations</div>
                <div style="font-size: 14px; font-weight:600; color:#E2E8F0;">\${escapeHTML(fellow.manualHooName || fellow.hooName || 'Not Assigned')}</div>
                \${(fellow.manualHooName || fellow.hooName) ? \`
                <div style="font-size: 12px; margin-top:4px;"><a style="color:#94A3B8;" href="mailto:\${escapeHTML(fellow.manualHooEmail || fellow.hooEmail || '')}">\${escapeHTML(fellow.manualHooEmail || fellow.hooEmail || '-')}</a></div>
                <div style="font-size: 12px; margin-top:2px;"><a style="color:#94A3B8;" href="tel:\${escapeHTML(fellow.manualHooPhone || fellow.hooPhone || '')}">\${escapeHTML(fellow.manualHooPhone || fellow.hooPhone || '-')}</a></div>
                \` : '<div style="font-size:12px; color:#64748B; font-style:italic;">Can be updated in Edit Tab</div>'}
              </div>
              <div style="background: rgba(15,23,42,0.6); padding: 12px; border-radius: 8px;">
                <div style="font-size: 11px; color:#64748B; margin-bottom:4px; text-transform:uppercase;">Faculty Advisor</div>
                <div style="font-size: 14px; font-weight:600; color:#E2E8F0;">\${escapeHTML(fellow.manualFaName || fellow.faName || 'Not Assigned')}</div>
                \${(fellow.manualFaName || fellow.faName) ? \`
                <div style="font-size: 12px; margin-top:4px;"><a style="color:#94A3B8;" href="mailto:\${escapeHTML(fellow.manualFaEmail || fellow.faEmail || '')}">\${escapeHTML(fellow.manualFaEmail || fellow.faEmail || '-')}</a></div>
                <div style="font-size: 12px; margin-top:2px;"><a style="color:#94A3B8;" href="tel:\${escapeHTML(fellow.manualFaPhone || fellow.faPhone || '')}">\${escapeHTML(fellow.manualFaPhone || fellow.faPhone || '-')}</a></div>
                \` : '<div style="font-size:12px; color:#64748B; font-style:italic;">Can be updated in Edit Tab</div>'}
              </div>
            </div>
          </div>`;

app = app.replace(regex, newBlock);
fs.writeFileSync('app.js', app);
