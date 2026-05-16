const fs = require('fs');
const { spawnSync } = require('child_process');

const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

function testRange(s, e) {
    const testCode = content.substring(0, s) + ' "" ' + content.substring(e);
    fs.writeFileSync('temp_check.js', testCode);
    const result = spawnSync('node', ['--check', 'temp_check.js']);
    return result.status === 0;
}

// Full file length
const len = content.length;
console.log(`Total length: ${len}`);

// Test halves
if (testRange(0, Math.floor(len/2))) {
    console.log("Error is in 0 to half");
    binarySearch(0, Math.floor(len/2));
} else if (testRange(Math.floor(len/2), len)) {
    console.log("Error is in half to end");
    binarySearch(Math.floor(len/2), len);
} else {
    console.log("Error might be multi-point or the logic of testRange is flawed.");
}

function binarySearch(low, high) {
    while (high - low > 10) {
        let mid = Math.floor((low + high) / 2);
        if (testRange(low, mid)) {
            high = mid;
        } else if (testRange(mid, high)) {
            low = mid;
        } else {
            console.log("Split error near mid.");
            break;
        }
        console.log(`Searching: ${low} - ${high}`);
    }
    console.log(`Suspected index: ${low}`);
    console.log("Context:");
    console.log(content.substring(low - 100, high + 100));
}
