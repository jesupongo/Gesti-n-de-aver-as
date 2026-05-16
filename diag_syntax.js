const { spawnSync } = require('child_process');
const result = spawnSync('node', ['--check', 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js']);
const stderr = result.stderr.toString();
console.log(stderr);

// Try to find the line and column from the stderr
const match = stderr.match(/:(\d+):(\d+)\n/);
if (match) {
    console.log(`Error at line ${match[1]}, column ${match[2]}`);
} else {
    console.log('No line/column found in stderr');
    // Print first 500 chars of stderr to see if it's there
    console.log(stderr.substring(0, 500));
}
