const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
const { spawnSync } = require('child_process');

spawnSync('git', ['restore', 'public/assets/index-3qApb8rl.js']);
let content = fs.readFileSync(path, 'utf8');

console.log("SURGERY: FINAL SYSTEM RESTORATION V5 (OFFSET TARGETING)...");

const ne_c = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/ne_new.js', 'utf8');
const ie_c = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/ie_new.js', 'utf8');
const ae_c = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/ae_new.js', 'utf8');
const s_c = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/s_new.js', 'utf8');
const oe_c = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/oe_new.js', 'utf8');

const replaceFn = (name, newContent, startOffset = 190000) => {
  let start = content.indexOf(`function ${name}(`, startOffset);
  if (start === -1) { start = content.indexOf(`function ${name} (`, startOffset); }
  if (start === -1) { console.log("FAILED to find " + name + " after offset " + startOffset); return; }
  
  // Skip the parameters (handle nested parens)
  let parenCount = 1;
  let j = content.indexOf('(', start) + 1;
  while(parenCount > 0 && j < content.length) {
    if (content[j] === '(') parenCount++;
    else if (content[j] === ')') parenCount--;
    j++;
  }
  let endOfParens = j;
  
  // Find the opening brace of the function body
  let openBrace = content.indexOf('{', endOfParens);
  if (openBrace === -1) { console.log("FAILED to find { for " + name); return; }
  
  let count = 1;
  let i = openBrace + 1;
  while (count > 0 && i < content.length) {
    if (content[i] === '{') count++;
    else if (content[i] === '}') count--;
    i++;
  }
  let end = i;
  
  console.log(`Replacing ${name} at ${start} (length: ${end-start})`);
  content = content.substring(0, start) + newContent + " " + content.substring(end);
};

// Apply all patches targeting the main module (190k+)
replaceFn('ne', ne_c);
replaceFn('ie', ie_c);
replaceFn('ae', ae_c);
replaceFn('S', s_c);
replaceFn('oe', oe_c);

fs.writeFileSync(path, content);
console.log("FINAL SURGERY COMPLETED.");
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
