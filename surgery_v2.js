const fs = require('fs');
const path = 'c:/Users/USER/Documents/Proyint/fullapp/Gesti-n-de-aver-as/public/assets/index-3qApb8rl.js';
const { spawnSync } = require('child_process');

spawnSync('git', ['restore', 'public/assets/index-3qApb8rl.js']);
let content = fs.readFileSync(path, 'utf8');

console.log("Applying SURGERY V2 (No Renaming)...");

// 1. App Level (oe) - KEEP ORIGINAL NAMES e, t, n, r, i, a, u, s
// Original: let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)
// I will keep n, r, i, a as the main identity states.
// I will keep t as the setter for view.
content = content.replace('let[e,t]=(0,b.useState)(`bienvenida`),[n,r]=(0,b.useState)(null),[i,a]=(0,b.useState)(``)', 'let[e,t]=(0,b.useState)(localStorage.getItem(`v`)||`bienvenida`),[n,r]=(0,b.useState)(localStorage.getItem(`r`)),[i,a]=(0,b.useState)(localStorage.getItem(`n`)||``),[u,s]=(0,b.useState)(localStorage.getItem(`u`))');

// 2. Login Logic
const login_orig = 'iniciarSesionComo:(e,t)=>{r(e),a(t),o(e===`personal`?`panel-personal`:`panel-admin`)}})';
// In the bundle, 'o' is the navegar function in this scope.
// I need to find the name of 'navegar' in the REAL bundle.
// Step 2439: o=(e,n=!0)=>{t(e)...} 
// Wait! In oe snippet 2439: navegate is 'o'. 
// So replace 'o(xxx)' with 'o(xxx)' but also save to localStorage.
const login_new = 'iniciarSesionComo:(_r,_n,_id)=>{localStorage.setItem(`r`,_r),localStorage.setItem(`n`,_n),localStorage.setItem(`u`,_id),r(_r),a(_n),s(_id),o(_r===`personal`?`panel-personal`:`panel-admin`)}})';
content = content.replace(login_orig, login_new);

// 3. Logout Persistence (Cerrar Sesión)
content = content.replace('onClick:g', 'onClick:()=>{localStorage.clear(),window.location.reload()}');

// 4. Trace the Navigate function (o)
// content = content.replace('t(e),n&&window.history.pushState({viewId:e},``,``)', 't(e),localStorage.setItem(`v`,e),n&&window.history.pushState({viewId:e},``,``)');
// Wait! t is the view setter. o is navigate.
// Snippet 2439: o=(e,n=!0)=>{t(e),n&&window.history.pushState({viewId:e},``,``),window.scrollTo({top:0,behavior:`smooth`})}
content = content.replace('t(e),n&&window.history.pushState({viewId:e},``,``)', 't(e),localStorage.setItem(`v`,e),n&&window.history.pushState({viewId:e},``,``)');

// 5. idUsuario prop drilling (u)
content = content.replace('e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-admin`&&(0,x.jsx)(ne,{navegar:o,rolUsuario:n,nombreUsuario:i,idUsuario:u,actualizarPerfil:a})');
content = content.replace('e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,actualizarPerfil:a})', 'e===`panel-personal`&&(0,x.jsx)(ae,{navegar:o,rolUsuario:n,nombreUsuario:i,idUsuario:u,actualizarPerfil:a})');

// 6. Signatures
content = content.replace('function ne({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ne({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:id_u,actualizarPerfil:r})');
content = content.replace('function ae({navegar:e,rolUsuario:t,nombreUsuario:n,actualizarPerfil:r})', 'function ae({navegar:e,rolUsuario:t,nombreUsuario:n,idUsuario:id_u,actualizarPerfil:r})');

