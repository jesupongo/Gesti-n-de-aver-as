const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Applying DIAGNOSTIC patch...");

// 1. Add logs to ne
content = content.replace(
    'function ne({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:i_u,actualizarPerfil:r}){',
    'function ne({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:i_u,actualizarPerfil:r}){console.log("DASHBOARD ROL:",t,"ID:",i_u);'
);

// 2. Add logs to ae (VistaPersonal)
content = content.replace(
    'function ae({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:i_u,actualizarPerfil:r}){',
    'function ae({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:i_u,actualizarPerfil:r}){console.log("PERSONAL ID:",i_u);'
);

// 3. Relax ID comparisons (=== to ==)
content = content.replace(/e\.asignadoA===i_u/g, 'e.asignadoA==i_u');
content = content.replace(/av\.reportador\.id===i_u/g, 'av.reportador.id==i_u');

// 4. Force Admin to see EVERYTHING regardless of filter bugs
content = content.replace(
    'return n&&r&&i&&a&&(t==="admin"||(e.asignadoA==i_u&&e.verificada))',
    'return t==="admin"?n&&r&&i&&a : n&&r&&i&&a&&(e.asignadoA==i_u&&e.verificada)'
);

fs.writeFileSync(path, content);
console.log("DIAGNOSTIC Patch COMPLETED. Please ask the user for console logs if possible, but first let's see if this fixes it.");
const { spawnSync } = require('child_process');
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
