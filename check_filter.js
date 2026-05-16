const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

const t1 = 'return t==="admin"';
const t2 = 'return t=="admin"';

console.log(`Search for '${t1}': ${content.includes(t1)}`);
console.log(`Search for '${t2}': ${content.includes(t2)}`);

if (!content.includes(t1) && !content.includes(t2)) {
    console.log("None found. Checking surrounding context... Searching for 'return n&&r&&i&&a'");
    console.log(`Found 'return n&&r&&i&&a': ${content.includes('return n&&r&&i&&a')}`);
}
