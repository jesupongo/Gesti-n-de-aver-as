const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

const regexBrackets = /\]\]+/g;
const regexBraces = /\}\}+/g;

console.log("Checking BRACKETS...");
let m;
while ((m = regexBrackets.exec(content)) !== null) {
    if (m.index > 200000) {
        console.log(`Bracket ${m[0]} at ${m.index}: ${content.substring(m.index - 30, m.index + 30)}`);
    }
}

console.log("Checking BRACES...");
while ((m = regexBraces.exec(content)) !== null) {
    if (m.index > 200000) {
        console.log(`Brace ${m[0]} at ${m.index}: ${content.substring(m.index - 30, m.index + 30)}`);
    }
}
