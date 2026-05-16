const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
const { spawnSync } = require('child_process');

spawnSync('git', ['restore', 'public/assets/index-3qApb8rl.js']);
let content = fs.readFileSync(path, 'utf8');

console.log("Applying INBOX WORKFLOW (Corrected) patch...");

// 1. App State & Login
content = content.replace('let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)', 'let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``),[u,s]=(0,b.useState)(null)');
content = content.replace('iniciarSesionComo:(e,t)=>{r(e),a(t),o(e===`personal`?`panel-personal`:`panel-admin`)}})', 'iniciarSesionComo:(e,rol,identificador)=>{r(e),a(rol),s(identificador),o(e===`personal`?`panel-personal`:`panel-admin`)}})');
content = content.replace('e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rol_u:n,nom_u:i,id_u:u,actualizarPerfil:a})');
content = content.replace('e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rol_u:n,nom_u:i,id_u:u,actualizarPerfil:a})');
content = content.replace('e===`comunicar-averia`&&(0,x.jsx)(C,{navegar:o})', 'e===`comunicar-averia`&&(0,x.jsx)(C,{navegar:o,id_u:u})');
content = content.replace(/t\(data\.user\.rol\.toLowerCase\(\)==="administrador"\?"admin":data\.user\.rol\.toLowerCase\(\)==="mantenimiento"\?"tecnico":"personal",data\.user\.nombre\);/, 't(data.user.rol.toLowerCase()==="administrador"?"admin":data.user.rol.toLowerCase()==="mantenimiento"?"tecnico":"personal",data.user.nombre,data.user.id);');

// 2. Component Signatures
content = content.replace('function C({navegar:e})', 'function C({navegar:e,id_u:id_u})');
content = content.replace('function ae({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ae({navegar:e,rol_u:rol_u,nom_u:nom_u,id_u:id_u,actualizarPerfil:r})');
content = content.replace('function ne({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ne({navegar:e,rol_u:rol_u,nom_u:nom_u,id_u:id_u,actualizarPerfil:r})');

// 3. ne (VistaAdmin) REAL FETCH AND VIEWMODE
content = content.replace(
    'let[i,a]=(0,b.useState)(te)',
    'let[i,a]=(0,b.useState)([]);let[vm,svm]=(0,b.useState)(`pendientes`);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{a(data.map(x=>({id:x.id,titulo:x.nombre,categoria:x.tipo,ubicacion:x.ubicacion,descripcion:x.descripcion,prioridad:x.valoracion.toLowerCase().replace(/_/g,"-"),estado:x.estado.toLowerCase().replace(/_/g,"-"),asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada,reportador:x.reportador?x.reportador.id:null})))})},[])'
);

// 4. h function and verificar in ne
const h_end = 'r.id===e?{...r,[t]:n}:r))';
content = content.replace(h_end, h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok)a(r=>r.map(x=>x.id===id?{...x,verificada:!0}:x))})}');

// 5. ne Filter logic
content = content.replace('return n&&r&&i&&a', 'return n&&r&&i&&a && (rol_u=="admin" ? (vm=="pendientes" ? !e.verificada : e.verificada) : (e.verificada && e.asignadoA==id_u))');

// 6. JSX Labels and Panel (ne)
content = content.replace('children:n||`Usuario`', 'children:nom_u||`Usuario`');
content = content.replace('children:[`Rol: `,t===`admin`?`Administrador`:`Técnico`]', 'children:[`Rol: `,rol_u===`admin`?`Administrador`:`Técnico`]');
content = content.replace('onClick:()=>{d(n||`Usuario`)', 'onClick:()=>{d(nom_u||`Usuario`)');

