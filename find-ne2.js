const fs = require('fs');
const content = fs.readFileSync('public/assets/index-3qApb8rl.js', 'utf8');

const sIdx = content.indexOf('(0,b.useState)({estado:');
if (sIdx !== -1) {
    const start = Math.max(0, sIdx - 200);
    console.log("Found ne body inside: ", content.substring(start, sIdx + 100));
} else {
    console.log("Could NOT find ne body either.");
}
