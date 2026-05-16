const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

let braceCount = 0;
let bracketCount = 0;
let parenCount = 0;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '{') braceCount++;
    if (char === '}') braceCount--;
    if (char === '[') bracketCount++;
    if (char === ']') bracketCount--;
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    
    if (braceCount < 0) {
        console.log(`Unexpected } at index ${i}`);
        console.log(content.substring(i - 50, i + 50));
        braceCount = 0; // reset to keep searching
    }
    if (bracketCount < 0) {
        console.log(`Unexpected ] at index ${i}`);
        console.log(content.substring(i - 50, i + 50));
        bracketCount = 0;
    }
    if (parenCount < 0) {
        console.log(`Unexpected ) at index ${i}`);
        console.log(content.substring(i - 50, i + 50));
        parenCount = 0;
    }
}
console.log(`Final counts: Braces: ${braceCount}, Brackets: ${bracketCount}, Parens: ${parenCount}`);
