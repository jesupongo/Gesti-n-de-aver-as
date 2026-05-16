const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
const { spawnSync } = require('child_process');

spawnSync('git', ['restore', 'public/assets/index-3qApb8rl.js']);
let content = fs.readFileSync(path, 'utf8');

console.log("Applying THE FINAL STAND...");

// 1. App Level (oe) - FORCING CONSISTENCY
content = content.replace('let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)', 'let[e,at]=(0,b.useState)(localStorage.getItem(`v`)||`bienvenida`),[r_u,sr]=(0,b.useState)(localStorage.getItem(`r`)),[n_u,sn]=(0,b.useState)(localStorage.getItem(`n`)||``),[i_u,si]=(0,b.useState)(localStorage.getItem(`u`))');

// Use sr, sn, si, at for setters
const login_logic = 'iniciarSesionComo:(rr,nn,ii)=>{localStorage.setItem(`v`,rr===`personal`?`panel-personal`:`panel-admin`),localStorage.setItem(`r`,rr),localStorage.setItem(`n`,nn),localStorage.setItem(`u`,ii),sr(rr),sn(nn),si(ii),at(rr===`personal`?`panel-personal`:`panel-admin`)}})';
content = content.replace('iniciarSesionComo:(e,t)=>{r(e),a(t),o(e===`personal`?`panel-personal`:`panel-admin`)}})', login_logic);

// Routing with consistent prop names: rol_u, nom_u, id_u
content = content.replace('e===`bienvenida`&&(0,x.jsx)(ee,{navegar:o})', 'e===`bienvenida`&&(0,x.jsx)(ee,{navegar:at})');
content = content.replace(/e==="acceso"&&\(0,x\.jsx\)\(S,\{navegar:o,iniciarSesionComo:.*\}\)/, 'e==="acceso"&&(0,x.jsx)(S,{navegar:at,iniciarSesionComo:(rr,nn,ii)=>{localStorage.setItem("v",rr==="personal"?"panel-personal":"panel-admin"),localStorage.setItem("r",rr),localStorage.setItem("n",nn),localStorage.setItem("u",ii),sr(rr),sn(nn),si(ii),at(rr==="personal"?"panel-personal":"panel-admin")}} )');
content = content.replace('e===`comunicar-averia`&&(0,x.jsx)(C,{navegar:o})', 'e===`comunicar-averia`&&(0,x.jsx)(C,{navegar:at,id_u:i_u})');
content = content.replace('e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-admin`&&(0,x.jsx)(ne,{navegar:at,rol_u:r_u,nom_u:n_u,id_u:i_u,actualizarPerfil:sn})');
content = content.replace('e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-personal`&&(0,x.jsx)(ae,{navegar:at,rol_u:r_u,nom_u:n_u,id_u:i_u,actualizarPerfil:sn})');
content = content.replace('e===`crear-usuario`&&(0,x.jsx)(ce,{navegar:o})', 'e===`crear-usuario`&&(0,x.jsx)(re,{navegar:at})');
content = content.replace('e===`usuarios-averias`&&(0,x.jsx)(re,{navegar:o,rolUsuario:n})', 'e===`usuarios-averias`&&(0,x.jsx)(ie,{navegar:at,rol_u:r_u})');

// 2. Signature Patching
content = content.replace('function C({navegar:e})', 'function C({navegar:e,id_u:id_u})');
content = content.replace('function ae({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ae({navegar:e,rol_u:rol_u,nom_u:nom_u,id_u:id_u,actualizarPerfil:r})');
content = content.replace('function ne({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ne({navegar:e,rol_u:rol_u,nom_u:nom_u,id_u:id_u,actualizarPerfil:r})');
content = content.replace('function ie({navegar:e,rolUsuario:t})', 'function ie({navegar:e,rol_u:rol_u})');

// 3. ne Logic (VistaAdmin)
content = content.replace('let[i,a]=(0,b.useState)(te)', 'let[i,a]=(0,b.useState)([]);let[vm,svm]=(0,b.useState)(`pendientes`);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{a(data.map(x=>({id:x.id,titulo:x.nombre,categoria:x.tipo,ubicacion:x.ubicacion,descripcion:x.descripcion,prioridad:x.valoracion.toLowerCase().replace(/_/g,"-"),estado:x.estado.toLowerCase().replace(/_/g,"-"),asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada,reportador:x.reportador?x.reportador.id:null})))})},[])');
// verificar with ALERT
const h_end = 'r.id===e?{...r,[t]:n}:r))';
content = content.replace(h_end, h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok){alert("¡Avería publicada con éxito!");a(r=>r.map(x=>x.id===id?{...x,verificada:!0}:x))}})}');
content = content.replace('return n&&r&&i&&a', 'const is_a=rol_u=="admin"||rol_u=="ADMINISTRADOR";return n&&r&&i&&a && (is_a ? (vm=="pendientes" ? !e.verificada : e.verificada) : (e.verificada && e.asignadoA==id_u))');

