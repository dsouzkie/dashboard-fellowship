const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const oldApproveAll = `
      const btns = document.querySelectorAll('.btn-approve-faf');
      btns.forEach(btn => {
        const id = btn.dataset.id;
        const fellow = AppState.fellows.find(f => f.id === id);
        if(fellow) { fellow.finalAcceptance = 'Yes'; logChange(id, 'finalAcceptance', 'No', 'Yes'); }
      });
`;

const newApproveAll = `
      const btns = document.querySelectorAll('.btn-approve-faf');
      btns.forEach(btn => {
        const id = btn.dataset.id;
        const fellow = AppState.fellows.find(f => f.id === id);
        if(fellow) { 
          fellow.finalAcceptance = 'Yes'; 
          logChange(id, 'finalAcceptance', 'No', 'Yes'); 
          
          // Merge FAF data on approval
          const acc = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(fellow) : null;
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
`;

app = app.replace(oldApproveAll.trim(), newApproveAll.trim());


const oldApproveOne = `
  document.querySelectorAll('.btn-approve-faf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      updateFellow(e.currentTarget.dataset.id, 'finalAcceptance', 'Yes');
      showToast('Form status synced', 'success');
      render();
    });
  });
`;

const newApproveOne = `
  document.querySelectorAll('.btn-approve-faf').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const fellow = AppState.fellows.find(f => f.id === id);
      if (fellow) {
          const acc = typeof findAcceptanceForFellow === 'function' ? findAcceptanceForFellow(fellow) : null;
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
      updateFellow(id, 'finalAcceptance', 'Yes');
      showToast('Form status synced and data linked', 'success');
      // updateFellow already calls render()
    });
  });
`;

app = app.replace(oldApproveOne.trim(), newApproveOne.trim());

fs.writeFileSync('app.js', app);
console.log('Patched approvals');
