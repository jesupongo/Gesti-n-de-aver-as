const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');
const t = '"prioridad"';
let i = -1;
while ((i = content.indexOf(t, i + 1)) !== -1) {
    console.log(`Index: ${i}`);
    console.log(content.substring(i - 100, i + 300));
}