// Admin Header Buttons (Updated for rol_u)
const hb_orig = 'children:t===`admin`&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`button`,{onClick:_,className:`boton boton-secundario boton-header`,style:{marginTop:0,whiteSpace:`nowrap`},children:`Usuarios y Averías`}),(0,x.jsx)(`button`,{onClick:v,className:`boton boton-secundario boton-header`,style:{marginTop:0,whiteSpace:`nowrap`},children:`+ Crear Usuario`})]})';
const hb_new = `children:(0,x.jsxs)(x.Fragment,{children:[
  (0,x.jsx)("button",{onClick:()=>svm("pendientes"),className:"boton "+(vm=="pendientes"?"boton-principal":"boton-secundario")+" boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Pendientes"}),
  (0,x.jsx)("button",{onClick:()=>svm("publicadas"),className:"boton "+(vm=="publicadas"?"boton-principal":"boton-secundario")+" boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Publicadas"}),
  (0,x.jsx)("button",{onClick:_,className:"boton boton-secundario boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Usuarios"}),
  (0,x.jsx)("button",{onClick:v,className:"boton boton-secundario boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"+ Crear Usuario"})
]})`;
content = content.replace(hb_orig, hb_new);
content = content.replace('children:n||`Usuario`', 'children:nom_u||`Usuario`');
content = content.replace('children:[`Rol: `,t===`admin`?`Administrador`:`Técnico`]', 'children:[`Rol: `, (rol_u=="admin"||rol_u=="ADMINISTRADOR")?`Administrador`:`Técnico`]');

// 4. ie Logic (VistaUsuariosAverias)
content = content.replace('let[i,a]=(0,b.useState)(w)', 'let[i,a]=(0,b.useState)([]);(0,b.useEffect)(()=>{fetch(`/user`).then(res=>res.json()).then(data=>{a(data.map(u=>({id:u.id,nombre:u.nombre,rol:u.rol===`ADMINISTRADOR`?`Administrador`:u.rol===`MANTENIMIENTO`?`T\u00e9cnico`:`Personal`,correo:u.email,averiasComunicadas:[]})))})},[])');
content = content.replace('rolUsuario!==`admin`','!(rol_u==`admin`||rol_u==`ADMINISTRADOR`)');

// 5. ae Logic (VistaPersonal)
content = content.replace('[f,p]=(0,b.useState)([])', '[f,p]=(0,b.useState)([]);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{p(data.filter(av=>!id_u||(av.reportador&&av.reportador.id==id_u)).map(av=>({id:av.id,titulo:av.nombre,ubicacion:av.ubicacion,descripcion:av.descripcion,categoria:av.tipo,estado:av.estado.toLowerCase().replace(/_/g,"-"),fecha:new Date(av.fecha_comunica).toLocaleDateString()})))})},[id_u])');

// 6. REAL POST Replacement
content = content.replace('setTimeout(()=>{n(!1),alert(`¡Avería enviada con éxito! El equipo de mantenimiento la evaluará en breve.`),e(`bienvenida`)},800)', 'fetch("/averia",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:document.getElementById("nombre_averia").value,tipo:document.getElementById("tipo_averia").value,ubicacion:document.getElementById("ubicacion").value,descripcion:document.getElementById("descripcion").value,reportadorId:id_u})}).then(res=>{if(!res.ok)throw new Error();alert("¡Avería enviada con éxito!");e("bienvenida")}).catch(()=>alert("Error al enviar reporte")).finally(()=>n(!1))');
content = content.replace('setTimeout(()=>{d(!1),p([{id:Date.now(),titulo:t,ubicacion:n,descripcion:r,categoria:i,estado:`sin-empezar`,fecha:new Date().toLocaleDateString()},...f]),e.target.reset()},600)', 'fetch("/averia",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({nombre:t,tipo:i,ubicacion:n,descripcion:r,reportadorId:id_u})}).then(res=>{if(!res.ok)throw new Error();alert("¡Avería enviada con éxito!");window.location.reload()}).catch(()=>alert("Error al enviar reporte")).finally(()=>d(!1))');
content = content.replace('children:ee[e.estado]})]', 'children:ee[e.estado]}),(rol_u=="admin"||rol_u=="ADMINISTRADOR")&&!e.verificada&&(0,x.jsx)(`button`,{onClick:()=>verificar(e.id),style:{marginLeft:`1rem`,padding:`.4rem 1rem`,backgroundColor:`#2ecc71`,color:`white`,border:`none`,borderRadius:`4px`,cursor:`pointer`,fontWeight:`bold`,fontSize:`.8rem`},children:`CREAR / PUBLICAR`})]');

fs.writeFileSync(path, content);
console.log("THE FINAL STAND COMPLETED.");
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
