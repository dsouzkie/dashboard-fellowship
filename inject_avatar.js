const fs = require('fs');
let content = fs.readFileSync('app.js', 'utf8');
const replacement = `function renderAvatar(name, color, size = 'sm') {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const hasPhoto = ['Adi', 'Arjun', 'Christy', 'Harsh', 'Ibadat', 'Kabir', 'Surya', 'Urvi', 'Vansh'].includes(name);
  if (hasPhoto) {
    return \`<div class="avatar avatar--\${size}" style="background-image: url('team%20photos/\${name.toLowerCase()}.png'); background-size: cover; background-position: center; border: 1px solid \${color};"></div>\`;
  }
  return \`<div class="avatar avatar--\${size}" style="background-color: \${color}">\${initial}</div>\`;
}`;
content = content.replace(/function renderAvatar\(name, color, size = 'sm'\) \{[\s\S]*?\n\}/, replacement);
fs.writeFileSync('app.js', content);
console.log('Injected renderAvatar');
