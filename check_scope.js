const fs = require('fs');
const content = fs.readFileSync('c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js', 'utf8');

const s1 = 'rol_u=="admin"';
const s2 = 'rol_u==="admin"';

console.log(`Search for '${s1}': ${content.includes(s1)}`);
console.log(`Search for '${s2}': ${content.includes(s2)}`);

const signature = 'function ne({navegar:e,rolUsuario:rol_u';
console.log(`Search for signature: ${content.includes(signature)}`);

if (content.includes(signature)) {
    const pos = content.indexOf(signature);
    console.log(`Context around signature: ${content.substring(pos, pos + 200)}`);
}
