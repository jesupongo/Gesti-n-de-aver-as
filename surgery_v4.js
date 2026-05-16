const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
const { spawnSync } = require('child_process');

spawnSync('git', ['restore', 'public/assets/index-3qApb8rl.js']);
let content = fs.readFileSync(path, 'utf8');

console.log("Applying SURGERY V4 (Full Variable Reconciliation)...");

// 1. App Level (oe)
// Identity states: n=role, i=name, u=id
content = content.replace('let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)', 'let[e,t_v]=(0,b.useState)(localStorage.getItem(`v`)||`bienvenida`),[n,r_s]=(0,b.useState)(localStorage.getItem(`r`)),[i,a_s]=(0,b.useState)(localStorage.getItem(`n`)||``),[u,u_s]=(0,b.useState)(localStorage.getItem(`u`))');

// Navegar (o)
content = content.replace('t(e),n&&window.history.pushState({viewId:e},``,``)', 't_v(e),localStorage.setItem(`v`,e),n&&window.history.pushState({viewId:e},``,``)');

// Login logic
const login_orig = 'iniciarSesionComo:(e,t)=>{r(e),a(t),o(e===`personal`?`panel-personal`:`panel-admin`)}})';
const login_new = 'iniciarSesionComo:(_r,_n,_id)=>{localStorage.setItem(`r`,_r),localStorage.setItem(`n`,_n),localStorage.setItem(`u`,_id),r_s(_r),a_s(_n),u_s(_id),o(_r===`personal`?`panel-personal`:`panel-admin`)}})';
content = content.replace(login_orig, login_new);

// Logout
content = content.replace('onClick:g', 'onClick:()=>{localStorage.clear(),window.location.reload()}');

// Admin & Personal Calls - ADDING idUsuario:u
content = content.replace('e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,idUsuario:u,actualizarPerfil:a_s})');
content = content.replace('e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,idUsuario:u,actualizarPerfil:a_s})');
content = content.replace('e===`usuarios-averias`&&(0,x.jsx)(ie,{navegar:o,rolUsuario:n})', 'e===`usuarios-averias`&&(0,x.jsx)(ie,{navegar:o,rolUsuario:n})');

// 2. Signatures (Adding idUsuario:id_u)
content = content.replace('function ne({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ne({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:id_u,actualizarPerfil:r})');
content = content.replace('function ae({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ae({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:id_u,actualizarPerfil:r})');

// 3. VistaAdmin (ne) Logic - Use `t` for role, `id_u` for ID
content = content.replace('let[i,a]=(0,b.useState)(te)', 'let[i,a]=(0,b.useState)([]);let[vm,svm]=(0,b.useState)(`pendientes`);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{a(data.map(x=>({id:x.id,titulo:x.nombre,categoria:x.tipo,ubicacion:x.ubicacion,descripcion:x.descripcion,prioridad:x.valoracion.toLowerCase().replace(/_/g,"-"),estado:x.estado.toLowerCase().replace(/_/g,"-"),asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada,reportador:x.reportador?x.reportador.id:null})))})},[])');

const h_end = 'r.id===e?{...r,[t]:n}:r))';
content = content.replace(h_end, h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok){alert("¡Avería publicada con éxito!");a(curr=>curr.map(x=>x.id===id?{...x,verificada:!0}:x))}})}');

// Filter - Use `t` as role
content = content.replace('return n&&r&&i&&a', 'const is_a=(t||"").toLowerCase()=="admin";return n&&r&&i&&a&&(is_a?(vm=="pendientes"?!e.verificada:e.verificada):(e.verificada&&e.asignadoA==id_u))');

// Admin Header Toggle Buttons - Use `t`
const hb_orig = 'children:t===`admin`&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`button`,{onClick:_,className:`boton boton-secundario boton-header`,style:{marginTop:0,whiteSpace:`nowrap`},children:`Usuarios y Averías`}),(0,x.jsx)(`button`,{onClick:v,className:`boton boton-secundario boton-header`,style:{marginTop:0,whiteSpace:`nowrap`},children:`+ Crear Usuario`})]})';
const hb_new = `children:(t==="admin"||t==="ADMINISTRADOR")&&(0,x.jsxs)(x.Fragment,{children:[
  (0,x.jsx)("button",{onClick:()=>svm("pendientes"),className:"boton "+(vm=="pendientes"?"boton-principal":"boton-secundario")+" boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Pendientes"}),
  (0,x.jsx)("button",{onClick:()=>svm("publicadas"),className:"boton "+(vm=="publicadas"?"boton-principal":"boton-secundario")+" boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Publicadas"}),
  (0,x.jsx)("button",{onClick:_,className:"boton boton-secundario boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Usuarios"}),
  (0,x.jsx)("button",{onClick:v,className:"boton boton-secundario boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"+ Crear Usuario"})
]})`;
content = content.replace(hb_orig, hb_new);

// 4. VistaUsuariosAverias (ie) Logic
// ie Signature: function ie({navegar:e,rolUsuario:t})
// Mapping: n=search, i=users
content = content.replace('[i,a]=(0,b.useState)(w)', '[i,a]=(0,b.useState)([]);(0,b.useEffect)(()=>{fetch(`/user`).then(res=>res.json()).then(data=>{a(data.map(u=>({id:u.id,nombre:u.nombre,rol:u.rol,correo:u.email,averiasComunicadas:[]})))})},[])');
// Fix ie role check
content = content.replace('return t===`admin`?', 'return (t==="admin"||t==="ADMINISTRADOR")?');

// 5. VistaPersonal (ae) Logic
content = content.replace('[f,p]=(0,b.useState)([])', '[f,p]=(0,b.useState)([]);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{p(data.filter(av=>!id_u||(av.reportador&&av.reportador.id==id_u)).map(av=>({id:av.id,titulo:av.nombre,ubicacion:av.ubicacion,descripcion:av.descripcion,categoria:av.tipo,estado:av.estado.toLowerCase().replace(/_/g,"-"),fecha:new Date(av.fecha_comunica).toLocaleDateString()})))})},[id_u])');

fs.writeFileSync(path, content);
console.log("SURGERY V4 COMPLETED.");
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