// 7. RESTORE AND ENHANCE BUTTONS HEADER (Fixed regex with backticks)
const buttons_header_target = /children:t===`admin`&&\(0,x\.jsxs\)\(x\.Fragment,\{children:\[\(0,x\.jsx\)\(`button`,\{onClick:_,className:`boton boton-secundario boton-header`,style:\{marginTop:0,whiteSpace:`nowrap`\},children:`Usuarios y Averías`\}\),\(0,x\.jsx\)\(`button`,\{onClick:v,className:`boton boton-secundario boton-header`,style:\{marginTop:0,whiteSpace:`nowrap`\},children:`\+ Crear Usuario`\}\)\]\}\)/;
const buttons_header_replacement = `children:(0,x.jsxs)(x.Fragment,{children:[
    rol_u=="admin" && (0,x.jsx)("button",{onClick:()=>svm("pendientes"),className:"boton "+(vm=="pendientes"?"boton-principal":"boton-secundario")+" boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Pendientes"}),
    rol_u=="admin" && (0,x.jsx)("button",{onClick:()=>svm("publicadas"),className:"boton "+(vm=="publicadas"?"boton-principal":"boton-secundario")+" boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Publicadas"}),
    rol_u=="admin" && (0,x.jsx)("button",{onClick:_,className:"boton boton-secundario boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Usuarios"}),
    rol_u=="admin" && (0,x.jsx)("button",{onClick:v,className:"boton boton-secundario boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"+ Crear Usuario"})
]})`;
content = content.replace(buttons_header_target, buttons_header_replacement);

// 8. ae (VistaPersonal) FETCH and labels
content = content.replace('[f,p]=(0,b.useState)([])', '[f,p]=(0,b.useState)([]);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{p(data.filter(av=>!id_u||(av.reportador&&av.reportador.id==id_u)).map(av=>({id:av.id,titulo:av.nombre,ubicacion:av.ubicacion,descripcion:av.descripcion,categoria:av.tipo,estado:av.estado.toLowerCase().replace(/_/g,"-"),fecha:new Date(av.fecha_comunica).toLocaleDateString()})))})},[id_u])');
content = content.replace('children:n||`Usuario`', 'children:nom_u||`Usuario`');
content = content.replace('children:[`Rol: `,t===`admin`?`Administrador`:`Técnico`]', 'children:[`Rol: `,rol_u===`admin`?`Administrador`:`Técnico`]');

// 9. REAL POST Replacement (800 and 600 timing)
content = content.replace('setTimeout(()=>{n(!1),alert(`¡Avería enviada con éxito! El equipo de mantenimiento la evaluará en breve.`),e(`bienvenida`)},800)', 'fetch("/averia",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:document.getElementById("nombre_averia").value,tipo:document.getElementById("tipo_averia").value,ubicacion:document.getElementById("ubicacion").value,descripcion:document.getElementById("descripcion").value,reportadorId:id_u})}).then(res=>{if(!res.ok)throw new Error();alert("¡Avería enviada con éxito!");e("bienvenida")}).catch(()=>alert("Error al enviar reporte")).finally(()=>n(!1))');
content = content.replace('setTimeout(()=>{d(!1),p([{id:Date.now(),titulo:t,ubicacion:n,descripcion:r,categoria:i,estado:`sin-empezar`,fecha:new Date().toLocaleDateString()},...f]),e.target.reset()},600)', 'fetch("/averia",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:t,tipo:i,ubicacion:n,descripcion:r,reportadorId:id_u})}).then(res=>{if(!res.ok)throw new Error();alert("¡Avería enviada con éxito!");window.location.reload()}).catch(()=>alert("Error al enviar reporte")).finally(()=>d(!1))');

// 10. UI Controls & Admin Button
content = content.replace('children:ee[e.estado]})]', 'children:ee[e.estado]}),rol_u=="admin"&&!e.verificada&&(0,x.jsx)(`button`,{onClick:()=>verificar(e.id),style:{marginLeft:`1rem`,padding:`.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`.8rem`},children:`CREAR / PUBLICAR`})]');
content = content.replace('className:`control-formulario select-sm`,value:e.prioridad', 'className:`control-formulario select-sm`,value:e.prioridad,disabled:rol_u!==`admin`');
content = content.replace('className:`control-formulario select-sm`,value:e.asignadoA', 'className:`control-formulario select-sm`,value:e.asignadoA,disabled:rol_u!==`admin`');
content = content.replace('onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado', 'onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado,disabled:e.estado===`terminada`&&rol_u!==`admin`');

fs.writeFileSync(path, content);
console.log("INBOX WORKFLOW (Corrected) Patch COMPLETED.");
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
