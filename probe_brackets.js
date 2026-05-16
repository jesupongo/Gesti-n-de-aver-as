const fs = require('fs');
const { spawnSync } = require('child_process');

const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

function check(code) {
    fs.writeFileSync('temp_check.js', code);
    const result = spawnSync('node', ['--check', 'temp_check.js']);
    return result.status === 0;
}

// Binary search for the first prefix that is invalid
// Actually, usually an "Unexpected token ]" means there's an extra one.
// We'll search for 'children:' blocks and check them one by one.

let lastValid = 0;
let step = 1000;
for (let i = 200000; i < content.length; i += step) {
    const testCode = content.substring(0, i);
    // Note: a truncated file is likely invalid. 
    // This approach is hard for minified React.
    
    // Let's just find ALL ']]' and print context.
}

console.log("Searching for redundant brackets...");
const regex = /\]\]+/g;
let match;
while ((match = regex.exec(content)) !== null) {
    if (match.index > 200000) {
        console.log(`Match ${match[0]} at ${match.index}`);
        console.log(content.substring(match.index - 50, match.index + 50));
    }
}
