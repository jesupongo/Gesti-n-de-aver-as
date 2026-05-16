const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Starting DEFINITIVE DEFINITIVE surgical patch...");

// 1. Data mapping: Add verificada
if (!content.includes('verificada:x.verificada')) {
    content = content.replace(
        'asignadoA:x.reparador?x.reparador.id:null})))',
        'asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada})))'
    );
}

// 2. Add manejarVerificar (verificar)
if (!content.includes('verificar=(id)=>{fetch')) {
    const h_end = 'res.ok)a(r=>r.map(x=>x.id===id?{...x,[field]:val}:x))})}';
    content = content.replace(
        h_end,
        h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok)a(r=>r.map(x=>x.id===id?{...x,verificada:!0}:x))})}'
    );
}

// 3. Filter logic
content = content.replace(
    'return n&&r&&i&&a&&(t==="admin"||e.asignadoA===i_u)',
    'return n&&r&&i&&a&&(t==="admin"||(e.asignadoA===i_u&&e.verificada))'
);

// 4. CREAR button
if (!content.includes('CREAR / PUBLICAR')) {
    // Find: ee[e.estado]}</span>
    // Note: ee might be different name, but probe shows 'ee' is near
    content = content.replace(
        'ee[e.estado]}</span>',
        'ee[e.estado]}</span>{t==="admin"&&!e.verificada&&(0,x.jsx)(`button`,{onClick:()=>verificar(e.id),style:{marginLeft:`1rem`,padding:`.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`.8rem`},children:`CREAR / PUBLICAR`})}'
    );
}

// 5. Priority Block Replacement
const priority_target = '(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad,children:[(0,x.jsx)(`option`,{value:`critica`,children:`Crítica`}),(0,x.jsx)(`option`,{value:`menor`,children:`Menor`}),(0,x.jsx)(`option`,{value:`acumulable`,children:`Acumulable`})]})';
const priority_replace = 't==="admin"?[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad,children:[(0,x.jsx)(`option`,{value:`critica`,children:`Crítica`}),(0,x.jsx)(`option`,{value:`menor`,children:`Menor`}),(0,x.jsx)(`option`,{value:`acumulable`,children:`Acumulable`})]})]]:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Prioridad`}),(0,x.jsx)(`div`,{className:`valor-estatico`,style:{opacity:0.7},children:e.prioridad.toUpperCase()})]';

if (content.includes(priority_target)) {
    content = content.replace(priority_target, priority_replace);
    console.log("Priority block patched.");
} else {
    console.log("Priority block NOT found. Trying alternative label matches...");
    // Fallback: search for only the select part
    const priority_select = '(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad';
    content = content.replace(
        priority_select,
        't==="admin"?' + priority_select
    );
}

// 6. Assigned To Block Replacement
const assigned_target = '(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]})';
const assigned_replace = 't==="admin"?[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]})]]:[(0,x.jsx)(`label`,{className:`etiqueta-formulario label-sm`,children:`Asignado a`}),(0,x.jsx)(`div`,{className:`valor-estatico`,style:{opacity:0.7},children:techs.find(t=>t.id===e.asignadoA)?.nombre||`Yo`})]';

if (content.includes(assigned_target)) {
    content = content.replace(assigned_target, assigned_replace);
    console.log("Assigned block patched.");
}

// 7. Status change restriction
content = content.replace(
    'onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado',
    'onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado,disabled:e.estado===`terminada`&&t!==`admin`'
);

fs.writeFileSync(path, content);
console.log("DEFINITIVE DEFINITIVE Surgical patch COMPLETED.");
