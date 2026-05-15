const fs = require('fs');
const content = fs.readFileSync('public/assets/index-3qApb8rl.js', 'utf8');

try {
  new Function(content);
  console.log("No syntax errors found.");
} catch (e) {
  console.error("Syntax Error:", e);
}

// Let's also print out the replaced login snippet to verify it
const loginMatch = content.match(/e\.preventDefault\(\)[^{]*?fetch\("\/user\/login"/g);
if (loginMatch) {
    // print a bit around it
    const idx = content.indexOf('fetch("/user/login"');
    console.log("Login snippet: ", content.substring(idx - 100, idx + 400));
}

// User creation snippet
const createMatch = content.match(/fetch\("\/user"/);
if (createMatch) {
    const idx = content.indexOf('fetch("/user"');
    console.log("Create snippet: ", content.substring(idx - 100, idx + 400));
}

// Role option snippet
const roleMatch = content.match(/value:"personal"/);
if (roleMatch) {
    const idx = content.indexOf('value:"personal"');
    console.log("Role snippet: ", content.substring(idx - 50, idx + 100));
}
