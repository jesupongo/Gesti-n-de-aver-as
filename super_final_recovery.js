const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
// Restore from git to be certain of starting point
const { spawnSync } = require('child_process');
spawnSync('git', ['restore', 'public/assets/index-3qApb8rl.js']);

let content = fs.readFileSync(path, 'utf8');

console.log("Applying SUPER FINAL RECOVERY patch...");

// 1. App (oe) Foundation
content = content.replace(
    'let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)',
    'let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``),[u,s]=(0,b.useState)(null)'
);
content = content.replace(
    'iniciarSesionComo:(e,t)=>{r(e),a(t),o(e===`personal`?`panel-personal`:`panel-admin`)}})',
    'iniciarSesionComo:(e,t,u)=>{r(e),a(t),s(u),o(e===`personal`?`panel-personal`:`panel-admin`)}})'
);
content = content.replace(
    'e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})',
    'e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,idUsuario:u,actualizarPerfil:a})'
);
content = content.replace(
    'e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})',
    'e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,idUsuario:u,actualizarPerfil:a})'
);
content = content.replace(
    'e===`comunicar-averia`&&(0,x.jsx)(C,{navegar:o})',
    'e===`comunicar-averia`&&(0,x.jsx)(C,{navegar:o,idUsuario:u})'
);
content = content.replace(
    't(data.user.rol.toLowerCase()==="administrador"?"admin":data.user.rol.toLowerCase()==="mantenimiento"?"tecnico":"personal",data.user.nombre);',
    't(data.user.rol.toLowerCase()==="administrador"?"admin":data.user.rol.toLowerCase()==="mantenimiento"?"tecnico":"personal",data.user.nombre,data.user.id);'
);

// 2. Component Signatures
content = content.replace('function C({navegar:e})', 'function C({navegar:e,idUsuario:i_u})');
content = content.replace('function ae({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ae({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:i_u,actualizarPerfil:r})');
content = content.replace('function ne({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ne({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:i_u,actualizarPerfil:r})');

// 3. ne (VistaAdmin) REAL FETCH Injection
// Replace: let[i,a]=(0,b.useState)(te)
content = content.replace(
    'let[i,a]=(0,b.useState)(te)',
    'let[i,a]=(0,b.useState)([]);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{a(data.map(x=>({id:x.id,titulo:x.nombre,categoria:x.tipo,ubicacion:x.ubicacion,descripcion:x.descripcion,prioridad:x.valoracion.toLowerCase().replace(/_/g,"-"),estado:x.estado.toLowerCase().replace(/_/g,"-"),asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada,reportador:x.reportador?x.reportador.id:null})))})},[])'
);

// 4. h function and verificar in ne
const h_end = 'r.id===e?{...r,[t]:n}:r))';
content = content.replace(
    h_end,
    h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok)a(r=>r.map(x=>x.id===id?{...x,verificada:!0}:x))})}'
);

// 5. ne Filter Update (Technician view)
content = content.replace(
    'i=o.tecnico===``||e.asignadoA===o.tecnico,a=o.prioridad===``||e.prioridad===o.prioridad;return n&&r&&i&&a',
    'i=o.tecnico===``||e.asignadoA===o.tecnico,a=o.prioridad===``||e.prioridad===o.prioridad;return n&&r&&i&&a&&(t=="admin"||(e.asignadoA==i_u&&e.verificada))'
);

// 6. ae (VistaPersonal) REAL FETCH Injection
content = content.replace(
    '[f,p]=(0,b.useState)([])',
    '[f,p]=(0,b.useState)([]);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{p(data.filter(av=>!i_u||(av.reportador&&av.reportador.id==i_u)).map(av=>({id:av.id,titulo:av.nombre,ubicacion:av.ubicacion,descripcion:av.descripcion,categoria:av.tipo,estado:av.estado.toLowerCase().replace(/_/g,"-"),fecha:new Date(av.fecha_comunica).toLocaleDateString()})))})},[i_u])'
);

// 7. Replace ae and C mocks with real POST
const c_mock = /onSubmit:t=>{t\.preventDefault\(\),n\(!0\),setTimeout\(\(\)=>{n\(!1\),alert\(`¡Avería enviada con éxito! El equipo de mantenimiento la evaluará en breve\.`\),e\(`bienvenida`\)},1e3\)}/;
content = content.replace(c_mock, 'onSubmit:t=>{t.preventDefault(),n(!0);const a=document.getElementById("nombre_averia").value,o=document.getElementById("tipo_averia").value,c=document.getElementById("ubicacion").value,d=document.getElementById("descripcion").value;fetch("/averia",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:a,tipo:o,ubicacion:c,descripcion:d,reportadorId:i_u})}).then(res=>{if(!res.ok)throw new Error();alert("¡Avería enviada con éxito!");e("bienvenida")}).catch(()=>alert("Error al enviar reporte")).finally(()=>n(!1))}');

const ae_mock = /onSubmit:e=>{e\.preventDefault\(\);const t=e\.target\.elements\.nombre_averia\.value,n=e\.target\.elements\.ubicacion\.value,r=e\.target\.elements\.descripcion\.value,i=e\.target\.elements\.tipo_averia\.value;d\(!0\),setTimeout\(\(\)=>{d\(!1\),p\(\[\{id:Date\.now\(\),titulo:t,ubicacion:n,descripcion:r,categoria:i,estado:`sin-empezar`,fecha:new Date\(\)\.toLocaleDateString\(\)\}\]\)\},1e3\)}/;
content = content.replace(ae_mock, 'onSubmit:e=>{e.preventDefault();const t=e.target.elements.nombre_averia.value,n=e.target.elements.ubicacion.value,r=e.target.elements.descripcion.value,i=e.target.elements.tipo_averia.value;d(!0);fetch("/averia",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:t,tipo:i,ubicacion:n,descripcion:r,reportadorId:i_u})}).then(res=>{if(!res.ok)throw new Error();alert("¡Avería enviada con éxito!");window.location.reload()}).catch(()=>alert("Error al enviar reporte")).finally(()=>d(!1))}');

// 8. Admin button and locks
content = content.replace('children:ee[e.estado]})]', 'children:ee[e.estado]}),t==="admin"&&!e.verificada&&(0,x.jsx)(`button`,{onClick:()=>verificar(e.id),style:{marginLeft:`1rem`,padding:`.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`.8rem`},children:`CREAR / PUBLICAR`})]');
content = content.replace('className:`control-formulario select-sm`,value:e.prioridad', 'className:`control-formulario select-sm`,value:e.prioridad,disabled:t!==`admin`');
content = content.replace('className:`control-formulario select-sm`,value:e.asignadoA', 'className:`control-formulario select-sm`,value:e.asignadoA,disabled:t!==`admin`');
content = content.replace('onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado', 'onChange:t=>h(e.id,`estado`,t.target.value),className:`control-formulario select-sm`,value:e.estado,disabled:e.estado===`terminada`&&t!==`admin`');

fs.writeFileSync(path, content);
console.log("SUPER FINAL RECOVERY Patch COMPLETED.");
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
