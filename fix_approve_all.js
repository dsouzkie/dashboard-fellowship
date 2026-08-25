const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const targetHtml = `  // Form Tracker Approve All
  const btnApproveAll = document.getElementById('btn-approve-all-faf');
  if (btnApproveAll) {
    btnApproveAll.addEventListener('click', () => {
      const btns = document.querySelectorAll('.btn-approve-faf');
      btns.forEach(btn => {
        const id = btn.dataset.id;
        const fellow = AppState.fellows.find(f => f.id === id);
        if(fellow) { 
          fellow.finalAcceptance = 'Yes'; 
          logChange(id, 'finalAcceptance', 'No', 'Yes'); 
          
          // Merge FAF data on approval
          const acc = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(fellow, true) : null;
          if (acc) {
            if (!fellow.fellowName || fellow.fellowName === 'N/A' || fellow.fellowName.trim() === '') fellow.fellowName = acc.fullName;
            if (!fellow.emailId || fellow.emailId === 'N/A' || fellow.emailId.trim() === '') fellow.emailId = acc.email;
            if (!fellow.whatsappNo || fellow.whatsappNo === 'N/A' || fellow.whatsappNo.trim() === '') fellow.whatsappNo = acc.phone;
            if (!fellow.collegeName || fellow.collegeName === 'N/A' || fellow.collegeName.trim() === '') fellow.collegeName = acc.college;
            fellow.dob = acc.dob;
            fellow.address = acc.address;
            fellow.tshirt = acc.tshirt;
          }
        }
      });
      if (btns.length > 0) {
        runAutoStrikes();
        saveFellows();
        showToast('All new acceptances approved!', 'success');
        render();
      }
    });
  }`;

const replacementHtml = `  // Form Tracker Approve All
  window.approveAllFaf = function() {
    const btns = document.querySelectorAll('.btn-approve-faf');
    let approved = 0;
    btns.forEach(btn => {
      const id = btn.dataset.id;
      const fellow = AppState.fellows.find(f => f.id === id);
      if(fellow) { 
        fellow.finalAcceptance = 'Yes'; 
        logChange(id, 'finalAcceptance', 'No', 'Yes'); 
        
        const acc = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(fellow, true) : null;
        if (acc) {
          if (!fellow.fellowName || fellow.fellowName === 'N/A' || fellow.fellowName.trim() === '') fellow.fellowName = acc.fullName;
          if (!fellow.emailId || fellow.emailId === 'N/A' || fellow.emailId.trim() === '') fellow.emailId = acc.email;
          if (!fellow.whatsappNo || fellow.whatsappNo === 'N/A' || fellow.whatsappNo.trim() === '') fellow.whatsappNo = acc.phone;
          if (!fellow.collegeName || fellow.collegeName === 'N/A' || fellow.collegeName.trim() === '') fellow.collegeName = acc.college;
        }
        approved++;
      }
    });
    if (approved > 0) {
      runAutoStrikes();
      saveFellows();
      showToast(approved + ' acceptances approved!', 'success');
      render();
    }
  };
  
  const btnApproveAll = document.getElementById('btn-approve-all-faf');
  if (btnApproveAll) {
    btnApproveAll.onclick = window.approveAllFaf;
  }
`;

app = app.replace(targetHtml, replacementHtml);

// Also add onclick to the HTML template for resilience
const htmlTarget = `<button class="btn btn--sm btn--primary" id="btn-approve-all-faf">`;
const htmlReplacement = `<button class="btn btn--sm btn--primary" id="btn-approve-all-faf" onclick="approveAllFaf()">`;
app = app.replace(htmlTarget, htmlReplacement);


fs.writeFileSync('app.js', app);
