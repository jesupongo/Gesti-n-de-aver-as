const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("BRUTE FORCE RECOVERY...");

// Find the problematic area around Priority
// We'll search for the literal corrupted fragments I saw in probe_brackets_all.js

// Problem fragment 1: optionAcumulable`})]})]]:[(0,x.jsx)
// We'll replace the ENTIRE broken ternary block for Priority.
// The block starts with t==="admin"? and ends with .toUpperCase()})]]]
// Wait, regex is safer.

const priorityRegex = /t==="admin"\?\[.+?toUpperCase\(\)\}\)\]+/;
content = content.replace(priorityRegex, '(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad,children:[(0,x.jsx)(`option`,{value:`critica`,children:`Crítica`}),(0,x.jsx)(`option`,{value:`menor`,children:`Menor`}),(0,x.jsx)(`option`,{value:`acumulable`,children:`Acumulable`})]})');

// Problem fragment 2: Assigned To
const assignedRegex = /t==="admin"\?\[.+?\|\|`Yo`\}\)\]+/;
content = content.replace(assignedRegex, '(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]})');

// Remove Admin button
content = content.replace(/,t==="admin"&&!e\.verificada&&\(0,x\.jsx\)\(`button`,.+?children:`CREAR \/ PUBLICAR`\}\)/, '');

// Fix any leftover corrupted transitions
content = content.replace(']}]})', ']})'); // Potential leftover bracket
content = content.replace('] ) ] } )', ']})');

fs.writeFileSync(path, content);
console.log("Brute force recovery COMPLETED. Checking syntax...");

const { spawnSync } = require('child_process');
const result = spawnSync('node', ['--check', path]);
if (result.status === 0) {
    console.log("SYNTAX VALID!");
} else {
    console.log("SYNTAX STILL INVALID:");
    console.log(result.stderr.toString());
}
