const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// 1. Restore FIELD_KEYS
app = app.replace(
  /'clubMade', 'reelsPostedWeek1'/,
  "'clubMade', 'clubPageLaunched', 'reelsPostedWeek1'"
);

// 2. Restore FIELD_LABELS
app = app.replace(
  /clubMade: 'Club Made',/,
  "clubMade: 'Club Made',\n  clubPageLaunched: 'Club Page Launched',"
);

// 3. Restore mapping in fetchTrackerFromSheet
app = app.replace(
  /clubMade: getIdx\('club made'\),/,
  "clubMade: getIdx('club made'),\n    clubPageLaunched: getIdx('club page launched'),"
);

// 4. Restore Gamification in calculateScore
app = app.replace(
  /if \(fellow\.clubPageActivity === 'Active'\) score \+= 15;/,
  "if (fellow.clubPageActivity === 'Active') score += 15;\n  if (fellow.clubPageLaunched === 'Yes') score += 15;"
);

// 5. Restore Strike Rules in runAutoStrikes
const rule3Old = "if (AppState.strikeRules.rule3 && fellow.finalAcceptance === 'Yes' && fellow.clubPageActivity === 'Inactive')";
const rule3New = `  if (AppState.strikeRules.rule2 && fellow.finalAcceptance === 'Yes' && (fellow.clubPageLaunched === 'No' || fellow.clubPageLaunched === '')) {
    strikes.push({ reason: 'Club Page Launch', severity: 'warning' });
  }

  if (AppState.strikeRules.rule3 && fellow.clubPageLaunched === 'Yes' && fellow.clubPageActivity === 'Inactive')`;
app = app.replace(rule3Old, rule3New);

// 6. Restore in renderFellowEditModal
// We had it inside YES_NO_OPTIONS mapping. Let's just add it back.
const editSelectOld = "if (k === 'finalAcceptance' || k === 'clubMade')";
const editSelectNew = "if (k === 'finalAcceptance' || k === 'clubPageLaunched' || k === 'clubMade')";
app = app.replace(editSelectOld, editSelectNew);

// 7. Restore Table Headers & Cells
// In renderAllFellows table header
const thOld = `<th data-sort="finalAcceptance">Form \${AppState.sortField === 'finalAcceptance' ? (AppState.sortDirection === 'asc' ? ' ' : ' ') : ''}</th>`;
const thNew = `<th data-sort="finalAcceptance">Form \${AppState.sortField === 'finalAcceptance' ? (AppState.sortDirection === 'asc' ? ' ' : ' ') : ''}</th>
              <th data-sort="clubPageLaunched">Launched \${AppState.sortField === 'clubPageLaunched' ? (AppState.sortDirection === 'asc' ? ' ' : ' ') : ''}</th>`;
app = app.replace(new RegExp(thOld.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), thNew);

// In renderAllFellows table cell
const tdOld = `<td class="\${editableClass}" data-id="\${f.id}" data-field="finalAcceptance">\${renderBadge(f.finalAcceptance)}</td>`;
const tdNew = `<td class="\${editableClass}" data-id="\${f.id}" data-field="finalAcceptance">\${renderBadge(f.finalAcceptance)}</td>
          <td class="\${editableClass}" data-id="\${f.id}" data-field="clubPageLaunched">\${renderBadge(f.clubPageLaunched)}</td>`;
app = app.replace(new RegExp(tdOld.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), tdNew);

// 8. Restore Filter UI
const filterHtmlOld = `  const activityOptionsList = ['all', ...ACTIVITY_OPTIONS].map(a => \`<option value="\${escapeHTML(a)}" \${AppState.filterActivity === a ? 'selected' : ''}>\${a === 'all' ? 'All Activities' : a}</option>\`).join('');`;
const filterHtmlNew = `  const activityOptionsList = ['all', ...ACTIVITY_OPTIONS].map(a => \`<option value="\${escapeHTML(a)}" \${AppState.filterActivity === a ? 'selected' : ''}>\${a === 'all' ? 'All Activities' : a}</option>\`).join('');
  const launchedOptionsList = ['all', 'Yes', 'No'].map(l => \`<option value="\${escapeHTML(l)}" \${AppState.filterLaunched === l ? 'selected' : ''}>\${l === 'all' ? 'All Form Status' : l}</option>\`).join('');`;
