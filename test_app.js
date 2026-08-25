const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('app.js', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously" });

// Mock fetch for the CSVs
dom.window.fetch = async (url) => {
  return {
    ok: true,
    text: async () => {
      if (url.includes('FAF')) {
        return `"Timestamp","Email Address","Fellow Name","WhatsApp No","Instagram Link","DOB","College Name","City","State","Total capacity of students","Address","T-Shirt Size","HOC Name","HOC Email","HOC Phone","HOO Name","HOO Email","HOO Phone","FA Name","FA Email","FA Phone","dummy1","dummy2","dummy3","dummy4","dummy5","dummy6","dummy7","dummy8","Upload your photo","Upload your video"
"7/9/2026 13:15:42","test@test.com","Test Fellow","1234567890","ig","3/3/2005","Test College","Pune","Maharashtra","350","Address","S","HOC","hoc@test.com","123","HOO","hoo@test.com","123","FA","fa@test.com","123","","","","","","","","","photo-url","video-url"`;
      }
      if (url.includes('nomination')) {
        return `"Timestamp","Name of the graduating alumni","Name of College","Are you a Fellow or a President?","Personal Email ID","Phone Number","Club IG Username","Club IG Password","Did you have a summit in your college?","Name of the nominated fellow","Phone number of nominated fellow","Email ID of nominated fellow","Instagram handle of nominated fellow","Upload a photo of the nominated fellow","Upload a 30 sec intro video of nominated fellow","Please write a short note as to why you're choosing this fellow to takeover","Do you want to be contacted by Under 25 in the future for any opportunities?","Join our Alumni WhatsApp Community","Would you like to continue to work with Under 25?","Anything else you'd like to share?"
"1","Alumni","Test College","Fellow","a@a.com","123","ig","pass","Yes","Nominated","123","n@n.com","ig","photo","video","note","Yes","Yes","Yes","nothing"`;
      }
      if (url.includes('Tracker')) {
        return `"Timestamp","College Name","POC Assigned","Fellow Status","Manual Strikes"
"1","Test College","Kabir","Active",""`;
      }
      return "";
    }
  };
};

dom.window.localStorage = {
  getItem: (k) => null,
  setItem: (k, v) => {},
  removeItem: (k) => {}
};

try {
  // Execute the app logic
  const scriptEl = dom.window.document.createElement("script");
  scriptEl.textContent = appJs;
  dom.window.document.body.appendChild(scriptEl);

  // Wait for init to finish
  setTimeout(() => {
    try {
      console.log("Testing renderDashboard...");
      dom.window.renderDashboard();
      
      console.log("Testing renderAllFellows...");
      dom.window.renderAllFellows();

      console.log("Testing renderMyFellows...");
      dom.window.renderMyFellows();

      if (dom.window.AppState.fellows.length > 0) {
        console.log("Testing renderFellowProfile...");
        dom.window.renderFellowProfile(dom.window.AppState.fellows[0].id);
      }

      console.log("Testing renderStrikes...");
      dom.window.renderStrikes();

      console.log("ALL TESTS PASSED WITH NO CRASHES!");
    } catch (e) {
      console.error("RUNTIME ERROR DURING RENDER:", e);
    }
  }, 2000);
} catch (e) {
  console.error("INITIALIZATION ERROR:", e);
}
