const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Starting surgical patch...");

// 1. Patch App (oe) state and prop drill
// Find: [i,a]=(0,b.useState)(``)
// Add: ,[u,s]=(0,b.useState)(null)
content = content.replace(
    'let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)',
    'let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``),[u,s]=(0,b.useState)(null)'
);

// Update iniciarSesionComo callback
content = content.replace(
    'iniciarSesionComo:(e,t)=>{r(e),a(t),o(e===`personal`?`panel-personal`:`panel-admin`)}})',
    'iniciarSesionComo:(e,t,u)=>{r(e),a(t),s(u),o(e===`personal`?`panel-personal`:`panel-admin`)}})'
);

// Pass idUsuario to components
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

// 2. Patch VistaAcceso (S) to capture idUsuario
content = content.replace(
    't(data.user.rol.toLowerCase()==="administrador"?"admin":data.user.rol.toLowerCase()==="mantenimiento"?"tecnico":"personal",data.user.nombre);',
    't(data.user.rol.toLowerCase()==="administrador"?"admin":data.user.rol.toLowerCase()==="mantenimiento"?"tecnico":"personal",data.user.nombre,data.user.id);'
);

// 3. Patch VistaAdmin (ne) for filtering and UI locks
// Update props to include idUsuario (using name 'i_u' since 'i' is taken)
content = content.replace(
    'function ne({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})',
    'function ne({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:i_u,actualizarPerfil:r})'
);

// Update Filter logic: y=i.filter(...)
// Original: i=o.tecnico===``||e.asignadoA===o.tecnico,a=o.prioridad===``||e.prioridad===o.prioridad;return n&&r&&i&&a
content = content.replace(
    'i=o.tecnico===``||e.asignadoA===o.tecnico,a=o.prioridad===``||e.prioridad===o.prioridad;return n&&r&&i&&a',
    'i=o.tecnico===``||e.asignadoA===o.tecnico,a=o.prioridad===``||e.prioridad===o.prioridad;return n&&r&&i&&a&&(t==="admin"||e.asignadoA===i_u)'
);

// Update Admin Title
content = content.replace(
    'children:`Gestión de Averías`',
    'children:(t==="admin"?`Gestión de Averías`:`Mis Averías Asignadas`)'
);

// Update welcome message
content = content.replace(
    'children:`Bienvenido, Equipo Coordinador`',
    'children:(t==="admin"?`Bienvenido, Equipo Coordinador`:`Bienvenido, Equipo de Mantenimiento`)'
);

// Disable selects for non-admins
// Priority select
content = content.replace(
    'name:`prioridad`,onChange:e=>h(x.id,`prioridad`,e.target.value),className:`control-formulario select-sm`,value:x.prioridad',
    'name:`prioridad`,onChange:e=>h(x.id,`prioridad`,e.target.value),className:`control-formulario select-sm`,value:x.prioridad,disabled:t!==`admin`'
);
// Assignment select
content = content.replace(
    'onChange:e=>h(x.id,`asignadoA`,e.target.value),className:`control-formulario select-sm`,value:x.asignadoA',
    'onChange:e=>h(x.id,`asignadoA`,e.target.value),className:`control-formulario select-sm`,value:x.asignadoA,disabled:t!==`admin`'
);

// 4. Patch VistaCrearAveria (C) for reportadorId
content = content.replace(
    'function C({navegar:e})',
    'function C({navegar:e,idUsuario:t_u})'
);
content = content.replace(
    'body:JSON.stringify({nombre,tipo,ubicacion,descripcion})',
    'body:JSON.stringify({nombre,tipo,ubicacion,descripcion,reportadorId:t_u})'
);

fs.writeFileSync(path, content);
console.log("Surgical patch completed successfully.");
