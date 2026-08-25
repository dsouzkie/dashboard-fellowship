const fs = require('fs');

const mockDOM = `
global.window = { addEventListener: () => {} };
global.document = {
  getElementById: (id) => {
    return {
      value: '',
      classList: { add: () => {}, remove: () => {} },
      innerHTML: '',
      innerText: '',
      appendChild: () => {},
      createElement: () => ({ classList: { add: () => {}, remove: () => {} } }),
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {}
    };
  },
  createElement: () => ({ className: '', innerHTML: '' }),
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.fetch = async () => ({ ok: true, text: async () => '' });
`;

let code = fs.readFileSync('app.js', 'utf8');
code = code.replace(/const AppState =/g, 'global.AppState =');
code = code.replace(/const TEAM =/g, 'global.TEAM =');

fs.writeFileSync('test_init.js', mockDOM + '\n' + code + `
setTimeout(() => {
  try {
    init();
    console.log('Init success');
  } catch(e) {
    console.error('INIT ERROR:', e);
  }
}, 100);
`);
