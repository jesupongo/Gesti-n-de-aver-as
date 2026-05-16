const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Reverting dashboard patches...");

// Revert Priority block
// It currently has something like t==="admin"? [label, select] : [label, div]
// We want to restore JUST the label and select part (which was the original content of the array)
const priority_reverted = '(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad,children:[(0,x.jsx)(`option`,{value:`critica`,children:`Crítica`}),(0,x.jsx)(`option`,{value:`menor`,children:`Menor`}),(0,x.jsx)(`option`,{value:`acumulable`,children:`Acumulable`})]})';

content = content.replace(/t==="admin"\?\[\(0,x\.jsx\)\(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}\),\(0,x\.jsxs\)\(`select`,{onChange:t=>h\(e\.id,`prioridad`,t\.target\.value\),className:`control-formulario select-sm`,value:e\.prioridad,children:\[\(0,x\.jsx\)\(`option`,{value:`critica`,children:`Crítica`}\),\(0,x\.jsx\)\(`option`,{value:`menor`,children:`Menor`}\),\(0,x\.jsx\)\(`option`,{value:`acumulable`,children:`Acumulable`}\)\]}\)\]:\[\(0,x\.jsx\)\(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}\),\(0,x\.jsx\)\(`div`,{className:`valor-estatico`,style:{opacity:0\.7},children:e\.prioridad\.toUpperCase\(\)}\)\]/g, priority_reverted);

// Revert Assigned block
const assigned_reverted = '(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]})';

content = content.replace(/t==="admin"\?\[\(0,x\.jsx\)\(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}\),\(0,x\.jsxs\)\(`select`,{onChange:t=>h\(e\.id,`asignadoA`,t\.target\.value\),className:`control-formulario select-sm`,value:e\.asignadoA,children:\[\.\.\.techs\.map\(t=>\(0,x\.jsx\)\("option",{value:t\.id,children:t\.nombre}\)\)\]}\)\]:\[\(0,x\.jsx\)\(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}\),\(0,x\.jsx\)\(`div`,{className:`valor-estatico`,style:{opacity:0\.7},children:techs\.find\(t=>t\.id===e\.asignadoA\)\?\.nombre\|\|`Yo`}\)\]/g, assigned_reverted);

// Revert button
content = content.replace(/,t==="admin"&&!e\.verificada&&\(0,x\.jsx\)\(`button`,{onClick:\(\)=>verificar\(e\.id\),className:`boton-crear-averia-admin`,style:{marginLeft:`1rem`,padding:`\.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`\.8rem`},children:`CREAR \/ PUBLICAR`}\)/g, '');

fs.writeFileSync(path, content);
console.log("Revert COMPLETED.");
