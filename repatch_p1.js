const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Applying Patch 1 (App State & Login)...");

// App (oe) state
content = content.replace(
    'let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)',
    'let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``),[u,s]=(0,b.useState)(null)'
);

// iniciarSesionComo callback in oe
content = content.replace(
    'iniciarSesionComo:(e,t)=>{r(e),a(t),o(e===`personal`?`panel-personal`:`panel-admin`)}})',
    'iniciarSesionComo:(e,t,u)=>{r(e),a(t),s(u),o(e===`personal`?`panel-personal`:`panel-admin`)}})'
);

// Prop drills in oe
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

// Login (S) capture
content = content.replace(
    't(data.user.rol.toLowerCase()==="administrador"?"admin":data.user.rol.toLowerCase()==="mantenimiento"?"tecnico":"personal",data.user.nombre);',
    't(data.user.rol.toLowerCase()==="administrador"?"admin":data.user.rol.toLowerCase()==="mantenimiento"?"tecnico":"personal",data.user.nombre,data.user.id);'
);

fs.writeFileSync(path, content);
console.log("Patch 1 COMPLETED.");
