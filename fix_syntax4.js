const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  /<button class="btn btn--sm btn--ghost" onclick="window\.copyToClipboardText\('\\$\\{escapeHTML\\(emailText\.replace\(\/\\\\\/g, "\\\\\\\\\\\\\\\\"\)\.replace\(\/'\/g, "\\\\'"\)\.replace\(\/n\/g, '\\\\\\\\n'\)\\}\\)'"\>Copy Email<\/button>/g,
  '<button class="btn btn--sm btn--ghost" onclick="window.copyToClipboardText(\\'${escapeHTML(emailText.replace(/\\\\/g, \\"\\\\\\\\\\\\\\\\\\").replace(/\\'/g, \\"\\\\\\'\\").replace(/\\\\n/g, \\"\\\\\\\\n\\"))}\\')">Copy Email</button>'
);

// wait let me just replace that entire line by index.
let lines = app.split('\\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("window.copyToClipboardText('${escapeHTML(emailText.replace")) {
    lines[i] = '              <button class="btn btn--sm btn--ghost" onclick="window.copyToClipboardText(\\'' + "${escapeHTML(emailText.replace(/\\\\\\\\/g, '\\\\\\\\\\\\\\\\').replace(/\\\\'/g, \\\"\\\\\\\\\\\"\\\").replace(/\\\\n/g, '\\\\\\\\n'))}" + '\\')\">Copy Email</button>';
  }
}
fs.writeFileSync('app.js', lines.join('\\n'));
