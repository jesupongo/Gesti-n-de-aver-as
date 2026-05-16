const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

console.log("Searching for redundant brackets anywhere...");
const regex = /\]\]+/g;
let match;
while ((match = regex.exec(content)) !== null) {
    console.log(`Match ${match[0]} at ${match.index}`);
    console.log(content.substring(match.index - 50, match.index + 50));
}
