const fs = require('fs');
const content = fs.readFileSync('public/assets/index-3qApb8rl.js', 'utf8');

const sIdx = content.indexOf('iniciarSesionComo');
if (sIdx !== -1) {
    console.log("iniciarSesionComo logic: ", content.substring(sIdx - 50, sIdx + 150));
}
