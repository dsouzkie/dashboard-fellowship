const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');
if (!content.includes('window.copyToClipboardText')) {
  const replacement = `function copyEmailToClipboard(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => showToast('Email copied to clipboard! 📋', 'success'));
}

window.copyToClipboardText = function(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard! 📋', 'success')).catch(err => {
    console.error('Failed to copy', err);
    showToast('Failed to copy to clipboard.', 'error');
  });
};`;
  content = content.replace(/function copyEmailToClipboard\(elementId\) \{[\s\S]*?\n\}/, replacement);
  fs.writeFileSync('app.js', content);
  console.log('Injected copyToClipboardText');
} else {
  console.log('Already exists');
}
