const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

const t = 'function ae({';
let i = content.indexOf(t);
if (i !== -1) {
    console.log(`Found ae at ${i}:`);
    console.log(content.substring(i, i + 200));
} else {
    console.log("function ae({ NOT found");
}
