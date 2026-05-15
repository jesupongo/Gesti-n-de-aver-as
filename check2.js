const fs = require('fs');
const content = fs.readFileSync('public/assets/index-3qApb8rl.js', 'utf8');

const idx = content.indexOf('fetch("/user/login"');
if (idx !== -1) {
    console.log("-->", content.substring(idx - 150, idx + 250));
} else {
    console.log("Login fetch not found.");
}
