function navigate(view) {
  AppState.currentView = view;
  AppState.searchQuery = '';
  const searchInput = document.getElementById('searchFellows');
  if (searchInput) searchInput.value = '';
  render();
}

function renderEditModal(fellowId) {
  const f = AppState.fellows.find(f => f.id === fellowId);
  if (!f) return;
  
  const modalHTML = `
    <div class="modal-overlay" id="editModalOverlay">
      <div class="modal" style="width: 700px;">
        <div class="modal-header">
          <h2 class="modal-title">Edit Fellow: ${escapeHTML(f.fellowName || f.collegeName)}</h2>
          <button class="modal-close" onclick="closeModal()">✖</button>
        </div>
        <div class="modal-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            ${FIELD_KEYS.map(k => {
              const label = FIELD_LABELS[k] || k;
              if (k === 'pocAssigned') {
                return `
                  <div class="form-group">
                    <label class="form-label">${label}</label>
                    <select class="form-select" id="edit_${k}">
                      ${TEAM.map(t => `<option value="${t.name}" ${f[k] === t.name ? 'selected' : ''}>${t.name}</option>`).join('')}
                    </select>
                  </div>
                `;
              }
              if (k === 'fellowStatus' || k === 'clubPageActivity' || k === 'finalAcceptance' || k === 'clubPageLaunched' || k === 'clubMade' || k === 'firstReelPosted' || k === 'mtf') {
                return `
                  <div class="form-group">
                    <label class="form-label">${label}</label>
                    <select class="form-select" id="edit_${k}">
                      <option value="Active" ${f[k] === 'Active' ? 'selected' : ''}>Active</option>
                      <option value="Inactive" ${f[k] === 'Inactive' ? 'selected' : ''}>Inactive</option>
                      <option value="Yes" ${f[k] === 'Yes' ? 'selected' : ''}>Yes</option>
                      <option value="No" ${f[k] === 'No' ? 'selected' : ''}>No</option>
                      <option value="On Hold" ${f[k] === 'On Hold' ? 'selected' : ''}>On Hold</option>
                      <option value="Ghosted" ${f[k] === 'Ghosted' ? 'selected' : ''}>Ghosted</option>
                      <option value="Dropped Out" ${f[k] === 'Dropped Out' ? 'selected' : ''}>Dropped Out</option>
                      <option value="N/A" ${f[k] === 'N/A' || !f[k] ? 'selected' : ''}>N/A</option>
                    </select>
                  </div>
                `;
              }
              return `
                <div class="form-group">
                  <label class="form-label">${label}</label>
                  <input type="text" class="form-input" id="edit_${k}" value="${escapeHTML(f[k] || '')}" />
                </div>
              `;
            }).join('')}
            <div class="form-group">
              <label class="form-label">Strike 1</label>
              <input type="text" class="form-input" id="edit_strike1" value="${escapeHTML(f.strike1 || '')}" />
            </div>
            <div class="form-group">
              <label class="form-label">Strike 2</label>
              <input type="text" class="form-input" id="edit_strike2" value="${escapeHTML(f.strike2 || '')}" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn--ghost" onclick="closeModal()">Cancel</button>
          <button class="btn btn--primary" onclick="saveFellowData('${f.id}')">Save Changes</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById('modalContainer').innerHTML = modalHTML;
}

function closeModal() {
  document.getElementById('modalContainer').innerHTML = '';
}

function saveFellowData(fellowId) {
  const f = AppState.fellows.find(f => f.id === fellowId);
  if (!f) return;
  
  let changed = false;
  
  FIELD_KEYS.concat(['strike1', 'strike2']).forEach(k => {
    const input = document.getElementById('edit_' + k);
    if (input) {
      const newVal = input.value.trim();
      if (f[k] !== newVal) {
        logChange(f.id, k, f[k], newVal);
        f[k] = newVal;
        changed = true;
      }
    }
  });
  
  if (changed) {
    runAutoStrikes();
    saveFellows();
    showToast('Changes saved successfully', 'success');
  }
  
  closeModal();
  render();
}

