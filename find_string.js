const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

const target = 'Gestión de Averías';
const index = content.indexOf(target);

if (index !== -1) {
    console.log(`Found "${target}" at index ${index}`);
    console.log('--- CONTEXT BEGRIN ---');
    console.log(content.substring(Math.max(0, index - 2000), Math.min(content.length, index + 2000)));
    console.log('--- CONTEXT END ---');
} else {
    console.log(`"${target}" not found`);
    // Try a shorter string
    const target2 = 'Asignado a';
    const index2 = content.indexOf(target2);
    if (index2 !== -1) {
        console.log(`Found "${target2}" at index ${index2}`);
        console.log('--- CONTEXT BEGRIN ---');
        console.log(content.substring(Math.max(0, index2 - 2000), Math.min(content.length, index2 + 2000)));
        console.log('--- CONTEXT END ---');
    }
}
