const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const massAddLogic = `

function renderMassAddModal() {
  const modalHTML = \`
    <div class="modal-overlay" id="massAddModalOverlay">
      <div class="modal" style="width: 900px; max-width: 95vw;">
        <div class="modal-header">
          <h2 class="modal-title">Mass Add Fellows</h2>
          <button class="modal-close" onclick="document.getElementById('massAddModalOverlay').remove()">?</button>
        </div>
        <div class="modal-body" style="overflow-x: auto;">
          <div style="display:flex; gap: 15px; margin-bottom: 20px;">
            <div class="form-group" style="flex:1;">
              <label class="form-label">Number of Fellows to Add</label>
              <input type="number" id="massAddCount" class="form-input" min="1" max="100" value="5">
            </div>
            <div class="form-group" style="flex:1;">
              <label class="form-label">Intake Label</label>
              <input type="text" id="massAddIntake" class="form-input" placeholder="e.g. Intake 2" value="Intake 2">
            </div>
            <div style="flex:1; display:flex; align-items:flex-end; padding-bottom:15px;">
              <button class="btn btn--secondary" onclick="generateMassAddGrid()">Generate Grid</button>
            </div>
          </div>
          <div id="massAddGridContainer"></div>
        </div>
        <div class="modal-footer" style="margin-top:20px; border-top:1px solid #334155; padding-top:15px; text-align:right;">
          <button class="btn btn--primary" onclick="saveMassAdd()">Save Fellows</button>
        </div>
      </div>
    </div>
  \`;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  generateMassAddGrid();
}

function generateMassAddGrid() {
  const count = parseInt(document.getElementById('massAddCount').value) || 5;
  const intake = document.getElementById('massAddIntake').value || '';
  
  let gridHtml = \`
    <table class="table" style="width: 100%; min-width: 1200px;">
      <thead>
        <tr>
          <th>College Name</th>
          <th>Fellow Name</th>
          <th>WhatsApp No.</th>
          <th>Email ID</th>
          <th>City</th>
          <th>POC Assigned</th>
          <th>Status</th>
          <th>Final Acc.</th>
        </tr>
      </thead>
      <tbody id="massAddTbody">
  \`;
  
  for (let i = 0; i < count; i++) {
    gridHtml += \`
      <tr class="mass-add-row">
        <td><input type="text" class="form-input ma-col" placeholder="College"></td>
        <td><input type="text" class="form-input ma-name" placeholder="Name"></td>
        <td><input type="text" class="form-input ma-phone" placeholder="Phone"></td>
        <td><input type="text" class="form-input ma-email" placeholder="Email"></td>
        <td><input type="text" class="form-input ma-city" placeholder="City"></td>
        <td>
          <select class="form-select ma-poc">
            <option value="">Select POC</option>
            \${TEAM.map(t => \`<option value="\${t.name}">\${t.name}</option>\`).join('')}
          </select>
        </td>
        <td>
          <select class="form-select ma-status">
            <option value="Active">Active</option>
            <option value="Dropped Out">Dropped Out</option>
          </select>
        </td>
        <td>
          <select class="form-select ma-faf">
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </td>
      </tr>
    \`;
  }
  
  gridHtml += \`</tbody></table>\`;
  document.getElementById('massAddGridContainer').innerHTML = gridHtml;
}

function saveMassAdd() {
  const rows = document.querySelectorAll('.mass-add-row');
  const intake = document.getElementById('massAddIntake').value || 'Intake';
  let addedCount = 0;
  
  rows.forEach((row, i) => {
    const col = row.querySelector('.ma-col').value.trim();
    const name = row.querySelector('.ma-name').value.trim();
    const email = row.querySelector('.ma-email').value.trim();
    
    if (col || name || email) {
      // Deterministic ID Hash
      const str = (email + name + col).toLowerCase().replace(/[^a-z0-9]/g, '');
      let hash = 0;
      for (let j = 0; j < str.length; j++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(j);
        hash = hash & hash;
      }
      const newId = 'f_' + Math.abs(hash) + '_' + Date.now().toString().slice(-4); // fallback if exact same
      
      const fellow = {
        id: newId,
        intakeStatus: intake,
        collegeName: col,
        fellowName: name,
        whatsappNo: row.querySelector('.ma-phone').value.trim(),
        emailId: email,
        city: row.querySelector('.ma-city').value.trim(),
        pocAssigned: row.querySelector('.ma-poc').value,
        fellowStatus: row.querySelector('.ma-status').value,
        finalAcceptance: row.querySelector('.ma-faf').value,
        clubPageLaunched: 'No',
        clubPageActivity: 'N/A'
      };
      
      AppState.fellows.push(fellow);
      addedCount++;
    }
  });
  
  if (addedCount > 0) {
    saveFellows();
    runAutoStrikes();
    render();
    showToast(\`Successfully added \${addedCount} fellows!\`, 'success');
  }
  
  document.getElementById('massAddModalOverlay').remove();
}

// End Mass Add Logic
`;

// Insert the mass add logic at the bottom of the file
app += massAddLogic;
fs.writeFileSync('app.js', app);
console.log('Injected Mass Add logic');
