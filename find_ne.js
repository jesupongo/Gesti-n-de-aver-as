const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

const target = 'function ne({';
const index = content.indexOf(target);

if (index !== -1) {
    console.log(`Found "${target}" at index ${index}`);
    console.log('--- CONTEXT ---');
    console.log(content.substring(index, index + 500));
} else {
    console.log(`"${target}" not found`);
    // Try without curly braces
    const target2 = 'function ne(';
    const index2 = content.indexOf(target2);
    if (index2 !== -1) {
        console.log(`Found "${target2}" at index ${index2}`);
        console.log('--- CONTEXT ---');
        console.log(content.substring(index2, index2 + 500));
    }
}