// 7. VistaAdmin (ne) Inbox Logic
content = content.replace('let[i,a]=(0,b.useState)(te)', 'let[i,a]=(0,b.useState)([]);let[vm,svm]=(0,b.useState)(`pendientes`);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{a(data.map(x=>({id:x.id,titulo:x.nombre,categoria:x.tipo,ubicacion:x.ubicacion,descripcion:x.descripcion,prioridad:x.valoracion.toLowerCase().replace(/_/g,"-"),estado:x.estado.toLowerCase().replace(/_/g,"-"),asignadoA:x.reparador?x.reparador.id:null,verificada:x.verificada,reportador:x.reportador?x.reportador.id:null})))})},[])');
// verificar
const h_end = 'r.id===e?{...r,[t]:n}:r))';
content = content.replace(h_end, h_end + ',verificar=(id)=>{fetch("/averia/"+id+"/verificar",{method:"PATCH"}).then(res=>{if(res.ok){alert("¡Avería publicada con éxito!");a(r=>r.map(x=>x.id===id?{...x,verificada:!0}:x))}})}');
// Filter with correct idUsuario name 'id_u'
content = content.replace('return n&&r&&i&&a', 'const is_a=t=="admin";return n&&r&&i&&a && (is_a ? (vm=="pendientes" ? !e.verificada : e.verificada) : (e.verificada && e.asignadoA==id_u))');

// Admin Header Toggle Buttons (Using 't' which is rolUsuario in this scope)
const hb_orig = 'children:t===`admin`&&(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(`button`,{onClick:_,className:`boton boton-secundario boton-header`,style:{marginTop:0,whiteSpace:`nowrap`},children:`Usuarios y Averías`}),(0,x.jsx)(`button`,{onClick:v,className:`boton boton-secundario boton-header`,style:{marginTop:0,whiteSpace:`nowrap`},children:`+ Crear Usuario`})]})';
const hb_new = `children:t==="admin"&&(0,x.jsxs)(x.Fragment,{children:[
  (0,x.jsx)("button",{onClick:()=>svm("pendientes"),className:"boton "+(vm=="pendientes"?"boton-principal":"boton-secundario")+" boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Pendientes"}),
  (0,x.jsx)("button",{onClick:()=>svm("publicadas"),className:"boton "+(vm=="publicadas"?"boton-principal":"boton-secundario")+" boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Publicadas"}),
  (0,x.jsx)("button",{onClick:_,className:"boton boton-secundario boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"Usuarios"}),
  (0,x.jsx)("button",{onClick:v,className:"boton boton-secundario boton-header",style:{marginTop:0,whiteSpace:"nowrap"},children:"+ Crear Usuario"})
]})`;
content = content.replace(hb_orig, hb_new);

// 8. VistaPersonal (ae) fetch
content = content.replace('[f,p]=(0,b.useState)([])', '[f,p]=(0,b.useState)([]);(0,b.useEffect)(()=>{fetch(`/averia`).then(res=>res.json()).then(data=>{p(data.filter(av=>!id_u||(av.reportador&&av.reportador.id==id_u)).map(av=>({id:av.id,titulo:av.nombre,ubicacion:av.ubicacion,descripcion:av.descripcion,categoria:av.tipo,estado:av.estado.toLowerCase().replace(/_/g,"-"),fecha:new Date(av.fecha_comunica).toLocaleDateString()})))})},[id_u])');

// 9. VistaUsuariosAverias (ie) REAL FETCH
content = content.replace('let[i,a]=(0,b.useState)(w)', 'let[i,a]=(0,b.useState)([]);(0,b.useEffect)(()=>{fetch(`/user`).then(res=>res.json()).then(data=>{a(data.map(u=>({id:u.id,nombre:u.nombre,rol:u.rol===`ADMINISTRADOR`?`Administrador`:u.rol===`MANTENIMIENTO`?`T\u00e9cnico`:`Personal`,correo:u.email,averiasComunicadas:[]})))})},[])');

// UPDATE index.html back to 3qApb8rl
fs.writeFileSync(path, content);
console.log("SURGERY V2 COMPLETED.");
const r_check = spawnSync('node', ['--check', path]);
if (r_check.status === 0) console.log("SYNTAX VALID!"); else console.log(r_check.stderr.toString());
