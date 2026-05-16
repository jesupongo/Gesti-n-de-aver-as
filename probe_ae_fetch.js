const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');
const startIdx = content.indexOf('function ae({');
const fetchIdx = content.indexOf('fetch("/averia")', startIdx);
console.log(`Fetch starts at: ${fetchIdx}`);
console.log(content.substring(fetchIdx - 100, fetchIdx + 800));
