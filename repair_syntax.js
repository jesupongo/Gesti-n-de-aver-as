const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Starting syntax repair...");

// Fix Priority block
// It has "]]]]:[[" or similar
content = content.replace(
    'optionAcumulable`})]})]]:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsx)(`div`,{className:`valor-estatico`,style:{opacity:0.7},children:e.prioridad.toUpperCase()})]]})',
    'optionAcumulable`})]})] : [(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsx)(`div`,{className:`valor-estatico`,style:{opacity:0.7},children:e.prioridad.toUpperCase()})] })'
);

// Fix Assigned block
// It likely has similar issues
// Search for techs.map part
content = content.replace(
    't.nombre}))]})]]:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsx)(`div`,{className:`valor-estatico`,style:{opacity:0.7},children:techs.find(t=>t.id===e.asignadoA)?.nombre||`Yo`})]]})',
    't.nombre}))]})] : [(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsx)(`div`,{className:`valor-estatico`,style:{opacity:0.7},children:techs.find(t=>t.id===e.asignadoA)?.nombre||`Yo`})] })'
);

// Fix the start of the ternary too if I messed it up
// t==="admin"?[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsxs)(...
// t==="admin"?[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsxs)(...

// Check syntax again
fs.writeFileSync(path, content);
console.log("Syntax repair COMPLETED.");
