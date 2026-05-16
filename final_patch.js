const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Starting FINAL surgical patch...");

// 1. Data mapping: Add verificada
// Find: asignadoA:x.reparador?x.reparador.id:null})))
// Add: ,verificada:x.verificada
content = content.replace(
    'asignadoA:x.reparador?x.reparador.id:null})))',
    'asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada})))'
);

// 2. Add manejarVerificar function
// We'll inject it next to manejarCambioAveria (h)
// Find: h=(id,field,val)=>{...res.ok)a(r=>r.map(x=>x.id===id?{...x,[field]:val}:x))})}
const h_end = 'res.ok)a(r=>r.map(x=>x.id===id?{...x,[field]:val}:x))})}';
content = content.replace(
    h_end,
    h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok)a(r=>r.map(x=>x.id===id?{...x,verificada:!0}:x))})}'
);

// 3. Filter logic: Add &&(t==="admin"||e.verificada)
// Current filter might already have my previous partial patch
// Find: return n&&r&&i&&a&&(t==="admin"||e.asignadoA===i_u)
content = content.replace(
    'return n&&r&&i&&a&&(t==="admin"||e.asignadoA===i_u)',
    'return n&&r&&i&&a&&(t==="admin"||(e.asignadoA===i_u&&e.verificada))'
);

// 4. Inject "CREAR / PUBLICAR" button for admins
// Find: labels[e.estado]}</span>
content = content.replace(
    'ee[e.estado]}</span>',
    'ee[e.estado]}</span>{t==="admin"&&!e.verificada&&(0,x.jsx)(`button`,{onClick:()=>verificar(e.id),className:`boton-crear-averia-admin`,style:{marginLeft:`1rem`,padding:`.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`.8rem`},children:`CREAR / PUBLICAR`})}'
);

// 5. Technician restriction: Hide Prioridad/Asignado selectors and show static values
// We'll find the Prioridad block and add a conditional
// Block starts with: (0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`})
// The select follows.
// Because it's minified, we need to be very precise.

// Original Priority Select wrapper:
// (0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsxs)(`select`,{...})]})
const priority_block = '(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsxs)(`select`,{name:`prioridad`,onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad,children:[(0,x.jsx)(`option`,{value:`critica`,children:`Crítica`}),(0,x.jsx)(`option`,{value:`menor`,children:`Menor`}),(0,x.jsx)(`option`,{value:`acumulable`,children:`Acumulable`})]})]})]';
const replacement_priority = 't==="admin"?(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsxs)(`select`,{name:`prioridad`,onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad,children:[(0,x.jsx)(`option`,{value:`critica`,children:`Crítica`}),(0,x.jsx)(`option`,{value:`menor`,children:`Menor`}),(0,x.jsx)(`option`,{value:`acumulable`,children:`Acumulable`})]})]}):(0,x.jsxs)(`div`,{style:{opacity:.7},children:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsx)(`div`,{className:`valor-estatico`,children:e.prioridad.toUpperCase()})]})]';

content = content.replace(priority_block, replacement_priority);

// Original Assignment Select wrapper:
// (0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]})]})]
const assigned_block = '(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]})]})]';
const replacement_assigned = 't==="admin"?(0,x.jsxs)(`div`,{children:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]})]}):(0,x.jsxs)(`div`,{style:{opacity:.7},children:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsx)(`div`,{className:`valor-estatico`,children:techs.find(t=>t.id===e.asignadoA)?.nombre||`Yo`})]})]';

content = content.replace(assigned_block, replacement_assigned);

// 6. Disable status change for techs if finished
// Find: onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado
content = content.replace(
    'onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado',
    'onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado,disabled:e.estado===`terminada`&&t!==`admin`'
);

fs.writeFileSync(path, content);
console.log("FINAL Surgical patch completed successfully.");
