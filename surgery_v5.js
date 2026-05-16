const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
const { spawnSync } = require('child_process');

spawnSync('git', ['restore', 'public/assets/index-3qApb8rl.js']);
let content = fs.readFileSync(path, 'utf8');

console.log("Applying SURGERY V5 (Final Case-Insensitive Admin Fix)...");

// 1. VistaAdmin (ne) - Fix the is_a check to include "ADMINISTRADOR"
content = content.replace('const is_a=(t||"").toLowerCase()=="admin"', 'const is_a=/admin/i.test(t||"")');
content = content.replace('t==="admin"&&(0,x.jsxs)', '/admin/i.test(t||"")&&(0,x.jsxs)');

// Ensure the mapping and fetching is active
// This was already in V4 but I'll ensure it stays
if (!content.includes('fetch(`/averia`)')) {
    console.log("Re-injecting averia fetch...");
    content = content.replace('let[i,a]=(0,b.useState)(te)', 'let[i,a]=(0,b.useState)([]);let[vm,svm]=(0,b.useState)(`pendientes`);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{a(data.map(x=>({id:x.id,titulo:x.nombre,categoria:x.tipo,ubicacion:x.ubicacion,descripcion:x.descripcion,prioridad:x.valoracion.toLowerCase().replace(/_/g,"-"),estado:x.estado.toLowerCase().replace(/_/g,"-"),asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada,reportador:x.reportador?x.reportador.id:null})))})},[])');
}

// 2. VistaUsuariosAverias (ie) - Already working based on screenshot, but strengthening the check
content = content.replace('t==="admin"||t==="ADMINISTRADOR"', '/admin/i.test(t||"")');

// 3. App (oe) - Pass consistent props
// let[e,t_v]=(0,b.useState)(localStorage.getItem(`v`)||`bienvenida`),[n,r_s]=(0,b.useState)(localStorage.getItem(`r`)),[i,a_s]=(0,b.useState)(localStorage.getItem(`n`)||``),[u,u_s]=(0,b.useState)(localStorage.getItem(`u`))
// This was V4.

// 4. Persistence for all view changes
content = content.replace('t_v(e),n&&window.history.pushState({viewId:e},``,``)', 't_v(e),localStorage.setItem(`v`,e),n&&window.history.pushState({viewId:e},``,``)');

// 5. Verification alert fix (Ensure single alert and correct update)
// The previous patch might have had a syntax error in the nested arrow function for setter a(curr => ...).
// I'll re-apply the verificar function clearly.
const h_end = 'r.id===e?{...r,[t]:n}:r))';
if (!content.includes('verificar=(id)')) {
    content = content.replace(h_end, h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok){alert("¡Avería publicada con éxito!");a(curr=>curr.map(x=>x.id===id?{...x,verificada:!0}:x))}})}');
}

fs.writeFileSync(path, content);
console.log("SURGERY V5 COMPLETED.");
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
