const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Total Reset of Dashboard Patches...");

// Restore Priority block to original observed state
const priority_original = '(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad,children:[(0,x.jsx)(`option`,{value:`critica`,children:`Crítica`}),(0,x.jsx)(`option`,{value:`menor`,children:`Menor`}),(0,x.jsx)(`option`,{value:`acumulable`,children:`Acumulable`})]})]';
// Use a generic regex to find and replace my failed ternary attempts
content = content.replace(/t==="admin"\?.+?prioridad\.toUpperCase\(\)\}\)\]+/, priority_original);

// Restore Assigned block
const assigned_original = '(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]})]';
content = content.replace(/t==="admin"\?.+?nombre\|\|`Yo`\}\)\]+/, assigned_original);

// Remove button
content = content.replace(/,t==="admin"&&!e\.verificada&&\(0,x\.jsx\)\(`button`,.+?children:`CREAR \/ PUBLICAR`\}\)/g, '');

// Fix any leftover extra brackets from failed fallback repairs
// Search for ]]}) or similar
// But be careful not to break valid ones.
// In the probe 1317, the valid sequence was: option_jsx_)] }) ] })
// So ]]})]}) was valid.
// My broken one had ]]]}) or similar.

fs.writeFileSync(path, content);
console.log("Total Reset COMPLETED. Checking syntax...");
const { spawnSync } = require('child_process');
const result = spawnSync('node', ['--check', path]);
if (result.status === 0) {
    console.log("SYNTAX IS VALID! RECOVERY SUCCESSFUL.");
} else {
    console.log("SYNTAX STILL INVALID.");
    console.log(result.stderr.toString());
}
