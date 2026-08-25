const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

// Add paste event listener to mass add inputs
const targetHtml = `  gridHtml += \`</tbody></table>\`;
  document.getElementById('massAddGridContainer').innerHTML = gridHtml;
}`;
const replacementHtml = `  gridHtml += \`</tbody></table>\`;
  document.getElementById('massAddGridContainer').innerHTML = gridHtml;
  
  // Attach paste handler to all inputs in the grid
  const inputs = document.getElementById('massAddGridContainer').querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('paste', function(e) {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData('text');
      const rows = text.split(/\\r?\\n/).filter(r => r.trim());
      
      const targetRowTr = this.closest('tr');
      const allTrs = Array.from(targetRowTr.parentNode.children);
      const startRowIndex = allTrs.indexOf(targetRowTr);
      const startColIndex = Array.from(targetRowTr.children).indexOf(this.closest('td'));
      
      rows.forEach((row, rIdx) => {
        const cols = row.split('\\t');
        if (startRowIndex + rIdx < allTrs.length) {
          const tr = allTrs[startRowIndex + rIdx];
          cols.forEach((colData, cIdx) => {
            if (startColIndex + cIdx < tr.children.length) {
              const inputElement = tr.children[startColIndex + cIdx].querySelector('input');
              if (inputElement) {
                inputElement.value = colData.trim();
              }
            }
          });
        }
      });
    });
  });
}`;

app = app.replace(targetHtml, replacementHtml);
fs.writeFileSync('app.js', app);
