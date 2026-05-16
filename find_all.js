const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

const target = 'asignadoA';
let index = -1;
let indices = [];

while ((index = content.indexOf(target, index + 1)) !== -1) {
    indices.push(index);
}

console.log(`Found ${indices.length} occurrences of "${target}"`);
indices.forEach((idx, i) => {
    console.log(`--- Match ${i+1} at ${idx} ---`);
    console.log(content.substring(idx - 200, idx + 200));
});
