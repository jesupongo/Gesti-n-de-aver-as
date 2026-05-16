const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');
const startIdx = content.indexOf('function ae({');
let i = startIdx;
let count = 0;
while ((i = content.indexOf('p(', i + 1)) !== -1 && i < startIdx + 5000) {
    count++;
    console.log(`Setter p( at ${i}: ${content.substring(i - 50, i + 100)}`);
}
