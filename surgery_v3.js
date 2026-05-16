const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
const { spawnSync } = require('child_process');

spawnSync('git', ['restore', 'public/assets/index-3qApb8rl.js']);
let content = fs.readFileSync(path, 'utf8');

console.log("Applying SURGERY V3 DEFINITIVE (Shadow-Safe)...");

// 1. App Level (oe) - Signature & State
// Using _v, _r, _n, _u as global setters to avoid conflicts
content = content.replace('let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)', 'let[e,t_v]=(0,b.useState)(localStorage.getItem(`v`)||`bienvenida`),[n_r,s_r]=(0,b.useState)(localStorage.getItem(`r`)),[i_n,s_n]=(0,b.useState)(localStorage.getItem(`n`)||``),[u_i,s_i]=(0,b.useState)(localStorage.getItem(`u`))');

// Re-map Navegar (o) to use local storage
content = content.replace('t(e),n&&window.history.pushState({viewId:e},``,``)', 't_v(e),localStorage.setItem(`v`,e),n&&window.history.pushState({viewId:e},``,``)');

// Login Patch - Use s_r, s_n, s_i
const login_orig = 'iniciarSesionComo:(e,t)=>{r(e),a(t),o(e===`personal`?`panel-personal`:`panel-admin`)}})';
const login_new = 'iniciarSesionComo:(_role,_name,_uid)=>{localStorage.setItem(`r`,_role),localStorage.setItem(`n`,_name),localStorage.setItem(`u`,_uid),s_r(_role),s_n(_name),s_i(_uid),o(_role===`personal`?`panel-personal`:`panel-admin`)}})';
content = content.replace(login_orig, login_new);

// Logout
content = content.replace('onClick:g', 'onClick:()=>{localStorage.clear(),window.location.reload()}');

// 2. Component Call Props (using n_r, i_n, u_i)
content = content.replace('e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rol_u:n_r,nom_u:i_n,id_u:u_i,actualizarPerfil:s_n})');
content = content.replace('e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rol_u:n_r,nom_u:i_n,id_u:u_i,actualizarPerfil:s_n})');
content = content.replace('e===`usuarios-averias`&&(0,x.jsx)(ie,{navegar:o,rolUsuario:n})', 'e===`usuarios-averias`&&(0,x.jsx)(ie,{navegar:o,rol_u:n_r})');

// 3. Component Signatures (SHADOW-SAFE NAMES)
content = content.replace('function ne({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ne({navegar:e,rol_u:_role,nom_u:_name,id_u:_uid,actualizarPerfil:_set})');
content = content.replace('function ae({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ae({navegar:e,rol_u:_role,nom_u:_name,id_u:_uid,actualizarPerfil:_set})');
content = content.replace('function ie({navegar:e,rolUsuario:t})', 'function ie({navegar:e,rol_u:_role})');

// 4. VistaAdmin (ne) Logic
content = content.replace('let[i,a]=(0,b.useState)(te)', 'let[i,a]=(0,b.useState)([]);let[vm,svm]=(0,b.useState)(`pendientes`);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{a(data.map(x=>({id:x.id,titulo:x.nombre,categoria:x.tipo,ubicacion:x.ubicacion,descripcion:x.descripcion,prioridad:x.valoracion.toLowerCase().replace(/_/g,"-"),estado:x.estado.toLowerCase().replace(/_/g,"-"),asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada,reportador:x.reportador?x.reportador.id:null})))})},[])');

// verificar with ALERT
const h_end = 'r.id===e?{...r,[t]:n}:r))';
content = content.replace(h_end, h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok){alert("¡Avería publicada con éxito!");a(curr=>curr.map(x=>x.id===id?{...x,verificada:!0}:x))}})}');

// Filter with SHADOW-SAFE Role check
content = content.replace('return n&&r&&i&&a', 'const is_a=(_role||"").toLowerCase()=="admin";return n&&r&&i&&a&&(is_a?(vm=="pendientes"?!e.verificada:e.verificada):(e.verificada&&e.asignadoA==_uid))');

// Admin Header Buttons
const hb_orig = 'children:t===`admin`&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`button`,{onClick:_,className:`boton boton-secundario boton-header`,style:{marginTop:0,whiteSpace:`nowrap`},children:`Usuarios y Averías`}),(0,x.jsx)(`button`,{onClick:v,className:`boton boton-secundario boton-header`,style:{marginTop:0,whiteSpace:`nowrap`},children:`+ Crear Usuario`})]})';
const hb_new = `children:((_role||"").toLowerCase()=="admin")&&(0,x.jsxs)(x.Fragment,{children:[
  (0,x.jsx)("button",{onClick:()=>svm("pendientes"),className:"boton "+(vm=="pendientes"?"boton-principal":"boton-secundario")+" boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Pendientes"}),
  (0,x.jsx)("button",{onClick:()=>svm("publicadas"),className:"boton "+(vm=="publicadas"?"boton-principal":"boton-secundario")+" boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Publicadas"}),
  (0,x.jsx)("button",{onClick:_,className:"boton boton-secundario boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Usuarios"}),
  (0,x.jsx)("button",{onClick:v,className:"boton boton-secundario boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"+ Crear Usuario"})
]})`;
content = content.replace(hb_orig, hb_new);

// UI Profile Labels in ne
content = content.replace('children:n||`Usuario`', 'children:_name||`Usuario`');
content = content.replace('children:[`Rol: `,t===`admin`?`Administrador`:`Técnico`]', 'children:[`Rol: `, ((_role||"").toLowerCase()=="admin")?`Administrador`:`Técnico`]');

// 5. VistaPersonal (ae) fetch - Use _uid
content = content.replace('[f,p]=(0,b.useState)([])', '[f,p]=(0,b.useState)([]);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{p(data.filter(av=>!(_uid)||(av.reportador&&av.reportador.id==_uid)).map(av=>({id:av.id,titulo:av.nombre,ubicacion:av.ubicacion,descripcion:av.descripcion,categoria:av.tipo,estado:av.estado.toLowerCase().replace(/_/g,"-"),fecha:new Date(av.fecha_comunica).toLocaleDateString()})))})},[_uid])');

// 6. VistaUsuariosAverias (ie) REAL FETCH - Avoid shadowing role
content = content.replace('let[i,a]=(0,b.useState)(w)', 'let[i,a]=(0,b.useState)([]);(0,b.useEffect)(()=>{fetch(`/user`).then(res=>res.json()).then(data=>{a(data.map(u=>({id:u.id,nombre:u.nombre,rol:u.rol===`ADMINISTRADOR`?`Administrador`:u.rol===`MANTENIMIENTO`?`T\u00e9cnico`:`Personal`,correo:u.email,averiasComunicadas:[]})))})},[])');
content = content.replace('rolUsuario!==`admin`','!((_role||"").toLowerCase()=="admin")');

fs.writeFileSync(path, content);
console.log("SURGERY V3 DEFINITIVE COMPLETED.");
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
