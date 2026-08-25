const fs = require('fs');
let app = fs.readFileSync('app.js', 'utf8');

const newEmailCode = `function generateStrikeEmailBody(fellow, reason, strikeSentence) {
  const poc = TEAM.find(t => t.name === fellow.pocAssigned);
  const ordinals = ['first','second','third'];
  const count = getActiveStrikeCount(fellow.id);
  const ordinal = ordinals[Math.min(count,3)-1] || 'next';
  const template = {
    subject: \`Under25 Fellowship — Strike \${count} | \${escapeHTML(fellow.collegeName)}\`,
    body: \`Dear Fellow,

This is your \${ordinal} strike for \${reason}.

We had flagged this earlier and given you time to complete it, but we still don't see your submission. \${strikeSentence}

At this point, we need you to treat this as urgent.

📌 What you need to do:
Please rectify this immediately.

If we don't receive an update, it will be treated as a lack of commitment to the Fellowship, and may affect your standing in the program, including potential removal from the Fellowship.

We genuinely want you in this journey with us - so if you're facing any issues or have questions, reach out to your Respective POC (\${fellow.pocAssigned}) or the Program Team right away.

Let's get this done.

Regards,
Team Under25\`
  };
  return template;
}`;

app = app.replace(/function generateStrikeEmailBody[\s\S]*?return template;\n}/m, newEmailCode);

fs.writeFileSync('app.js', app, 'utf8');
console.log('Email template updated.');
