const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Starting definitive syntax repair...");

// 1. Fix Priority block error
const broken_priority = 't==="admin"?[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad,children:[(0,x.jsx)(`option`,{value:`critica`,children:`Crítica`}),(0,x.jsx)(`option`,{value:`menor`,children:`Menor`}),(0,x.jsx)(`option`,{value:`acumulable`,children:`Acumulable`})]})]]:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsx)(`div`,{className:`valor-estatico`,style:{opacity:0.7},children:e.prioridad.toUpperCase()})]]';
const fixed_priority = '[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad,children:[(0,x.jsx)(`option`,{value:`critica`,children:`Crítica`}),(0,x.jsx)(`option`,{value:`menor`,children:`Menor`}),(0,x.jsx)(`option`,{value:`acumulable`,children:`Acumulable`})]})]';

if (content.includes(broken_priority)) {
    console.log("Found broken priority, fixing...");
    content = content.replace(broken_priority, fixed_priority);
} else {
    console.log("Broken priority NOT found by exact match. Trying sub-matches...");
    // Fallback: search for only the problematic transition ]]]:[[
    content = content.replace(']})]]:[(0,x.jsx)', ']})]:[(0,x.jsx)');
    content = content.replace('toUpperCase()})]]', 'toUpperCase()})]');
}

// 2. Fix Assigned block error
const broken_assigned = 't==="admin"?[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]})]]:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsx)(`div`,{className:`valor-estatico`,style:{opacity:0.7},children:techs.find(t=>t.id===e.asignadoA)?.nombre||`Yo`})]]';
const fixed_assigned = '[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]})]';

if (content.includes(broken_assigned)) {
    console.log("Found broken assigned, fixing...");
    content = content.replace(broken_assigned, fixed_assigned);
} else {
    console.log("Broken assigned NOT found by exact match.");
    // Manual bracket fix for assigned
    content = content.replace('n}))]})]]:[(0,x.jsx)', 'n}))]})]:[(0,x.jsx)');
    // Wait, let's fix the ending which doesn't have a unique string but uses ||`Yo`
    content = content.replace('||`Yo`})]]', '||`Yo`})]');
}

fs.writeFileSync(path, content);
console.log("Definitive syntax repair COMPLETED.");
