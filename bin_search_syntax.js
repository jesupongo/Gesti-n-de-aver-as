const fs = require('fs');
const { spawnSync } = require('child_process');

const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

function checkSyntax(code) {
    // We need to wrap it in a function or block to make it valid for check
    const wrapped = `(function(){\n${code}\n})()`;
    fs.writeFileSync('temp_check.js', wrapped);
    const result = spawnSync('node', ['--check', 'temp_check.js']);
    return result.status === 0;
}

// The full file fails. Let's find the error in a specific range.
// We know it's around 200,000 to 210,000.
let start = 200000;
let end = 210000;

console.log(`Checking range ${start} to ${end}...`);
// Since it's minified, we can't easily cut it.
// We'll replace the range with a valid empty string and see if it passes.
// If it passes, the error was in that range.

function testRange(s, e) {
    const testCode = content.substring(0, s) + ' "" ' + content.substring(e);
    fs.writeFileSync('temp_check.js', testCode);
    const result = spawnSync('node', ['--check', 'temp_check.js']);
    return result.status === 0;
}

if (testRange(200000, 210000)) {
    console.log("Error is IN the 200000-210000 range.");
    // Binary search within this range
    let low = 200000;
    let high = 210000;
    while (high - low > 10) {
        let mid = Math.floor((low + high) / 2);
        if (testRange(low, mid)) {
            high = mid;
        } else if (testRange(mid, high)) {
            low = mid;
        } else {
            console.log("Error might be outside or split across mid.");
            break;
        }
        console.log(`Searching: ${low} - ${high}`);
    }
    console.log(`Error suspected near index: ${low}`);
    console.log("Context:");
    console.log(content.substring(low - 100, high + 100));
} else {
    console.log("Error is OUTSIDE the 200000-210000 range.");
}
