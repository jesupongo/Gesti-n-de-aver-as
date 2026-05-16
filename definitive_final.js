const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Applying DEFINITIVE FINAL patch...");

// 1. Update ne signature to accept idUsuario (i_u)
content = content.replace(
    'function ne({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})',
    'function ne({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:i_u,actualizarPerfil:r})'
);

// 2. Data mapping: Add verificada (if not added yet)
if (!content.includes('verificada:x.verificada')) {
    content = content.replace(
        'asignadoA:x.reparador?x.reparador.id:null})))',
        'asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada})))'
    );
}

// 3. Add verificar function
if (!content.includes('verificar=(id)=>{fetch')) {
    const h_end = 'res.ok)a(r=>r.map(x=>x.id===id?{...x,[field]:val}:x))})}';
    content = content.replace(
        h_end,
        h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok)a(r=>r.map(x=>x.id===id?{...x,verificada:!0}:x))})}'
    );
}

// 4. Update filter logic
content = content.replace(
    'i=o.tecnico===``||e.asignadoA===o.tecnico,a=o.prioridad===``||e.prioridad===o.prioridad;return n&&r&&i&&a',
    'i=o.tecnico===``||e.asignadoA===o.tecnico,a=o.prioridad===``||e.prioridad===o.prioridad;return n&&r&&i&&a&&(t==="admin"||(e.asignadoA===i_u&&e.verificada))'
);

// 5. Admin CREAR button
// Use the exact child injection observed: children:ee[e.estado]})]
content = content.replace(
    'children:ee[e.estado]})]',
    'children:ee[e.estado]}),t==="admin"&&!e.verificada&&(0,x.jsx)(`button`,{onClick:()=>verificar(e.id),style:{marginLeft:`1rem`,padding:`.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`.8rem`},children:`CREAR / PUBLICAR`})] )'
);
// Wait! I added a parenthetical closing at the end. Original was: children:ee[e.estado]})]
// So it should be: children:ee[e.estado]}), button)]
// No extra ' ) '.
content = content.replace('children:ee[e.estado]}),t==="admin"&&!e.verificada&&(0,x.jsx)(`button`,{onClick:()=>verificar(e.id),style:{marginLeft:`1rem`,padding:`.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`.8rem`},children:`CREAR / PUBLICAR`})] )', 
                          'children:ee[e.estado]}),t==="admin"&&!e.verificada&&(0,x.jsx)(`button`,{onClick:()=>verificar(e.id),style:{marginLeft:`1rem`,padding:`.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`.8rem`},children:`CREAR / PUBLICAR`})]');
// Wait! I need to be EXTREMELY CAREFUL with the trailing brackets of the array.
// Original: ... children:ee[e.estado] } ) ]
// If I want to add a second element to the array:
// ... children:ee[e.estado] }), (0,x.jsx)(button) ]

content = fs.readFileSync(path, 'utf8'); // Reload to be clean
content = content.replace(
    'children:ee[e.estado]})]',
    'children:ee[e.estado]}),t==="admin"&&!e.verificada&&(0,x.jsx)(`button`,{onClick:()=>verificar(e.id),style:{marginLeft:`1rem`,padding:`.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`.8rem`},children:`CREAR / PUBLICAR`})]'
);

// 6. Technician lockdowns (SAFE WAY - only disable/display conditional inside existing array)
// Instead of replacing TWO elements with a ternary array, I'll patch each element individually to use t==="admin"

// Priority Label: no change needed.
// Priority Select: add disabled or wrap it.
content = content.replace(
    'children:`Prioridad`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad,children:[(0,x.jsx)(`option`,{value:`critica`,children:`Crítica`}),(0,x.jsx)(`option`,{value:`menor`,children:`Menor`}),(0,x.jsx)(`option`,{value:`acumulable`,children:`Acumulable`})]})',
    'children:t==="admin"?`Prioridad`:`Prioridad (Lectura)`}),t==="admin"?(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`prioridad`,t.target.value),className:`control-formulario select-sm`,value:e.prioridad,children:[(0,x.jsx)(`option`,{value:`critica`,children:`Crítica`}),(0,x.jsx)(`option`,{value:`menor`,children:`Menor`}),(0,x.jsx)(`option`,{value:`acumulable`,children:`Acumulable`})]}):(0,x.jsx)(`div`,{className:`valor-estatico`,style:{opacity:0.7},children:e.prioridad.toUpperCase()})'
);

// Assigned To Select
content = content.replace(
    'children:`Asignado a`}),(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]})',
    'children:t==="admin"?`Asignado a`:`Asignado a (Lectura)`}),t==="admin"?(0,x.jsxs)(`select`,{onChange:t=>h(e.id,`asignadoA`,t.target.value),className:`control-formulario select-sm`,value:e.asignadoA,children:[...techs.map(t=>(0,x.jsx)("option",{value:t.id,children:t.nombre}))]}):(0,x.jsx)(`div`,{className:`valor-estatico`,style:{opacity:0.7},children:techs.find(at=>at.id===e.asignadoA)?.nombre||`Yo`})'
);

// 7. Status restriction
content = content.replace(
    'onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado',
    'onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado,disabled:e.estado===`terminada`&&t!==`admin`'
);

fs.writeFileSync(path, content);
console.log("DEFINITIVE FINAL Patch COMPLETED.");
