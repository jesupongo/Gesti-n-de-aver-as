const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
let content = fs.readFileSync(path, 'utf8');

console.log("Applying Patch 2 (Logic & Button)...");

// 1. Data mapping: Add verificada
content = content.replace(
    'asignadoA:x.reparador?x.reparador.id:null})))',
    'asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada})))'
);

// 2. Add verificar function
const h_end = 'res.ok)a(r=>r.map(x=>x.id===id?{...x,[field]:val}:x))})}';
content = content.replace(
    h_end,
    h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok)a(r=>r.map(x=>x.id===id?{...x,verificada:!0}:x))})}'
);

// 3. Filter logic
content = content.replace(
    'i=o.tecnico===``||e.asignadoA===o.tecnico,a=o.prioridad===``||e.prioridad===o.prioridad;return n&&r&&i&&a',
    'i=o.tecnico===``||e.asignadoA===o.tecnico,a=o.prioridad===``||e.prioridad===o.prioridad;return n&&r&&i&&a&&(t==="admin"||(e.asignadoA===idUsuario&&e.verificada))'
);
// Wait, I used 'idUsuario' in the filter. I should use 'i_u' because that's the prop name in the minified 'ne'.
// Let's check the prop name for 'ne'.
// In repatch_p1.js I used: 'idUsuario:u'.
// Wait! Let's check the 'ne' definition in the file.
// I'll search for 'function ne({'
+ '';

fs.writeFileSync(path, content);
console.log("Patch 2 PRE-CHECK (Checking prop name)...");
// I'll use index to find the name of the 4th prop
const ne_start = content.indexOf('function ne({');
const prop_block = content.substring(ne_start, ne_start + 100);
console.log('Prop block:', prop_block);
