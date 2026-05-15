const fs = require('fs');
const content = fs.readFileSync('public/assets/index-3qApb8rl.js', 'utf8');

const sIdx = content.indexOf('Bienvenido, Equipo Coordinador');
if (sIdx !== -1) {
    const start = Math.max(0, sIdx - 500);
    console.log("Found string inside: ", content.substring(start, sIdx + 100));
} else {
    console.log("Could NOT find string.");
}
