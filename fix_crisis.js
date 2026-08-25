const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// REVERT the uc?export=view back to thumbnail
app = app.replace(
  /return \`https:\/\/drive\.google\.com\/uc\?export=view&id=\$\{match\[1\]\}\`;/g,
  `return \`https://drive.google.com/thumbnail?id=\${match[1]}&sz=w800\`;`
);

// Actually inject the approveAllFaf function safely at the global scope
const functionCode = `
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
    if (typeof runAutoStrikes === 'function') runAutoStrikes();
    saveFellows();
    showToast(approved + ' acceptances approved!', 'success');
    render();
  }
};
`;

if (!app.includes('window.approveAllFaf')) {
  app = app + '\\n' + functionCode;
}

fs.writeFileSync('app.js', app);
