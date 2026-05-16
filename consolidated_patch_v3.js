const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
// FIRST: RESTORE FROM GIT to be 100% clean
const { spawnSync } = require('child_process');
spawnSync('git', ['restore', 'public/assets/index-3qApb8rl.js']);

let content = fs.readFileSync(path, 'utf8');

console.log("Applying CONSOLIDATED SAFE patch...");

// 1. App (oe) State, Login & Prop Drills
content = content.replace(
    'let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)',
    'let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``),[u,s]=(0,b.useState)(null)'
);
content = content.replace(
    'iniciarSesionComo:(e,t)=>{r(e),a(t),o(e===`personal`?`panel-personal`:`panel-admin`)}})',
    'iniciarSesionComo:(e,t,u)=>{r(e),a(t),s(u),o(e===`personal`?`panel-personal`:`panel-admin`)}})'
);
content = content.replace(
    'e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})',
    'e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,idUsuario:u,actualizarPerfil:a})'
);
content = content.replace(
    'e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})',
    'e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,idUsuario:u,actualizarPerfil:a})'
);
content = content.replace(
    'e===`comunicar-averia`&&(0,x.jsx)(C,{navegar:o})',
    'e===`comunicar-averia`&&(0,x.jsx)(C,{navegar:o,idUsuario:u})'
);
content = content.replace(
    't(data.user.rol.toLowerCase()==="administrador"?"admin":data.user.rol.toLowerCase()==="mantenimiento"?"tecnico":"personal",data.user.nombre);',
    't(data.user.rol.toLowerCase()==="administrador"?"admin":data.user.rol.toLowerCase()==="mantenimiento"?"tecnico":"personal",data.user.nombre,data.user.id);'
);

// 2. ne Component Updated Signature (idUsuario:i_u)
content = content.replace(
    'function ne({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})',
    'function ne({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:i_u,actualizarPerfil:r})'
);

// 3. Logic: Data & Function
content = content.replace(
    'asignadoA:x.reparador?x.reparador.id:null})))',
    'asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada})))'
);
const h_end = 'res.ok)a(r=>r.map(x=>x.id===id?{...x,[field]:val}:x))})}';
content = content.replace(
    h_end,
    h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok)a(r=>r.map(x=>x.id===id?{...x,verificada:!0}:x))})}'
);

// 4. Filter logic (using i_u)
content = content.replace(
    'i=o.tecnico===``||e.asignadoA===o.tecnico,a=o.prioridad===``||e.prioridad===o.prioridad;return n&&r&&i&&a',
    'i=o.tecnico===``||e.asignadoA===o.tecnico,a=o.prioridad===``||e.prioridad===o.prioridad;return n&&r&&i&&a&&(t==="admin"||(e.asignadoA===i_u&&e.verificada))'
);

// 5. Button Injection
// Use strict string matching for children:ee[e.estado]})]
content = content.replace(
    'children:ee[e.estado]})]',
    'children:ee[e.estado]}),t==="admin"&&!e.verificada&&(0,x.jsx)(`button`,{onClick:()=>verificar(e.id),style:{marginLeft:`1rem`,padding:`.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`.8rem`},children:`CREAR / PUBLICAR`})]'
);

// 6. SAFE LOCKS (disabled instead of replacement)
content = content.replace(
    'className:`control-formulario select-sm`,value:e.prioridad',
    'className:`control-formulario select-sm`,value:e.prioridad,disabled:t!==`admin`'
);
content = content.replace(
    'className:`control-formulario select-sm`,value:e.asignadoA',
    'className:`control-formulario select-sm`,value:e.asignadoA,disabled:t!==`admin`'
);
content = content.replace(
    'onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado',
    'onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado,disabled:e.estado===`terminada`&&t!==`admin`'
);

fs.writeFileSync(path, content);
console.log("CONSOLIDATED SAFE Patch applied. Checking syntax...");
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());

console.log('Button search:', content.includes('CREAR / PUBLICAR'));
console.log('Disabled search:', content.includes('disabled:t!==`admin`'));