app = app.replace(filterHtmlOld, filterHtmlNew);

const filterSelectOld = `<div class="form-group">
        <label class="form-label">Activity:</label>
        <select class="form-select" id="filterActivity" onchange="AppState.filterActivity = this.value; renderAllFellows();">
          \${activityOptionsList}
        </select>
      </div>`;
const filterSelectNew = `<div class="form-group">
        <label class="form-label">Activity:</label>
        <select class="form-select" id="filterActivity" onchange="AppState.filterActivity = this.value; renderAllFellows();">
          \${activityOptionsList}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Club Page Launched:</label>
        <select class="form-select" id="filterLaunched" onchange="AppState.filterLaunched = this.value; renderAllFellows();">
          \${launchedOptionsList}
        </select>
      </div>`;
app = app.replace(filterSelectOld, filterSelectNew);

// 9. Restore Filter Logic
const filterLogicOld = `if (AppState.filterActivity !== 'all') {
    filtered = filtered.filter(f => f.clubPageActivity === AppState.filterActivity);
  }`;
const filterLogicNew = `if (AppState.filterActivity !== 'all') {
    filtered = filtered.filter(f => f.clubPageActivity === AppState.filterActivity);
  }
  if (AppState.filterLaunched && AppState.filterLaunched !== 'all') {
    filtered = filtered.filter(f => f.clubPageLaunched === AppState.filterLaunched);
  }`;
app = app.replace(filterLogicOld, filterLogicNew);

// 10. Restore Profile Detail
const profileHtmlOld = `<div class="profile-stat__label">Activity</div>
            </div>
          </div>

          <div class="profile-grid">`;
const profileHtmlNew = `<div class="profile-stat__label">Activity</div>
            </div>
          </div>

          <div class="profile-grid">
            <div class="profile-detail-card">
              <div class="profile-detail-label">Club Page Launched</div>
              <div style="margin-top: 10px;">
                <div class="profile-detail-value">\${renderBadge(fellow.clubPageLaunched)}</div>
              </div>
            </div>`;
app = app.replace(profileHtmlOld, profileHtmlNew);

// 11. Remove from DB Sweep!
const sweepOld = `['clubPageLaunched', 'firstReelPosted', 'whatsappGroupAdded', 'mtf', 'clubRecruitmentCampaign']`;
const sweepNew = `['firstReelPosted', 'whatsappGroupAdded', 'mtf', 'clubRecruitmentCampaign']`;
app = app.replace(sweepOld, sweepNew);

// 12. Restore KPI Card
const kpiOld = `const myActiveRate = myTotal > 0 ? Math.round((myActive/myTotal)*100) : 0;
  const allActiveRate = total > 0 ? Math.round((active/total)*100) : 0;`;
const kpiNew = `const myActiveRate = myTotal > 0 ? Math.round((myActive/myTotal)*100) : 0;
  const allActiveRate = total > 0 ? Math.round((active/total)*100) : 0;
  const launchRate = total > 0 ? Math.round((fellows.filter(f => f.clubPageLaunched === 'Yes').length / total) * 100) : 0;`;
app = app.replace(kpiOld, kpiNew);

const kpiHtmlOld = `\${iCard('??','Total Fellows', total, myFellows.length+' assigned to you', '#3B82F6')}
        \${iCard('??','Active Profiles', allActiveRate+'%', active+' active fellows globally', '#F59E0B')}`;
const kpiHtmlNew = `\${iCard('??','Total Fellows', total, myFellows.length+' assigned to you', '#3B82F6')}
        \${iCard('??','Active Profiles', allActiveRate+'%', active+' active fellows globally', '#F59E0B')}
        \${iCard('??','Pages Launched', launchRate+'%', fellows.filter(f=>f.clubPageLaunched==='Yes').length+' of '+total+' clubs', '#10B981')}`;
app = app.replace(kpiHtmlOld, kpiHtmlNew);

fs.writeFileSync('app.js', app);
console.log('Restored clubPageLaunched!');
