const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

app = app.replace(
  '<button class="btn btn--primary" id="btnAddFellow">',
  '<button class="btn btn--secondary" onclick="renderMassAddModal()" style="margin-right: 10px;">z Mass Add</button>\n            <button class="btn btn--primary" id="btnAddFellow">'
);

fs.writeFileSync('app.js', app);
