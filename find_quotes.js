const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');
let pos = 0;
while ((pos = content.indexOf('ubicacion', pos + 1)) !== -1) {
    // Print 5 chars before and 20 after to see quotes
    console.log(`Found at ${pos}: ${content.substring(pos - 5, pos + 25)}`);
}
