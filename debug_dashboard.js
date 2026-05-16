const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';

let content = fs.readFileSync(path, 'utf8');

console.log("Applying DEBUG DASHBOARD patch...");

// Inject logs into ne fetch
content = content.replace(
    '.then(data=>{a(data.map',
    '.then(data=>{console.log("ADMIN FETCHED:",data.length,"items");a(data.map'
);

// Inject logs into ne render
content = content.replace(
    'function ne({navegar:e,rolUsuario:rol_u,nombreUsuario:nom_u,idUsuario:id_u,actualizarPerfil:r}){',
    'function ne({navegar:e,rolUsuario:rol_u,nombreUsuario:nom_u,idUsuario:id_u,actualizarPerfil:r}){console.log("ADMIN RENDER rol_u:",rol_u,"id_u:",id_u);'
);

// Inject logs into ne filter
content = content.replace(
    'return rol_u=="admin" ? n&&r&&i&&a : n&&r&&i&&a&&(e.asignadoA==id_u&&e.verificada)',
    'const res = rol_u=="admin" ? n&&r&&i&&a : n&&r&&i&&a&&(e.asignadoA==id_u&&e.verificada); if(!res) { /* console.log("Filtered out:", e.titulo) */ } return res'
);

fs.writeFileSync(path, content);
console.log("DEBUG DASHBOARD Patch COMPLETED.");
const { spawnSync } = require('child_process');
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
