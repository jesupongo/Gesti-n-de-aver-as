const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');
let pos = 0;
while ((pos = content.indexOf('titulo:x.nombre', pos + 1)) !== -1) {
    console.log(`Found at ${pos}: ${content.substring(pos - 50, pos + 200)}`);
}
// Try also without id specified
pos = 0;
while ((pos = content.indexOf(',titulo:', pos + 1)) !== -1) {
    console.log(`Found titulo: at ${pos}: ${content.substring(pos - 50, pos + 100)}`);
}
